import React from 'react'
import Link from 'next/link'
import { VehicleCard } from '@/branches/automotive/components/VehicleCard'
import type { VehiclesArchiveProps } from './types'

/**
 * VehiclesArchiveTemplate - Overzicht van alle voertuigen (/occasions)
 *
 * Grid met VehicleCard componenten, filterbalk, en paginering.
 * Server component die data ontvangt van de page route.
 */
export function VehiclesArchiveTemplate({
  vehicles,
  brands,
  totalPages,
  currentPage,
  totalDocs,
  filters,
}: VehiclesArchiveProps) {
  const fuelTypeLabels: Record<string, string> = {
    benzine: 'Benzine',
    diesel: 'Diesel',
    elektrisch: 'Elektrisch',
    'hybride-benzine': 'Hybride (benzine)',
    'hybride-diesel': 'Hybride (diesel)',
    lpg: 'LPG',
  }

  const bodyTypeLabels: Record<string, string> = {
    sedan: 'Sedan',
    hatchback: 'Hatchback',
    suv: 'SUV',
    stationwagon: 'Stationwagon',
    cabrio: 'Cabrio',
    coupe: 'Coup\u00e9',
    bus: 'Bus',
    bestel: 'Bestel',
  }

  // Build query string helper
  const buildFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (filters?.brand) params.set('brand', filters.brand)
    if (filters?.fuelType) params.set('fuelType', filters.fuelType)
    if (filters?.bodyType) params.set('bodyType', filters.bodyType)
    if (filters?.priceMin) params.set('priceMin', String(filters.priceMin))
    if (filters?.priceMax) params.set('priceMax', String(filters.priceMax))
    if (filters?.yearMin) params.set('yearMin', String(filters.yearMin))
    if (filters?.yearMax) params.set('yearMax', String(filters.yearMax))

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    const qs = params.toString()
    return '/occasions' + (qs ? '?' + qs : '')
  }

  const paginationUrl = (page: number) => {
    const params = new URLSearchParams()
    if (filters?.brand) params.set('brand', filters.brand)
    if (filters?.fuelType) params.set('fuelType', filters.fuelType)
    if (filters?.bodyType) params.set('bodyType', filters.bodyType)
    if (filters?.priceMin) params.set('priceMin', String(filters.priceMin))
    if (filters?.priceMax) params.set('priceMax', String(filters.priceMax))
    if (filters?.yearMin) params.set('yearMin', String(filters.yearMin))
    if (filters?.yearMax) params.set('yearMax', String(filters.yearMax))
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return '/occasions' + (qs ? '?' + qs : '')
  }

  const hasActiveFilters = filters?.brand || filters?.fuelType || filters?.bodyType || filters?.priceMin || filters?.priceMax || filters?.yearMin || filters?.yearMax

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Occasions</span>
        </nav>
      </div>

      {/* Hero */}
      <section
        className="py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, var(--color-secondary, #1e3a5f), var(--color-secondary, #1e3a5f)dd)' }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1
            className="text-3xl text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Ons aanbod
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Ontdek onze selectie kwalitatieve occasions met garantie.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalDocs}</div>
              <div className="text-sm text-white/60">Voertuigen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{brands.length}</div>
              <div className="text-sm text-white/60">Merken</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Filter bar */}
        <div
          className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border p-4"
          style={{
            borderColor: 'var(--color-grey, #e2e8f0)',
            backgroundColor: 'var(--color-white, #ffffff)',
          }}
        >
          {/* Brand filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Merk</label>
            <div className="flex flex-wrap gap-1.5">
              <Link
                href={buildFilterUrl('brand', '')}
                className={'rounded-full px-3 py-1 text-xs font-medium transition-colors ' + (!filters?.brand ? 'text-white' : '')}
                style={{
                  backgroundColor: !filters?.brand ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                  color: !filters?.brand ? '#fff' : 'var(--color-grey-dark, #475569)',
                }}
              >
                Alle
              </Link>
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={buildFilterUrl('brand', brand.slug)}
                  className={'rounded-full px-3 py-1 text-xs font-medium transition-colors ' + (filters?.brand === brand.slug ? 'text-white' : '')}
                  style={{
                    backgroundColor: filters?.brand === brand.slug ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                    color: filters?.brand === brand.slug ? '#fff' : 'var(--color-grey-dark, #475569)',
                  }}
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Fuel type filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Brandstof</label>
            <div className="flex flex-wrap gap-1.5">
              <Link
                href={buildFilterUrl('fuelType', '')}
                className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: !filters?.fuelType ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                  color: !filters?.fuelType ? '#fff' : 'var(--color-grey-dark, #475569)',
                }}
              >
                Alle
              </Link>
              {Object.entries(fuelTypeLabels).map(([value, label]) => (
                <Link
                  key={value}
                  href={buildFilterUrl('fuelType', value)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: filters?.fuelType === value ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                    color: filters?.fuelType === value ? '#fff' : 'var(--color-grey-dark, #475569)',
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Body type filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Carrosserie</label>
            <div className="flex flex-wrap gap-1.5">
              <Link
                href={buildFilterUrl('bodyType', '')}
                className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  backgroundColor: !filters?.bodyType ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                  color: !filters?.bodyType ? '#fff' : 'var(--color-grey-dark, #475569)',
                }}
              >
                Alle
              </Link>
              {Object.entries(bodyTypeLabels).map(([value, label]) => (
                <Link
                  key={value}
                  href={buildFilterUrl('bodyType', value)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: filters?.bodyType === value ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                    color: filters?.bodyType === value ? '#fff' : 'var(--color-grey-dark, #475569)',
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Link
              href="/occasions"
              className="ml-auto rounded-lg px-4 py-2 text-xs font-medium transition-colors"
              style={{
                backgroundColor: 'var(--color-grey-light, #f1f5f9)',
                color: 'var(--color-grey-dark, #475569)',
              }}
            >
              Filters wissen
            </Link>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
            {totalDocs} {totalDocs === 1 ? 'voertuig' : 'voertuigen'} gevonden
          </p>
        </div>

        {/* Vehicle grid */}
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
            Geen voertuigen gevonden met de huidige filters.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
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
          </div>
        )}

        {/* CTA */}
        <section
          className="mt-16 rounded-2xl p-8 text-center md:p-12"
          style={{ background: 'linear-gradient(135deg, var(--color-navy, #1a2b4a), var(--color-navy, #1a2b4a)cc)' }}
        >
          <h2
            className="text-2xl text-white md:text-3xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Niet gevonden wat u zoekt?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Laat ons weten wat u zoekt en wij vinden de perfecte auto voor u.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Neem contact op
          </Link>
        </section>
      </div>
    </div>
  )
}

export default VehiclesArchiveTemplate
