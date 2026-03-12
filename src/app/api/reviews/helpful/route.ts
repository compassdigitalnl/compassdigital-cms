import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

/**
 * POST /api/reviews/helpful
 * Vote on whether a review was helpful
 *
 * Body: { reviewId, vote: 'yes' | 'no' }
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    const body = await request.json()
    if (!body.reviewId || !['yes', 'no'].includes(body.vote)) {
      return NextResponse.json(
        { error: 'reviewId and vote (yes/no) are required' },
        { status: 400 },
      )
    }

    // Get current review
    const review = await payload.findByID({
      collection: 'product-reviews',
      id: body.reviewId,
      depth: 0,
    })

    // Increment the appropriate counter
    const updateData: Record<string, number> = {}
    if (body.vote === 'yes') {
      updateData.helpfulYes = (review.helpfulYes || 0) + 1
    } else {
      updateData.helpfulNo = (review.helpfulNo || 0) + 1
    }

    await payload.update({
      collection: 'product-reviews',
      id: body.reviewId,
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      helpfulYes: body.vote === 'yes' ? (review.helpfulYes || 0) + 1 : review.helpfulYes || 0,
      helpfulNo: body.vote === 'no' ? (review.helpfulNo || 0) + 1 : review.helpfulNo || 0,
    })
  } catch (error: unknown) {
    console.error('Error voting on review:', error)
    return NextResponse.json(
      { error: 'Failed to vote' },
      { status: 500 },
    )
  }
}
