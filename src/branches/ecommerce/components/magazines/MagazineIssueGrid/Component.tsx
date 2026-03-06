'use client'

import React from 'react'
import Link from 'next/link'
import { BookOpen, ShoppingCart } from 'lucide-react'
import type { MagazineIssueGridProps } from './types'

export const MagazineIssueGrid: React.FC<MagazineIssueGridProps> = ({
  title = 'Recente edities',
  issues,
  magazineSlug,
  className = '',
}) => {
  return (
    <section className={className}>
      <h2 className="mb-4 flex items-center gap-2.5 font-heading text-[22px] font-extrabold text-theme-navy">
        <BookOpen className="h-[22px] w-[22px] text-theme-teal" />
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {issues.map((issue) => (
          <Link
            key={issue.id}
            href={`/${issue.slug}`}
            className="
              group flex flex-col rounded-[14px] border-[1.5px] bg-white
              no-underline transition-all duration-[250ms]
              hover:-translate-y-[3px] hover:border-theme-teal
              hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)]
            "
            style={{ borderColor: 'var(--color-border)' }}
          >
            {/* Cover */}
            <div className="flex aspect-[3/4] items-center justify-center rounded-t-[13px] bg-theme-grey-light">
              {issue.coverUrl ? (
                <img
                  src={issue.coverUrl}
                  alt={issue.title}
                  className="h-full w-full rounded-t-[13px] object-cover"
                />
              ) : (
                <BookOpen className="h-10 w-10 text-theme-teal" strokeWidth={1.5} />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="mb-1 font-heading text-[13px] font-extrabold text-theme-navy line-clamp-2">
                {issue.title}
              </h3>

              {issue.publishedDate && (
                <span className="mb-2 text-[11px] text-theme-grey-mid">
                  {issue.publishedDate}
                </span>
              )}

              <div className="mt-auto flex items-center justify-between">
                {issue.price != null && (
                  <span className="font-heading text-sm font-extrabold text-theme-teal">
                    &euro;{issue.price.toFixed(2).replace('.', ',')}
                  </span>
                )}

                {issue.status === 'sold-out' ? (
                  <span className="text-[11px] font-bold text-[var(--color-error)]">Uitverkocht</span>
                ) : (
                  <ShoppingCart className="h-3.5 w-3.5 text-theme-grey-mid transition-colors group-hover:text-theme-teal" />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
