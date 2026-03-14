import React from 'react'
import type { ReviewCardProps } from './types'

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, className = '' }) => {
  const { authorName, rating, quote, treatmentType, createdAt, _status } = review

  if (_status && _status !== 'published') return null

  const stars = rating ? Math.min(Math.round(rating), 5) : 0

  return (
    <article className={`flex h-full flex-col rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 ${className}`}>
      {/* Stars */}
      {stars > 0 && (
        <div className="mb-3 flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={i < stars ? '#f59e0b' : 'none'}
              stroke={i < stars ? '#f59e0b' : 'var(--color-base-300)'}
              strokeWidth="2"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      )}

      {/* Quote */}
      {quote && (
        <blockquote className="mb-4 flex-1 text-[0.9375rem] leading-relaxed text-[var(--color-base-700)]">
          &ldquo;{quote}&rdquo;
        </blockquote>
      )}

      {/* Author + Treatment */}
      <div className="mt-auto border-t border-[var(--color-base-200)] pt-4">
        {authorName && (
          <div className="font-semibold text-[var(--color-base-1000)]">{authorName}</div>
        )}
        {treatmentType && (
          <div className="mt-0.5 text-sm text-[var(--color-base-600)]">{treatmentType}</div>
        )}
      </div>
    </article>
  )
}

export default ReviewCard
