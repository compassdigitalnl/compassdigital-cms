import React from 'react'
import Link from 'next/link'
import type { WorkshopArchiveProps } from './types'

/**
 * WorkshopArchiveTemplate - Overzicht werkplaatsdiensten (/werkplaats)
 *
 * Grid van werkplaatsdiensten met prijzen en boekings-CTA.
 * Categorieën: APK, Onderhoud, Reparatie, Banden, Airco.
 */

const CATEGORY_ICONS: Record<string, string> = {
  apk: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  onderhoud: 'M11.42 15.17L17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z',
  reparatie: 'M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z',
  banden: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  airco: 'M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z',
}

export function WorkshopArchiveTemplate({
  services,
  categories,
  activeCategory,
}: WorkshopArchiveProps) {
  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Werkplaats</span>
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
            Werkplaats
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Professioneel onderhoud en reparatie voor uw voertuig. Altijd scherpe prijzen en vakkundige monteurs.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/werkplaats"
              className="rounded-full px-5 py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor: !activeCategory ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                color: !activeCategory ? '#fff' : 'var(--color-grey-dark, #475569)',
              }}
            >
              Alle diensten
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={'/werkplaats?categorie=' + cat.value}
                className="rounded-full px-5 py-2 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeCategory === cat.value ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                  color: activeCategory === cat.value ? '#fff' : 'var(--color-grey-dark, #475569)',
                }}
              >
                {cat.label} ({cat.count})
              </Link>
            ))}
          </div>
        )}

        {/* Services grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const categoryKey = service.serviceCategory || service.category || ''
              const iconPath = CATEGORY_ICONS[categoryKey] || CATEGORY_ICONS.onderhoud

              return (
                <div
                  key={service.id}
                  className="group flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    backgroundColor: 'var(--color-white, #ffffff)',
                  }}
                >
                  {/* Icon + Category */}
                  <div
                    className="flex items-center gap-3 px-6 py-4"
                    style={{ borderBottom: '1px solid var(--color-grey, #e2e8f0)' }}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: 'var(--color-primary-glow, rgba(0,100,200,0.1))' }}
                    >
                      <svg
                        className="h-5 w-5"
                        style={{ color: 'var(--color-primary)' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                      </svg>
                    </div>
                    <span
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {service.serviceCategory || service.category || ''}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3
                      className="mb-2 text-lg font-bold"
                      style={{ color: 'var(--color-navy, #1a2b4a)' }}
                    >
                      {service.title}
                    </h3>
                    {service.shortDescription && (
                      <p className="mb-4 flex-1 text-sm leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                        {service.shortDescription}
                      </p>
                    )}

                    {/* Price + Duration */}
                    <div className="mb-4 flex items-end justify-between">
                      {service.price != null && (
                        <div>
                          <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Vanaf</span>
                          <div className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                            {formatPrice(service.price)}
                          </div>
                        </div>
                      )}
                      {service.duration && (
                        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          {service.duration} min
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <Link
                      href={'/afspraak-maken?dienst=' + (service.slug || service.id)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Afspraak maken
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-12 text-center" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
            Geen werkplaatsdiensten gevonden.
          </div>
        )}

        {/* CTA section */}
        <section
          className="mt-16 rounded-2xl p-8 text-center md:p-12"
          style={{ background: 'linear-gradient(135deg, var(--color-navy, #1a2b4a), var(--color-navy, #1a2b4a)cc)' }}
        >
          <h2
            className="text-2xl text-white md:text-3xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Direct een afspraak maken?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Plan online uw werkplaatsbezoek in en ontvang direct een bevestiging.
          </p>
          <Link
            href="/afspraak-maken"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Afspraak inplannen
          </Link>
        </section>
      </div>
    </div>
  )
}

export default WorkshopArchiveTemplate
