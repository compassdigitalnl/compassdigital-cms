import React from 'react'
import Link from 'next/link'
import type { TreatmentCardProps } from './types'

export const TreatmentCard: React.FC<TreatmentCardProps> = ({
  treatment,
  variant = 'default',
  showCTA = true,
  className = '',
}) => {
  const { title, slug, shortDescription, icon, duration, price, priceFrom, priceTo, _status } = treatment

  if (_status && _status !== 'published') return null

  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const formatDuration = (min: number) => {
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60)
    const m = min % 60
    return m > 0 ? `${h}u ${m}min` : `${h} uur`
  }

  return (
    <article
      className={`group relative flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isFeatured
          ? 'rounded-xl border-2 border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-base-50)] to-[var(--color-base-0)] hover:border-[var(--color-primary)]'
          : 'rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] hover:border-[var(--color-base-400)]'
      } ${isCompact ? 'p-5' : 'p-6 md:p-8'} ${className}`}
    >
      {/* Icon */}
      {icon && (
        <div
          className={`mb-4 flex items-center justify-center rounded-xl ${
            isFeatured
              ? 'h-[72px] w-[72px] bg-[var(--color-primary)] text-3xl text-white'
              : isCompact
                ? 'h-12 w-12 bg-[var(--color-base-100)] text-2xl'
                : 'h-16 w-16 bg-[var(--color-base-100)] text-2xl'
          }`}
        >
          <span>{icon}</span>
        </div>
      )}

      {/* Content */}
      <div className="mb-4 flex-1">
        <h3
          className={`mb-2 font-bold leading-tight text-[var(--color-base-1000)] ${
            isFeatured ? 'text-xl md:text-2xl' : isCompact ? 'text-lg' : 'text-lg md:text-xl'
          }`}
        >
          {title}
        </h3>

        {shortDescription && (
          <p className="mb-3 text-[0.9375rem] leading-relaxed text-[var(--color-base-700)]">
            {shortDescription}
          </p>
        )}

        {/* Price & Duration */}
        <div className="flex flex-wrap items-center gap-3">
          {duration && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-base-100)] px-3 py-1 text-sm text-[var(--color-base-700)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {formatDuration(duration)}
            </span>
          )}
          {price ? (
            <span className="font-semibold text-[var(--color-primary)]">
              {formatPrice(price)}
            </span>
          ) : priceFrom && priceTo ? (
            <span className="font-semibold text-[var(--color-primary)]">
              {formatPrice(priceFrom)} – {formatPrice(priceTo)}
            </span>
          ) : priceFrom ? (
            <span className="font-semibold text-[var(--color-primary)]">
              Vanaf {formatPrice(priceFrom)}
            </span>
          ) : null}
        </div>
      </div>

      {/* CTA */}
      {showCTA && (
        <div className="flex items-center gap-3 border-t border-[var(--color-base-200)] pt-4">
          <Link
            href={`/behandelingen/${slug}`}
            className="text-sm font-semibold text-[var(--color-base-800)] no-underline transition-colors hover:text-[var(--color-primary)]"
          >
            Meer info
          </Link>
          <Link
            href={`/boeken?service=${slug}`}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
          >
            Boek nu
            <svg className="transition-transform group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}
    </article>
  )
}

export default TreatmentCard
