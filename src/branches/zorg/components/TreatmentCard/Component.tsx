import React from 'react'
import Link from 'next/link'
import type { TreatmentCardProps } from './types'
import { InsuranceBadge } from '../InsuranceBadge'
import { formatDuration, formatPrice } from '@/branches/zorg/lib/appointmentUtils'

export const TreatmentCard: React.FC<TreatmentCardProps> = ({
  treatment,
  className = '',
}) => {
  const { title, slug, shortDescription, duration, price, priceFrom, priceTo, insurance, bookable, _status } = treatment

  if (_status && _status !== 'published') return null

  const priceLabel = formatPrice(price, priceFrom, priceTo)

  return (
    <article
      className={`group relative flex h-full flex-col rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-base-400)] ${className}`}
    >
      {/* Duration + Insurance */}
      <div className="mb-4 flex items-start justify-between gap-3">
        {duration && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-base-100)] px-3 py-1 text-xs font-medium text-[var(--color-base-700)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatDuration(duration)}
          </span>
        )}
        {insurance && <InsuranceBadge status={insurance} />}
      </div>

      {/* Content */}
      <div className="mb-4 flex-1">
        <h3 className="mb-2 text-lg font-bold leading-tight text-[var(--color-base-1000)] md:text-xl">
          {title}
        </h3>

        {shortDescription && (
          <p className="mb-3 text-[0.9375rem] leading-relaxed text-[var(--color-base-700)]">
            {shortDescription}
          </p>
        )}

        {/* Price */}
        {priceLabel && (
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[var(--color-primary)]">
              {priceLabel}
            </span>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3 border-t border-[var(--color-base-200)] pt-4">
        <Link
          href={`/behandelingen/${slug}`}
          className="text-sm font-semibold text-[var(--color-base-800)] no-underline transition-colors hover:text-[var(--color-primary)]"
        >
          Meer info
        </Link>
        {bookable !== false && (
          <Link
            href={`/afspraak-maken?behandeling=${slug}`}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
          >
            Afspraak maken
            <svg className="transition-transform group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>
    </article>
  )
}

export default TreatmentCard
