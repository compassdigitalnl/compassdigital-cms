import React from 'react'
import Link from 'next/link'
import { PractitionerCard } from '@/branches/zorg/components/PractitionerCard'
import type { TeamArchiveProps } from './types'

/**
 * TeamArchiveTemplate - Archive page for zorg team members (/team)
 *
 * Features:
 * - Breadcrumb navigation
 * - Hero section with healthcare gradient
 * - Responsive grid of PractitionerCard components
 * - Pagination
 * - CTA section linking to appointment booking
 */
export function TeamArchiveTemplate({
  members,
  totalPages,
  currentPage,
}: TeamArchiveProps) {
  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary, #059669)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Ons Team</span>
        </nav>
      </div>

      {/* Hero section with healthcare gradient */}
      <section
        className="py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, #059669, #0891b2)' }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1
            className="text-3xl font-bold text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Ons team
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Maak kennis met onze ervaren behandelaars. Alle behandelaars zijn BIG-geregistreerd.
          </p>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{members.length}</div>
              <div className="text-sm text-white/60">Behandelaars</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {members.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <PractitionerCard key={member.id} practitioner={member} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
            Geen teamleden gevonden.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={'/team' + (i > 0 ? '?page=' + (i + 1) : '')}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors"
                style={
                  currentPage === i + 1
                    ? { backgroundColor: 'var(--color-primary, #059669)', color: '#ffffff' }
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
          style={{ background: 'linear-gradient(135deg, #059669, #0891b2)' }}
        >
          <h2
            className="text-2xl font-bold text-white md:text-3xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Direct een afspraak maken?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">
            Plan eenvoudig online een afspraak in bij een van onze behandelaars.
          </p>
          <Link
            href="/afspraak-maken"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}
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

export default TeamArchiveTemplate
