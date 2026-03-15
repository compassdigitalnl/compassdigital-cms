import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ProjectCardProps } from './types'

const variantClasses = {
  default: '',
  compact: '',
  detailed: '',
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
  } = project as any

  if (status !== 'published') return null

  const beforeImageUrl = typeof beforeImage === 'object' && beforeImage !== null ? beforeImage.url : null
  const afterImageUrl = typeof afterImage === 'object' && afterImage !== null ? afterImage.url : null
  const featuredImageUrl = typeof featuredImage === 'object' && featuredImage !== null ? featuredImage.url : null
  const primaryImage = afterImageUrl || featuredImageUrl || beforeImageUrl

  const formattedDate = completionDate
    ? new Date(completionDate).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })
    : null

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-base-400)] hover:shadow-lg ${className}`}
    >
      <Link href={`/projecten/${slug}`} className="flex h-full flex-col text-inherit no-underline">
        {/* Image */}
        {primaryImage && (
          <div className={`relative w-full overflow-hidden bg-[var(--color-base-100)] ${variant === 'detailed' ? 'aspect-video' : 'aspect-[3/2]'}`}>
            <Image
              src={primaryImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Category Badge */}
            {category && (
              <span className="absolute left-4 top-4 z-[2] rounded-md bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
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
              <div className="absolute right-4 top-4 z-[2] flex items-center gap-2 rounded-md bg-amber-500/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M13 7l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Voor/Na
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className={`flex flex-1 flex-col ${variant === 'detailed' ? 'p-6 md:p-8' : variant === 'compact' ? 'p-4 md:p-5' : 'p-5 md:p-6'}`}>
          <h3 className={`font-bold leading-tight text-[var(--color-base-1000)] ${variant === 'compact' ? 'mb-3 text-lg md:text-xl' : variant === 'detailed' ? 'mb-4 text-xl md:text-2xl' : 'mb-4 text-lg md:text-2xl'}`}>
            {title}
          </h3>

          {/* Meta Info */}
          <div className={`flex flex-wrap gap-4 ${variant === 'compact' ? 'mb-3' : 'mb-4'}`}>
            {location && (
              <span className="flex items-center gap-2 text-sm text-[var(--color-base-600)]">
                <svg className="shrink-0 text-[var(--color-base-500)]" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor" />
                  <path d="M8 1a6 6 0 0 0-6 6c0 4.5 6 8 6 8s6-3.5 6-8a6 6 0 0 0-6-6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {location}
              </span>
            )}
            {formattedDate && (
              <span className="flex items-center gap-2 text-sm text-[var(--color-base-600)]">
                <svg className="shrink-0 text-[var(--color-base-500)]" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {formattedDate}
              </span>
            )}
          </div>

          {/* Description */}
          {shortDescription && variant !== 'compact' && (
            <p className="mb-6 text-[0.9375rem] leading-relaxed text-[var(--color-base-700)] md:text-base">
              {shortDescription}
            </p>
          )}

          {/* Testimonial Preview */}
          {showTestimonial && testimonial && typeof testimonial === 'object' && (
            <div className="mb-6 rounded border-l-[3px] border-l-[var(--color-base-800)] bg-[var(--color-base-50)] p-4">
              <blockquote className="mb-2 text-[0.9375rem] italic leading-normal text-[var(--color-base-700)]">
                &ldquo;{testimonial.quote && testimonial.quote.length > 100
                  ? testimonial.quote.substring(0, 100) + '...'
                  : testimonial.quote}&rdquo;
              </blockquote>
              {testimonial.clientName && (
                <cite className="text-sm font-semibold not-italic text-[var(--color-base-800)]">
                  — {testimonial.clientName}
                </cite>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto inline-flex items-center gap-2 text-base font-semibold text-[var(--color-base-800)] transition-colors group-hover:text-[var(--color-base-1000)]">
            Bekijk project
            <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ProjectCard
