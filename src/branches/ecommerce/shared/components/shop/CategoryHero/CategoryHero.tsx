'use client'

import React from 'react'
import { Package } from 'lucide-react'
import { getIcon } from '@/utilities/getIcon'
import type { CategoryHeroProps } from './types'

export const CategoryHero: React.FC<CategoryHeroProps> = ({
  category,
  productCount,
  brandCount,
  inStockPercent,
  className = '',
}) => {
  // Dynamically load Lucide icon (convert kebab-case to PascalCase)
  const IconComponent = React.useMemo(() => {
    if (!category.icon) return Package // Default fallback

    // Convert kebab-case to PascalCase (e.g., "heart-pulse" → "HeartPulse")
    const iconName = category.icon
      .split('-')
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')

    return getIcon(iconName, Package)!
  }, [category.icon])

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br from-theme-navy to-theme-navy-light p-10 md:p-[40px] ${className}`}
      role="banner"
      aria-labelledby="category-title"
    >
      {/* Decorative teal glow overlay */}
      <div
        className="pointer-events-none absolute -right-[10%] -top-1/2 h-[400px] w-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center md:gap-10">
        {/* Text Section */}
        <div className="flex-1">
          {/* Badge */}
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-theme-teal/30 bg-theme-teal/15 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-theme-teal-light"
            aria-hidden="true"
          >
            {IconComponent && <IconComponent className="h-[14px] w-[14px]" />}
            {category.badgeText || 'PRODUCTCATEGORIE'}
          </div>

          {/* Title */}
          <h1
            id="category-title"
            className="mb-2.5 font-heading text-[28px] font-extrabold leading-tight tracking-tight text-white md:text-[36px]"
            style={{ letterSpacing: '-0.02em' }}
          >
            {category.name}
          </h1>

          {/* Description */}
          {category.description && (
            <p className="max-w-[520px] text-[16px] leading-relaxed text-white/50">
              {category.description}
            </p>
          )}
        </div>

        {/* Stats Section */}
        <div className="flex gap-6 md:gap-8" aria-label="Categorie statistieken">
          {/* Product Count */}
          <div className="text-center">
            <div
              className="font-heading text-[24px] font-extrabold text-white md:text-[28px]"
              aria-label={`${productCount} producten`}
            >
              <span className="text-theme-teal-light">{productCount}</span>
            </div>
            <div className="mt-0.5 text-[12px] text-white/40" aria-hidden="true">
              Producten
            </div>
          </div>

          {/* Brand Count (optional) */}
          {brandCount !== undefined && (
            <div className="text-center">
              <div
                className="font-heading text-[24px] font-extrabold text-white md:text-[28px]"
                aria-label={`${brandCount} merken`}
              >
                <span className="text-theme-teal-light">{brandCount}</span>
              </div>
              <div className="mt-0.5 text-[12px] text-white/40" aria-hidden="true">
                Merken
              </div>
            </div>
          )}

          {/* In Stock Percent (optional) */}
          {inStockPercent !== undefined && (
            <div className="text-center">
              <div
                className="font-heading text-[24px] font-extrabold text-white md:text-[28px]"
                aria-label={`${inStockPercent}% op voorraad`}
              >
                <span className="text-theme-teal-light">{inStockPercent}%</span>
              </div>
              <div className="mt-0.5 text-[12px] text-white/40" aria-hidden="true">
                Op voorraad
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
