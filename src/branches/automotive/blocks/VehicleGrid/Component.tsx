import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import type { VehicleGridProps } from './types'

export async function VehicleGridComponent(props: VehicleGridProps) {
  const {
    heading,
    limit = 6,
    columns = '3',
    fuelFilter = 'alle',
    bodyTypeFilter = '',
    showPrice = true,
  } = props

  const payload = await getPayload({ config })

  const whereConditions: any[] = [
    { status: { equals: 'beschikbaar' } },
  ]

  if (fuelFilter && fuelFilter !== 'alle') {
    whereConditions.push({ fuelType: { equals: fuelFilter } })
  }

  if (bodyTypeFilter) {
    whereConditions.push({ bodyType: { equals: bodyTypeFilter } })
  }

  const result = await payload.find({
    collection: 'vehicles',
    where: { and: whereConditions },
    limit: limit || 6,
    sort: '-createdAt',
  })

  const vehicles = result.docs

  if (vehicles.length === 0) return null

  const gridColsClasses: Record<string, string> = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  const gridClass = gridColsClasses[columns || '3']

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const formatMileage = (km: number) =>
    new Intl.NumberFormat('nl-NL').format(km)

  const FUEL_LABELS: Record<string, string> = {
    benzine: 'Benzine',
    diesel: 'Diesel',
    elektrisch: 'Elektrisch',
    hybride: 'Hybride',
    lpg: 'LPG',
  }

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {heading && (
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>
        )}

        <div className={`grid ${gridClass} gap-6`}>
          {vehicles.map((vehicle: any) => {
            const mainImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : null
            const brandName = vehicle.brand && typeof vehicle.brand === 'object' ? vehicle.brand.title : ''
            const displayTitle = brandName ? `${brandName} ${vehicle.title}` : vehicle.title

            return (
              <article
                key={vehicle.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[var(--color-primary)]/30"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-base-100)]">
                  {mainImage?.url ? (
                    <img
                      src={mainImage.url}
                      alt={mainImage.alt || displayTitle}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--color-base-400)]">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h1" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="7" cy="17" r="2" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                    </div>
                  )}

                  {/* Status badge */}
                  {vehicle.status === 'beschikbaar' && (
                    <div className="absolute left-3 top-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                      Beschikbaar
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 text-lg font-bold text-[var(--color-base-1000)] line-clamp-2">
                    {displayTitle}
                  </h3>

                  {/* Price */}
                  {showPrice && vehicle.price != null && (
                    <div className="mb-3 flex items-center gap-2">
                      {vehicle.salePrice != null && vehicle.salePrice > 0 ? (
                        <>
                          <span className="text-lg font-bold text-[var(--color-primary)]">
                            {formatPrice(vehicle.salePrice)}
                          </span>
                          <span className="text-sm text-[var(--color-base-500)] line-through">
                            {formatPrice(vehicle.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-[var(--color-primary)]">
                          {formatPrice(vehicle.price)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Specs */}
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-base-600)]">
                    {vehicle.year && <span>{vehicle.year}</span>}
                    {vehicle.mileage != null && <span>{formatMileage(vehicle.mileage)} km</span>}
                    {vehicle.fuelType && <span>{FUEL_LABELS[vehicle.fuelType] || vehicle.fuelType}</span>}
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <Link
                      href={`/occasions/${vehicle.slug}`}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white no-underline transition-opacity hover:opacity-90"
                    >
                      Bekijk details
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* View all link */}
        <div className="mt-10 text-center">
          <Link
            href="/occasions"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-primary)] no-underline transition-colors hover:bg-[var(--color-primary)] hover:text-white"
          >
            Bekijk alle occasions
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
