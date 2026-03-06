'use client'

import React from 'react'
import Link from 'next/link'
import type { BrandCardProps } from './types'
import type { Media } from '@/payload-types'

export const BrandCard: React.FC<BrandCardProps> = ({
  name,
  slug,
  logo,
  productCount,
  variant = 'standard',
  className = '',
}) => {
  const isFeatured = variant === 'featured'
  const logoUrl = logo && typeof logo === 'object' ? (logo as Media).url : null

  return (
    <Link
      href={`/merken/${slug}`}
      className={`
        group flex flex-col items-center gap-3 rounded-[14px] border bg-white
        transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:-translate-y-[3px] hover:border-theme-teal hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)]
        ${isFeatured
          ? 'border-[var(--grey,#E8ECF1)] p-5'
          : 'border-[1.5px] border-[var(--grey,#E8ECF1)] px-4 py-5'
        }
        ${className}
      `}
      aria-label={`${name}${productCount !== undefined ? ` — ${productCount} producten` : ''}`}
    >
      {/* Logo box */}
      <div
        className={`
          flex items-center justify-center rounded-lg bg-theme-grey-light
          ${isFeatured ? 'h-[52px] w-[100px]' : 'h-[48px] w-[80px]'}
        `}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="max-h-full max-w-full object-contain p-1"
          />
        ) : (
          <span className="font-heading text-xs font-bold text-theme-grey-mid">
            {name}
          </span>
        )}
      </div>

      {/* Name */}
      <span className="text-center text-[13px] font-bold text-theme-navy">
        {name}
      </span>

      {/* Product count */}
      {productCount !== undefined && (
        <span className="text-[11px] text-theme-grey-mid">
          {productCount} producten
        </span>
      )}
    </Link>
  )
}
