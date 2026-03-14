import React from 'react'
import Link from 'next/link'
import type { VehicleCardProps } from './types'

const STATUS_CONFIG: Record<string, { label: string; bgClass: string; textClass: string }> = {
  beschikbaar: {
    label: 'Beschikbaar',
    bgClass: 'bg-green-500',
    textClass: 'text-white',
  },
  gereserveerd: {
    label: 'Gereserveerd',
    bgClass: 'bg-amber-500',
    textClass: 'text-white',
  },
  verkocht: {
    label: 'Verkocht',
    bgClass: 'bg-red-500',
    textClass: 'text-white',
  },
}

const FUEL_LABELS: Record<string, string> = {
  benzine: 'Benzine',
  diesel: 'Diesel',
  elektrisch: 'Elektrisch',
  hybride: 'Hybride',
  lpg: 'LPG',
}

const TRANSMISSION_LABELS: Record<string, string> = {
  automaat: 'Automaat',
  handgeschakeld: 'Handgeschakeld',
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  showPrice = true,
  className = '',
}) => {
  const {
    slug,
    title,
    images,
    price,
    salePrice,
    year,
    mileage,
    fuelType,
    transmission,
    status,
    brand,
  } = vehicle

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const formatMileage = (km: number) =>
    new Intl.NumberFormat('nl-NL').format(km)

  const mainImage = images && images.length > 0 ? images[0] : null
  const statusConfig = status ? STATUS_CONFIG[status] : null
  const brandName = brand && typeof brand === 'object' ? brand.title : ''
  const displayTitle = brandName ? `${brandName} ${title}` : title

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--color-base-400)] ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-base-100)]">
        {mainImage?.url ? (
          <img
            src={mainImage.url}
            alt={mainImage.alt || displayTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--color-base-400)]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h1" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
        )}

        {/* Status badge */}
        {statusConfig && (
          <div className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${statusConfig.bgClass} ${statusConfig.textClass}`}>
            {statusConfig.label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-bold leading-tight text-[var(--color-base-1000)] line-clamp-2">
          {displayTitle}
        </h3>

        {/* Price */}
        {showPrice && price != null && (
          <div className="mb-3 flex items-center gap-2">
            {salePrice != null && salePrice > 0 ? (
              <>
                <span className="text-lg font-bold text-[var(--color-primary)]">
                  {formatPrice(salePrice)}
                </span>
                <span className="text-sm text-[var(--color-base-500)] line-through">
                  {formatPrice(price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-[var(--color-primary)]">
                {formatPrice(price)}
              </span>
            )}
          </div>
        )}

        {/* Key specs row */}
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-base-600)]">
          {year && (
            <span className="inline-flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {year}
            </span>
          )}
          {mileage != null && (
            <span className="inline-flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {formatMileage(mileage)} km
            </span>
          )}
          {fuelType && (
            <span className="inline-flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
              </svg>
              {FUEL_LABELS[fuelType] || fuelType}
            </span>
          )}
          {transmission && (
            <span className="inline-flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              </svg>
              {TRANSMISSION_LABELS[transmission] || transmission}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto border-t border-[var(--color-base-200)] pt-4">
          <Link
            href={`/occasions/${slug}`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
          >
            Bekijk details
            <svg className="transition-transform group-hover:translate-x-0.5" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default VehicleCard
