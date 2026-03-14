import type { CollectionAfterChangeHook } from 'payload'

/**
 * Course Review Hook (Onderwijs Branch)
 *
 * Payload CMS afterChange hook on ContentReviews collection.
 * When a review is created/updated for branch 'onderwijs':
 *   - Fetches all reviews for the linked course
 *   - Calculates new average rating
 *   - Updates course.rating and course.reviewCount
 *
 * Guard: only runs when doc.branch === 'onderwijs' and doc has course relationship.
 */

export const courseReviewHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Only handle onderwijs branch reviews
  if (doc.branch !== 'onderwijs') return doc

  // Must have a course relationship
  const courseId = typeof doc.course === 'object' ? doc.course?.id : doc.course
  if (!courseId) return doc

  // Only run on create or update
  if (operation !== 'create' && operation !== 'update') return doc

  try {
    // Fetch all published reviews for this course
    const allReviews = await req.payload.find({
      collection: 'content-reviews',
      where: {
        and: [
          { branch: { equals: 'onderwijs' } },
          { course: { equals: courseId } },
          { status: { equals: 'published' } },
        ],
      },
      limit: 1000,
      depth: 0,
    })

    const reviews = allReviews.docs
    const reviewCount = reviews.length

    if (reviewCount === 0) return doc

    // Calculate average rating
    const totalRating = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0)
    const avgRating = Math.round((totalRating / reviewCount) * 10) / 10 // 1 decimal

    // Update course rating and reviewCount
    await req.payload.update({
      collection: 'courses',
      id: courseId,
      data: {
        rating: avgRating,
        reviewCount,
      },
    })

    console.log(
      `[courseReviewHook] Cursus ${courseId} bijgewerkt: rating ${avgRating}, reviewCount ${reviewCount}`,
    )
  } catch (e) {
    console.error(`[courseReviewHook] Fout bij herberekenen rating voor cursus ${courseId}:`, e)
  }

  return doc
}
