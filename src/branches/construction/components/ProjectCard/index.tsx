/**
 * ProjectCard Component
 *
 * Displays a construction project with before/after images, details, and testimonials.
 * Optimized for portfolio/case studies presentation.
 */

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ConstructionProject } from '@/payload-types'
import './styles.scss'

export interface ProjectCardProps {
  project: ConstructionProject
  variant?: 'default' | 'compact' | 'detailed'
  showTestimonial?: boolean
  className?: string
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  variant = 'default',
  showTestimonial = false,
  className = '',
}) => {
  const {
    title,
    slug,
    shortDescription,
    category,
    location,
    completionDate,
    beforeImage,
    afterImage,
    featuredImage,
    testimonial,
    status,
  } = project

  if (status !== 'published') return null

  // Get image URLs
  const beforeImageUrl = typeof beforeImage === 'object' && beforeImage !== null ? beforeImage.url : null
  const afterImageUrl = typeof afterImage === 'object' && afterImage !== null ? afterImage.url : null
  const featuredImageUrl = typeof featuredImage === 'object' && featuredImage !== null ? featuredImage.url : null

  // Primary image for card
  const primaryImage = afterImageUrl || featuredImageUrl || beforeImageUrl

  // Format completion date
  const formattedDate = completionDate
    ? new Date(completionDate).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
    : null

  return (
    <article className={`project-card project-card--${variant} ${className}`}>
      <Link href={`/projecten/${slug}`} className="project-card__link">
        {/* Image */}
        {primaryImage && (
          <div className="project-card__image-wrapper">
            <Image
              src={primaryImage}
              alt={title}
              fill
              className="project-card__image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Category Badge */}
            {category && (
              <span className="project-card__category">
                {category === 'new-construction' && 'Nieuwbouw'}
                {category === 'renovation' && 'Renovatie'}
                {category === 'extension' && 'Aanbouw'}
                {category === 'restoration' && 'Restauratie'}
                {category === 'commercial' && 'Zakelijk'}
                {category === 'other' && 'Overig'}
              </span>
            )}

            {/* Before/After Indicator */}
            {beforeImageUrl && afterImageUrl && (
              <div className="project-card__ba-indicator">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M13 7l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Voor/Na
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="project-card__content">
          <h3 className="project-card__title">{title}</h3>

          {/* Meta Info */}
          <div className="project-card__meta">
            {location && (
              <span className="project-card__meta-item">
                <svg className="project-card__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor"/>
                  <path d="M8 1a6 6 0 0 0-6 6c0 4.5 6 8 6 8s6-3.5 6-8a6 6 0 0 0-6-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {location}
              </span>
            )}
            {formattedDate && (
              <span className="project-card__meta-item">
                <svg className="project-card__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {formattedDate}
              </span>
            )}
          </div>

          {/* Description */}
          {shortDescription && variant !== 'compact' && (
            <p className="project-card__description">{shortDescription}</p>
          )}

          {/* Testimonial Preview */}
          {showTestimonial && testimonial && typeof testimonial === 'object' && (
            <div className="project-card__testimonial">
              <blockquote>
                "{testimonial.review && testimonial.review.length > 100
                  ? testimonial.review.substring(0, 100) + '...'
                  : testimonial.review}"
              </blockquote>
              {testimonial.clientName && (
                <cite>— {testimonial.clientName}</cite>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="project-card__cta">
            Bekijk project
            <svg className="project-card__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ProjectCard
