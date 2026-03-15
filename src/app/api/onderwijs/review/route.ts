import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Onderwijs Review API
 *
 * POST /api/onderwijs/review
 *
 * Maakt een review aan voor een cursus in de content-reviews collectie.
 * Valideert rating (1-5) en cursus bestaan.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { courseId, rating, comment, authorName, authorEmail } = body

    // Validate required fields
    if (!courseId) {
      return NextResponse.json(
        { error: 'Cursus is verplicht' },
        { status: 400 },
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Beoordeling moet tussen 1 en 5 liggen' },
        { status: 400 },
      )
    }

    if (!authorName) {
      return NextResponse.json(
        { error: 'Naam is verplicht' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Validate course exists
    try {
      await payload.findByID({
        collection: 'courses',
        id: courseId,
      })
    } catch {
      return NextResponse.json(
        { error: 'Cursus niet gevonden' },
        { status: 404 },
      )
    }

    // Create review in content-reviews with branch: onderwijs
    const review = await payload.create({
      collection: 'content-reviews',
      data: {
        branch: 'onderwijs',
        authorName,
        rating: Math.round(rating),
        quote: comment || '',
        course: Number(courseId),
        status: 'published',
        verified: false,
      },
    })

    console.log(
      `[onderwijs/review] Review aangemaakt — review ${review.id}, ` +
        `auteur: ${authorName}, rating: ${rating}, cursus: ${courseId}`,
    )

    return NextResponse.json({
      success: true,
      reviewId: review.id,
    })
  } catch (error) {
    console.error('[onderwijs/review] Error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de review' },
      { status: 500 },
    )
  }
}

// Prevent caching of API route
export const dynamic = 'force-dynamic'
