'use client'

import React from 'react'
import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'
import { resolveIcon } from '../iconMap'
import type { BranchCardProps } from './types'
import type { Media } from '@/payload-types'

export const BranchCard: React.FC<BranchCardProps> = ({
  name,
  slug,
  description,
  icon: iconName,
  image,
  productCount,
  className = '',
}) => {
  const Icon = iconName ? resolveIcon(iconName) ?? Building2 : Building2
  const imageUrl = image && typeof image === 'object' ? (image as Media).url : null

  return (
    <Link
      href={`/branches/${slug}`}
      className={`
        group flex flex-col rounded-[14px] border-[1.5px] bg-white
        no-underline transition-all duration-[250ms]
        hover:-translate-y-[3px] hover:border-theme-teal
        hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)]
        ${className}
      `}
      style={{ borderColor: 'var(--color-border, #E8ECF1)' }}
      aria-label={`${name}${productCount !== undefined ? ` — ${productCount} producten` : ''}`}
    >
      {/* Image or icon */}
      <div className="flex h-[140px] items-center justify-center rounded-t-[13px] bg-theme-grey-light">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${name}`}
            className="h-full w-full rounded-t-[13px] object-cover"
          />
        ) : (
          <Icon className="h-12 w-12 text-theme-teal" strokeWidth={1.5} />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 font-heading text-[15px] font-extrabold text-theme-navy">
          {name}
        </h3>

        {description && (
          <p className="mb-3 flex-1 text-[13px] leading-snug text-theme-grey-mid line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {productCount !== undefined && (
            <span className="text-xs text-theme-grey-mid">
              {productCount} producten
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs font-bold text-theme-teal transition-transform group-hover:translate-x-1">
            Bekijk
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
