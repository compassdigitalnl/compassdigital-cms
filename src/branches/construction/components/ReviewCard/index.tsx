/**
 * ReviewCard Component
 *
 * Displays customer testimonials with ratings, avatars, and project references.
 * Optimized for social proof and trust building.
 */

import React from 'react'
import Image from 'next/image'
import type { ConstructionReview } from '@/payload-types'
import './styles.scss'

export interface ReviewCardProps {
  review: ConstructionReview
  variant?: 'default' | 'compact' | 'featured'
  showProject?: boolean
  className?: string
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  variant = 'default',
  showProject = true,
  className = '',
}) => {
  const {
    clientName,
    rating,
    review: reviewText,
    date,
    project,
    service,
    avatar,
    featured,
  } = review

  // Get project/service info
  const projectTitle = typeof project === 'object' && project !== null ? project.title : null
  const serviceTitle = typeof service === 'object' && service !== null ? service.title : null

  // Get avatar URL
  const avatarUrl = typeof avatar === 'object' && avatar !== null ? avatar.url : null

  // Format date
  const formattedDate = date
    ? new Date(date).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
    : null

  // Generate initials for fallback avatar
  const initials = clientName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <article className={`review-card review-card--${variant} ${featured ? 'review-card--featured' : ''} ${className}`}>
      {/* Header */}
      <div className="review-card__header">
        {/* Avatar */}
        <div className="review-card__avatar">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={clientName}
              width={56}
              height={56}
              className="review-card__avatar-image"
            />
          ) : (
            <div className="review-card__avatar-fallback">
              {initials}
            </div>
          )}
        </div>

        {/* Client Info */}
        <div className="review-card__client-info">
          <h3 className="review-card__client-name">{clientName}</h3>

          {/* Rating */}
          <div className="review-card__rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`review-card__star ${star <= rating ? 'review-card__star--filled' : ''}`}
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
            <span className="review-card__rating-text">({rating}/5)</span>
          </div>

          {/* Date */}
          {formattedDate && variant !== 'compact' && (
            <time className="review-card__date">{formattedDate}</time>
          )}
        </div>
      </div>

      {/* Review Text */}
      <blockquote className="review-card__text">
        "{reviewText}"
      </blockquote>

      {/* Footer with project/service reference */}
      {showProject && (projectTitle || serviceTitle) && variant !== 'compact' && (
        <footer className="review-card__footer">
          <svg className="review-card__footer-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="review-card__footer-text">
            {projectTitle && `Project: ${projectTitle}`}
            {projectTitle && serviceTitle && ' • '}
            {serviceTitle && !projectTitle && `Dienst: ${serviceTitle}`}
          </span>
        </footer>
      )}

      {/* Featured badge */}
      {featured && (
        <div className="review-card__featured-badge">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l2 5h5l-4 3.5L13 14l-5-3-5 3 2-4.5L1 6h5l2-5z" fill="currentColor"/>
          </svg>
          Uitgelicht
        </div>
      )}
    </article>
  )
}

export default ReviewCard
