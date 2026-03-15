'use client'

import React, { useState, useMemo, useCallback, useRef } from 'react'
import type { Brand, Media } from '@/payload-types'
import { Award } from 'lucide-react'

// Layout
import { Breadcrumbs } from '@/globals/site/breadcrumbs/components/Breadcrumbs'
import type { BreadcrumbItem } from '@/globals/site/breadcrumbs/components/Breadcrumbs'

// Brand components
import { BrandCard } from '@/branches/shared/components/catalog/brands/BrandCard/Component'
import { FeaturedBrands } from '@/branches/shared/components/catalog/brands/FeaturedBrands/Component'
import { AlphabetNav } from '@/branches/shared/components/catalog/brands/AlphabetNav/Component'
import { BrandSearchToolbar } from '@/branches/shared/components/catalog/brands/BrandSearchToolbar/Component'

// ============================================
// TYPES
// ============================================

interface BrandWithCount extends Brand {
  productCount?: number
}

interface BrandsArchiveTemplate1Props {
  brands: BrandWithCount[]
  featuredBrands: BrandWithCount[]
  totalProductCount?: number
}

// ============================================
// HELPERS
// ============================================

function groupBrandsByLetter(brands: BrandWithCount[]): Record<string, BrandWithCount[]> {
  const groups: Record<string, BrandWithCount[]> = {}
  for (const brand of brands) {
    const firstChar = brand.name.charAt(0).toUpperCase()
    // Numbers and special chars go under '#'
    const letter = /^[A-Z]$/.test(firstChar) ? firstChar : '#'
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(brand)
  }
  // Sort within each group
  for (const letter of Object.keys(groups)) {
    groups[letter].sort((a, b) => a.name.localeCompare(b.name, 'nl'))
  }
  return groups
}

// ============================================
// COMPONENT
// ============================================

export default function BrandsArchiveTemplate1({
  brands,
  featuredBrands,
  totalProductCount,
}: BrandsArchiveTemplate1Props) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // Filter brands by search
  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands
    const q = searchQuery.toLowerCase()
    return brands.filter((b) => b.name.toLowerCase().includes(q))
  }, [brands, searchQuery])

  // Group by letter
  const groupedBrands = useMemo(() => groupBrandsByLetter(filteredBrands), [filteredBrands])
  const sortedLetters = useMemo(
    () => Object.keys(groupedBrands).sort((a, b) => {
      // '#' always first
      if (a === '#') return -1
      if (b === '#') return 1
      return a.localeCompare(b)
    }),
    [groupedBrands],
  )
  const availableLetters = useMemo(
    () => Object.keys(groupBrandsByLetter(brands)).sort((a, b) => {
      if (a === '#') return -1
      if (b === '#') return 1
      return a.localeCompare(b)
    }),
    [brands],
  )

  // Featured brands mapped to card props
  const featuredCardProps = useMemo(
    () =>
      featuredBrands.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        logo: b.logo,
        productCount: b.productCount,
      })),
    [featuredBrands],
  )

  // Scroll to section on letter click
  const handleLetterClick = useCallback((letter: string) => {
    setActiveLetter(letter)
    const el = sectionRefs.current[letter]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  return (
    <div className="bg-theme-bg min-h-screen">
      {/* Breadcrumbs */}
      <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        <Breadcrumbs items={[]} currentPage="Merken" />
      </div>

      <div className="mx-auto px-6 pb-12" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        {/* Hero */}
        <section
          className="relative mb-8 overflow-hidden rounded-[20px] bg-gradient-to-br from-theme-navy to-theme-navy-light p-10 md:p-[40px]"
          role="banner"
        >
          <div
            className="pointer-events-none absolute -right-[10%] -top-1/2 h-[400px] w-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, var(--color-primary-glow) 0%, transparent 70%)' }}
          />
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center md:gap-10">
            <div className="flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-theme-teal/30 bg-theme-teal/15 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-theme-teal-light">
                <Award className="h-[14px] w-[14px]" />
                MERKEN
              </div>
              <h1
                className="mb-2.5 font-heading text-[28px] font-extrabold leading-tight text-white md:text-[36px]"
                style={{ letterSpacing: '-0.02em' }}
              >
                Alle merken in ons assortiment
              </h1>
              <p className="max-w-[520px] text-[16px] leading-relaxed text-white/50">
                Ontdek alle merken in ons assortiment. Van toonaangevende fabrikanten tot
                gespecialiseerde productlijnen.
              </p>
            </div>
            <div className="flex gap-6 md:gap-8">
              <div className="text-center">
                <div className="font-heading text-[24px] font-extrabold text-white md:text-[28px]">
                  <span className="text-theme-teal-light">{brands.length}</span>
                </div>
                <div className="mt-0.5 text-[12px] text-white/40">Merken</div>
              </div>
              {totalProductCount !== undefined && (
                <div className="text-center">
                  <div className="font-heading text-[24px] font-extrabold text-white md:text-[28px]">
                    <span className="text-theme-teal-light">{totalProductCount}</span>
                  </div>
                  <div className="mt-0.5 text-[12px] text-white/40">Producten</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Brands */}
        {featuredCardProps.length > 0 && (
          <FeaturedBrands brands={featuredCardProps} className="mb-9" />
        )}

        {/* Search Toolbar */}
        <BrandSearchToolbar
          totalCount={filteredBrands.length}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q)
            setActiveLetter(null)
          }}
          className="mb-5"
        />

        {/* Alphabet Navigation */}
        <AlphabetNav
          availableLetters={availableLetters}
          activeLetter={activeLetter}
          onLetterClick={handleLetterClick}
          className="mb-8"
        />

        {/* Brand Sections */}
        {sortedLetters.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-semibold text-theme-navy">Geen merken gevonden</p>
            <p className="mt-1 text-sm text-theme-grey-mid">
              Probeer een andere zoekterm.
            </p>
          </div>
        ) : (
          sortedLetters.map((letter) => (
            <section
              key={letter}
              ref={(el) => { sectionRefs.current[letter] = el }}
              className="mb-8 scroll-mt-[160px]"
              aria-label={`Merken met ${letter === '#' ? 'cijfers' : `letter ${letter}`}`}
            >
              <h3 className="mb-3 inline-block border-b-2 border-theme-teal pb-1 font-heading text-2xl font-extrabold text-theme-teal">
                {letter}
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {groupedBrands[letter].map((brand) => (
                  <BrandCard
                    key={brand.id}
                    id={brand.id}
                    name={brand.name}
                    slug={brand.slug}
                    logo={brand.logo}
                    productCount={brand.productCount}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
