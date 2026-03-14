import React from 'react'
import Link from 'next/link'
import { AppointmentForm } from '@/branches/zorg/components/AppointmentForm'
import { AppointmentSidebar } from '@/branches/zorg/components/AppointmentSidebar'
import type { AppointmentWizardProps } from './types'

/**
 * AppointmentWizardTemplate - Multi-step appointment page (/afspraak-maken)
 *
 * 2-column layout with the AppointmentForm (main) and AppointmentSidebar (sidebar).
 * The sidebar shows trust signals and appointment summary.
 */
export function AppointmentWizardTemplate({
  className,
}: AppointmentWizardProps) {
  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary, #059669)' }}>
            Home
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
          Kies uw behandeling, behandelaar en gewenst tijdstip
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content - AppointmentForm */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl border p-6 md:p-8"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <AppointmentForm />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <AppointmentSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentWizardTemplate
