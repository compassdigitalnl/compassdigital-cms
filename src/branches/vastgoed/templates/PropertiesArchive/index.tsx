import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatArea, formatPropertyType, formatEnergyLabel } from '@/branches/vastgoed/lib/propertyUtils'
import type { PropertiesArchiveProps } from './types'

/**
 * PropertiesArchiveTemplate - Overzicht van alle woningen (/woningen)
 *
 * Layout: Page header met stats, 2-kolom met PropertyFilters sidebar + PropertyCard grid.
 * Server component die data ontvangt van de page route.
 */

const propertyTypeOptions = [
  { value: 'appartement', label: 'Appartement' },
  { value: 'woonhuis', label: 'Woonhuis' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'tussenwoning', label: 'Tussenwoning' },
  { value: 'hoekwoning', label: 'Hoekwoning' },
  { value: 'twee-onder-een-kap', label: 'Twee-onder-een-kap' },
  { value: 'vrijstaand', label: 'Vrijstaand' },
]

const priceRanges = [
  { label: 'Tot \u20ac200.000', min: 0, max: 200000 },
  { label: '\u20ac200.000 - \u20ac350.000', min: 200000, max: 350000 },
  { label: '\u20ac350.000 - \u20ac500.000', min: 350000, max: 500000 },
  { label: '\u20ac500.000 - \u20ac750.000', min: 500000, max: 750000 },
  { label: '\u20ac750.000+', min: 750000, max: 99999999 },
]

const bedroomOptions = [
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
]

const energyLabelOptions = ['A+++', 'A++', 'A+', 'A', 'B', 'C']

function getEnergyLabelBgColor(label: string): string {
  const info = formatEnergyLabel(label)
  const colorMap: Record<string, string> = {
    green: '#22c55e',
    lime: '#84cc16',
    yellow: '#eab308',
    orange: '#f97316',
    red: '#ef4444',
    gray: '#94A3B8',
  }
  return colorMap[info.color] || '#94A3B8'
}

function getStatusLabel(status: string): { label: string; color: string } {
  switch (status) {
    case 'beschikbaar':
      return { label: 'Beschikbaar', color: '#22c55e' }
    case 'onder-bod':
      return { label: 'Onder bod', color: '#f59e0b' }
    case 'verkocht':
      return { label: 'Verkocht', color: '#ef4444' }
    case 'verhuurd':
      return { label: 'Verhuurd', color: '#8b5cf6' }
    default:
      return { label: 'Beschikbaar', color: '#22c55e' }
  }
}

