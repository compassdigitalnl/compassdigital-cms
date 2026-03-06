'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import { resolveIcon } from '../iconMap'
import type { BranchCategoryGridProps } from './types'

export const BranchCategoryGrid: React.FC<BranchCategoryGridProps> = ({
  title = 'Populaire categorieen',
  titleIcon: titleIconName,
  categories,
  branchSlug,
  className = '',
}) => {
  const TitleIcon = titleIconName ? resolveIcon(titleIconName) ?? LayoutGrid : LayoutGrid
  return (
    <section className={className}>
      <h2 className="mb-4 flex items-center gap-2.5 font-heading text-[22px] font-extrabold text-theme-navy">
        <TitleIcon className="h-[22px] w-[22px] text-theme-teal" />
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = resolveIcon(category.icon)

          return (
            <Link
              key={category.slug}
              href={`/branches/${branchSlug}/${category.slug}`}
              className="
                group flex flex-col items-center gap-2 rounded-[14px] border-[1.5px]
                bg-white p-5 text-center no-underline
                transition-all duration-[250ms]
                hover:-translate-y-[3px] hover:border-theme-teal
                hover:shadow-[0_8px_28px_rgba(0,0,0,0.05)]
              "
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-[14px]"
                style={{ background: category.iconBg }}
              >
                {Icon && <Icon className="h-7 w-7 text-theme-teal" />}
              </div>
              <div className="font-heading text-sm font-extrabold text-theme-navy">
                {category.name}
              </div>
              <div className="text-xs text-theme-grey-mid">
                {category.productCount} producten
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
