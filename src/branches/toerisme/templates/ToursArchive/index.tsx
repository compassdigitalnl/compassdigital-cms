import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ToursArchiveProps } from './types'

/**
 * ToursArchiveTemplate - Overzicht van alle reizen (/reizen)
 *
 * Layout: ContinentPills bovenaan, dan 2-kolom met TourFilters sidebar + TourCard grid.
 * Server component die data ontvangt van de page route.
 */

const continentLabels: Record<string, string> = {
  europa: 'Europa',
  azie: 'Azi\u00eb',
  afrika: 'Afrika',
  amerika: 'Amerika',
  oceanie: 'Oceani\u00eb',
}

const categoryLabels: Record<string, string> = {
  bestseller: 'Bestseller',
  nieuw: 'Nieuw',
  avontuur: 'Avontuur',
  luxe: 'Luxe',
  familie: 'Familie',
  stedentrip: 'Stedentrip',
  strand: 'Strand',
  cultuur: 'Cultuur',
}

const durationRanges = [
  { label: '1-5 dagen', min: 1, max: 5 },
  { label: '6-10 dagen', min: 6, max: 10 },
  { label: '11-15 dagen', min: 11, max: 15 },
  { label: '16+ dagen', min: 16, max: 99 },
]

function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price)
}

function formatAvailability(availability: string): { label: string; color: string } {
  switch (availability) {
    case 'beschikbaar':
      return { label: 'Beschikbaar', color: '#22c55e' }
    case 'beperkt':
      return { label: 'Beperkt beschikbaar', color: '#f59e0b' }
    case 'uitverkocht':
      return { label: 'Uitverkocht', color: '#ef4444' }
    default:
      return { label: 'Onbekend', color: '#94A3B8' }
  }
}

