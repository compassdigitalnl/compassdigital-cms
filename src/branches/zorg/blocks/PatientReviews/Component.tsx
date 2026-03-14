import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { PatientReviewsProps } from './types'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-amber-400' : 'text-[var(--color-base-200)]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function anonymizeName(name?: string): string {
  if (!name) return 'Anoniem'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return 'Anoniem'
  if (parts.length === 1) return `${parts[0].charAt(0)}.`
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`
}

export async function PatientReviewsComponent(props: PatientReviewsProps) {
  const {
    heading,
    source = 'auto',
    reviews: manualReviews,
    limit = 6,
    showTreatmentType = true,
  } = props

  let reviews: any[] = []

  if (source === 'auto') {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'content-reviews',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { branch: { equals: 'zorg' } },
        ],
      },
      limit: limit || 6,
      sort: '-createdAt',
    })
    reviews = result.docs
  } else if (source === 'manual' && manualReviews) {
    if (Array.isArray(manualReviews)) {
      reviews = manualReviews.filter(
        (r): r is any => typeof r === 'object' && r !== null,
      )

      if (reviews.length === 0 && manualReviews.length > 0) {
        const payload = await getPayload({ config })
        const ids = manualReviews.filter((id): id is number => typeof id === 'number')
        if (ids.length > 0) {
          const result = await payload.find({
            collection: 'content-reviews',
            where: { id: { in: ids } },
          })
          reviews = result.docs
        }
      }
    }
  }

  if (reviews.length === 0) return null

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {heading && (
          <div className="mb-12 text-center">
            {heading.badge && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
                {heading.badge}
              </div>
            )}
            {heading.title && (
              <h2 className="mb-4 text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl lg:text-5xl">
                {heading.title}
              </h2>
            )}
            {heading.description && (
              <p className="mx-auto max-w-3xl text-lg text-[var(--color-base-600)]">{heading.description}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex flex-col rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[var(--color-primary)]/30"
            >
              <div className="mb-3">
                <StarRating rating={review.rating || 5} />
              </div>

              {review.content && (
                <p className="mb-4 flex-1 text-sm leading-relaxed text-[var(--color-base-700)] line-clamp-4">
                  &ldquo;{review.content}&rdquo;
                </p>
              )}

              <div className="mt-auto border-t border-[var(--color-base-100)] pt-4">
                <p className="text-sm font-semibold text-[var(--color-base-1000)]">
                  {anonymizeName(review.authorName || review.name)}
                </p>
                {showTreatmentType && review.treatmentType && (
                  <p className="mt-1 text-xs text-[var(--color-base-500)]">
                    {typeof review.treatmentType === 'object' ? review.treatmentType.title : review.treatmentType}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
