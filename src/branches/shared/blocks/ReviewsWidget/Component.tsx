import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type {
  ReviewsWidgetBlockProps,
  ReviewItem,
  ReviewLayout,
  ReviewAveragePosition,
  ReviewCollectionSource,
} from './types'

/**
 * B-39 ReviewsWidget Block Component (Async Server)
 *
 * Detailed reviews with rating distribution bars (5 -> 1 star),
 * average score, and individual review cards.
 * Supports manual, collection-selection, and auto-fetch sources.
 * Layouts: cards, quotes, compact.
 * Average position: top or left (sticky sidebar).
 */

/* ─── Helpers ──────────────────────────────────────────────────────── */

function renderStars(rating: number, size: 'sm' | 'lg' = 'sm') {
  const sizeClass = size === 'lg' ? 'text-xl' : 'text-base'
  return Array.from({ length: 5 }).map((_, i) => (
    <span key={i} className={`${sizeClass} ${i < rating ? 'text-amber-400' : 'text-grey'}`}>
      &#9733;
    </span>
  ))
}

function getInitials(name: string): string {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function calculateRatingDistribution(reviews: ReviewItem[]): Record<number, number> {
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((review) => {
    const r = review.rating || 5
    if (r >= 1 && r <= 5) dist[r]++
  })
  return dist
}

function calculateAverage(reviews: ReviewItem[]): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

/**
 * Map collection documents to the unified ReviewItem interface.
 * Each collection has different field names for reviewer, text, rating, and date.
 */
function mapCollectionToReviewItem(
  doc: Record<string, unknown>,
  collectionSource: ReviewCollectionSource,
): ReviewItem {
  switch (collectionSource) {
    case 'product-reviews':
      return {
        id: String(doc.id ?? ''),
        reviewer: (doc.authorName as string) || null,
        rating: (doc.rating as number) || null,
        text: (doc.comment as string) || null,
        date: doc.createdAt
          ? new Date(doc.createdAt as string).toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : null,
      }

    case 'construction-reviews':
      return {
        id: String(doc.id ?? ''),
        reviewer: (doc.clientName as string) || null,
        rating: (doc.rating as number) || null,
        text: (doc.quote as string) || null,
        date: doc.createdAt
          ? new Date(doc.createdAt as string).toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : null,
      }

    case 'experience-reviews': {
      // Experience reviews use a 1-10 scale; normalize to 1-5
      const rawRating = (doc.overallRating as number) || 5
      const normalizedRating = Math.round((rawRating / 10) * 5)

      return {
        id: String(doc.id ?? ''),
        reviewer: (doc.author as string) || null,
        rating: Math.max(1, Math.min(5, normalizedRating)),
        text: (doc.content as string) || null,
        date: doc.date
          ? new Date(doc.date as string).toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          : doc.createdAt
            ? new Date(doc.createdAt as string).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : null,
      }
    }

    default:
      return {
        id: String(doc.id ?? ''),
        reviewer: null,
        rating: null,
        text: null,
        date: null,
      }
  }
}

/**
 * Get the published-status filter for a given collection.
 * product-reviews uses "approved", construction-reviews uses "published",
 * experience-reviews uses "approved".
 */
function getPublishedFilter(collectionSource: ReviewCollectionSource) {
  switch (collectionSource) {
    case 'product-reviews':
      return { status: { equals: 'approved' } }
    case 'construction-reviews':
      return { status: { equals: 'published' } }
    case 'experience-reviews':
      return { status: { equals: 'approved' } }
    default:
      return { status: { equals: 'published' } }
  }
}

/* ─── Sub-components ───────────────────────────────────────────────── */

function HeadingSection({
  heading,
  legacyTitle,
}: {
  heading?: { badge?: string | null; title?: string | null; description?: string | null } | null
  legacyTitle?: string | null
}) {
  const badge = heading?.badge
  const title = heading?.title || legacyTitle
  const description = heading?.description

  if (!badge && !title && !description) return null

  return (
    <div className="mb-8 text-center md:mb-12">
      {badge && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/10 px-4 py-1.5 text-xs font-semibold text-teal">
          {badge}
        </div>
      )}
      {title && (
        <h2 className="font-display text-2xl text-navy md:text-3xl">{title}</h2>
      )}
      {description && (
        <p className="mx-auto mt-3 max-w-3xl text-sm text-grey-dark md:text-base">
          {description}
        </p>
      )}
    </div>
  )
}

