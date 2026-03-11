import React from 'react'
import type { ReviewCardProps } from './types'

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  variant = 'default',
  showCase = true,
  className = '',
}) => {
  const {
    clientName,
    rating,
    quote: reviewText,
    createdAt: date,
    case: caseRef,
    service,
    featured,
  } = review

  const caseTitle = typeof caseRef === 'object' && caseRef !== null ? caseRef.title : null
  const serviceTitle = typeof service === 'object' && service !== null ? service.title : null

  const formattedDate = date
    ? new Date(date).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
    : null

  const initials = clientName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const isCompact = variant === 'compact'
  const isFeatured = variant === 'featured' || featured

  return (
    <article
      className={`relative h-full transition-all duration-300 hover:border-[var(--color-base-400)] hover:shadow-lg ${
        isFeatured
          ? 'rounded-xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-[var(--color-base-0)] pt-12 hover:border-amber-500'
          : 'rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)]'
      } ${isCompact ? 'p-5' : 'p-6 md:p-8'} ${className}`}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-md bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-orange-500/30">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l2 5h5l-4 3.5L13 14l-5-3-5 3 2-4.5L1 6h5l2-5z" fill="currentColor" />
          </svg>
          Uitgelicht
        </div>
      )}

      {/* Header */}
      <div className={`flex items-start gap-4 ${isCompact ? 'mb-4' : 'mb-6'}`}>
        {/* Avatar */}
        <div className={`shrink-0 overflow-hidden rounded-full bg-[var(--color-base-100)] ${isCompact ? 'h-12 w-12' : 'h-14 w-14'}`}>
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-base-200)] to-[var(--color-base-100)] text-xl font-bold text-[var(--color-base-600)]">
            {initials}
          </div>
        </div>

        {/* Client Info */}
        <div className="flex-1">
          <h3 className={`mb-2 font-bold text-[var(--color-base-1000)] ${isCompact ? 'text-base' : 'text-lg'}`}>
            {clientName}
          </h3>

          {/* Rating */}
          <div className="mb-1 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`${star <= rating ? 'text-amber-400' : 'text-[var(--color-base-300)]'} transition-colors`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 1l2.5 6.5L19 8l-5.5 4.5L15 19l-5-3.5L5 19l1.5-6.5L1 8l6.5-.5L10 1z"
                  fill={star <= rating ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
            <span className="ml-2 text-sm font-semibold text-[var(--color-base-600)]">({rating}/5)</span>
          </div>

          {/* Date */}
          {formattedDate && !isCompact && (
            <time className="block text-sm text-[var(--color-base-500)]">{formattedDate}</time>
          )}
        </div>
      </div>

      {/* Review Text */}
      <blockquote className={`italic leading-relaxed text-[var(--color-base-700)] ${isCompact ? 'mb-4 text-[0.9375rem]' : isFeatured ? 'mb-6 text-lg' : 'mb-6 text-base'}`}>
        &ldquo;{reviewText}&rdquo;
      </blockquote>

      {/* Footer with case/service reference */}
      {showCase && (caseTitle || serviceTitle) && !isCompact && (
        <footer className="flex items-center gap-2 border-t border-[var(--color-base-200)] pt-4">
          <svg className="shrink-0 text-[var(--color-base-500)]" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm text-[var(--color-base-600)]">
            {caseTitle && `Case: ${caseTitle}`}
            {caseTitle && serviceTitle && ' • '}
            {serviceTitle && !caseTitle && `Dienst: ${serviceTitle}`}
          </span>
        </footer>
      )}
    </article>
  )
}

export default ReviewCard
