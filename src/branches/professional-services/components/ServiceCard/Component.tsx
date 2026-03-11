import React from 'react'
import Link from 'next/link'
import type { ServiceCardProps } from './types'

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  variant = 'default',
  showCTA = true,
  className = '',
}) => {
  const { title, slug, shortDescription, icon, features, status } = service

  if (status !== 'published') return null

  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'

  return (
    <article
      className={`group relative flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isFeatured
          ? 'rounded-xl border-2 border-[var(--color-base-800)] bg-gradient-to-br from-[var(--color-base-50)] to-[var(--color-base-0)] hover:border-[var(--color-base-1000)]'
          : 'rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] hover:border-[var(--color-base-400)]'
      } ${isCompact ? 'p-5' : 'p-6 md:p-8'} ${className}`}
    >
      {/* Icon */}
      {icon && (
        <div
          className={`mb-4 flex items-center justify-center rounded-xl ${
            isFeatured
              ? 'h-[72px] w-[72px] bg-[var(--color-base-800)] text-3xl'
              : isCompact
                ? 'h-12 w-12 bg-[var(--color-base-100)] text-2xl'
                : 'h-16 w-16 bg-[var(--color-base-100)] text-2xl'
          }`}
        >
          <span className={isFeatured ? 'brightness-0 invert filter' : ''}>{icon}</span>
        </div>
      )}

      {/* Content */}
      <div className="mb-6 flex-1">
        <h3
          className={`mb-3 font-bold leading-tight text-[var(--color-base-1000)] ${
            isFeatured ? 'text-xl md:text-[1.75rem]' : isCompact ? 'text-lg md:text-xl' : 'text-lg md:text-2xl'
          }`}
        >
          {title}
        </h3>

        {shortDescription && (
          <p className={`leading-relaxed text-[var(--color-base-700)] ${isCompact ? 'text-[0.9375rem]' : 'mb-4 text-base'}`}>
            {shortDescription}
          </p>
        )}

        {/* Features List */}
        {isFeatured && features && features.length > 0 && (
          <ul className="mt-6 space-y-2 p-0">
            {features.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-[0.9375rem] leading-normal text-[var(--color-base-800)]">
                <svg className="mt-1 shrink-0 text-green-500" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.3 4.7L6 12l-3.3-3.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {feature.feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CTA */}
      {showCTA && (
        <div className="border-t border-[var(--color-base-200)] pt-6">
          <Link
            href={`/dienstverlening/${slug}`}
            className="inline-flex items-center gap-2 text-base font-semibold text-[var(--color-base-800)] no-underline transition-colors hover:text-[var(--color-base-1000)]"
          >
            Meer informatie
            <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}
    </article>
  )
}

export default ServiceCard
