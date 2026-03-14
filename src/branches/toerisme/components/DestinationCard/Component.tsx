import React from 'react'
import Link from 'next/link'
import type { DestinationCardProps } from './types'

export const DestinationCard: React.FC<DestinationCardProps> = ({
  name,
  slug,
  country,
  coverImage,
  coverAlt,
  icon,
  tourCount,
  className = '',
}) => {
  return (
    <Link
      href={`/reizen?bestemming=${slug}`}
      className={`group relative flex h-[240px] flex-col justify-end overflow-hidden rounded-xl no-underline shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg md:h-[280px] ${className}`}
      aria-label={`${name}${country ? `, ${country}` : ''}`}
    >
      {/* Background image */}
      {coverImage ? (
        <img
          src={coverImage}
          alt={coverAlt || name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-[var(--color-base-200)]" />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Icon (top-right) */}
      {icon && (
        <div className="absolute right-3 top-3 text-2xl drop-shadow-md">
          {icon}
        </div>
      )}

      {/* Content (bottom) */}
      <div className="relative z-10 p-4">
        <h3 className="mb-0.5 text-xl font-bold text-white drop-shadow-sm">
          {name}
        </h3>
        {country && (
          <p className="mb-1 text-sm text-white/80">
            {country}
          </p>
        )}
        {tourCount != null && tourCount > 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {tourCount} {tourCount === 1 ? 'reis' : 'reizen'}
          </span>
        )}
      </div>
    </Link>
  )
}
