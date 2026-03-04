import React from 'react'
import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import type { BrandCTAProps } from './types'

export const BrandCTA: React.FC<BrandCTAProps> = ({
  brandName,
  brandSlug,
  productCount,
  className = '',
}) => {
  return (
    <section
      className={`relative overflow-hidden rounded-[20px] bg-gradient-to-br from-theme-navy to-theme-navy-light p-10 text-center ${className}`}
    >
      {/* Decorative blob */}
      <div
        className="pointer-events-none absolute -top-[50px] right-[50px] h-[300px] w-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,137,123,0.06) 0%, transparent 70%)',
        }}
      />

      <h2
        className="relative mb-1.5 font-heading text-2xl font-extrabold text-white"
        style={{ letterSpacing: '-0.02em' }}
      >
        Alle {productCount} {brandName} producten bekijken
      </h2>

      <p className="relative mb-5 text-sm text-white/[0.45]">
        Profiteer van B2B-prijzen, staffelkortingen en volgende-dag levering.
      </p>

      <Link
        href={`/shop?brand=${brandSlug}`}
        className="relative inline-flex items-center gap-[7px] rounded-xl bg-theme-teal px-7 py-3.5 text-[15px] font-bold text-white transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-theme-teal-light"
      >
        <LayoutGrid className="h-[17px] w-[17px]" />
        Bekijk alle producten
      </Link>
    </section>
  )
}
