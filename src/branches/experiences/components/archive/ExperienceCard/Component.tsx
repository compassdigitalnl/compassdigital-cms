import React from 'react'
import Link from 'next/link'
import { Clock, Users, Star } from 'lucide-react'
import type { ExperienceCardProps } from './types'

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  slug,
  category,
  thumbnail,
  duration,
  minPersons,
  maxPersons,
  rating,
  reviewCount,
  pricePerPerson,
  priceType = 'per-person',
  popular = false,
  featured = false,
  badge,
  className = '',
}) => {
  const personLabel =
    minPersons && maxPersons
      ? `${minPersons}–${maxPersons} pers.`
      : minPersons
        ? `Vanaf ${minPersons} pers.`
        : maxPersons
          ? `Max ${maxPersons} pers.`
          : null

  const pricePrefix = priceType === 'from' ? 'Vanaf ' : ''
  const priceSuffix = priceType === 'per-person' ? 'p.p.' : priceType === 'from' ? 'p.p.' : ''

  return (
    <Link
      href={`/ervaringen/${slug}`}
      className={`
        group flex flex-col rounded-xl border bg-white
        no-underline shadow-sm transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md
        ${className}
      `}
      style={{ borderColor: 'var(--color-border, #e5e7eb)' }}
      aria-label={title}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden rounded-t-xl">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-[180px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-[180px] w-full items-center justify-center"
            style={{ backgroundColor: 'var(--color-grey-light, #f3f4f6)' }}
          >
            <span className="text-4xl opacity-40">🎯</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {popular && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: 'var(--color-coral, #ff6b6b)' }}
            >
              Populair
            </span>
          )}
          {featured && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
            >
              Uitgelicht
            </span>
          )}
          {badge && !popular && !featured && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
            >
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        {category && (
          <span
            className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-teal, #00a39b)' }}
          >
            {category}
          </span>
        )}

        {/* Title */}
        <h3
          className="mb-2 line-clamp-2 text-[15px] font-bold leading-snug"
          style={{ color: 'var(--color-navy, #1a2b4a)' }}
        >
          {title}
        </h3>

        {/* Meta row */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-[12px] text-gray-500">
          {duration && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {duration}
            </span>
          )}
          {personLabel && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {personLabel}
            </span>
          )}
        </div>

        {/* Rating */}
        {rating !== undefined && rating > 0 && (
          <div className="mb-3 flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-md px-2 py-0.5 text-[12px] font-bold text-white"
              style={{ backgroundColor: 'var(--color-teal, #00a39b)' }}
            >
              {rating.toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3"
                  fill={i < Math.round(rating / 2) ? '#f59e0b' : 'none'}
                  stroke={i < Math.round(rating / 2) ? '#f59e0b' : '#d1d5db'}
                  strokeWidth={1.5}
                />
              ))}
            </div>
            {reviewCount !== undefined && reviewCount > 0 && (
              <span className="text-[11px] text-gray-400">
                ({reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-1 pt-2 border-t border-gray-100">
          <span className="text-[11px] text-gray-400">{pricePrefix}</span>
          <span
            className="text-lg font-bold"
            style={{ color: 'var(--color-navy, #1a2b4a)' }}
          >
            &euro;{pricePerPerson.toFixed(2).replace('.', ',')}
          </span>
          {priceSuffix && (
            <span className="text-[11px] text-gray-400">{priceSuffix}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
