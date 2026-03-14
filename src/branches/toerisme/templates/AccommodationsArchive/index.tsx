import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { AccommodationsArchiveProps } from './types'

/**
 * AccommodationsArchiveTemplate - Overzicht van alle accommodaties (/accommodaties)
 *
 * AccommodationFilters sidebar + AccommodationCard grid met paginatie.
 * Filters: type, sterren, faciliteiten, maaltijdplan, prijsklasse.
 */

const typeLabels: Record<string, string> = {
  hotel: 'Hotel',
  resort: 'Resort',
  villa: 'Villa',
  appartement: 'Appartement',
  hostel: 'Hostel',
  'b&b': 'B&B',
  glamping: 'Glamping',
}

const facilityLabels: Record<string, string> = {
  zwembad: 'Zwembad',
  spa: 'Spa',
  restaurant: 'Restaurant',
  bar: 'Bar',
  fitness: 'Fitness',
  wifi: 'WiFi',
  parkeren: 'Parkeren',
  roomservice: 'Roomservice',
  airco: 'Airco',
  wasserij: 'Wasserij',
  kindvriendelijk: 'Kindvriendelijk',
  huisdieren: 'Huisdieren',
}

const mealPlanLabels: Record<string, string> = {
  logies: 'Logies',
  ontbijt: 'Logies & Ontbijt',
  halfpension: 'Halfpension',
  volpension: 'Volpension',
  allinclusive: 'All Inclusive',
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price)
}

