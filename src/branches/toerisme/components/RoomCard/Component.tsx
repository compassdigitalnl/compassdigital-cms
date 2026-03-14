import React from 'react'
import type { RoomCardProps } from './types'

export const RoomCard: React.FC<RoomCardProps> = ({
  name,
  type,
  maxGuests,
  pricePerNight,
  description,
  amenities = [],
  onSelect,
  className = '',
}) => {
  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  return (
    <div
      className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-5 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Left: Info */}
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h4 className="text-base font-bold text-[var(--color-base-1000)]">{name}</h4>
            {type && (
              <span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[11px] font-medium text-[var(--color-primary)]">
                {type}
              </span>
            )}
          </div>

          {/* Max guests */}
          {maxGuests != null && (
            <div className="mb-2 flex items-center gap-1 text-sm text-[var(--color-base-600)]">
              {Array.from({ length: maxGuests }).map((_, i) => (
                <svg key={i} className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              ))}
              <span className="ml-1 text-xs">Max {maxGuests} gasten</span>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="mb-3 text-sm text-[var(--color-base-600)] line-clamp-2">{description}</p>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {amenities.map((amenity, i) => (
                <span
                  key={i}
                  className="rounded-full border border-[var(--color-base-200)] bg-[var(--color-base-50)] px-2 py-0.5 text-[11px] text-[var(--color-base-600)]"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Price + CTA */}
        <div className="flex flex-row items-center gap-4 md:flex-col md:items-end md:text-right">
          {pricePerNight != null && (
            <div>
              <span className="text-xl font-bold text-[var(--color-base-1000)]">
                {formatPrice(pricePerNight)}
              </span>
              <span className="block text-[11px] text-[var(--color-base-500)]">per nacht</span>
            </div>
          )}

          {onSelect && (
            <button
              onClick={onSelect}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Selecteer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
