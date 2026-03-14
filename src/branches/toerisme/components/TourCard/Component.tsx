import React from 'react'
import Link from 'next/link'
import type { TourCardProps } from './types'

export const TourCard: React.FC<TourCardProps> = ({
  title,
  slug,
  coverImage,
  coverAlt,
  duration,
  nights,
  rating,
  reviewCount,
  price,
  originalPrice,
  category,
  highlights = [],
  availability,
  destination,
  className = '',
}) => {
  const durationLabel =
    duration && nights
      ? `${duration}d / ${nights}n`
      : duration
        ? `${duration} ${duration === 1 ? 'dag' : 'dagen'}`
        : null

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const availabilityInfo: Record<string, { label: string; className: string }> = {
    beschikbaar: { label: 'Beschikbaar', className: 'bg-green-100 text-green-800' },
    beperkt: { label: 'Beperkt', className: 'bg-amber-100 text-amber-800' },
    uitverkocht: { label: 'Uitverkocht', className: 'bg-red-100 text-red-800' },
  }

  const categoryLabels: Record<string, string> = {
    bestseller: 'Bestseller',
    nieuw: 'Nieuw',
    avontuur: 'Avontuur',
    luxe: 'Luxe',
    familie: 'Familie',
    stedentrip: 'Stedentrip',
    strand: 'Strand',
    cultuur: 'Cultuur',
  }

  return (
    <Link
      href={`/reizen/${slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border bg-[var(--color-base-0)] no-underline shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${className}`}
      style={{ borderColor: 'var(--color-base-200)' }}
      aria-label={title}
    >
      {/* Cover image */}
      <div className="relative overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={coverAlt || title}
            className="h-[200px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center bg-[var(--color-base-100)]">
            <span className="text-4xl opacity-40">✈️</span>
          </div>
        )}

        {/* Duration badge */}
        {durationLabel && (
          <div className="absolute right-3 top-3 rounded-full bg-[var(--color-base-1000)]/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {durationLabel}
          </div>
        )}

        {/* Category badge */}
        {category && categoryLabels[category] && (
          <div
            className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {categoryLabels[category]}
          </div>
        )}

        {/* Availability badge */}
        {availability && availability !== 'beschikbaar' && availabilityInfo[availability] && (
          <div className={`absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${availabilityInfo[availability].className}`}>
            {availabilityInfo[availability].label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Destination */}
        {destination && (
          <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-primary)]">
            {destination}
          </span>
        )}

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-[15px] font-bold leading-snug text-[var(--color-base-1000)]">
          {title}
        </h3>

        {/* Rating */}
        {rating !== undefined && rating > 0 && (
          <div className="mb-2 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill={i < Math.round(rating) ? '#f59e0b' : '#e5e7eb'}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            {reviewCount !== undefined && reviewCount > 0 && (
              <span className="text-[11px] text-[var(--color-base-500)]">({reviewCount})</span>
            )}
          </div>
        )}

        {/* Highlights chips */}
        {highlights.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {highlights.slice(0, 3).map((highlight, i) => (
              <span
                key={i}
                className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--color-primary)]"
              >
                {highlight}
              </span>
            ))}
            {highlights.length > 3 && (
              <span className="rounded-full bg-[var(--color-base-100)] px-2 py-0.5 text-[10px] text-[var(--color-base-500)]">
                +{highlights.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        {price != null && (
          <div className="mt-auto flex items-baseline gap-1.5 border-t border-[var(--color-base-100)] pt-3">
            <span className="text-[11px] text-[var(--color-base-500)]">Vanaf</span>
            {originalPrice != null && originalPrice > price && (
              <span className="text-sm text-[var(--color-base-400)] line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
            <span className="text-lg font-bold text-[var(--color-base-1000)]">
              {formatPrice(price)}
            </span>
            <span className="text-[11px] text-[var(--color-base-500)]">p.p.</span>
          </div>
        )}
      </div>
    </Link>
  )
}
