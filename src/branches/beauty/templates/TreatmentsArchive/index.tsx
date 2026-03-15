import React from 'react'
import Link from 'next/link'
import { TreatmentCard } from '@/branches/beauty/components/TreatmentCard'
import type { TreatmentsArchiveProps } from './types'

/**
 * TreatmentsArchiveTemplate - Archive page for beauty treatments (/behandelingen)
 *
 * Features:
 * - Breadcrumb navigation
 * - Hero section with beauty gradient
 * - Treatment count stat
 * - Responsive grid of TreatmentCard components
 * - Pagination
 * - CTA section linking to booking
 */
export function TreatmentsArchiveTemplate({
  treatments,
  totalPages,
  currentPage,
}: TreatmentsArchiveProps) {
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="text-teal transition-colors hover:opacity-80">
            Home
          </Link>
          <span>/</span>
          <span className="text-navy">Behandelingen</span>
        </nav>
      </div>

      {/* Hero section with beauty gradient */}
      <section
        className="py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent, var(--color-primary)))' }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Onze behandelingen
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Ontdek ons complete aanbod aan behandelingen voor jouw ultieme verzorging.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{treatments.length}</div>
              <div className="text-sm text-white/60">Behandelingen</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {treatments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {treatments.map((treatment) => (
              <TreatmentCard key={treatment.id} treatment={treatment} variant="default" showCTA />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-grey-mid">
            Geen behandelingen gevonden.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={'/behandelingen' + (i > 0 ? '?page=' + (i + 1) : '')}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === i + 1
                    ? 'bg-teal text-white'
                    : 'bg-grey-light text-grey-dark'
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}

        {/* CTA section */}
        <section
          className="mt-16 rounded-2xl p-8 text-center md:p-12"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent, var(--color-primary)))' }}
        >
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            Niet gevonden wat je zoekt?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Boek een afspraak en laat je persoonlijk adviseren door onze specialisten.
          </p>
          <Link
            href="/boeken"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/20 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition-opacity hover:opacity-90"
          >
            Afspraak maken
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </section>
      </div>
    </div>
  )
}

export default TreatmentsArchiveTemplate
