import React from 'react'
import Link from 'next/link'
import { ReservationForm } from '@/branches/horeca/components/ReservationForm'
import { ReservationSidebar } from '@/branches/horeca/components/ReservationSidebar'
import type { ReservationWizardProps } from './types'

/**
 * ReservationWizardTemplate - Reservation page (/reserveren)
 *
 * 2-column layout with the ReservationForm (main) and ReservationSidebar (sidebar).
 * The sidebar shows static info since the form manages its own state.
 */
export function ReservationWizardTemplate({ className }: ReservationWizardProps) {
  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }} className={className}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary, #f97316)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Reserveren</span>
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
          Reserveren
        </h1>
        <p className="mt-2 text-lg" style={{ color: 'var(--color-grey-dark, #475569)' }}>
          Reserveer eenvoudig online een tafel
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content - ReservationForm */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl border p-6 md:p-8"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <ReservationForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ReservationSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReservationWizardTemplate
