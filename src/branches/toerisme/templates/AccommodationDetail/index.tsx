import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { AccommodationDetailProps } from './types'

/**
 * AccommodationDetailTemplate - Detail pagina voor een accommodatie (/accommodaties/[slug])
 *
 * Async server component. Gallery, 2-kolom layout:
 * Links: naam/sterren/locatie, beschrijving, RoomCards, faciliteiten grid, locatie info
 * Rechts: sticky sidebar met prijs, maaltijdplan, boek-CTA, quick info, garanties
 * Reviews section.
 */

function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price)
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

const facilityIcons: Record<string, string> = {
  zwembad: 'M2 15c6.667-6 13.333 0 20 0',
  spa: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
  restaurant: 'M12 8v13m0-13V6a4 4 0 00-4-4H6v6a4 4 0 004 4h2zm0 0V6a4 4 0 014-4h2v6a4 4 0 01-4 4h-2z',
  bar: 'M8 2v4l4 4 4-4V2',
  fitness: 'M20.24 12.24a6 6 0 00-8.49-8.49L5 10.5V19h8.5z',
  wifi: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0',
  parkeren: 'M9 17V7h4a3 3 0 010 6H9',
  roomservice: 'M5 12h14',
  airco: 'M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2',
  wasserij: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
  kindvriendelijk: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2',
  huisdieren: 'M12 21a9 9 0 100-18 9 9 0 000 18z',
}

const mealPlanLabels: Record<string, string> = {
  logies: 'Logies',
  ontbijt: 'Logies & Ontbijt',
  halfpension: 'Halfpension',
  volpension: 'Volpension',
  allinclusive: 'All Inclusive',
}

