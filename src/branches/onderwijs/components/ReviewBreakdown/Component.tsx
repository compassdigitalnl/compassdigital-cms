import React from 'react'
import type { ReviewBreakdownProps } from './types'
import { formatRating } from '../../lib/courseUtils'

const StarIcon: React.FC<{ filled?: boolean; className?: string }> = ({
  filled = true,
  className = 'h-5 w-5',
}) => (
  <svg
    className={`${className} ${filled ? 'fill-amber-400 text-amber-400' : 'fill-[var(--color-base-200)] text-[var(--color-base-200)]'}`}
    viewBox="0 0 24 24"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

export const ReviewBreakdown: React.FC<ReviewBreakdownProps> = ({
  rating,
  reviewCount,
  breakdown,
}) => {
  // Default breakdown distribution if not provided
  const defaultBreakdown = {
    5: Math.round(reviewCount * 0.6),
    4: Math.round(reviewCount * 0.2),
    3: Math.round(reviewCount * 0.1),
    2: Math.round(reviewCount * 0.06),
    1: Math.round(reviewCount * 0.04),
  }

  const data = breakdown || defaultBreakdown

  return (
    <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 md:p-8">
      <h2 className="mb-5 flex items-center gap-2.5 text-xl font-extrabold text-[var(--color-base-1000)]">
        <svg
          className="h-6 w-6 text-[var(--color-primary)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        Beoordelingen
      </h2>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
        {/* Big rating number */}
        <div className="flex flex-col items-center">
          <span className="font-mono text-5xl font-extrabold text-[var(--color-base-1000)]">
            {formatRating(rating)}
          </span>
          <div className="mt-2 flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} filled={star <= Math.round(rating)} className="h-5 w-5" />
            ))}
          </div>
          <span className="mt-1.5 text-xs text-[var(--color-base-400)]">
            {reviewCount.toLocaleString('nl-NL')} beoordelingen
          </span>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 space-y-2">
          {([5, 4, 3, 2, 1] as const).map((stars) => {
            const count = data[stars]
            const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0

            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="flex w-8 items-center gap-1 text-xs font-semibold text-[var(--color-base-500)]">
                  {stars}
                  <svg className="h-3 w-3 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-base-100)]">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-[var(--color-base-400)]">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