export function ToursArchiveTemplate({
  tours,
  destinations,
  totalPages,
  currentPage,
  totalDocs,
  filters,
}: ToursArchiveProps) {
  // Build query string helper
  const buildFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (filters?.continent) params.set('continent', filters.continent)
    if (filters?.category) params.set('category', filters.category)
    if (filters?.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))
    if (filters?.minDuration) params.set('minDuration', String(filters.minDuration))
    if (filters?.maxDuration) params.set('maxDuration', String(filters.maxDuration))

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    const qs = params.toString()
    return '/reizen' + (qs ? '?' + qs : '')
  }

  const buildDurationUrl = (min: number, max: number) => {
    const params = new URLSearchParams()
    if (filters?.continent) params.set('continent', filters.continent)
    if (filters?.category) params.set('category', filters.category)
    if (filters?.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))

    const isActive = filters?.minDuration === min && filters?.maxDuration === max
    if (!isActive) {
      params.set('minDuration', String(min))
      params.set('maxDuration', String(max))
    }
    params.delete('page')
    const qs = params.toString()
    return '/reizen' + (qs ? '?' + qs : '')
  }

  const paginationUrl = (page: number) => {
    const params = new URLSearchParams()
    if (filters?.continent) params.set('continent', filters.continent)
    if (filters?.category) params.set('category', filters.category)
    if (filters?.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))
    if (filters?.minDuration) params.set('minDuration', String(filters.minDuration))
    if (filters?.maxDuration) params.set('maxDuration', String(filters.maxDuration))
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return '/reizen' + (qs ? '?' + qs : '')
  }

  const hasActiveFilters =
    filters?.continent ||
    filters?.category ||
    filters?.minPrice ||
    filters?.maxPrice ||
    filters?.minDuration ||
    filters?.maxDuration

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Reizen</span>
        </nav>
      </div>

      {/* Hero */}
      <section
        className="py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, var(--color-primary, #00BCD4), var(--color-secondary, #0097A7))' }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1
            className="text-3xl text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Onze reizen
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Ontdek onze zorgvuldig samengestelde reizen naar de mooiste bestemmingen ter wereld.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalDocs}</div>
              <div className="text-sm text-white/60">Reizen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{destinations.length}</div>
              <div className="text-sm text-white/60">Bestemmingen</div>
            </div>
          </div>
        </div>
      </section>

      {/* Continent pills */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={buildFilterUrl('continent', '')}
            className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: !filters?.continent ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
              color: !filters?.continent ? '#fff' : 'var(--color-grey-dark, #475569)',
            }}
          >
            Alle bestemmingen
          </Link>
          {Object.entries(continentLabels).map(([value, label]) => (
            <Link
              key={value}
              href={buildFilterUrl('continent', value)}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor: filters?.continent === value ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                color: filters?.continent === value ? '#fff' : 'var(--color-grey-dark, #475569)',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar filters */}
          <aside className="space-y-6 lg:col-span-1">
            {/* Category filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Categorie
              </h3>
              <div className="space-y-2">
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <Link
                    key={value}
                    href={buildFilterUrl('category', filters?.category === value ? '' : value)}
                    className="flex items-center gap-2 text-sm transition-colors"
                    style={{
                      color: filters?.category === value ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded border"
                      style={{
                        borderColor: filters?.category === value ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                        backgroundColor: filters?.category === value ? 'var(--color-primary)' : 'transparent',
                      }}
                    >
                      {filters?.category === value && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Duration filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Reisduur
              </h3>
              <div className="space-y-2">
                {durationRanges.map((range) => {
                  const isActive = filters?.minDuration === range.min && filters?.maxDuration === range.max
                  return (
                    <Link
                      key={range.label}
                      href={buildDurationUrl(range.min, range.max)}
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
                {[
                  { label: 'Tot \u20ac500', min: 0, max: 500 },
                  { label: '\u20ac500 - \u20ac1.000', min: 500, max: 1000 },
                  { label: '\u20ac1.000 - \u20ac2.000', min: 1000, max: 2000 },
                  { label: '\u20ac2.000 - \u20ac3.500', min: 2000, max: 3500 },
                  { label: '\u20ac3.500+', min: 3500, max: 99999 },
                ].map((range) => {
                  const isActive = filters?.minPrice === range.min && filters?.maxPrice === range.max
                  return (
                    <Link
                      key={range.label}
                      href={
                        isActive
                          ? buildFilterUrl('minPrice', '')
                          : (() => {
                              const params = new URLSearchParams()
                              if (filters?.continent) params.set('continent', filters.continent)
                              if (filters?.category) params.set('category', filters.category)
                              if (filters?.minDuration) params.set('minDuration', String(filters.minDuration))
                              if (filters?.maxDuration) params.set('maxDuration', String(filters.maxDuration))
                              params.set('minPrice', String(range.min))
                              params.set('maxPrice', String(range.max))
                              const qs = params.toString()
                              return '/reizen' + (qs ? '?' + qs : '')
                            })()
                      }
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

            {/* Clear filters */}
            {hasActiveFilters && (
              <Link
                href="/reizen"
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
            {/* Results count */}
            <div className="mb-6">
              <p className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                {totalDocs} {totalDocs === 1 ? 'reis' : 'reizen'} gevonden
              </p>
            </div>

            {/* Tour grid */}
            {tours.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {tours.map((tour) => {
                  const destination = typeof tour.destination === 'object' ? tour.destination : null
                  const coverImage = typeof tour.coverImage === 'object' ? tour.coverImage : null
                  const availInfo = formatAvailability(tour.availability || 'beschikbaar')
                  const highlights = (tour.highlights || []).slice(0, 3)

                  return (
                    <Link
                      key={tour.id}
                      href={`/reizen/${tour.slug}`}
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
                            alt={coverImage.alt || tour.title}
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                            </svg>
                          </div>
                        )}
                        {/* Category badge */}
                        {tour.category && (
                          <span
                            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            {categoryLabels[tour.category] || tour.category}
                          </span>
                        )}
                        {/* Availability badge */}
                        <span
                          className="absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                          style={{ backgroundColor: availInfo.color }}
                        >
                          {availInfo.label}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Destination + duration */}
                        <div className="mb-2 flex items-center gap-2 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          {destination && <span>{destination.name}</span>}
                          {destination && tour.duration && <span>-</span>}
                          {tour.duration && (
                            <span>{tour.duration} dagen{tour.nights ? ` / ${tour.nights} nachten` : ''}</span>
                          )}
                        </div>

                        {/* Title */}
                        <h3
                          className="mb-2 text-lg font-semibold leading-tight"
                          style={{
                            color: 'var(--color-navy, #1a2b4a)',
                            fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                          }}
                        >
                          {tour.title}
                        </h3>

                        {/* Rating */}
                        {tour.rating != null && tour.rating > 0 && (
                          <div className="mb-2 flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className="h-4 w-4"
                                fill={i < Math.round(tour.rating) ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                                style={{ color: i < Math.round(tour.rating) ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)' }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                              </svg>
                            ))}
                            {tour.reviewCount > 0 && (
                              <span className="ml-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                                ({tour.reviewCount})
                              </span>
                            )}
                          </div>
                        )}

                        {/* Highlights chips */}
                        {highlights.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1.5">
                            {highlights.map((h: any, i: number) => (
                              <span
                                key={i}
                                className="rounded-full px-2 py-0.5 text-xs"
                                style={{
                                  backgroundColor: 'var(--color-primary-glow, rgba(0,188,212,0.1))',
                                  color: 'var(--color-primary)',
                                }}
                              >
                                {typeof h === 'object' ? h.highlight || h.text : h}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-end justify-between border-t pt-3" style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}>
                          <div>
                            <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Vanaf</span>
                            <div className="flex items-baseline gap-1">
                              {tour.earlyBirdPrice && tour.earlyBirdPrice < tour.price && (
                                <span className="text-sm line-through" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                                  {formatPrice(tour.price)}
                                </span>
                              )}
                              <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                {formatPrice(tour.earlyBirdPrice && tour.earlyBirdPrice < tour.price ? tour.earlyBirdPrice : tour.price)}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>p.p.</span>
                            </div>
                          </div>
                          <span
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity group-hover:opacity-90"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            Bekijk reis
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
                  Geen reizen gevonden
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                  Pas uw filters aan of bekijk al onze reizen.
                </p>
                {hasActiveFilters && (
                  <Link
                    href="/reizen"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Alle reizen bekijken
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

        {/* CTA */}
        <section
          className="mt-16 rounded-2xl p-8 text-center md:p-12"
          style={{ background: 'linear-gradient(135deg, var(--color-primary, #00BCD4), var(--color-secondary, #0097A7))' }}
        >
          <h2
            className="text-2xl text-white md:text-3xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Uw droomreis niet gevonden?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Onze reisadviseurs helpen u graag bij het samenstellen van uw perfecte reis op maat.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-secondary, #0097A7)' }}
          >
            Neem contact op
          </Link>
        </section>
      </div>
    </div>
  )
}

export default ToursArchiveTemplate
