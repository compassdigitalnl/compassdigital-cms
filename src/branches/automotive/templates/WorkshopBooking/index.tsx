import React from 'react'
import Link from 'next/link'
import { WorkshopBookingForm } from '@/branches/automotive/components/WorkshopBookingForm'
import type { WorkshopBookingProps } from './types'

/**
 * WorkshopBookingTemplate - Afspraak maken pagina (/afspraak-maken)
 *
 * 2-kolom layout met WorkshopBookingForm (3-stappen wizard: Dienst, Voertuig, Gegevens)
 * en sidebar met boekingsoverzicht en garanties.
 */
export function WorkshopBookingTemplate({
  services,
  preselectedService,
  preselectedVehicle,
}: WorkshopBookingProps) {
  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/werkplaats" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Werkplaats
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Afspraak maken</span>
        </nav>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pb-6">
        <h1
          className="text-3xl font-bold md:text-4xl"
          style={{
            color: 'var(--color-navy, #1a2b4a)',
            fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
          }}
        >
          Afspraak maken
        </h1>
        <p className="mt-2 text-lg" style={{ color: 'var(--color-grey-dark, #475569)' }}>
          Plan uw werkplaatsbezoek in drie eenvoudige stappen
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content - Booking form */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl border p-6 md:p-8"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <WorkshopBookingForm services={services} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Steps overview */}
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
                  Hoe werkt het?
                </h3>
                <ol className="space-y-4">
                  {[
                    { step: '1', title: 'Kies een dienst', description: 'Selecteer de gewenste werkplaatsdienst' },
                    { step: '2', title: 'Voertuiggegevens', description: 'Vul uw kenteken en voertuiginfo in' },
                    { step: '3', title: 'Uw gegevens', description: 'Vul uw contactgegevens in en kies een datum' },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        {item.step}
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                          {item.title}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                          {item.description}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Guarantees */}
              <div
                className="rounded-xl p-5"
                style={{ backgroundColor: 'var(--color-primary-glow, rgba(0,100,200,0.05))' }}
              >
                <h3
                  className="mb-3 text-sm font-semibold"
                  style={{ color: 'var(--color-navy, #1a2b4a)' }}
                >
                  Onze garanties
                </h3>
                <ul className="space-y-2">
                  {[
                    'Binnen 24 uur bevestiging',
                    'Geen verrassingen achteraf',
                    'Gecertificeerde monteurs',
                    'Originele onderdelen',
                    'Gratis vervangend vervoer',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                      <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phone */}
              <div
                className="rounded-xl border p-6"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                <h3
                  className="mb-2 text-sm font-semibold"
                  style={{ color: 'var(--color-navy, #1a2b4a)' }}
                >
                  Liever telefonisch?
                </h3>
                <p className="mb-3 text-xs" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  Onze werkplaats is bereikbaar op werkdagen van 08:00 tot 17:30.
                </p>
                <a
                  href="tel:0251247233"
                  className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Bel de werkplaats
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkshopBookingTemplate
