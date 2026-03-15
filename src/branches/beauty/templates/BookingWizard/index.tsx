import React from 'react'
import Link from 'next/link'
import { BookingForm } from '@/branches/beauty/components/BookingForm'
import { BookingSidebar } from '@/branches/beauty/components/BookingSidebar'
import type { BookingWizardProps } from './types'

/**
 * BookingWizardTemplate - Multi-step booking page (/boeken)
 *
 * 2-column layout with the BookingForm (main) and BookingSidebar (sidebar).
 * The sidebar shows static guarantees since the form manages its own state.
 */
export function BookingWizardTemplate({
  services,
  stylists,
  preselectedService,
  preselectedStylist,
}: BookingWizardProps) {
  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="text-teal transition-colors hover:opacity-80">
            Home
          </Link>
          <span>/</span>
          <span className="text-navy">Boeken</span>
        </nav>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pb-6">
        <h1 className="font-display text-3xl font-bold text-navy md:text-4xl">
          Afspraak maken
        </h1>
        <p className="mt-2 text-lg text-grey-dark">
          Kies je behandeling, specialist en tijdstip
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content - BookingForm */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-grey-light bg-white p-6 md:p-8">
              <BookingForm
                services={services}
                stylists={stylists}
                preselectedService={preselectedService}
                preselectedStylist={preselectedStylist}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <BookingSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingWizardTemplate
