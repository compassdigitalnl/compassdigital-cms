import React from 'react'
import Link from 'next/link'
import { TradeInForm } from '@/branches/automotive/components/TradeInForm'
import type { TradeInProps } from './types'

/**
 * TradeInTemplate - Inruil pagina (/inruilen)
 *
 * 2-kolom layout met TradeInForm (hoofdgedeelte) en sidebar
 * met uitleg over het inruilproces, USPs en garanties.
 */
export function TradeInTemplate({ settings }: TradeInProps) {
  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Auto inruilen</span>
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
            Uw auto inruilen
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Ontdek snel en eenvoudig de inruilwaarde van uw huidige voertuig. Vul uw kenteken in en ontvang direct een indicatie.
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content - Trade-in form */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl border p-6 md:p-8"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h2
                className="mb-2 text-2xl font-bold"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                }}
              >
                Inruilwaarde berekenen
              </h2>
              <p className="mb-6 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                Vul de gegevens van uw huidige voertuig in voor een vrijblijvende waardebepaling.
              </p>
              <TradeInForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* How it works */}
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
                  Hoe werkt inruilen?
                </h3>
                <ol className="space-y-4">
                  {[
                    { step: '1', title: 'Kenteken invullen', description: 'Wij halen automatisch de voertuiggegevens op via RDW' },
                    { step: '2', title: 'Staat aangeven', description: 'Geef de kilometerstand en staat van uw voertuig aan' },
                    { step: '3', title: 'Bod ontvangen', description: 'Ontvang binnen 24 uur een vrijblijvend inruilbod' },
                    { step: '4', title: 'Inruilen', description: 'Akkoord? Rij uw auto naar ons toe en rijd weg in uw nieuwe auto' },
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

              {/* USPs / Guarantees */}
              <div
                className="rounded-xl p-5"
                style={{ backgroundColor: 'var(--color-primary-glow, rgba(0,100,200,0.05))' }}
              >
                <h3
                  className="mb-3 text-sm font-semibold"
                  style={{ color: 'var(--color-navy, #1a2b4a)' }}
                >
                  Onze inruilgaranties
                </h3>
                <ul className="space-y-2">
                  {[
                    'Eerlijke marktconforme prijs',
                    'Gratis en vrijblijvend',
                    'Binnen 24 uur reactie',
                    'Alle merken en modellen',
                    'Directe verrekening bij aankoop',
                    'Geen verborgen kosten',
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

              {/* Contact card */}
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
                  Vragen over inruilen?
                </h3>
                <p className="mb-3 text-xs" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  Onze inruilspecialisten staan voor u klaar.
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:0251247233"
                    className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Bel ons
                  </a>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Stuur een bericht
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TradeInTemplate
