import React from 'react'
import { Star } from 'lucide-react'
import type { ReviewSummaryProps } from './types'

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  overallRating,
  breakdowns,
  reviews,
  className = '',
}) => {
  return (
    <div className={className}>
      {/* Summary section */}
      <div className="mb-8 rounded-2xl border bg-white p-6 md:p-8" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
          {/* Overall score */}
          <div className="flex flex-col items-center">
            <span
              className="font-serif text-5xl font-bold"
              style={{ color: 'var(--color-navy, #1a2b4a)' }}
            >
              {overallRating.toFixed(1)}
            </span>
            <div className="mt-2 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4"
                  fill={i < Math.round(overallRating / 2) ? '#f59e0b' : 'none'}
                  stroke={i < Math.round(overallRating / 2) ? '#f59e0b' : '#d1d5db'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <span className="mt-1 text-sm text-grey-mid">
              uit 10
            </span>
          </div>

          {/* Breakdown bars */}
          <div className="flex-1 space-y-2.5">
            {breakdowns.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  className="w-28 flex-shrink-0 text-sm font-medium"
                  style={{ color: 'var(--color-navy, #1a2b4a)' }}
                >
                  {item.label}
                </span>
                <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-grey-light">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(item.score * 10, 100)}%`,
                      backgroundColor: 'var(--color-teal, #00a39b)',
                    }}
                  />
                </div>
                <span
                  className="w-8 flex-shrink-0 text-right text-sm font-bold"
                  style={{ color: 'var(--color-navy, #1a2b4a)' }}
                >
                  {item.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const starCount = Math.round(review.rating / 2)

          return (
            <div
              key={review.id}
              className="rounded-2xl border bg-white p-5 md:p-6"
              style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
                >
                  {review.initials}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Author row */}
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      className="text-sm font-bold"
                      style={{ color: 'var(--color-navy, #1a2b4a)' }}
                    >
                      {review.author}
                    </span>
                    {review.groupType && (
                      <span className="rounded-full bg-grey-light px-2 py-0.5 text-[11px] font-medium text-grey-mid">
                        {review.groupType}
                      </span>
                    )}
                    <span className="text-[12px] text-grey-mid">{review.date}</span>
                  </div>

                  {/* Stars */}
                  <div className="mb-2 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5"
                        fill={i < starCount ? '#f59e0b' : 'none'}
                        stroke={i < starCount ? '#f59e0b' : '#d1d5db'}
                        strokeWidth={1.5}
                      />
                    ))}
                    <span
                      className="ml-2 text-sm font-bold"
                      style={{ color: 'var(--color-teal, #00a39b)' }}
                    >
                      {review.rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Review text */}
                  <p className="text-sm leading-relaxed text-grey-dark">
                    {review.content}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
