import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { getReviewModerator } from '@/features/ai/lib/ReviewModerator'

/**
 * GET /api/reviews?productId=xxx&sort=helpful&page=1&limit=10
 * Fetch approved reviews for a product
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { searchParams } = new URL(request.url)

    const productId = searchParams.get('productId')
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 })
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50)
    const sortParam = searchParams.get('sort') || 'newest'
    const filterRating = searchParams.get('rating')

    // Build sort
    let sort: string
    switch (sortParam) {
      case 'helpful':
        sort = '-helpfulYes'
        break
      case 'rating-high':
        sort = '-rating'
        break
      case 'rating-low':
        sort = 'rating'
        break
      case 'newest':
      default:
        sort = '-createdAt'
    }

    // Build where clause
    const where: Record<string, unknown> = {
      product: { equals: productId },
      status: { equals: 'approved' },
    }

    if (filterRating) {
      where.rating = { equals: parseInt(filterRating) }
    }

    const { docs, totalDocs, totalPages } = await payload.find({
      collection: 'product-reviews',
      where,
      sort,
      page,
      limit,
      depth: 0,
    })

    // Calculate summary (distribution)
    const allReviews = await payload.find({
      collection: 'product-reviews',
      where: {
        product: { equals: productId },
        status: { equals: 'approved' },
      },
      limit: 10000,
      depth: 0,
    })

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let totalRating = 0
    for (const r of allReviews.docs) {
      const stars = r.rating as 1 | 2 | 3 | 4 | 5
      if (stars >= 1 && stars <= 5) {
        distribution[stars]++
        totalRating += stars
      }
    }

    const total = allReviews.totalDocs
    const average = total > 0 ? Math.round((totalRating / total) * 10) / 10 : 0

    // Map reviews to frontend format
    const reviews = docs.map((doc) => ({
      id: String(doc.id),
      author: {
        name: doc.authorName,
        initials: doc.authorInitials || doc.authorName?.slice(0, 2)?.toUpperCase() || '??',
        verified: doc.isVerifiedPurchase ?? false,
      },
      rating: doc.rating,
      date: doc.createdAt,
      text: doc.comment,
      title: doc.title,
      helpful: {
        yes: doc.helpfulYes || 0,
        no: doc.helpfulNo || 0,
      },
      response: doc.response?.text
        ? {
            text: doc.response.text,
            date: doc.response.respondedAt,
          }
        : null,
    }))

    return NextResponse.json({
      success: true,
      reviews,
      summary: { average, total, distribution },
      pagination: { page, limit, totalDocs, totalPages },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews', message },
      { status: 500 },
    )
  }
}

/**
 * POST /api/reviews
 * Submit a new review (with AI moderation)
 *
 * Body: { productId, rating, title?, comment, authorName, authorEmail? }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const { user } = await payload.auth({ headers: request.headers })

    const body = await request.json()

    // Validate required fields
    if (!body.productId || !body.rating || !body.comment || !body.authorName) {
      return NextResponse.json(
        { error: 'productId, rating, comment, and authorName are required' },
        { status: 400 },
      )
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }

    // Check if user already reviewed this product
    if (user) {
      const existing = await payload.find({
        collection: 'product-reviews',
        where: {
          user: { equals: user.id },
          product: { equals: body.productId },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        return NextResponse.json(
          { error: 'Je hebt dit product al beoordeeld' },
          { status: 409 },
        )
      }
    }

    // Check if product exists and get name for AI
    let productName = ''
    try {
      const product = await payload.findByID({
        collection: 'products',
        id: body.productId,
        depth: 0,
      })
      productName = product.title || ''
    } catch {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check verified purchase
    let isVerifiedPurchase = false
    if (user) {
      try {
        const orders = await payload.find({
          collection: 'orders',
          where: {
            user: { equals: user.id },
            status: { in: ['delivered', 'completed', 'processing'] },
          },
          limit: 100,
          depth: 0,
        })

        // Check if any order contains this product
        for (const order of orders.docs) {
          const items = (order as Record<string, unknown>).items as Array<Record<string, unknown>> | undefined
          if (items?.some((item) => {
            const pid = typeof item.product === 'object' && item.product !== null
              ? (item.product as { id: number }).id
              : item.product
            return String(pid) === String(body.productId)
          })) {
            isVerifiedPurchase = true
            break
          }
        }
      } catch {
        // Ignore order check errors
      }
    }

    // AI Moderation
    const moderator = getReviewModerator()
    const moderation = await moderator.moderate({
      title: body.title,
      comment: body.comment,
      rating: body.rating,
      authorName: body.authorName,
      productName,
    })

    // Determine initial status based on AI moderation
    let status: 'pending' | 'approved' | 'rejected' | 'flagged' = 'pending'
    if (moderation.action === 'approve') {
      status = 'approved'
    } else if (moderation.action === 'reject') {
      status = 'rejected'
    }

    // Create the review
    const doc = await payload.create({
      collection: 'product-reviews',
      data: {
        product: body.productId,
        title: body.title || undefined,
        rating: body.rating,
        comment: body.comment,
        user: user?.id || undefined,
        authorName: body.authorName,
        authorEmail: body.authorEmail || undefined,
        isVerifiedPurchase,
        status,
        ai: {
          moderated: true,
          score: moderation.score,
          sentiment: moderation.sentiment,
          topics: moderation.topics,
          toxicity: moderation.toxicity,
          isFake: moderation.isFake,
          summary: moderation.summary,
        },
      },
    })

    return NextResponse.json({
      success: true,
      id: doc.id,
      status,
      message:
        status === 'approved'
          ? 'Je review is geplaatst!'
          : status === 'rejected'
            ? 'Je review kon niet worden geplaatst.'
            : 'Je review wordt beoordeeld en is binnenkort zichtbaar.',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error submitting review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review', message },
      { status: 500 },
    )
  }
}
