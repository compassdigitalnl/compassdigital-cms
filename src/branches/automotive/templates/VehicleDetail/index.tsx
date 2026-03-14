import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { VehicleGallery } from '@/branches/automotive/components/VehicleGallery'
import { VehicleSpecs } from '@/branches/automotive/components/VehicleSpecs'
import { FinancingCalculator } from '@/branches/automotive/components/FinancingCalculator'
import { TestDriveForm } from '@/branches/automotive/components/TestDriveForm'
import { VehicleCard } from '@/branches/automotive/components/VehicleCard'
import { ApkBadge } from '@/branches/automotive/components/ApkBadge'
import type { VehicleDetailProps } from './types'

/**
 * VehicleDetailTemplate - Detail pagina voor een voertuig (/occasions/[slug])
 *
 * 2-kolom layout: links = VehicleGallery + VehicleSpecs, rechts = prijssidebar
 * met FinancingCalculator + TestDriveForm CTA.
 * Toont gerelateerde voertuigen onderaan.
 */
export async function VehicleDetailTemplate({ vehicle }: VehicleDetailProps) {
  const payload = await getPayload({ config })

  // Fetch related vehicles (same brand or body type, different slug)
  let relatedVehicles: any[] = []
  try {
    const brandId = typeof vehicle.brand === 'object' ? vehicle.brand?.id : vehicle.brand
    const result = await payload.find({
      collection: 'vehicles',
      where: {
        and: [
          { status: { equals: 'beschikbaar' } },
          { id: { not_equals: vehicle.id } },
          ...(brandId ? [{ brand: { equals: brandId } }] : []),
        ],
      },
      limit: 3,
      sort: '-createdAt',
    })
    relatedVehicles = result.docs
  } catch (e) {
    /* fail silently */
  }

  // Extract data
  const brandObj = typeof vehicle.brand === 'object' ? vehicle.brand : null
  const brandName = brandObj?.name || brandObj?.title || ''
  const images = (vehicle.images || [])
    .map((item: any) => {
      const img = typeof item.image === 'object' ? item.image : item
      return img?.url ? { url: img.url, alt: img.alt || vehicle.title } : null
    })
    .filter(Boolean)

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const formatMileage = (km: number) =>
    new Intl.NumberFormat('nl-NL').format(km)

  const priceTypeLabels: Record<string, string> = {
    'btw-marge': 'BTW/Marge',
    'btw-auto': 'BTW-auto',
    'ex-btw': 'Excl. BTW',
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    beschikbaar: { label: 'Beschikbaar', color: '#22c55e' },
    gereserveerd: { label: 'Gereserveerd', color: '#f59e0b' },
    verkocht: { label: 'Verkocht', color: '#ef4444' },
  }

  const statusInfo = vehicle.status ? statusLabels[vehicle.status] : null

  // Build specs data for VehicleSpecs component
  const specsData = {
    brand: brandName || undefined,
    model: vehicle.model || undefined,
    year: vehicle.year || undefined,
    bodyType: vehicle.bodyType || undefined,
    fuelType: vehicle.fuelType || undefined,
    transmission: vehicle.transmission || undefined,
    power: vehicle.power || undefined,
    engineCapacity: vehicle.engineCapacity || undefined,
    licensePlate: vehicle.licensePlate || undefined,
    apkExpiry: vehicle.apkExpiry || undefined,
    previousOwners: vehicle.numberOfOwners || undefined,
    napCheck: vehicle.napCheck ?? undefined,
    weight: vehicle.weight || undefined,
    doors: vehicle.doors || undefined,
    seats: vehicle.seats || undefined,
    color: vehicle.color || undefined,
  }

  // Features grouped by category
  const features = vehicle.features || []
  const featureGroups: Record<string, string[]> = {}
  features.forEach((f: any) => {
    const cat = f.category || 'overig'
    if (!featureGroups[cat]) featureGroups[cat] = []
    featureGroups[cat].push(f.name)
  })

  const categoryLabels: Record<string, string> = {
    comfort: 'Comfort',
    veiligheid: 'Veiligheid',
    exterieur: 'Exterieur',
    'audio-multimedia': 'Audio & Multimedia',
    overig: 'Overig',
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/occasions" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Occasions
          </Link>
          {brandName && (
            <>
              <span>/</span>
              <Link
                href={'/occasions?brand=' + (brandObj?.slug || '')}
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                {brandName}
              </Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>{vehicle.title}</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column: Gallery + Specs */}
          <div className="space-y-8 lg:col-span-2">
            {/* Gallery */}
            {images.length > 0 && (
              <VehicleGallery images={images} videoUrl={vehicle.videoUrl} />
            )}

            {/* Title + Status */}
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                {statusInfo && (
                  <span
                    className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: statusInfo.color }}
                  >
                    {statusInfo.label}
                  </span>
                )}
                {vehicle.apkExpiry && <ApkBadge expiryDate={vehicle.apkExpiry} />}
                {vehicle.napCheck && (
                  <span
                    className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: 'var(--color-primary-glow, rgba(0,100,200,0.1))',
                      color: 'var(--color-primary)',
                    }}
                  >
                    NAP-gecontroleerd
                  </span>
                )}
              </div>
              <h1
                className="text-3xl font-bold md:text-4xl"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                }}
              >
                {brandName ? `${brandName} ${vehicle.title}` : vehicle.title}
              </h1>
              {vehicle.variant && (
                <p className="mt-1 text-lg" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  {vehicle.variant}
                </p>
              )}
            </div>

            {/* Key specs summary */}
            <div
              className="flex flex-wrap items-center gap-4 rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              {vehicle.year && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Bouwjaar</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>{vehicle.year}</div>
                </div>
              )}
              {vehicle.mileage != null && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Kilometerstand</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>{formatMileage(vehicle.mileage)} km</div>
                </div>
              )}
              {vehicle.fuelType && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Brandstof</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {vehicle.fuelType === 'benzine' ? 'Benzine' : vehicle.fuelType === 'diesel' ? 'Diesel' : vehicle.fuelType === 'elektrisch' ? 'Elektrisch' : vehicle.fuelType}
                  </div>
                </div>
              )}
              {vehicle.transmission && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Transmissie</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {vehicle.transmission === 'automaat' ? 'Automaat' : 'Handgeschakeld'}
                  </div>
                </div>
              )}
              {vehicle.power && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Vermogen</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>{vehicle.power} pk</div>
                </div>
              )}
            </div>

            {/* Description */}
            {vehicle.shortDescription && (
              <div>
                <h2
                  className="mb-3 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Omschrijving
                </h2>
                <p className="leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  {vehicle.shortDescription}
                </p>
              </div>
            )}

            {/* Full specs */}
            <VehicleSpecs specs={specsData} />

            {/* Features / Uitrusting */}
            {Object.keys(featureGroups).length > 0 && (
              <div>
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Uitrusting
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(featureGroups).map(([category, items]) => (
                    <div
                      key={category}
                      className="rounded-xl border p-4"
                      style={{
                        borderColor: 'var(--color-grey, #e2e8f0)',
                        backgroundColor: 'var(--color-white, #ffffff)',
                      }}
                    >
                      <h3
                        className="mb-2 text-sm font-semibold"
                        style={{ color: 'var(--color-navy, #1a2b4a)' }}
                      >
                        {categoryLabels[category] || category}
                      </h3>
                      <ul className="space-y-1">
                        {items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                            <svg className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Pricing sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Price card */}
            <div
              className="rounded-xl border p-6"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              {vehicle.price != null && (
                <div className="mb-4">
                  {vehicle.salePrice != null && vehicle.salePrice > 0 ? (
                    <>
                      <div
                        className="text-3xl font-bold"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {formatPrice(vehicle.salePrice)}
                      </div>
                      <div className="mt-1 text-sm line-through" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                        {formatPrice(vehicle.price)}
                      </div>
                    </>
                  ) : (
                    <div
                      className="text-3xl font-bold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {formatPrice(vehicle.price)}
                    </div>
                  )}
                  {vehicle.priceType && (
                    <div className="mt-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                      {priceTypeLabels[vehicle.priceType] || vehicle.priceType}
                    </div>
                  )}
                  {vehicle.monthlyPrice && (
                    <div className="mt-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                      Vanaf <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{formatPrice(vehicle.monthlyPrice)}</span> p/m
                    </div>
                  )}
                </div>
              )}

              {/* Quick action buttons */}
              <div className="space-y-2">
                <Link
                  href={'/afspraak-maken?voertuig=' + vehicle.slug}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Proefrit aanvragen
                </Link>
                <Link
                  href="/inruilen"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                  Auto inruilen
                </Link>
                <a
                  href="tel:0251247233"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    color: 'var(--color-navy, #1a2b4a)',
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Bellen
                </a>
              </div>
            </div>

            {/* Financing calculator */}
            <div
              className="rounded-xl border p-6"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3
                className="mb-4 text-lg font-semibold"
                style={{ color: 'var(--color-navy, #1a2b4a)' }}
              >
                Financiering berekenen
              </h3>
              <FinancingCalculator vehiclePrice={vehicle.salePrice || vehicle.price} />
            </div>

            {/* Test drive form */}
            <div
              className="rounded-xl border p-6"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3
                className="mb-4 text-lg font-semibold"
                style={{ color: 'var(--color-navy, #1a2b4a)' }}
              >
                Proefrit aanvragen
              </h3>
              <TestDriveForm vehicleId={vehicle.id} vehicleTitle={vehicle.title} />
            </div>

            {/* USPs */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-primary-glow, rgba(0,100,200,0.05))' }}
            >
              <h3
                className="mb-3 text-sm font-semibold"
                style={{ color: 'var(--color-navy, #1a2b4a)' }}
              >
                Waarom bij ons kopen?
              </h3>
              <ul className="space-y-2">
                {[
                  'BOVAG-garantie',
                  'NAP-gecontroleerd',
                  'Inruil mogelijk',
                  'Financiering op maat',
                  'Thuisbezorging mogelijk',
                ].map((usp) => (
                  <li key={usp} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                    <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {usp}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Related vehicles */}
        {relatedVehicles.length > 0 && (
          <div className="mt-16">
            <h2
              className="mb-8 text-center text-2xl font-bold"
              style={{
                color: 'var(--color-navy, #1a2b4a)',
                fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
              }}
            >
              Vergelijkbare voertuigen
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VehicleDetailTemplate
