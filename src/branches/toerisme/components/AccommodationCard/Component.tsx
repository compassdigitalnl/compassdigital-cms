import React from 'react'
import Link from 'next/link'
import type { AccommodationCardProps } from './types'

const FACILITY_ICONS: Record<string, string> = {
  zwembad: '🏊',
  spa: '💆',
  restaurant: '🍽️',
  bar: '🍸',
  fitness: '💪',
  wifi: '📶',
  parkeren: '🅿️',
  roomservice: '🛎️',
  airco: '❄️',
  wasserij: '👕',
  kindvriendelijk: '👶',
  huisdieren: '🐾',
}

const MEAL_PLAN_LABELS: Record<string, string> = {
  logies: 'Logies',
  ontbijt: 'L&O',
  halfpension: 'HP',
  volpension: 'VP',
  allinclusive: 'All-in',
}

const TYPE_LABELS: Record<string, string> = {
  hotel: 'Hotel',
  resort: 'Resort',
  villa: 'Villa',
  appartement: 'Appartement',
  hostel: 'Hostel',
  'b-and-b': 'B&B',
  glamping: 'Glamping',
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  name,
  slug,
  coverImage,
  coverAlt,
  stars,
  type,
  city,
  region,
  facilities = [],
  priceFrom,
  mealPlan,
  rating,
  reviewCount,
  className = '',
}) => {
  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const location = [city, region].filter(Boolean).join(', ')

  return (
    <Link
      href={`/accommodaties/${slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border bg-[var(--color-base-0)] no-underline shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${className}`}
      style={{ borderColor: 'var(--color-base-200)' }}
      aria-label={name}
    >
      {/* Cover image */}
      <div className="relative overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={coverAlt || name}
            className="h-[200px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-[200px] w-full items-center justify-center bg-[var(--color-base-100)]">
            <span className="text-4xl opacity-40">🏨</span>
          </div>
        )}

        {/* Type badge */}
        {type && TYPE_LABELS[type] && (
          <div
            className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {TYPE_LABELS[type]}
          </div>
        )}

        {/* Meal plan badge */}
        {mealPlan && MEAL_PLAN_LABELS[mealPlan] && (
          <div className="absolute right-3 top-3 rounded-full bg-[var(--color-base-1000)]/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {MEAL_PLAN_LABELS[mealPlan]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Stars */}
        {stars != null && stars > 0 && (
          <div className="mb-1.5 flex items-center gap-0.5">
            {Array.from({ length: stars }).map((_, i) => (
              <svg key={i} className="h-3.5 w-3.5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        )}

        {/* Name */}
        <h3 className="mb-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-[var(--color-base-1000)]">
          {name}
        </h3>

        {/* Location */}
        {location && (
          <div className="mb-2 flex items-center gap-1 text-[12px] text-[var(--color-base-500)]">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            {location}
          </div>
        )}

        {/* Rating */}
        {rating != null && rating > 0 && (
          <div className="mb-2 flex items-center gap-1.5">
            <span className="rounded-md bg-[var(--color-primary)] px-1.5 py-0.5 text-[11px] font-bold text-white">
              {rating.toFixed(1)}
            </span>
            {reviewCount != null && reviewCount > 0 && (
              <span className="text-[11px] text-[var(--color-base-500)]">
                ({reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Facility icons */}
        {facilities.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {facilities.slice(0, 6).map((facility) => (
              <span
                key={facility}
                className="rounded bg-[var(--color-base-50)] px-1.5 py-0.5 text-[11px]"
                title={facility.charAt(0).toUpperCase() + facility.slice(1)}
              >
                {FACILITY_ICONS[facility] || facility}
              </span>
            ))}
            {facilities.length > 6 && (
              <span className="rounded bg-[var(--color-base-50)] px-1.5 py-0.5 text-[11px] text-[var(--color-base-500)]">
                +{facilities.length - 6}
              </span>
            )}
          </div>
        )}

        {/* Price */}
        {priceFrom != null && (
          <div className="mt-auto flex items-baseline gap-1.5 border-t border-[var(--color-base-100)] pt-3">
            <span className="text-[11px] text-[var(--color-base-500)]">Vanaf</span>
            <span className="text-lg font-bold text-[var(--color-base-1000)]">
              {formatPrice(priceFrom)}
            </span>
            <span className="text-[11px] text-[var(--color-base-500)]">p.p.p.n.</span>
          </div>
        )}
      </div>
    </Link>
  )
}
