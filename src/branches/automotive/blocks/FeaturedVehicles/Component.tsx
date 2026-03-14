import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import type { FeaturedVehiclesProps } from './types'

export async function FeaturedVehiclesComponent(props: FeaturedVehiclesProps) {
  const {
    heading,
    limit = 4,
    layout = 'grid',
  } = props

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'vehicles',
    where: {
      and: [
        { featured: { equals: true } },
        { status: { equals: 'beschikbaar' } },
      ],
    },
    limit: limit || 4,
    sort: '-createdAt',
  })

  const vehicles = result.docs

  if (vehicles.length === 0) return null

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

  const isCarousel = layout === 'carousel'

  return (
    <section className="px-4 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        {heading && (
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-2 text-sm font-semibold text-[var(--color-primary)]">
              Uitgelicht
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-base-1000)] md:text-4xl lg:text-5xl">
              {heading}
            </h2>
          </div>
        )}

        <div
          className={
            isCarousel
              ? 'flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory'
              : 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'
          }
        >
          {vehicles.map((vehicle: any) => {
            const mainImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : null
            const brandName = vehicle.brand && typeof vehicle.brand === 'object' ? vehicle.brand.title : ''
            const displayTitle = brandName ? `${brandName} ${vehicle.title}` : vehicle.title

            return (
              <article
                key={vehicle.id}
                className={`group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[var(--color-primary)]/30 ${
                  isCarousel ? 'w-80 shrink-0 snap-start' : ''
                }`}
              >
                {/* Larger image for featured */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-base-100)]">
                  {mainImage?.url ? (
                    <img
                      src={mainImage.url}
                      alt={mainImage.alt || displayTitle}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--color-base-400)]">
                      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h1" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="7" cy="17" r="2" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                    </div>
                  )}

                  {/* Featured badge */}
                  <div
                    className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #FF5722, #E65100)' }}
                  >
                    Uitgelicht
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="mb-2 text-lg font-bold text-[var(--color-base-1000)] line-clamp-2">
                    {displayTitle}
                  </h3>

                  {/* Price */}
                  {vehicle.price != null && (
                    <div className="mb-3 flex items-center gap-2">
                      {vehicle.salePrice != null && vehicle.salePrice > 0 ? (
                        <>
                          <span className="text-xl font-extrabold text-[var(--color-primary)]">
                            {formatPrice(vehicle.salePrice)}
                          </span>
                          <span className="text-sm text-[var(--color-base-500)] line-through">
                            {formatPrice(vehicle.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-extrabold text-[var(--color-primary)]">
                          {formatPrice(vehicle.price)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Key specs */}
                  <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-[var(--color-base-600)]">
                    {vehicle.year && (
                      <span className="rounded-full bg-[var(--color-base-100)] px-2 py-0.5">{vehicle.year}</span>
                    )}
                    {vehicle.mileage != null && (
                      <span className="rounded-full bg-[var(--color-base-100)] px-2 py-0.5">{formatMileage(vehicle.mileage)} km</span>
                    )}
                    {vehicle.fuelType && (
                      <span className="rounded-full bg-[var(--color-base-100)] px-2 py-0.5">{FUEL_LABELS[vehicle.fuelType] || vehicle.fuelType}</span>
                    )}
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
      </div>
    </section>
  )
}
