import React from 'react'
import Link from 'next/link'
import type { PropertyCardProps } from './types'
import { EnergyLabelBadge } from '../EnergyLabelBadge'
import { formatPrice, formatArea } from '../../lib/propertyUtils'

export const PropertyCard: React.FC<PropertyCardProps> = ({
  title,
  slug,
  coverImage,
  coverAlt,
  askingPrice,
  priceCondition,
  originalPrice,
  city,
  bedrooms,
  bathrooms,
  livingArea,
  energyLabel,
  listingStatus = 'beschikbaar',
  listingDate,
  featured,
  className = '',
}) => {
  const statusInfo: Record<string, { label: string; className: string }> = {
    beschikbaar: { label: 'Nieuw', className: 'bg-green text-white' },
    'onder-bod': { label: 'Onder bod', className: 'bg-amber-500 text-white' },
    verkocht: { label: 'Verkocht', className: 'bg-[var(--color-base-500)] text-white' },
    verhuurd: { label: 'Verhuurd', className: 'bg-[var(--color-base-500)] text-white' },
  }

  // Show "Nieuw" badge only if listing is recent (within 7 days) and beschikbaar
  const isNew =
    listingStatus === 'beschikbaar' &&
    listingDate &&
    Date.now() - new Date(listingDate).getTime() < 7 * 24 * 60 * 60 * 1000

  const showStatusBadge = listingStatus !== 'beschikbaar' || isNew

  return (
    <Link
      href={`/woningen/${slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] no-underline shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${className}`}
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
          <div className="flex h-[200px] w-full items-center justify-center bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5">
            <svg
              className="h-16 w-16 text-[var(--color-primary)]/30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}

        {/* Favorite button */}
        <button
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          aria-label="Bewaar als favoriet"
        >
          <svg
            className="h-[18px] w-[18px] text-[var(--color-base-500)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Status badge */}
        {showStatusBadge && (
          <div
            className={`absolute left-3 top-3 rounded-lg px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              isNew && listingStatus === 'beschikbaar'
                ? statusInfo.beschikbaar.className
                : statusInfo[listingStatus]?.className || ''
            }`}
          >
            {isNew && listingStatus === 'beschikbaar'
              ? 'Nieuw'
              : statusInfo[listingStatus]?.label || listingStatus}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-[18px]">
        {/* Price */}
        <div className="mb-1.5 font-mono text-xl font-bold text-[var(--color-primary)]">
          {originalPrice && originalPrice > askingPrice && (
            <span className="mr-2 text-sm font-normal text-[var(--color-base-400)] line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          {formatPrice(askingPrice, priceCondition)}
        </div>

        {/* Address */}
        <h3 className="mb-1 text-sm font-semibold text-[var(--color-base-1000)]">{title}</h3>

        {/* City */}
        {city && (
          <span className="mb-3.5 text-xs text-[var(--color-base-500)]">{city}</span>
        )}

        {/* Specs row */}
        <div className="flex items-center gap-3 border-t border-[var(--color-base-100)] pt-3">
          {bedrooms != null && (
            <div className="flex items-center gap-1 text-xs text-[var(--color-base-500)]">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 4v16" />
                <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                <path d="M2 17h20" />
                <path d="M6 8v9" />
              </svg>
              <span>{bedrooms}</span>
            </div>
          )}
          {bathrooms != null && (
            <div className="flex items-center gap-1 text-xs text-[var(--color-base-500)]">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
                <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" />
                <path d="M4 21h16" />
              </svg>
              <span>{bathrooms}</span>
            </div>
          )}
          {livingArea != null && (
            <div className="flex items-center gap-1 text-xs text-[var(--color-base-500)]">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
              </svg>
              <span>{formatArea(livingArea)}</span>
            </div>
          )}
          {energyLabel && (
            <div className="ml-auto">
              <EnergyLabelBadge label={energyLabel} size="sm" />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
