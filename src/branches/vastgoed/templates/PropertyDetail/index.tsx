import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  formatPrice,
  formatArea,
  formatPropertyType,
  formatEnergyLabel,
  formatPriceCondition,
  calculatePricePerM2,
  calculateMortgage,
} from '@/branches/vastgoed/lib/propertyUtils'
import type { PropertyDetailProps } from './types'

/**
 * PropertyDetailTemplate - Detail pagina voor een woning (/woningen/[slug])
 *
 * Async server component. Breadcrumb, gallery, 2-kolom layout:
 * Links: woninginfo, beschrijving, PropertySpecs
 * Rechts: sticky sidebar met prijs, MortgageCalculator, BezichtigingForm CTA
 * Onderaan: ValuationCTA banner
 */

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

const heatingLabels: Record<string, string> = {
  'cv-ketel': 'CV-ketel',
  stadsverwarming: 'Stadsverwarming',
  warmtepomp: 'Warmtepomp',
  vloerverwarming: 'Vloerverwarming',
  anders: 'Anders',
}

const gardenOrientationLabels: Record<string, string> = {
  noord: 'Noord',
  oost: 'Oost',
  zuid: 'Zuid',
  west: 'West',
  nvt: 'N.v.t.',
}

export async function PropertyDetailTemplate({ property }: PropertyDetailProps) {
  const payload = await getPayload({ config })

  // Fetch related properties (same city, different slug)
  let relatedProperties: any[] = []
  try {
    const result = await payload.find({
      collection: 'properties',
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: property.id } },
          ...(property.city ? [{ city: { equals: property.city } }] : []),
        ],
      },
      limit: 3,
      sort: '-createdAt',
    })
    relatedProperties = result.docs
  } catch (e) {
    /* fail silently */
  }

  // Extract data
  const coverImage = typeof property.coverImage === 'object' ? property.coverImage : null
  const gallery = (property.gallery || [])
    .map((item: any) => {
      const img = typeof item.image === 'object' ? item.image : item
      return img?.url ? { url: img.url, alt: img.alt || property.title } : null
    })
    .filter(Boolean)
  const allImages = coverImage?.url
    ? [{ url: coverImage.url, alt: coverImage.alt || property.title }, ...gallery]
    : gallery
  const statusInfo = getStatusLabel(property.listingStatus || 'beschikbaar')
  const agent = typeof property.agent === 'object' ? property.agent : null

  const isNew =
    property.listingDate &&
    new Date().getTime() - new Date(property.listingDate).getTime() < 14 * 24 * 60 * 60 * 1000

  // Calculate mortgage estimate (default: 30 years, 4% interest, no deposit)
  const mortgageEstimate = property.askingPrice
    ? calculateMortgage(property.askingPrice, 4.0, 30)
    : 0

  const pricePerM2 =
    property.askingPrice && property.livingArea
      ? calculatePricePerM2(property.askingPrice, property.livingArea)
      : property.pricePerM2 || 0

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/woningen" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Woningen
          </Link>
          {property.city && (
            <>
              <span>/</span>
              <Link
                href={`/woningen?city=${encodeURIComponent(property.city)}`}
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                {property.city}
              </Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>{property.title}</span>
        </nav>
      </div>

      {/* Gallery */}
      {allImages.length > 0 && (
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:grid-rows-2">
            {/* Main image */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl md:col-span-2 md:row-span-2 md:aspect-auto md:h-full">
              <Image
                src={allImages[0].url}
                alt={allImages[0].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            {/* Secondary images */}
            {allImages.slice(1, 5).map((img: any, i: number) => (
              <div
                key={i}
                className={`relative hidden aspect-[4/3] overflow-hidden rounded-xl md:block ${
                  i === 1 ? 'md:rounded-tr-xl' : ''
                } ${i === 3 ? 'md:rounded-br-xl' : ''}`}
              >
                <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="25vw" />
                {i === 3 && allImages.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-lg font-semibold text-white">+{allImages.length - 5} foto&apos;s</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Title + meta */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: statusInfo.color }}
                >
                  {statusInfo.label}
                </span>
                {isNew && (
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Nieuw
                  </span>
                )}
                {property.energyLabel && (
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: getEnergyLabelBgColor(property.energyLabel) }}
                  >
                    Energielabel {property.energyLabel}
                  </span>
                )}
                {property.propertyType && (
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: 'var(--color-grey-light, #f1f5f9)',
                      color: 'var(--color-grey-dark, #475569)',
                    }}
                  >
                    {formatPropertyType(property.propertyType)}
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
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-1 text-lg" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {property.city}{property.neighborhood ? ` - ${property.neighborhood}` : ''}
              </p>
            </div>

            {/* Key info bar */}
            <div
              className="flex flex-wrap items-center gap-6 rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              {property.askingPrice && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Vraagprijs</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                    {formatPrice(property.askingPrice, property.priceCondition)}
                  </div>
                </div>
              )}
              {property.livingArea && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Woonoppervlakte</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {formatArea(property.livingArea)}
                  </div>
                </div>
              )}
              {property.bedrooms != null && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Slaapkamers</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {property.bedrooms}
                  </div>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Badkamers</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {property.bathrooms}
                  </div>
                </div>
              )}
              {property.buildYear && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Bouwjaar</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {property.buildYear}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.shortDescription && (
              <div>
                <h2
                  className="mb-3 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Over deze woning
                </h2>
                <p className="leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  {property.shortDescription}
                </p>
              </div>
            )}

            {/* Property Specs - 2-column grid */}
            <div>
              <h2
                className="mb-4 text-xl font-bold"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                }}
              >
                Kenmerken
              </h2>
              <div
                className="grid grid-cols-1 gap-0.5 overflow-hidden rounded-xl border md:grid-cols-2"
                style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}
              >
                {[
                  { label: 'Woningtype', value: property.propertyType ? formatPropertyType(property.propertyType) : null },
                  { label: 'Bouwjaar', value: property.buildYear },
                  { label: 'Woonoppervlakte', value: property.livingArea ? formatArea(property.livingArea) : null },
                  { label: 'Perceeloppervlakte', value: property.plotArea ? formatArea(property.plotArea) : null },
                  { label: 'Kamers', value: property.rooms },
                  { label: 'Slaapkamers', value: property.bedrooms },
                  { label: 'Badkamers', value: property.bathrooms },
                  { label: 'Verdiepingen', value: property.floors },
                  { label: 'Energielabel', value: property.energyLabel },
                  { label: 'Verwarming', value: property.heatingType ? (heatingLabels[property.heatingType] || property.heatingType) : null },
                  { label: 'Tuin', value: property.hasGarden ? `Ja${property.gardenArea ? ` (${formatArea(property.gardenArea)})` : ''}${property.gardenOrientation && property.gardenOrientation !== 'nvt' ? ` - ${gardenOrientationLabels[property.gardenOrientation] || property.gardenOrientation}` : ''}` : null },
                  { label: 'Garage', value: property.hasGarage ? 'Ja' : null },
                  { label: 'Parkeren', value: property.hasParking ? (property.parkingType || 'Ja') : null },
                  { label: 'Prijs per m\u00b2', value: pricePerM2 > 0 ? formatPrice(pricePerM2) : null },
                  { label: 'VvE bijdrage', value: property.serviceCharges ? `${formatPrice(property.serviceCharges)} / mnd` : null },
                ]
                  .filter((spec) => spec.value != null)
                  .map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3"
                      style={{ backgroundColor: i % 2 === 0 ? 'var(--color-white, #ffffff)' : 'var(--color-grey-light, #f8fafc)' }}
                    >
                      <span className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                        {spec.label}
                      </span>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Insulation */}
            {property.insulation && property.insulation.length > 0 && (
              <div>
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Isolatie
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.insulation.map((item: string) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm"
                      style={{
                        backgroundColor: 'var(--color-primary-glow, rgba(63,81,181,0.08))',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' ')}
                    </span>
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
              {property.askingPrice != null && (
                <div className="mb-4">
                  <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Vraagprijs</span>
                  {property.originalPrice && property.originalPrice > property.askingPrice ? (
                    <>
                      <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                        {formatPrice(property.askingPrice)}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm line-through" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          {formatPrice(property.originalPrice)}
                        </span>
                        <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: '#22c55e' }}>
                          Prijsverlaging
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                      {formatPrice(property.askingPrice)}
                    </div>
                  )}
                  {property.priceCondition && (
                    <div className="mt-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                      {formatPriceCondition(property.priceCondition)}
                    </div>
                  )}
                </div>
              )}

              {/* Quick info */}
              <div className="mb-4 space-y-2">
                {property.livingArea && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Woonoppervlakte</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {formatArea(property.livingArea)}
                    </span>
                  </div>
                )}
                {property.bedrooms != null && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Slaapkamers</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {property.bedrooms}
                    </span>
                  </div>
                )}
                {property.energyLabel && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Energielabel</span>
                    <span
                      className="rounded px-2 py-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: getEnergyLabelBgColor(property.energyLabel) }}
                    >
                      {property.energyLabel}
                    </span>
                  </div>
                )}
                {pricePerM2 > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Prijs per m{'\u00b2'}</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {formatPrice(pricePerM2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Mortgage estimate */}
              {mortgageEstimate > 0 && (
                <div
                  className="mb-4 rounded-lg p-3"
                  style={{ backgroundColor: 'var(--color-primary-glow, rgba(63,81,181,0.08))' }}
                >
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                    Geschatte maandlasten
                  </div>
                  <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                    {formatPrice(mortgageEstimate)} / mnd
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                    o.b.v. 4% rente, 30 jaar, 100% financiering
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-2">
                <Link
                  href={`/bezichtiging?propertyId=${property.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Bezichtiging plannen
                </Link>
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  Contact opnemen
                </Link>
              </div>
            </div>

            {/* Agent card */}
            {agent && (
              <div
                className="rounded-xl border p-5"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                  Uw makelaar
                </h3>
                <div className="flex items-center gap-3">
                  {typeof agent.photo === 'object' && agent.photo?.url ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={agent.photo.url}
                        alt={agent.name || agent.firstName || ''}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: 'var(--color-grey-light, #f1f5f9)' }}
                    >
                      <svg className="h-6 w-6" style={{ color: 'var(--color-grey-mid, #94A3B8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {agent.name || `${agent.firstName || ''} ${agent.lastName || ''}`.trim()}
                    </div>
                    {agent.role && (
                      <div className="text-xs" style={{ color: 'var(--color-primary)' }}>
                        {agent.role}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Guarantees */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-primary-glow, rgba(63,81,181,0.05))' }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Onze garanties
              </h3>
              <ul className="space-y-2">
                {[
                  'NVM-gecertificeerd makelaarskantoor',
                  'Gratis en vrijblijvende bezichtiging',
                  'Professionele fotografie',
                  'Uitgebreide woningpresentatie',
                  'Persoonlijke begeleiding',
                ].map((guarantee) => (
                  <li key={guarantee} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                    <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {guarantee}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Related properties */}
        {relatedProperties.length > 0 && (
          <div className="mt-16">
            <h2
              className="mb-8 text-center text-2xl font-bold"
              style={{
                color: 'var(--color-navy, #1a2b4a)',
                fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
              }}
            >
              Vergelijkbare woningen
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProperties.map((relProp) => {
                const relCover = typeof relProp.coverImage === 'object' ? relProp.coverImage : null
                return (
                  <Link
                    key={relProp.id}
                    href={`/woningen/${relProp.slug}`}
                    className="group overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
                    style={{
                      borderColor: 'var(--color-grey, #e2e8f0)',
                      backgroundColor: 'var(--color-white, #ffffff)',
                    }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {relCover?.url ? (
                        <Image
                          src={relCover.url}
                          alt={relCover.alt || relProp.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: 'var(--color-grey-light, #f1f5f9)' }}>
                          <svg className="h-12 w-12" style={{ color: 'var(--color-grey-mid, #94A3B8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 21h19.5M3.75 3v18m16.5-18v18M5.25 3h13.5M5.25 21V10.5" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="mb-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                        {relProp.city || ''}{relProp.livingArea ? ` - ${formatArea(relProp.livingArea)}` : ''}
                      </div>
                      <h3 className="text-base font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {relProp.title}
                      </h3>
                      {relProp.askingPrice != null && (
                        <div className="mt-2 text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                          {formatPrice(relProp.askingPrice)}{' '}
                          {relProp.priceCondition && (
                            <span className="text-xs font-normal" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                              {relProp.priceCondition}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Valuation CTA */}
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
            Vraag een gratis en vrijblijvende waardebepaling aan. Onze makelaars komen graag bij u langs voor een professionele analyse.
          </p>
          <Link
            href="/waardebepaling"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-secondary, #303F9F)' }}
          >
            Gratis waardebepaling aanvragen
          </Link>
        </section>
      </div>
    </div>
  )
}

export default PropertyDetailTemplate