export function PropertiesArchiveTemplate({
  properties,
  totalPages,
  currentPage,
  totalDocs,
  filters,
}: PropertiesArchiveProps) {
  // Build query string helper
  const buildFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (filters?.city) params.set('city', filters.city)
    if (filters?.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))
    if (filters?.propertyType) params.set('propertyType', filters.propertyType)
    if (filters?.minBedrooms) params.set('minBedrooms', String(filters.minBedrooms))
    if (filters?.minArea) params.set('minArea', String(filters.minArea))
    if (filters?.maxArea) params.set('maxArea', String(filters.maxArea))
    if (filters?.energyLabel) params.set('energyLabel', filters.energyLabel)
    if (filters?.sort) params.set('sort', filters.sort)

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    const qs = params.toString()
    return '/woningen' + (qs ? '?' + qs : '')
  }

  const buildPriceUrl = (min: number, max: number) => {
    const params = new URLSearchParams()
    if (filters?.city) params.set('city', filters.city)
    if (filters?.propertyType) params.set('propertyType', filters.propertyType)
    if (filters?.minBedrooms) params.set('minBedrooms', String(filters.minBedrooms))
    if (filters?.minArea) params.set('minArea', String(filters.minArea))
    if (filters?.maxArea) params.set('maxArea', String(filters.maxArea))
    if (filters?.energyLabel) params.set('energyLabel', filters.energyLabel)
    if (filters?.sort) params.set('sort', filters.sort)

    const isActive = filters?.minPrice === min && filters?.maxPrice === max
    if (!isActive) {
      params.set('minPrice', String(min))
      params.set('maxPrice', String(max))
    }
    params.delete('page')
    const qs = params.toString()
    return '/woningen' + (qs ? '?' + qs : '')
  }

  const paginationUrl = (page: number) => {
    const params = new URLSearchParams()
    if (filters?.city) params.set('city', filters.city)
    if (filters?.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))
    if (filters?.propertyType) params.set('propertyType', filters.propertyType)
    if (filters?.minBedrooms) params.set('minBedrooms', String(filters.minBedrooms))
    if (filters?.minArea) params.set('minArea', String(filters.minArea))
    if (filters?.maxArea) params.set('maxArea', String(filters.maxArea))
    if (filters?.energyLabel) params.set('energyLabel', filters.energyLabel)
    if (filters?.sort) params.set('sort', filters.sort)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return '/woningen' + (qs ? '?' + qs : '')
  }

  const hasActiveFilters =
    filters?.city ||
    filters?.minPrice ||
    filters?.maxPrice ||
    filters?.propertyType ||
    filters?.minBedrooms ||
    filters?.minArea ||
    filters?.maxArea ||
    filters?.energyLabel

  // Calculate stats
  const availableCount = properties.filter(
    (p) => p.listingStatus === 'beschikbaar' || !p.listingStatus,
  ).length
  const avgPrice =
    properties.length > 0
      ? Math.round(
          properties.reduce((sum: number, p: any) => sum + (p.askingPrice || 0), 0) /
            properties.length,
        )
      : 0

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Woningen</span>
        </nav>
      </div>

      {/* Hero */}
      <section
        className="py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, var(--color-primary, #3F51B5), var(--color-secondary, #303F9F))' }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1
            className="text-3xl text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Woningen
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Ontdek ons actuele woningaanbod. Van appartementen tot vrijstaande woningen.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalDocs}</div>
              <div className="text-sm text-white/60">Woningen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{availableCount}</div>
              <div className="text-sm text-white/60">Beschikbaar</div>
            </div>
            {avgPrice > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{formatPrice(avgPrice)}</div>
                <div className="text-sm text-white/60">Gem. prijs</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar filters */}
          <aside className="space-y-6 lg:col-span-1">
            {/* Property type filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Woningtype
              </h3>
              <div className="space-y-2">
                {propertyTypeOptions.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildFilterUrl('propertyType', filters?.propertyType === opt.value ? '' : opt.value)}
                    className="flex items-center gap-2 text-sm transition-colors"
                    style={{
                      color: filters?.propertyType === opt.value ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded border"
                      style={{
                        borderColor: filters?.propertyType === opt.value ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                        backgroundColor: filters?.propertyType === opt.value ? 'var(--color-primary)' : 'transparent',
                      }}
                    >
                      {filters?.propertyType === opt.value && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price range filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Prijsklasse
              </h3>
              <div className="space-y-2">
                {priceRanges.map((range) => {
                  const isActive = filters?.minPrice === range.min && filters?.maxPrice === range.max
                  return (
                    <Link
                      key={range.label}
                      href={buildPriceUrl(range.min, range.max)}
                      className="flex items-center gap-2 text-sm transition-colors"
                      style={{
                        color: isActive ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)',
                      }}
                    >
                      <span
                        className="flex h-4 w-4 items-center justify-center rounded border"
                        style={{
                          borderColor: isActive ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                          backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                        }}
                      >
                        {isActive && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {range.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Bedrooms filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Slaapkamers
              </h3>
              <div className="flex flex-wrap gap-2">
                {bedroomOptions.map((opt) => {
                  const isActive = filters?.minBedrooms === opt.value
                  return (
                    <Link
                      key={opt.value}
                      href={buildFilterUrl('minBedrooms', isActive ? '' : String(opt.value))}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                        color: isActive ? '#fff' : 'var(--color-grey-dark, #475569)',
                      }}
                    >
                      {opt.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Energy label filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Energielabel
              </h3>
              <div className="flex flex-wrap gap-2">
                {energyLabelOptions.map((label) => {
                  const isActive = filters?.energyLabel === label
                  return (
                    <Link
                      key={label}
                      href={buildFilterUrl('energyLabel', isActive ? '' : label)}
                      className="rounded-lg px-3 py-1.5 text-xs font-bold transition-colors"
                      style={{
                        backgroundColor: isActive ? getEnergyLabelBgColor(label) : 'var(--color-grey-light, #f1f5f9)',
                        color: isActive ? '#fff' : 'var(--color-grey-dark, #475569)',
                      }}
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <Link
                href="/woningen"
                className="flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--color-grey-light, #f1f5f9)',
                  color: 'var(--color-grey-dark, #475569)',
                }}
              >
                Filters wissen
              </Link>
            )}
          </aside>

          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Results count + sort */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                {totalDocs} {totalDocs === 1 ? 'woning' : 'woningen'} gevonden
              </p>
              <div className="flex items-center gap-2">
                {[
                  { value: 'nieuwste', label: 'Nieuwste' },
                  { value: 'prijs-oplopend', label: 'Prijs oplopend' },
                  { value: 'prijs-aflopend', label: 'Prijs aflopend' },
                  { value: 'oppervlakte', label: 'Oppervlakte' },
                ].map((sortOpt) => (
                  <Link
                    key={sortOpt.value}
                    href={buildFilterUrl('sort', sortOpt.value)}
                    className="hidden rounded-lg px-3 py-1.5 text-xs font-medium transition-colors md:block"
                    style={{
                      backgroundColor: filters?.sort === sortOpt.value ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                      color: filters?.sort === sortOpt.value ? '#fff' : 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    {sortOpt.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Property grid */}
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {properties.map((property) => {
                  const coverImage = typeof property.coverImage === 'object' ? property.coverImage : null
                  const statusInfo = getStatusLabel(property.listingStatus || 'beschikbaar')
                  const energyInfo = property.energyLabel ? formatEnergyLabel(property.energyLabel) : null
                  const isNew =
                    property.listingDate &&
                    new Date().getTime() - new Date(property.listingDate).getTime() < 14 * 24 * 60 * 60 * 1000

                  return (
                    <Link
                      key={property.id}
                      href={`/woningen/${property.slug}`}
                      className="group overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
                      style={{
                        borderColor: 'var(--color-grey, #e2e8f0)',
                        backgroundColor: 'var(--color-white, #ffffff)',
                      }}
                    >
                      {/* Cover image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {coverImage?.url ? (
                          <Image
                            src={coverImage.url}
                            alt={coverImage.alt || property.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />
                        ) : (
                          <div
                            className="flex h-full w-full items-center justify-center"
                            style={{ backgroundColor: 'var(--color-grey-light, #f1f5f9)' }}
                          >
                            <svg className="h-12 w-12" style={{ color: 'var(--color-grey-mid, #94A3B8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 21h19.5M3.75 3v18m16.5-18v18M5.25 3h13.5M5.25 21V10.5m0 0h3.375c.621 0 1.125.504 1.125 1.125v3.026a1.125 1.125 0 01-.757 1.063L5.25 16.875m0-6.375h3.375" />
                            </svg>
                          </div>
                        )}
                        {/* Status badge */}
                        <span
                          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                          style={{ backgroundColor: statusInfo.color }}
                        >
                          {statusInfo.label}
                        </span>
                        {/* New badge */}
                        {isNew && (
                          <span
                            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            Nieuw
                          </span>
                        )}
                        {/* Energy label badge */}
                        {energyInfo && (
                          <span
                            className="absolute bottom-3 left-3 rounded px-2 py-0.5 text-xs font-bold text-white"
                            style={{ backgroundColor: getEnergyLabelBgColor(property.energyLabel) }}
                          >
                            {energyInfo.label}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* City + neighborhood */}
                        <div className="mb-1 flex items-center gap-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <span>{property.city}{property.neighborhood ? ` - ${property.neighborhood}` : ''}</span>
                        </div>

                        {/* Title */}
                        <h3
                          className="mb-2 text-base font-semibold leading-tight"
                          style={{
                            color: 'var(--color-navy, #1a2b4a)',
                            fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                          }}
                        >
                          {property.title}
                        </h3>

                        {/* Specs */}
                        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                          {property.bedrooms != null && (
                            <span className="flex items-center gap-1">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                              </svg>
                              {property.bedrooms} slpk
                            </span>
                          )}
                          {property.bathrooms != null && (
                            <span className="flex items-center gap-1">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {property.bathrooms} badk
                            </span>
                          )}
                          {property.livingArea != null && (
                            <span className="flex items-center gap-1">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                              </svg>
                              {formatArea(property.livingArea)}
                            </span>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-end justify-between border-t pt-3" style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}>
                          <div>
                            {property.originalPrice && property.originalPrice > property.askingPrice && (
                              <span className="text-sm line-through" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                                {formatPrice(property.originalPrice)}
                              </span>
                            )}
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                {formatPrice(property.askingPrice)}
                              </span>
                              {property.priceCondition && (
                                <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                                  {property.priceCondition}
                                </span>
                              )}
                            </div>
                          </div>
                          <span
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity group-hover:opacity-90"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            Bekijk woning
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div
                className="rounded-xl border p-12 text-center"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                <svg
                  className="mx-auto mb-4 h-16 w-16"
                  style={{ color: 'var(--color-grey-mid, #94A3B8)' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                  Geen woningen gevonden
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                  Pas uw filters aan of bekijk al onze woningen.
                </p>
                {hasActiveFilters && (
                  <Link
                    href="/woningen"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Alle woningen bekijken
                  </Link>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={paginationUrl(currentPage - 1)}
                    className="flex h-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: 'var(--color-grey-light, #f1f5f9)',
                      color: 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    Vorige
                  </Link>
                )}
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Link
                    key={i}
                    href={paginationUrl(i + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: currentPage === i + 1 ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                      color: currentPage === i + 1 ? '#fff' : 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    {i + 1}
                  </Link>
                ))}
                {currentPage < totalPages && (
                  <Link
                    href={paginationUrl(currentPage + 1)}
                    className="flex h-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: 'var(--color-grey-light, #f1f5f9)',
                      color: 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    Volgende
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CTA: Waardebepaling */}
        <section
          className="mt-16 rounded-2xl p-8 text-center md:p-12"
          style={{ background: 'linear-gradient(135deg, var(--color-primary, #3F51B5), var(--color-secondary, #303F9F))' }}
        >
          <h2
            className="text-2xl text-white md:text-3xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Wat is uw woning waard?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Vraag een gratis en vrijblijvende waardebepaling aan. Onze makelaars komen graag bij u langs.
          </p>
          <Link
            href="/waardebepaling"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-secondary, #303F9F)' }}
          >
            Gratis waardebepaling
          </Link>
        </section>
      </div>
    </div>
  )
}

export default PropertiesArchiveTemplate
