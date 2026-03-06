'use client'

import React from 'react'
import { Award } from 'lucide-react'
import type { BrandHeroProps } from './types'
import type { Media } from '@/payload-types'

export const BrandHero: React.FC<BrandHeroProps> = ({
  name,
  tagline,
  description,
  logo,
  productCount,
  categoryCount,
  inStockPercent,
  className = '',
}) => {
  const logoUrl = logo && typeof logo === 'object' ? (logo as Media).url : null

  return (
    <section
      className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br from-theme-navy to-theme-navy-light p-8 md:p-12 ${className}`}
      role="banner"
      aria-labelledby="brand-title"
    >
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -top-[50px] right-[50px] h-[300px] w-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto] md:gap-10">
        {/* Text section */}
        <div>
          {/* Badge */}
          {tagline && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.06] px-3 py-[5px]">
              <Award className="h-3.5 w-3.5 text-white/50" />
              <span className="text-xs font-bold text-white/50">{tagline}</span>
            </div>
          )}

          {/* Title */}
          <h1
            id="brand-title"
            className="mb-2 font-heading text-[28px] font-extrabold leading-tight text-white md:text-[32px]"
            style={{ letterSpacing: '-0.02em' }}
          >
            {name}
          </h1>

          {/* Description */}
          {description && (
            <p className="max-w-[520px] text-[15px] leading-relaxed text-white/[0.45]">
              {description}
            </p>
          )}

          {/* Stats */}
          <div className="mt-4 flex gap-5" aria-label="Merk statistieken">
            <div className="text-center">
              <div className="font-heading text-2xl font-extrabold text-theme-teal-light">
                {productCount}
              </div>
              <div className="mt-0.5 text-[11px] text-white/[0.35]">Producten</div>
            </div>

            {categoryCount !== undefined && (
              <div className="text-center">
                <div className="font-heading text-2xl font-extrabold text-theme-teal-light">
                  {categoryCount}
                </div>
                <div className="mt-0.5 text-[11px] text-white/[0.35]">Categorieën</div>
              </div>
            )}

            {inStockPercent !== undefined && (
              <div className="text-center">
                <div className="font-heading text-2xl font-extrabold text-theme-teal-light">
                  {inStockPercent}%
                </div>
                <div className="mt-0.5 text-[11px] text-white/[0.35]">Op voorraad</div>
              </div>
            )}
          </div>
        </div>

        {/* Logo box */}
        <div className="hidden md:flex">
          <div className="flex h-[80px] w-[140px] items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.06]">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${name} logo`}
                className="max-h-[60px] max-w-[120px] object-contain"
              />
            ) : (
              <span className="font-heading text-[28px] font-extrabold text-white">
                {name}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
