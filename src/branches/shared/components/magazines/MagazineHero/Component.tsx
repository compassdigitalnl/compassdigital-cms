'use client'

import React from 'react'
import { BookOpen } from 'lucide-react'
import type { MagazineHeroProps } from './types'

export const MagazineHero: React.FC<MagazineHeroProps> = ({
  badge = 'Magazine',
  title,
  description,
  logoUrl,
  stats = [],
  className = '',
}) => {
  return (
    <section
      className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br from-theme-navy to-theme-navy-light p-8 md:p-12 lg:p-14 ${className}`}
      role="banner"
    >
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -top-[60px] right-[100px] h-[300px] w-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--color-primary-glow), transparent 70%)',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto] md:gap-10">
        {/* Text section */}
        <div>
          {/* Badge */}
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary-glow)] bg-[var(--color-primary-glow)] px-3.5 py-1.5 text-xs font-bold text-theme-teal-light">
            <BookOpen className="h-3.5 w-3.5" />
            {badge}
          </div>

          {/* Title */}
          <h1
            className="mb-2.5 font-heading text-[28px] font-extrabold leading-tight text-white md:text-[34px]"
            style={{ letterSpacing: '-0.02em' }}
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="max-w-[560px] text-base leading-relaxed text-white/50">
              {description}
            </p>
          )}

          {/* Stats */}
          {stats.length > 0 && (
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-6" aria-label="Magazine statistieken">
              {stats.map((stat, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="font-heading text-[28px] font-extrabold text-theme-teal-light">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logo (desktop only) */}
        {logoUrl ? (
          <div className="hidden md:flex">
            <img
              src={logoUrl}
              alt={title}
              className="h-[100px] w-auto object-contain opacity-80"
            />
          </div>
        ) : (
          <div className="hidden md:flex">
            <BookOpen className="h-[120px] w-[120px] text-white/20" strokeWidth={1} />
          </div>
        )}
      </div>
    </section>
  )
}
