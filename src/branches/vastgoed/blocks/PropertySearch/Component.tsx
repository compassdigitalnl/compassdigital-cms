'use client'

import React, { useState } from 'react'
import type { PropertySearchProps } from './types'

const QUICK_TYPES = [
  { label: 'Alle types', value: '' },
  { label: 'Appartement', value: 'appartement' },
  { label: 'Woonhuis', value: 'woonhuis' },
  { label: 'Villa', value: 'villa' },
  { label: 'Penthouse', value: 'penthouse' },
]

const PRICE_RANGES = [
  { label: 'Alle prijzen', value: '' },
  { label: 'Tot \u20AC 300.000', value: '0-300000' },
  { label: '\u20AC 300.000 - \u20AC 500.000', value: '300000-500000' },
  { label: '\u20AC 500.000 - \u20AC 750.000', value: '500000-750000' },
  { label: '\u20AC 750.000+', value: '750000-' },
]

const BEDROOM_OPTIONS = [
  { label: 'Slaapkamers', value: '' },
  { label: '1+', value: '1' },
  { label: '2+', value: '2' },
  { label: '3+', value: '3' },
  { label: '4+', value: '4' },
]

export function PropertySearchComponent(props: PropertySearchProps) {
  const { heading, subheading, showFilters = true, defaultCity } = props

  const [propertyType, setPropertyType] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [bedrooms, setBedrooms] = useState('')

  const buildSearchUrl = () => {
    const params = new URLSearchParams()
    if (defaultCity) params.set('city', defaultCity)
    if (propertyType) params.set('type', propertyType)
    if (priceRange) {
      const [min, max] = priceRange.split('-')
      if (min) params.set('minPrice', min)
      if (max) params.set('maxPrice', max)
    }
    if (bedrooms) params.set('minBedrooms', bedrooms)
    const qs = params.toString()
    return `/woningen${qs ? `?${qs}` : ''}`
  }

  return (
    <section
      className="relative overflow-hidden px-4 py-16 md:py-20 lg:py-28"
      style={{ background: 'linear-gradient(135deg, #1a1f3d, #2d3352)' }}
    >
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute -right-[10%] -top-[50%] h-[280px] w-[280px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(92,107,192,0.15), transparent 60%)',
        }}
      />

      <div className="container relative z-10 mx-auto max-w-3xl text-center">
        {heading && (
          <h2 className="mb-4 text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="mx-auto mb-10 max-w-xl text-base text-white/70 md:text-lg">
            {subheading}
          </p>
        )}

        {showFilters && (
          <div className="mb-8 flex flex-col items-stretch gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:flex-row sm:items-center">
            {/* Type select */}
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="flex-1 cursor-pointer rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-[13px] text-white focus:border-[#5C6BC0] focus:outline-none"
            >
              {QUICK_TYPES.map((t) => (
                <option key={t.value} value={t.value} style={{ background: '#1a1f3d', color: 'white' }}>
                  {t.label}
                </option>
              ))}
            </select>

            {/* Price range */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="flex-1 cursor-pointer rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-[13px] text-white focus:border-[#5C6BC0] focus:outline-none"
            >
              {PRICE_RANGES.map((p) => (
                <option key={p.value} value={p.value} style={{ background: '#1a1f3d', color: 'white' }}>
                  {p.label}
                </option>
              ))}
            </select>

            {/* Bedrooms */}
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="flex-1 cursor-pointer rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-[13px] text-white focus:border-[#5C6BC0] focus:outline-none"
            >
              {BEDROOM_OPTIONS.map((b) => (
                <option key={b.value} value={b.value} style={{ background: '#1a1f3d', color: 'white' }}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* CTA button */}
        <a
          href={buildSearchUrl()}
          className="inline-flex items-center gap-2.5 rounded-xl px-8 py-4 text-[15px] font-bold text-white no-underline shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #3F51B5, #5C6BC0)',
            boxShadow: '0 4px 12px rgba(63,81,181,0.3)',
          }}
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
          Woningen zoeken
        </a>
      </div>
    </section>
  )
}
