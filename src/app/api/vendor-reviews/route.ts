import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * POST /api/vendor-reviews
 * Submit a new vendor review.
 *
 * Body: { vendorId, rating (1-5), authorName, comment, title?, authorEmail?, authorCompany? }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const body = await request.json()

    // Validate required fields
    if (!body.vendorId || !body.rating || !body.authorName || !body.comment) {
      return NextResponse.json(
        { error: 'vendorId, rating, authorName en comment zijn verplicht' },
        { status: 400 },
      )
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: 'Rating moet tussen 1 en 5 zijn' }, { status: 400 })
    }

    // Check if vendor exists
    try {
      await payload.findByID({ collection: 'vendors', id: body.vendorId, depth: 0 })
    } catch {
      return NextResponse.json({ error: 'Leverancier niet gevonden' }, { status: 404 })
    }

    // Auto-generate initials
    const words = body.authorName.split(' ')
    const authorInitials = words
      .slice(0, 2)
      .map((w: string) => w[0])
      .join('')
      .toUpperCase()

    // Create the review (isApproved: false — needs moderation)
    const doc = await payload.create({
      collection: 'vendor-reviews',
      data: {
        vendor: body.vendorId,
        title: body.title || undefined,
        rating: body.rating,
        comment: body.comment,
        authorName: body.authorName,
        authorEmail: body.authorEmail || undefined,
        authorCompany: body.authorCompany || undefined,
        authorInitials,
        isApproved: false,
      },
    })

    return NextResponse.json({
      success: true,
      id: doc.id,
      message: 'Uw review wordt beoordeeld en is binnenkort zichtbaar.',
    })
  } catch (error: unknown) {
    console.error('Error submitting vendor review:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het indienen van uw review.' },
      { status: 500 },
    )
  }
}