function renderStars(count: number) {
  return Array.from({ length: 5 }).map((_, i) => (
    <svg
      key={i}
      className="h-4 w-4"
      fill={i < count ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      style={{ color: i < count ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)' }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ))
}

export function AccommodationsArchiveTemplate({
  accommodations,
  totalPages,
  currentPage,
  totalDocs,
  filters,
}: AccommodationsArchiveProps) {
  // Build query string helper
  const buildFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (filters?.type) params.set('type', filters.type)
    if (filters?.stars) params.set('stars', String(filters.stars))
    if (filters?.mealPlan) params.set('mealPlan', filters.mealPlan)
    if (filters?.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))
    if (filters?.facilities?.length) params.set('facilities', filters.facilities.join(','))

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    const qs = params.toString()
    return '/accommodaties' + (qs ? '?' + qs : '')
  }

  const buildStarsUrl = (stars: number) => {
    const params = new URLSearchParams()
    if (filters?.type) params.set('type', filters.type)
    if (filters?.mealPlan) params.set('mealPlan', filters.mealPlan)
    if (filters?.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))
    if (filters?.facilities?.length) params.set('facilities', filters.facilities.join(','))

    if (filters?.stars === stars) {
      // toggle off
    } else {
      params.set('stars', String(stars))
    }
    params.delete('page')
    const qs = params.toString()
    return '/accommodaties' + (qs ? '?' + qs : '')
  }

  const paginationUrl = (page: number) => {
    const params = new URLSearchParams()
    if (filters?.type) params.set('type', filters.type)
    if (filters?.stars) params.set('stars', String(filters.stars))
    if (filters?.mealPlan) params.set('mealPlan', filters.mealPlan)
    if (filters?.minPrice) params.set('minPrice', String(filters.minPrice))
    if (filters?.maxPrice) params.set('maxPrice', String(filters.maxPrice))
    if (filters?.facilities?.length) params.set('facilities', filters.facilities.join(','))
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return '/accommodaties' + (qs ? '?' + qs : '')
  }

  const hasActiveFilters = filters?.type || filters?.stars || filters?.mealPlan || filters?.minPrice || filters?.maxPrice || (filters?.facilities?.length ?? 0) > 0

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Accommodaties</span>
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
            Accommodaties
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Van luxe resorts tot gezellige B&B's — vind uw ideale verblijf.
          </p>
          <div className="mt-6">
            <div className="text-2xl font-bold text-white">{totalDocs}</div>
            <div className="text-sm text-white/60">Accommodaties</div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar filters */}
          <aside className="space-y-6 lg:col-span-1">
            {/* Type filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Type accommodatie
              </h3>
              <div className="space-y-2">
                {Object.entries(typeLabels).map(([value, label]) => (
                  <Link
                    key={value}
                    href={buildFilterUrl('type', filters?.type === value ? '' : value)}
                    className="flex items-center gap-2 text-sm transition-colors"
                    style={{
                      color: filters?.type === value ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded border"
                      style={{
                        borderColor: filters?.type === value ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                        backgroundColor: filters?.type === value ? 'var(--color-primary)' : 'transparent',
                      }}
                    >
                      {filters?.type === value && (
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

            {/* Stars filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Sterren
              </h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <Link
                    key={stars}
                    href={buildStarsUrl(stars)}
                    className="flex items-center gap-2 text-sm transition-colors"
                    style={{
                      color: filters?.stars === stars ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded border"
                      style={{
                        borderColor: filters?.stars === stars ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                        backgroundColor: filters?.stars === stars ? 'var(--color-primary)' : 'transparent',
                      }}
                    >
                      {filters?.stars === stars && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <div className="flex items-center gap-0.5">{renderStars(stars)}</div>
                    <span>{stars} sterren</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Meal plan filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Maaltijdplan
              </h3>
              <div className="space-y-2">
                {Object.entries(mealPlanLabels).map(([value, label]) => (
                  <Link
                    key={value}
                    href={buildFilterUrl('mealPlan', filters?.mealPlan === value ? '' : value)}
                    className="flex items-center gap-2 text-sm transition-colors"
                    style={{
                      color: filters?.mealPlan === value ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded border"
                      style={{
                        borderColor: filters?.mealPlan === value ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                        backgroundColor: filters?.mealPlan === value ? 'var(--color-primary)' : 'transparent',
                      }}
                    >
                      {filters?.mealPlan === value && (
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

            {/* Price range filter */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Prijsklasse (p.p.p.n.)
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Tot \u20ac50', min: 0, max: 50 },
                  { label: '\u20ac50 - \u20ac100', min: 50, max: 100 },
                  { label: '\u20ac100 - \u20ac200', min: 100, max: 200 },
                  { label: '\u20ac200 - \u20ac350', min: 200, max: 350 },
                  { label: '\u20ac350+', min: 350, max: 99999 },
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
                              if (filters?.type) params.set('type', filters.type)
                              if (filters?.stars) params.set('stars', String(filters.stars))
                              if (filters?.mealPlan) params.set('mealPlan', filters.mealPlan)
                              if (filters?.facilities?.length) params.set('facilities', filters.facilities.join(','))
                              params.set('minPrice', String(range.min))
                              params.set('maxPrice', String(range.max))
                              const qs = params.toString()
                              return '/accommodaties' + (qs ? '?' + qs : '')
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
                href="/accommodaties"
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
                {totalDocs} {totalDocs === 1 ? 'accommodatie' : 'accommodaties'} gevonden
              </p>
            </div>

            {/* Accommodation grid */}
            {accommodations.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {accommodations.map((acc) => {
                  const destination = typeof acc.destination === 'object' ? acc.destination : null
                  const coverImage = typeof acc.coverImage === 'object' ? acc.coverImage : null
                  const facilities = acc.facilities || []

                  return (
                    <Link
                      key={acc.id}
                      href={`/accommodaties/${acc.slug}`}
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
                            alt={coverImage.alt || acc.name}
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
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 21h19.5M3.75 3v18h16.5V3H3.75z" />
                            </svg>
                          </div>
                        )}
                        {/* Type badge */}
                        {acc.type && (
                          <span
                            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            {typeLabels[acc.type] || acc.type}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Location + Stars */}
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                            {destination?.name || ''}{acc.city ? `, ${acc.city}` : ''}
                          </span>
                          {acc.stars && (
                            <div className="flex items-center gap-0.5">{renderStars(acc.stars)}</div>
                          )}
                        </div>

                        {/* Name */}
                        <h3
                          className="mb-2 text-lg font-semibold leading-tight"
                          style={{
                            color: 'var(--color-navy, #1a2b4a)',
                            fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                          }}
                        >
                          {acc.name}
                        </h3>

                        {/* Rating */}
                        {acc.rating != null && acc.rating > 0 && (
                          <div className="mb-2 flex items-center gap-1">
                            <span
                              className="rounded px-1.5 py-0.5 text-xs font-bold text-white"
                              style={{ backgroundColor: 'var(--color-primary)' }}
                            >
                              {acc.rating.toFixed(1)}
                            </span>
                            {acc.reviewCount > 0 && (
                              <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                                ({acc.reviewCount} reviews)
                              </span>
                            )}
                          </div>
                        )}

                        {/* Facilities icons */}
                        {facilities.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1.5">
                            {facilities.slice(0, 4).map((f: string) => (
                              <span
                                key={f}
                                className="rounded-full px-2 py-0.5 text-xs"
                                style={{
                                  backgroundColor: 'var(--color-primary-glow, rgba(0,188,212,0.1))',
                                  color: 'var(--color-primary)',
                                }}
                              >
                                {facilityLabels[f] || f}
                              </span>
                            ))}
                            {facilities.length > 4 && (
                              <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                                +{facilities.length - 4}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Meal plan */}
                        {acc.mealPlan && (
                          <p className="mb-2 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                            {mealPlanLabels[acc.mealPlan] || acc.mealPlan}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-end justify-between border-t pt-3" style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}>
                          <div>
                            <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Vanaf</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                                {acc.priceFrom != null ? formatPrice(acc.priceFrom) : '-'}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>p.p.p.n.</span>
                            </div>
                          </div>
                          <span
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity group-hover:opacity-90"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            Bekijk
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18h16.5V3H3.75z" />
                </svg>
                <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                  Geen accommodaties gevonden
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                  Pas uw filters aan of bekijk al onze accommodaties.
                </p>
                {hasActiveFilters && (
                  <Link
                    href="/accommodaties"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Alle accommodaties bekijken
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
            Op zoek naar iets speciaals?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Onze reisadviseurs kennen de mooiste accommodaties persoonlijk. Laat u adviseren.
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

export default AccommodationsArchiveTemplate
