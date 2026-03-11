import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { CaseCardProps } from './types'

const variantClasses = {
  default: '',
  compact: '',
  detailed: '',
}

export const CaseCard: React.FC<CaseCardProps> = ({
  case: caseItem,
  variant = 'default',
  showTestimonial = false,
  className = '',
}) => {
  const {
    title,
    slug,
    shortDescription,
    category,
    client,
    industry,
    featuredImage,
    testimonial,
    status,
  } = caseItem as any

  if (status !== 'published') return null

  const featuredImageUrl = typeof featuredImage === 'object' && featuredImage !== null ? featuredImage.url : null

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-base-400)] hover:shadow-lg ${className}`}
    >
      <Link href={`/cases/${slug}`} className="flex h-full flex-col text-inherit no-underline">
        {/* Image */}
        {featuredImageUrl && (
          <div className={`relative w-full overflow-hidden bg-[var(--color-base-100)] ${variant === 'detailed' ? 'aspect-video' : 'aspect-[3/2]'}`}>
            <Image
              src={featuredImageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Category Badge */}
            {category && (
              <span className="absolute left-4 top-4 z-[2] rounded-md bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
                {category === 'accountancy' && 'Accountancy'}
                {category === 'juridisch' && 'Juridisch'}
                {category === 'vastgoed' && 'Vastgoed'}
                {category === 'marketing' && 'Marketing'}
                {category === 'it' && 'IT'}
                {category === 'consultancy' && 'Consultancy'}
                {category === 'hr' && 'HR & Staffing'}
                {category === 'notarieel' && 'Notarieel'}
                {category === 'other' && 'Overig'}
              </span>
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
            {client && (
              <span className="flex items-center gap-2 text-sm text-[var(--color-base-600)]">
                <svg className="shrink-0 text-[var(--color-base-500)]" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" fill="currentColor" />
                  <path d="M13 14c0-2.8-2.2-5-5-5s-5 2.2-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Klant: {client}
              </span>
            )}
            {industry && (
              <span className="flex items-center gap-2 text-sm text-[var(--color-base-600)]">
                <svg className="shrink-0 text-[var(--color-base-500)]" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Branche: {industry}
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
            Bekijk case
            <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default CaseCard