function renderStars(count: number) {
  return Array.from({ length: 5 }).map((_, i) => (
    <svg
      key={i}
      className="h-5 w-5"
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

export async function AccommodationDetailTemplate({ accommodation }: AccommodationDetailProps) {
  const acc = accommodation

  // Extract data
  const destination = typeof acc.destination === 'object' ? acc.destination : null
  const coverImage = typeof acc.coverImage === 'object' ? acc.coverImage : null
  const gallery = (acc.gallery || [])
    .map((item: any) => {
      const img = typeof item.image === 'object' ? item.image : item
      return img?.url ? { url: img.url, alt: img.alt || acc.name } : null
    })
    .filter(Boolean)
  const allImages = coverImage?.url ? [{ url: coverImage.url, alt: coverImage.alt || acc.name }, ...gallery] : gallery
  const rooms = acc.rooms || []
  const facilities = acc.facilities || []

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/accommodaties" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Accommodaties
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>{acc.name}</span>
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
              <div key={i} className="relative hidden aspect-[4/3] overflow-hidden rounded-xl md:block">
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
            {/* Header: name, stars, location */}
            <div>
              <div className="mb-2 flex items-center gap-3">
                {acc.type && (
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {acc.type.charAt(0).toUpperCase() + acc.type.slice(1)}
                  </span>
                )}
                {acc.stars && <div className="flex items-center gap-0.5">{renderStars(acc.stars)}</div>}
              </div>
              <h1
                className="text-3xl font-bold md:text-4xl"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                }}
              >
                {acc.name}
              </h1>
              <p className="mt-2 flex items-center gap-1 text-lg" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                <svg className="h-4 w-4" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {[acc.city, acc.region, destination?.name].filter(Boolean).join(', ')}
              </p>
            </div>

            {/* Rating bar */}
            {acc.rating != null && acc.rating > 0 && (
              <div
                className="flex items-center gap-4 rounded-xl border p-4"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-bold text-white"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {acc.rating.toFixed(1)}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {acc.rating >= 9 ? 'Uitstekend' : acc.rating >= 8 ? 'Zeer goed' : acc.rating >= 7 ? 'Goed' : acc.rating >= 6 ? 'Redelijk' : 'Matig'}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                    Gebaseerd op {acc.reviewCount || 0} reviews
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {acc.shortDescription && (
              <div>
                <h2
                  className="mb-3 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Over deze accommodatie
                </h2>
                <p className="leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  {acc.shortDescription}
                </p>
              </div>
            )}

            {/* Rooms */}
            {rooms.length > 0 && (
              <div>
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Kamertypes
                </h2>
                <div className="space-y-4">
                  {rooms.map((room: any, i: number) => (
                    <div
                      key={i}
                      className="flex flex-col gap-4 rounded-xl border p-5 md:flex-row md:items-center md:justify-between"
                      style={{
                        borderColor: 'var(--color-grey, #e2e8f0)',
                        backgroundColor: 'var(--color-white, #ffffff)',
                      }}
                    >
                      <div className="flex-1">
                        <h3 className="text-base font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                          {room.name || room.type || `Kamer ${i + 1}`}
                        </h3>
                        {room.description && (
                          <p className="mt-1 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                            {room.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          {room.maxGuests && (
                            <span className="flex items-center gap-1">
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                              </svg>
                              Max. {room.maxGuests} gasten
                            </span>
                          )}
                          {room.amenities && room.amenities.length > 0 && (
                            <span>{room.amenities.map((a: any) => typeof a === 'object' ? a.text : a).join(', ')}</span>
                          )}
                        </div>
                      </div>
                      {room.price != null && (
                        <div className="text-right">
                          <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            {formatPrice(room.price)}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>per nacht</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities grid */}
            {facilities.length > 0 && (
              <div>
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Faciliteiten
                </h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                  {facilities.map((facility: string) => (
                    <div
                      key={facility}
                      className="flex items-center gap-3 rounded-lg p-3"
                      style={{ backgroundColor: 'var(--color-primary-glow, rgba(0,188,212,0.05))' }}
                    >
                      <svg
                        className="h-5 w-5 shrink-0"
                        style={{ color: 'var(--color-primary)' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={facilityIcons[facility] || 'M5 13l4 4L19 7'} />
                      </svg>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {facilityLabels[facility] || facility}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location info */}
            {(acc.distanceBeach || acc.distanceCenter || acc.distanceAirport) && (
              <div>
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Locatie
                </h2>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {acc.distanceBeach && (
                    <div
                      className="rounded-xl border p-4 text-center"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', backgroundColor: 'var(--color-white, #ffffff)' }}
                    >
                      <div className="text-2xl">🏖️</div>
                      <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>Strand</div>
                      <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>{acc.distanceBeach}</div>
                    </div>
                  )}
                  {acc.distanceCenter && (
                    <div
                      className="rounded-xl border p-4 text-center"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', backgroundColor: 'var(--color-white, #ffffff)' }}
                    >
                      <div className="text-2xl">🏙️</div>
                      <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>Centrum</div>
                      <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>{acc.distanceCenter}</div>
                    </div>
                  )}
                  {acc.distanceAirport && (
                    <div
                      className="rounded-xl border p-4 text-center"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', backgroundColor: 'var(--color-white, #ffffff)' }}
                    >
                      <div className="text-2xl">✈️</div>
                      <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>Luchthaven</div>
                      <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>{acc.distanceAirport}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reviews section */}
            {acc.rating != null && acc.rating > 0 && (
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
                    {acc.rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="text-base font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {acc.rating >= 9 ? 'Uitstekend' : acc.rating >= 8 ? 'Zeer goed' : acc.rating >= 7 ? 'Goed' : acc.rating >= 6 ? 'Redelijk' : 'Matig'}
                    </div>
                    <p className="text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                      Gebaseerd op {acc.reviewCount || 0} reviews
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
              {acc.priceFrom != null && (
                <div className="mb-4">
                  <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Vanaf</span>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {formatPrice(acc.priceFrom)}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                    per persoon per nacht
                  </div>
                  {acc.priceTo != null && acc.priceTo > acc.priceFrom && (
                    <div className="mt-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                      Tot {formatPrice(acc.priceTo)} p.p.p.n.
                    </div>
                  )}
                </div>
              )}

              {/* Quick info */}
              <div className="mb-4 space-y-2">
                {acc.mealPlan && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Maaltijdplan</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {mealPlanLabels[acc.mealPlan] || acc.mealPlan}
                    </span>
                  </div>
                )}
                {acc.stars && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Classificatie</span>
                    <div className="flex items-center gap-0.5">{renderStars(acc.stars)}</div>
                  </div>
                )}
                {acc.type && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Type</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {acc.type.charAt(0).toUpperCase() + acc.type.slice(1)}
                    </span>
                  </div>
                )}
                {rooms.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Kamertypes</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {rooms.length} types
                    </span>
                  </div>
                )}
              </div>

              {/* Booking CTA */}
              <div className="space-y-2">
                <Link
                  href={`/boeken?accommodatie=${acc.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Boek deze accommodatie
                </Link>
                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)',
                  }}
                >
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
                Boekingsgaranties
              </h3>
              <ul className="space-y-2">
                {[
                  'Laagste prijsgarantie',
                  'Gratis annuleren tot 48 uur',
                  'Direct boekingsbevestiging',
                  'Geen verborgen kosten',
                  '24/7 klantenservice',
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
      </div>
    </div>
  )
}

export default AccommodationDetailTemplate
