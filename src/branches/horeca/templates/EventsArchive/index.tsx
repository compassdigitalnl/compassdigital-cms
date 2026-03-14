import React from 'react'
import Link from 'next/link'
import { EventCard } from '@/branches/horeca/components/EventCard'
import type { EventsArchiveProps } from './types'

/**
 * EventsArchiveTemplate - Archive page for horeca events (/evenementen)
 *
 * Features:
 * - Breadcrumb navigation
 * - Hero section with horeca gradient (orange-to-red)
 * - Event count stat
 * - Responsive grid of EventCard components
 * - Pagination
 * - CTA section linking to contact
 */
export function EventsArchiveTemplate({
  events,
  totalPages,
  currentPage,
}: EventsArchiveProps) {
  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary, #f97316)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Evenementen</span>
        </nav>
      </div>

      {/* Hero section with horeca gradient */}
      <section
        className="py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)' }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1
            className="text-3xl font-bold text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Evenementen
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Ontdek onze evenementen en beleef bijzondere culinaire ervaringen.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{events.length}</div>
              <div className="text-sm text-white/60">Evenementen</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
            Geen evenementen gevonden.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={'/evenementen' + (i > 0 ? '?page=' + (i + 1) : '')}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors"
                style={
                  currentPage === i + 1
                    ? { backgroundColor: 'var(--color-primary, #f97316)', color: '#ffffff' }
                    : { backgroundColor: 'var(--color-grey-light, #f1f5f9)', color: 'var(--color-grey-dark, #475569)' }
                }
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}

        {/* CTA section */}
        <section
          className="mt-16 rounded-2xl p-8 text-center md:p-12"
          style={{ background: 'linear-gradient(135deg, #f97316, #dc2626)' }}
        >
          <h2
            className="text-2xl font-bold text-white md:text-3xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Wilt u een evenement organiseren?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Neem contact met ons op en we bespreken graag de mogelijkheden.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
          >
            Neem contact op
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </section>
      </div>
    </div>
  )
}

export default EventsArchiveTemplate
