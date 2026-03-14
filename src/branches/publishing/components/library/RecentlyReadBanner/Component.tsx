'use client'

import React from 'react'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import type { RecentlyReadBannerProps } from './types'

export const RecentlyReadBanner: React.FC<RecentlyReadBannerProps> = ({
  magazineSlug,
  magazineName,
  editionIndex,
  editionTitle,
  coverUrl,
  currentPage,
  totalPages,
}) => {
  const progressPercent = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0

  return (
    <Link
      href={`/account/bibliotheek/${magazineSlug}/${editionIndex}`}
      className="
        group flex items-center gap-4 rounded-[14px] border-[1.5px] bg-white p-3
        no-underline transition-all duration-[250ms]
        hover:-translate-y-[2px] hover:border-[var(--color-primary,#7c3aed)]
        hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)]
        md:p-4
      "
      style={{ borderColor: 'var(--color-base-200, #e2e8f0)' }}
    >
      {/* Cover thumbnail */}
      <div className="flex h-16 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--color-base-200,#f3f4f6)]">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={editionTitle}
            className="h-full w-full rounded-lg object-cover"
            loading="lazy"
          />
        ) : (
          <BookOpen
            className="h-5 w-5 text-[var(--color-primary,#7c3aed)]"
            strokeWidth={1.5}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5">
        <div>
          <p className="text-[11px] font-medium text-[var(--color-base-400,#94a3b8)]">
            {magazineName}
          </p>
          <h3 className="font-heading text-[13px] font-extrabold text-[var(--color-base-900,#0f172a)] line-clamp-1 md:text-sm">
            {editionTitle}
          </h3>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-base-200,#e2e8f0)]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(to right, #7c3aed, #2563eb)',
              }}
            />
          </div>
          <span className="flex-shrink-0 text-[10px] font-bold text-[var(--color-primary,#7c3aed)]">
            {progressPercent}%
          </span>
        </div>

        <p className="text-[10px] text-[var(--color-base-400,#94a3b8)]">
          Pagina {currentPage} van {totalPages}
        </p>
      </div>

      {/* CTA */}
      <span className="hidden flex-shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-bold text-white transition-opacity group-hover:opacity-90 sm:inline-flex"
        style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
      >
        Verder lezen
        <ArrowRight className="h-3 w-3" />
      </span>
    </Link>
  )
}
