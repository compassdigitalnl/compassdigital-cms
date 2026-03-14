import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { EventCardProps } from './types'

export const EventCard: React.FC<EventCardProps> = ({ event, className = '' }) => {
  const { title, slug, shortDescription, featuredImage, startDate, endDate, price, priceType, maxParticipants, _status } = event

  if (_status && _status !== 'published') return null

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('nl-NL', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })
    } catch {
      return dateStr
    }
  }

  const formatDateDay = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('nl-NL', { day: 'numeric' })
    } catch {
      return ''
    }
  }

  const formatDateMonth = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('nl-NL', { month: 'short' }).toUpperCase()
    } catch {
      return ''
    }
  }

  return (
    <article
      className={`group overflow-hidden rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      {/* Image with date badge */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-base-100)]">
        {featuredImage?.url ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-[var(--color-base-300)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        )}

        {/* Date badge overlay */}
        {startDate && (
          <div className="absolute left-4 top-4 flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-[var(--color-base-0)]/95 shadow-md backdrop-blur-sm">
            <span className="text-xl font-extrabold leading-none text-[var(--color-primary)]">
              {formatDateDay(startDate)}
            </span>
            <span className="mt-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-[var(--color-base-600)]">
              {formatDateMonth(startDate)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="mb-1 text-lg font-bold text-[var(--color-base-1000)]">{title}</h3>

        {/* Date range */}
        {startDate && (
          <div className="mb-2 flex items-center gap-1.5 text-sm text-[var(--color-base-600)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              {formatDate(startDate)}
              {endDate && ` \u2013 ${formatDate(endDate)}`}
            </span>
          </div>
        )}

        {shortDescription && (
          <p className="mb-3 text-sm leading-relaxed text-[var(--color-base-700)] line-clamp-2">{shortDescription}</p>
        )}

        {/* Footer: price + participants */}
        <div className="flex flex-wrap items-center gap-3">
          {price ? (
            <span className="font-semibold text-[var(--color-primary)]">
              {priceType === 'free' ? 'Gratis' : formatPrice(price)}
            </span>
          ) : priceType === 'free' ? (
            <span className="font-semibold text-green-600">Gratis</span>
          ) : null}

          {maxParticipants && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-base-100)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-base-700)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              Max {maxParticipants}
            </span>
          )}
        </div>

        <Link
          href={`/evenementen/${slug}`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] no-underline transition-colors hover:text-[var(--color-base-800)]"
        >
          Bekijk evenement
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </article>
  )
}

export default EventCard
