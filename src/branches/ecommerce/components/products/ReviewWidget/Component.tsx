'use client'

import React from 'react'
import { PenLine, BadgeCheck, ThumbsUp, ThumbsDown } from 'lucide-react'
import type { ReviewWidgetProps, Review } from './types'

// Helper: Render star rating
const renderStars = (rating: number, filled: number): React.ReactNode => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= filled ? 'text-theme-amber' : 'text-theme-grey'}>
        ★
      </span>,
    )
  }
  return stars
}

// Helper: Format date to locale string
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const ReviewWidget: React.FC<ReviewWidgetProps> = ({
  productId,
  productName,
  summary,
  reviews,
  onWriteReview,
  onHelpful,
  showWriteButton = true,
  className = '',
}) => {
  const handleHelpfulClick = async (reviewId: string, vote: 'yes' | 'no') => {
    if (onHelpful) {
      await onHelpful(reviewId, vote)
    }
  }

  return (
    <section
      className={`rounded-2xl border border-theme-border bg-white p-7 ${className}`}
      aria-labelledby="reviews-title"
    >
      <h2 id="reviews-title" className="sr-only">
        Klantbeoordelingen
      </h2>

      {/* Header: Summary + Rating Bars */}
      <div className="mb-6 flex flex-col gap-6 border-b border-theme-border pb-5 md:flex-row md:items-start md:gap-6">
        {/* Left: Summary */}
        <div className="flex-shrink-0 text-center md:min-w-[120px]">
          {/* Average Score */}
          <div
            className="font-heading text-5xl font-extrabold leading-none text-theme-navy"
            role="img"
            aria-label={`${summary.average} van 5 sterren`}
          >
            {summary.average.toFixed(1)}
          </div>

          {/* Big Stars */}
          <div className="my-1.5 text-lg text-theme-amber" aria-hidden="true">
            {renderStars(5, Math.round(summary.average))}
          </div>

          {/* Total Count */}
          <div className="text-[13px] text-theme-grey-mid">
            {summary.total} {summary.total === 1 ? 'review' : 'reviews'}
          </div>

          {/* Write Review Button */}
          {showWriteButton && onWriteReview && (
            <button
              onClick={onWriteReview}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-theme-teal px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-theme-navy"
              aria-label="Review schrijven"
            >
              <PenLine className="h-[15px] w-[15px]" />
              Review schrijven
            </button>
          )}
        </div>

        {/* Right: Rating Bars */}
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution[star as 1 | 2 | 3 | 4 | 5]
            const percentage = summary.total > 0 ? (count / summary.total) * 100 : 0

            return (
              <div key={star} className="mb-1 flex items-center gap-2">
                {/* Star Label */}
                <span className="w-[14px] text-right text-xs font-semibold text-theme-navy">
                  {star}
                </span>

                {/* Star Icon */}
                <span className="text-xs text-theme-amber">★</span>

                {/* Progress Bar */}
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-theme-grey-light">
                  <div
                    className="h-full rounded-full bg-theme-amber transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${star} sterren: ${count} reviews`}
                  />
                </div>

                {/* Count */}
                <span className="w-[20px] text-[11px] text-theme-grey-mid">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review List */}
      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <p className="py-8 text-center text-sm text-theme-grey-mid">
            Nog geen reviews. Wees de eerste om dit product te beoordelen!
          </p>
        ) : (
          reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onHelpful={handleHelpfulClick}
            />
          ))
        )}
      </div>
    </section>
  )
}

// Sub-component: Individual Review Item
const ReviewItem: React.FC<{
  review: Review
  onHelpful?: (reviewId: string, vote: 'yes' | 'no') => void
}> = ({ review, onHelpful }) => {
  return (
    <article
      className="border-b border-theme-border py-4 last:border-b-0"
      aria-label={`Review door ${review.author.name}`}
    >
      {/* Header: Author + Date */}
      <div className="mb-1.5 flex items-center justify-between">
        {/* Author Info */}
        <div className="flex items-center gap-2.5">
          {/* Avatar (initials) */}
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-theme-teal-glow text-sm font-extrabold text-theme-teal">
            {review.author.initials}
          </div>

          <div>
            {/* Name */}
            <div className="text-sm font-bold text-theme-navy">{review.author.name}</div>

            {/* Verified Badge */}
            {review.author.verified && (
              <div className="flex items-center gap-0.5 text-[11px] font-semibold text-theme-green">
                <BadgeCheck className="h-3 w-3" />
                Geverifieerde aankoop
              </div>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="text-xs text-theme-grey-mid">{formatDate(review.date)}</div>
      </div>

      {/* Star Rating */}
      <div
        className="mb-1.5 text-[13px] text-theme-amber"
        role="img"
        aria-label={`${review.rating} van 5 sterren`}
      >
        {renderStars(5, review.rating)}
      </div>

      {/* Review Text */}
      <p className="text-sm leading-relaxed text-theme-grey-dark">{review.text}</p>

      {/* Helpful Voting */}
      {onHelpful && (
        <div className="mt-2 flex items-center gap-3 text-xs text-theme-grey-mid">
          <span>Was dit nuttig?</span>

          <button
            onClick={() => onHelpful(review.id, 'yes')}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all ${
              review.userVote === 'yes'
                ? 'border-theme-teal bg-theme-teal-glow text-theme-teal'
                : 'border-theme-border text-theme-grey-mid hover:border-theme-teal hover:bg-theme-teal-glow hover:text-theme-teal'
            }`}
            aria-label={`Markeer als nuttig (${review.helpful.yes} stemmen)`}
            aria-pressed={review.userVote === 'yes'}
          >
            <ThumbsUp className="h-3 w-3" />
            Ja ({review.helpful.yes})
          </button>

          <button
            onClick={() => onHelpful(review.id, 'no')}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all ${
              review.userVote === 'no'
                ? 'border-theme-coral bg-theme-coral-light text-theme-coral'
                : 'border-theme-border text-theme-grey-mid hover:border-theme-coral hover:bg-theme-coral-light hover:text-theme-coral'
            }`}
            aria-label="Markeer als niet nuttig"
            aria-pressed={review.userVote === 'no'}
          >
            <ThumbsDown className="h-3 w-3" />
            Nee
          </button>
        </div>
      )}
    </article>
  )
}
