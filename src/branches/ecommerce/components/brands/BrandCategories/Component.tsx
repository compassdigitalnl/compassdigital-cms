'use client'

import React from 'react'
import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import type { BrandCategoriesProps } from './types'

export const BrandCategories: React.FC<BrandCategoriesProps> = ({
  categories,
  brandSlug,
  className = '',
}) => {
  if (categories.length === 0) return null

  return (
    <section className={`${className}`} aria-labelledby="brand-categories-title">
      <h2
        id="brand-categories-title"
        className="mb-3.5 flex items-center gap-2 font-heading text-xl font-extrabold text-theme-navy"
      >
        <LayoutGrid className="h-5 w-5 text-theme-teal" />
        Categorieën
      </h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop/${cat.slug}?brand=${brandSlug}`}
            className="group flex flex-col items-center gap-1.5 rounded-[14px] border-[1.5px] border-[var(--grey,#E8ECF1)] bg-white p-[18px] text-center transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-theme-teal hover:shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
          >
            {cat.icon && (
              <span className="text-[28px]" role="img" aria-hidden="true">
                {cat.icon}
              </span>
            )}
            <span className="text-[13px] font-bold text-theme-navy">{cat.name}</span>
            <span className="text-[11px] text-theme-grey-mid">
              {cat.productCount} producten
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
