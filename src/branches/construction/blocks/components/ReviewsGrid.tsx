/**
 * ReviewsGridComponent - Reviews grid block (SERVER COMPONENT)
 *
 * Features:
 * - Auto-fetch or featured reviews
 * - Manual review selection
 * - Multiple layout variants (cards, quotes, compact)
 * - Optional average rating display
 * - Configurable columns
 */

import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Icon } from '@/branches/shared/components/common/Icon'
import { ReviewCard } from '@/branches/construction/components/ReviewCard'
import type { ReviewsGridBlock, ConstructionReview } from '@/payload-types'

export async function ReviewsGridComponent(props: ReviewsGridBlock) {
  const {
    heading,
    reviewsSource = 'featured',
    reviews: manualReviews,
    limit = 6,
    columns = '3',
    layout = 'cards',
    showRatings = true,
    showAvatars = true,
    averageRating,
  } = props

  // Fetch reviews
  let reviews: ConstructionReview[] = []
  const payload = await getPayload({ config })

  if (reviewsSource === 'featured') {
    // Featured reviews
    const result = await payload.find({
      collection: 'construction-reviews',
      where: {
        and: [
          { status: { equals: 'published' } },
          { featured: { equals: true } },
        ],
      },
      limit: limit || 6,
      sort: '-createdAt',
    })
    reviews = result.docs
  } else if (reviewsSource === 'auto') {
    // All published reviews
    const result = await payload.find({
      collection: 'construction-reviews',
      where: { status: { equals: 'published' } },
      limit: limit || 6,
      sort: '-createdAt',
    })
    reviews = result.docs
  } else if (reviewsSource === 'manual' && manualReviews) {
    // Manual selection
    if (Array.isArray(manualReviews)) {
      reviews = manualReviews.filter(
        (review): review is ConstructionReview =>
          typeof review === 'object' && review !== null
      )

      // If we have IDs, resolve them
      if (reviews.length === 0 && manualReviews.length > 0) {
        const ids = manualReviews.filter((id): id is number => typeof id === 'number')
        if (ids.length > 0) {
          const result = await payload.find({
            collection: 'construction-reviews',
            where: { id: { in: ids } },
          })
          reviews = result.docs
        }
      }
    }
  }

  if (reviews.length === 0) {
    return null
  }

  // Calculate average rating if enabled
  let avgRating = 0
  if (averageRating?.enabled && reviews.length > 0) {
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0)
    avgRating = sum / reviews.length
  }

  // Grid columns
  const gridColsClasses = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }
  const gridClass = gridColsClasses[columns || '3'] || gridColsClasses['3']

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 bg-grey-light">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Average Rating (left/top position) */}
          {averageRating?.enabled && averageRating.position === 'left' && (
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center sticky top-24">
                <div className="text-6xl font-extrabold text-primary mb-2">
                  {avgRating.toFixed(1)}
                </div>
                <div className="flex justify-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name="Star"
                      size={20}
                      className={star <= Math.round(avgRating) ? 'text-warning' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <div className="text-sm text-grey-mid">
                  Gebaseerd op {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className={averageRating?.enabled && averageRating.position === 'left' ? 'lg:w-3/4' : 'w-full'}>
            {/* Heading */}
            {heading && (
              <div className={`${averageRating?.enabled && averageRating.position === 'top' ? 'text-center' : ''} mb-12`}>
                {heading.badge && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-glow border border-primary/20 rounded-full text-sm text-primary font-semibold mb-4">
                    <span>{heading.badge}</span>
                  </div>
                )}

                {heading.title && (
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-color mb-4">
                    {heading.title}
                  </h2>
                )}

                {heading.description && (
                  <p className="text-lg text-grey-mid max-w-3xl mx-auto">{heading.description}</p>
                )}

                {/* Average Rating (top position) */}
                {averageRating?.enabled && averageRating.position === 'top' && (
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="text-4xl font-extrabold text-primary">{avgRating.toFixed(1)}</div>
                    <div>
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={star}
                            name="Star"
                            size={20}
                            className={star <= Math.round(avgRating) ? 'text-warning' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-grey-mid">
                        {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Grid */}
            <div className={`grid ${gridClass} gap-6`}>
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  variant={layout === 'compact' ? 'compact' : 'default'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