function AverageSummary({
  average,
  totalReviews,
  distribution,
  showAverage,
  showRatingBars,
  variant,
}: {
  average: number
  totalReviews: number
  distribution: Record<number, number>
  showAverage: boolean
  showRatingBars: boolean
  variant: 'inline' | 'sidebar'
}) {
  if (!showAverage && !showRatingBars) return null

  const wrapperClass =
    variant === 'sidebar'
      ? 'rounded-xl border border-grey bg-white p-6 md:p-8 sticky top-24'
      : 'mb-10 flex flex-col gap-8 rounded-xl border border-grey bg-white p-6 md:flex-row md:items-start md:p-8'

  return (
    <div className={wrapperClass}>
      {/* Average score */}
      {showAverage && (
        <div className="flex shrink-0 flex-col items-center md:min-w-[140px]">
          <div className="text-5xl font-bold text-navy">{average}</div>
          <div className="mt-1 flex gap-0.5">{renderStars(Math.round(average), 'lg')}</div>
          <div className="mt-1 text-sm text-grey-mid">
            {totalReviews} {totalReviews === 1 ? 'beoordeling' : 'beoordelingen'}
          </div>
        </div>
      )}

      {/* Rating distribution bars */}
      {showRatingBars && (
        <div className={`${variant === 'sidebar' ? 'mt-6' : 'flex-1'} space-y-2`}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star]
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-8 text-right text-sm text-grey-mid">{star} &#9733;</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-grey-light">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-sm text-grey-mid">{count}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ─── Review Card Variants ─────────────────────────────────────────── */

function ReviewCardCards({ review }: { review: ReviewItem }) {
  return (
    <div className="rounded-xl border border-grey bg-white p-5 transition-all hover:shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {review.reviewer && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/10 text-xs font-bold text-teal">
              {getInitials(review.reviewer)}
            </div>
          )}
          <div>
            {review.reviewer && (
              <div className="text-sm font-semibold text-navy">{review.reviewer}</div>
            )}
            {review.date && <div className="text-xs text-grey-mid">{review.date}</div>}
          </div>
        </div>
        <div className="flex gap-0.5">{renderStars(review.rating || 5)}</div>
      </div>
      {review.text && (
        <p className="text-sm leading-relaxed text-grey-dark">{review.text}</p>
      )}
    </div>
  )
}

function ReviewCardQuotes({ review }: { review: ReviewItem }) {
  return (
    <div className="py-6 text-center">
      <div className="mb-4 flex justify-center gap-0.5">
        {renderStars(review.rating || 5)}
      </div>
      {review.text && (
        <blockquote className="mb-4 text-lg italic leading-relaxed text-navy">
          &ldquo;{review.text}&rdquo;
        </blockquote>
      )}
      {review.reviewer && (
        <div className="text-sm font-semibold text-grey-dark">&mdash; {review.reviewer}</div>
      )}
    </div>
  )
}

function ReviewCardCompact({ review }: { review: ReviewItem }) {
  return (
    <div className="rounded-lg bg-white px-4 py-3 transition-all hover:shadow-sm">
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {review.reviewer && (
            <span className="text-sm font-semibold text-navy">{review.reviewer}</span>
          )}
        </div>
        <div className="flex gap-0.5">{renderStars(review.rating || 5, 'sm')}</div>
      </div>
      {review.text && (
        <p className="text-xs leading-relaxed text-grey-dark line-clamp-3">{review.text}</p>
      )}
    </div>
  )
}

function ReviewCard({ review, layout }: { review: ReviewItem; layout: ReviewLayout }) {
  switch (layout) {
    case 'quotes':
      return <ReviewCardQuotes review={review} />
    case 'compact':
      return <ReviewCardCompact review={review} />
    case 'cards':
    default:
      return <ReviewCardCards review={review} />
  }
}

/* ─── Main Component ───────────────────────────────────────────────── */

export async function ReviewsWidgetBlockComponent(props: ReviewsWidgetBlockProps) {
  const {
    // Legacy title (backward compat)
    title: legacyTitle,
    // New heading group
    heading,
    source = 'manual',
    collectionSource = 'product-reviews',
    limit = 6,
    reviews: manualReviews = [],
    collection: collectionRelation,
    showRatingBars = true,
    showAverage = true,
    averagePosition = 'top',
    layout = 'cards',
    columns = '2',
    enableAnimation,
    animationType,
    animationDuration,
    animationDelay,
  } = props

  const currentLayout = (layout || 'cards') as ReviewLayout
  const currentAveragePosition = (averagePosition || 'top') as ReviewAveragePosition
  const currentColumns = columns || '2'

  /* ── Resolve reviews ──────────────────────────────────────────────── */
  let validReviews: ReviewItem[] = []

  if (source === 'manual') {
    validReviews = (manualReviews || []) as ReviewItem[]
  } else if (source === 'auto') {
    try {
      const payload = await getPayload({ config })
      const coll = (collectionSource || 'product-reviews') as ReviewCollectionSource
      const publishedFilter = getPublishedFilter(coll)

      const result = await payload.find({
        collection: coll as 'product-reviews' | 'construction-reviews' | 'experience-reviews',
        where: publishedFilter,
        limit: limit || 6,
        sort: '-createdAt',
      })

      validReviews = result.docs.map((doc) =>
        mapCollectionToReviewItem(doc as unknown as Record<string, unknown>, coll),
      )
    } catch (error) {
      console.error('[ReviewsWidget] Error fetching reviews:', error)
    }
  } else if (source === 'collection') {
    // Resolve relationship field — may contain full docs or just IDs
    if (Array.isArray(collectionRelation) && collectionRelation.length > 0) {
      const firstItem = collectionRelation[0]

      if (typeof firstItem === 'object' && firstItem !== null) {
        // Already populated docs
        const coll = (collectionSource || 'product-reviews') as ReviewCollectionSource
        validReviews = collectionRelation
          .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
          .map((doc) => mapCollectionToReviewItem(doc as Record<string, unknown>, coll))
      } else {
        // IDs only — fetch them
        try {
          const payload = await getPayload({ config })
          const coll = (collectionSource || 'product-reviews') as ReviewCollectionSource
          const ids = collectionRelation.filter((id): id is number => typeof id === 'number')

          if (ids.length > 0) {
            const result = await payload.find({
              collection: coll as 'product-reviews' | 'construction-reviews' | 'experience-reviews',
              where: { id: { in: ids } },
              limit: ids.length,
            })
            validReviews = result.docs.map((doc) =>
              mapCollectionToReviewItem(doc as unknown as Record<string, unknown>, coll),
            )
          }
        } catch (error) {
          console.error('[ReviewsWidget] Error resolving collection reviews:', error)
        }
      }
    }
  }

  if (validReviews.length === 0) return null

  /* ── Calculate stats ──────────────────────────────────────────────── */
  const average = calculateAverage(validReviews)
  const distribution = calculateRatingDistribution(validReviews)
  const totalReviews = validReviews.length

  /* ── Grid classes ─────────────────────────────────────────────────── */
  const gridColsClasses: Record<string, string> = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }
  const gridClass = gridColsClasses[currentColumns] || gridColsClasses['2']

  /* ── Render ───────────────────────────────────────────────────────── */
  const hasSummary = showAverage || showRatingBars
  const isLeftPosition = currentAveragePosition === 'left' && hasSummary

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="reviews-widget-block bg-white py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <HeadingSection heading={heading} legacyTitle={legacyTitle} />

        {isLeftPosition ? (
          /* ── Left layout: sidebar + reviews ─────────────────────────── */
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <AverageSummary
                average={average}
                totalReviews={totalReviews}
                distribution={distribution}
                showAverage={showAverage}
                showRatingBars={showRatingBars}
                variant="sidebar"
              />
            </div>

            {/* Reviews */}
            <div className="lg:w-3/4">
              <div className={`grid ${gridClass} gap-4`}>
                {validReviews.map((review, index) => (
                  <ReviewCard
                    key={review.id || index}
                    review={review}
                    layout={currentLayout}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Top layout: summary above reviews ─────────────────────── */
          <>
            {hasSummary && (
              <AverageSummary
                average={average}
                totalReviews={totalReviews}
                distribution={distribution}
                showAverage={showAverage}
                showRatingBars={showRatingBars}
                variant="inline"
              />
            )}

            {/* Review cards */}
            <div className={`grid ${gridClass} gap-4`}>
              {validReviews.map((review, index) => (
                <ReviewCard
                  key={review.id || index}
                  review={review}
                  layout={currentLayout}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default ReviewsWidgetBlockComponent
