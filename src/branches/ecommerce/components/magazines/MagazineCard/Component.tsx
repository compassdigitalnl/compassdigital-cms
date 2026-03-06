'use client'

import React from 'react'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import type { MagazineCardProps } from './types'
import type { Media } from '@/payload-types'

export const MagazineCard: React.FC<MagazineCardProps> = ({
  name,
  slug,
  tagline,
  logo,
  image,
  issueCount,
  className = '',
}) => {
  const imageUrl = image && typeof image === 'object' ? (image as Media).url : null
  const logoUrl = logo && typeof logo === 'object' ? (logo as Media).url : null

  return (
    <Link
      href={`/magazines/${slug}`}
      className={`
        group flex flex-col rounded-[14px] border-[1.5px] bg-white
        no-underline transition-all duration-[250ms]
        hover:-translate-y-[3px] hover:border-theme-teal
        hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)]
        ${className}
      `}
      style={{ borderColor: 'var(--color-border)' }}
      aria-label={`${name}${issueCount !== undefined ? ` — ${issueCount} edities` : ''}`}
    >
      {/* Cover image or logo */}
      <div className="flex h-[180px] items-center justify-center rounded-t-[13px] bg-theme-grey-light">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full rounded-t-[13px] object-cover"
          />
        ) : logoUrl ? (
          <img
            src={logoUrl}
            alt={name}
            className="h-16 w-auto object-contain"
          />
        ) : (
          <BookOpen className="h-12 w-12 text-theme-teal" strokeWidth={1.5} />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 font-heading text-[15px] font-extrabold text-theme-navy">
          {name}
        </h3>

        {tagline && (
          <p className="mb-3 flex-1 text-[13px] leading-snug text-theme-grey-mid line-clamp-2">
            {tagline}
          </p>
        )}

        <div className="flex items-center justify-between">
          {issueCount !== undefined && (
            <span className="text-xs text-theme-grey-mid">
              {issueCount} {issueCount === 1 ? 'editie' : 'edities'}
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
