import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { TourDetailProps } from './types'

/**
 * TourDetailTemplate - Detail pagina voor een reis (/reizen/[slug])
 *
 * Async server component. Breadcrumb, gallery, 2-kolom layout:
 * Links: tour info, ItineraryTimeline, inclusief/exclusief, highlights
 * Rechts: sticky pricing sidebar met prijs, vroegboekkorting, boek-CTA, garanties
 * Onderaan: gerelateerde reizen (zelfde bestemming)
 */

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

export async function TourDetailTemplate({ tour }: TourDetailProps) {
  const payload = await getPayload({ config })

  // Fetch related tours (same destination, different slug)
  let relatedTours: any[] = []
  try {
    const destinationId = typeof tour.destination === 'object' ? tour.destination?.id : tour.destination
    const result = await payload.find({
      collection: 'tours',
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: tour.id } },
          ...(destinationId ? [{ destination: { equals: destinationId } }] : []),
        ],
      },
      limit: 3,
      sort: '-createdAt',
    })
    relatedTours = result.docs
  } catch (e) {
    /* fail silently */
  }

  // Extract data
  const destination = typeof tour.destination === 'object' ? tour.destination : null
  const coverImage = typeof tour.coverImage === 'object' ? tour.coverImage : null
  const gallery = (tour.gallery || [])
    .map((item: any) => {
      const img = typeof item.image === 'object' ? item.image : item
      return img?.url ? { url: img.url, alt: img.alt || tour.title } : null
    })
    .filter(Boolean)
  const allImages = coverImage?.url ? [{ url: coverImage.url, alt: coverImage.alt || tour.title }, ...gallery] : gallery
  const itinerary = tour.itinerary || []
  const inclusions = tour.inclusions || []
  const exclusions = tour.exclusions || []
  const highlights = tour.highlights || []
  const availInfo = formatAvailability(tour.availability || 'beschikbaar')

  const hasEarlyBird = tour.earlyBirdPrice && tour.earlyBirdPrice < tour.price
  const displayPrice = hasEarlyBird ? tour.earlyBirdPrice : tour.price

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/reizen" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Reizen
          </Link>
          {destination && (
            <>
              <span>/</span>
              <Link
                href={`/reizen?continent=${destination.continent || ''}`}
                className="transition-colors hover:opacity-80"
                style={{ color: 'var(--color-primary)' }}
              >
                {destination.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>{tour.title}</span>
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
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
                {i === 3 && allImages.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="text-lg font-semibold text-white">+{allImages.length - 5} foto's</span>
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
                {tour.category && (
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {tour.category.charAt(0).toUpperCase() + tour.category.slice(1)}
                  </span>
                )}
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                  style={{ backgroundColor: availInfo.color }}
                >
                  {availInfo.label}
                </span>
              </div>
              <h1
                className="text-3xl font-bold md:text-4xl"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                }}
              >
                {tour.title}
              </h1>
              {destination && (
                <p className="mt-2 text-lg" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  {destination.icon && <span className="mr-1">{destination.icon}</span>}
                  {destination.name}{destination.country ? `, ${destination.country}` : ''}
                </p>
              )}
            </div>

            {/* Key info bar */}
            <div
              className="flex flex-wrap items-center gap-6 rounded-xl border p-4"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              {tour.duration && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Reisduur</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {tour.duration} dagen{tour.nights ? ` / ${tour.nights} nachten` : ''}
                  </div>
                </div>
              )}
              {tour.maxParticipants && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Max. deelnemers</div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {tour.maxParticipants} personen
                  </div>
                </div>
              )}
              {tour.rating != null && tour.rating > 0 && (
                <div className="text-center">
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Beoordeling</div>
                  <div className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-primary)' }}>
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {tour.rating.toFixed(1)}
                    </span>
                    {tour.reviewCount > 0 && (
                      <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                        ({tour.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {tour.shortDescription && (
              <div>
                <h2
                  className="mb-3 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Over deze reis
                </h2>
                <p className="leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  {tour.shortDescription}
                </p>
              </div>
            )}

            {/* Highlights */}
            {highlights.length > 0 && (
              <div>
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Hoogtepunten
                </h2>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {highlights.map((h: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg p-3"
                      style={{ backgroundColor: 'var(--color-primary-glow, rgba(0,188,212,0.05))' }}
                    >
                      <svg className="h-5 w-5 shrink-0" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {typeof h === 'object' ? h.highlight || h.text : h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary Timeline */}
            {itinerary.length > 0 && (
              <div>
                <h2
                  className="mb-6 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Reisprogramma
                </h2>
                <div className="relative space-y-0">
                  {itinerary.map((day: any, i: number) => (
                    <div key={i} className="relative flex gap-4 pb-8 last:pb-0">
                      {/* Timeline line */}
                      {i < itinerary.length - 1 && (
                        <div
                          className="absolute left-[15px] top-[30px] w-0.5"
                          style={{
                            backgroundColor: 'var(--color-grey, #e2e8f0)',
                            height: 'calc(100% - 20px)',
                          }}
                        />
                      )}
                      {/* Day number circle */}
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        {day.dagNummer || day.dayNumber || i + 1}
                      </div>
                      {/* Day content */}
                      <div
                        className="flex-1 rounded-xl border p-4"
                        style={{
                          borderColor: 'var(--color-grey, #e2e8f0)',
                          backgroundColor: 'var(--color-white, #ffffff)',
                        }}
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                            Dag {day.dagNummer || day.dayNumber || i + 1}: {day.titel || day.title}
                          </h3>
                          {(day.locatie || day.location) && (
                            <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                              - {day.locatie || day.location}
                            </span>
                          )}
                        </div>
                        {(day.beschrijving || day.description) && (
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                            {typeof (day.beschrijving || day.description) === 'string'
                              ? day.beschrijving || day.description
                              : 'Zie de volledige beschrijving.'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusief / Exclusief */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Inclusief */}
              {inclusions.length > 0 && (
                <div
                  className="rounded-xl border p-5"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    backgroundColor: 'var(--color-white, #ffffff)',
                  }}
                >
                  <h3
                    className="mb-3 text-base font-semibold"
                    style={{ color: 'var(--color-navy, #1a2b4a)' }}
                  >
                    Inclusief
                  </h3>
                  <ul className="space-y-2">
                    {inclusions.map((item: any, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                        <svg className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {typeof item === 'object' ? item.item || item.text : item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exclusief */}
              {exclusions.length > 0 && (
                <div
                  className="rounded-xl border p-5"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    backgroundColor: 'var(--color-white, #ffffff)',
                  }}
                >
                  <h3
                    className="mb-3 text-base font-semibold"
                    style={{ color: 'var(--color-navy, #1a2b4a)' }}
                  >
                    Exclusief
                  </h3>
                  <ul className="space-y-2">
                    {exclusions.map((item: any, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                        <svg className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {typeof item === 'object' ? item.item || item.text : item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Reviews section */}
            {tour.rating != null && tour.rating > 0 && (
              <div>
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Beoordelingen
                </h2>
                <div
                  className="flex items-center gap-4 rounded-xl border p-6"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    backgroundColor: 'var(--color-white, #ffffff)',
                  }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {tour.rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5"
                          fill={i < Math.round(tour.rating) ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          style={{ color: i < Math.round(tour.rating) ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-1 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                      Gebaseerd op {tour.reviewCount || 0} reviews
                    </p>
                  </div>
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
              {tour.price != null && (
                <div className="mb-4">
                  <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Vanaf</span>
                  {hasEarlyBird ? (
                    <>
                      <div
                        className="text-3xl font-bold"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {formatPrice(tour.earlyBirdPrice)}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm line-through" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          {formatPrice(tour.price)}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: '#22c55e' }}
                        >
                          Vroegboekkorting
                        </span>
                      </div>
                      {tour.earlyBirdDeadline && (
                        <p className="mt-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          Geldig t/m {new Date(tour.earlyBirdDeadline).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      )}
                    </>
                  ) : (
                    <div
                      className="text-3xl font-bold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {formatPrice(tour.price)}
                    </div>
                  )}
                  <div className="mt-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                    per persoon
                  </div>
                </div>
              )}

              {/* Quick info */}
              <div className="mb-4 space-y-2">
                {tour.duration && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Reisduur</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {tour.duration} dagen{tour.nights ? ` / ${tour.nights} nachten` : ''}
                    </span>
                  </div>
                )}
                {tour.maxParticipants && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Groepsgrootte</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Max. {tour.maxParticipants} personen
                    </span>
                  </div>
                )}
                {tour.childPrice != null && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Kinderprijs</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {formatPrice(tour.childPrice)} p.p.
                    </span>
                  </div>
                )}
                {tour.singleSupplement != null && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Enkeltoeslag</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {formatPrice(tour.singleSupplement)}
                    </span>
                  </div>
                )}
                {tour.departureDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Vertrekdatum</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {new Date(tour.departureDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Booking CTA */}
              <div className="space-y-2">
                <Link
                  href={`/boeken?tour=${tour.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Boek deze reis
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                  Vraag advies aan
                </Link>
              </div>
            </div>

            {/* Guarantees */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-primary-glow, rgba(0,188,212,0.05))' }}
            >
              <h3
                className="mb-3 text-sm font-semibold"
                style={{ color: 'var(--color-navy, #1a2b4a)' }}
              >
                Reisgaranties
              </h3>
              <ul className="space-y-2">
                {[
                  'SGR/GGTO garantie',
                  'Calamiteitenfonds bescherming',
                  'Gratis annuleren tot 30 dagen voor vertrek',
                  'Persoonlijk reisadvies',
                  'Nederlands reisleiding',
                  '24/7 bereikbaar tijdens reis',
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

        {/* Related tours */}
        {relatedTours.length > 0 && (
          <div className="mt-16">
            <h2
              className="mb-8 text-center text-2xl font-bold"
              style={{
                color: 'var(--color-navy, #1a2b4a)',
                fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
              }}
            >
              Vergelijkbare reizen
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedTours.map((relTour) => {
                const relCover = typeof relTour.coverImage === 'object' ? relTour.coverImage : null
                const relDest = typeof relTour.destination === 'object' ? relTour.destination : null
                return (
                  <Link
                    key={relTour.id}
                    href={`/reizen/${relTour.slug}`}
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
                          alt={relCover.alt || relTour.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: 'var(--color-grey-light, #f1f5f9)' }}>
                          <svg className="h-12 w-12" style={{ color: 'var(--color-grey-mid, #94A3B8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="mb-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                        {relDest?.name || ''} {relTour.duration ? `- ${relTour.duration} dagen` : ''}
                      </div>
                      <h3 className="text-base font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {relTour.title}
                      </h3>
                      {relTour.price != null && (
                        <div className="mt-2 text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                          {formatPrice(relTour.price)} <span className="text-xs font-normal" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>p.p.</span>
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TourDetailTemplate
