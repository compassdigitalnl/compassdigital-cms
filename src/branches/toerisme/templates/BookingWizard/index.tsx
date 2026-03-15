'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import type { BookingWizardProps } from './types'

/**
 * BookingWizardTemplate - 3-staps boekingswizard (/boeken)
 *
 * Client component met form state.
 * 2-kolom: BookingForm (3-step wizard) + sidebar met boekingsoverzicht.
 * Stap 1: Selecteer reis of accommodatie
 * Stap 2: Reizigers, data
 * Stap 3: Persoonsgegevens (naam, email, telefoon)
 * Sidebar toont lopend totaal en geselecteerde items.
 */

function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price)
}

export function BookingWizardTemplate({
  tours = [],
  accommodations = [],
  preselectedTourId,
  preselectedAccommodationId,
}: BookingWizardProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    type: preselectedTourId ? 'tour' : preselectedAccommodationId ? 'accommodatie' : '',
    tourId: preselectedTourId ? String(preselectedTourId) : '',
    accommodationId: preselectedAccommodationId ? String(preselectedAccommodationId) : '',
    departureDate: '',
    returnDate: '',
    travelers: 2,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    travelInsurance: false,
    remarks: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const updateField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  // Find selected items
  const selectedTour = tours.find((t: any) => String(t.id) === formData.tourId) || null
  const selectedAccommodation = accommodations.find((a: any) => String(a.id) === formData.accommodationId) || null

  // Calculate total
  const calculateTotal = () => {
    let total = 0
    if (selectedTour?.price) {
      total += (selectedTour.earlyBirdPrice && selectedTour.earlyBirdPrice < selectedTour.price
        ? selectedTour.earlyBirdPrice
        : selectedTour.price) * formData.travelers
    }
    if (selectedAccommodation?.priceFrom && formData.departureDate && formData.returnDate) {
      const start = new Date(formData.departureDate)
      const end = new Date(formData.returnDate)
      const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
      total += selectedAccommodation.priceFrom * formData.travelers * nights
    }
    return total
  }

  const canProceed = () => {
    if (step === 1) {
      return formData.type && (formData.tourId || formData.accommodationId)
    }
    if (step === 2) {
      return formData.departureDate && formData.returnDate && formData.travelers >= 1
    }
    if (step === 3) {
      return formData.firstName && formData.lastName && formData.email && formData.phone
    }
    return false
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/toerisme/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: formData.tourId || undefined,
          accommodationId: formData.accommodationId || undefined,
          departureDate: formData.departureDate,
          returnDate: formData.returnDate,
          travelers: formData.travelers,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          travelInsurance: formData.travelInsurance,
          remarks: formData.remarks,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Er is een fout opgetreden')
        return
      }

      setSuccess(true)
    } catch (e) {
      setError('Er is een fout opgetreden bij het versturen van uw boeking')
    } finally {
      setSubmitting(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: 'var(--color-primary-glow, rgba(0,188,212,0.1))' }}
          >
            <svg className="h-10 w-10" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1
            className="mb-4 text-3xl font-bold"
            style={{
              color: 'var(--color-navy, #1a2b4a)',
              fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
            }}
          >
            Boeking ontvangen!
          </h1>
          <p className="mb-8 text-lg" style={{ color: 'var(--color-grey-dark, #475569)' }}>
            Bedankt voor uw boeking. U ontvangt binnen 24 uur een bevestiging per e-mail.
            Onze reisadviseurs nemen contact met u op voor de verdere afhandeling.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/reizen"
              className="rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Meer reizen bekijken
            </Link>
            <Link
              href="/"
              className="rounded-lg border px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-grey-dark, #475569)' }}
            >
              Naar homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const steps = [
    { number: 1, label: 'Reis kiezen' },
    { number: 2, label: 'Reizigers & Data' },
    { number: 3, label: 'Gegevens' },
  ]

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Boeken</span>
        </nav>
      </div>

      {/* Hero */}
      <section
        className="py-8 md:py-12"
        style={{ background: 'linear-gradient(135deg, var(--color-primary, #00BCD4), var(--color-secondary, #0097A7))' }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1
            className="text-3xl text-white md:text-4xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Boek uw reis
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-white/80">
            In drie eenvoudige stappen naar uw droomvakantie
          </p>
        </div>
      </section>

      {/* Progress steps */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-center gap-4">
          {steps.map((s, i) => (
            <React.Fragment key={s.number}>
              {i > 0 && (
                <div
                  className="h-0.5 w-12 md:w-24"
                  style={{ backgroundColor: step >= s.number ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)' }}
                />
              )}
              <button
                onClick={() => s.number < step && setStep(s.number)}
                className="flex items-center gap-2"
                disabled={s.number > step}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: step >= s.number ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                    color: step >= s.number ? '#fff' : 'var(--color-grey-mid, #94A3B8)',
                  }}
                >
                  {step > s.number ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s.number
                  )}
                </span>
                <span
                  className="hidden text-sm font-medium md:block"
                  style={{ color: step >= s.number ? 'var(--color-navy, #1a2b4a)' : 'var(--color-grey-mid, #94A3B8)' }}
                >
                  {s.label}
                </span>
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl border p-6 md:p-8"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              {/* Step 1: Select tour or accommodation */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2
                    className="text-xl font-bold"
                    style={{ color: 'var(--color-navy, #1a2b4a)', fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
                  >
                    Wat wilt u boeken?
                  </h2>

                  {/* Type selection */}
                  <div className="flex gap-4">
                    {[
                      { value: 'tour', label: 'Reis', icon: '✈️' },
                      { value: 'accommodatie', label: 'Accommodatie', icon: '🏨' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => {
                          updateField('type', type.value)
                          if (type.value === 'tour') updateField('accommodationId', '')
                          if (type.value === 'accommodatie') updateField('tourId', '')
                        }}
                        className="flex flex-1 flex-col items-center gap-2 rounded-xl border p-6 transition-colors"
                        style={{
                          borderColor: formData.type === type.value ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                          backgroundColor: formData.type === type.value ? 'var(--color-primary-glow, rgba(0,188,212,0.05))' : 'transparent',
                        }}
                      >
                        <span className="text-3xl">{type.icon}</span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: formData.type === type.value ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)' }}
                        >
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Tour selection */}
                  {formData.type === 'tour' && tours.length > 0 && (
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        Selecteer een reis
                      </label>
                      <select
                        value={formData.tourId}
                        onChange={(e) => updateField('tourId', e.target.value)}
                        className="w-full rounded-lg border p-3 text-sm"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      >
                        <option value="">Kies een reis...</option>
                        {tours.map((tour: any) => (
                          <option key={tour.id} value={tour.id}>
                            {tour.title} {tour.price ? `- ${formatPrice(tour.price)} p.p.` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Accommodation selection */}
                  {formData.type === 'accommodatie' && accommodations.length > 0 && (
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        Selecteer een accommodatie
                      </label>
                      <select
                        value={formData.accommodationId}
                        onChange={(e) => updateField('accommodationId', e.target.value)}
                        className="w-full rounded-lg border p-3 text-sm"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      >
                        <option value="">Kies een accommodatie...</option>
                        {accommodations.map((acc: any) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.name} {acc.priceFrom ? `- ${formatPrice(acc.priceFrom)} p.p.p.n.` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Travelers & dates */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2
                    className="text-xl font-bold"
                    style={{ color: 'var(--color-navy, #1a2b4a)', fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
                  >
                    Reizigers en data
                  </h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        Vertrekdatum *
                      </label>
                      <input
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => updateField('departureDate', e.target.value)}
                        className="w-full rounded-lg border p-3 text-sm"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        Retourdatum *
                      </label>
                      <input
                        type="date"
                        value={formData.returnDate}
                        onChange={(e) => updateField('returnDate', e.target.value)}
                        className="w-full rounded-lg border p-3 text-sm"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                        min={formData.departureDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Aantal reizigers *
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateField('travelers', Math.max(1, formData.travelers - 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition-colors"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      >
                        -
                      </button>
                      <span className="text-xl font-bold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {formData.travelers}
                      </span>
                      <button
                        onClick={() => updateField('travelers', Math.min(20, formData.travelers + 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border text-lg transition-colors"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      >
                        +
                      </button>
                      <span className="text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                        {formData.travelers === 1 ? 'reiziger' : 'reizigers'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.travelInsurance}
                        onChange={(e) => updateField('travelInsurance', e.target.checked)}
                        className="h-4 w-4 rounded"
                      />
                      <span className="text-sm" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        Reisverzekering gewenst
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 3: Personal details */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2
                    className="text-xl font-bold"
                    style={{ color: 'var(--color-navy, #1a2b4a)', fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
                  >
                    Uw gegevens
                  </h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        Voornaam *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className="w-full rounded-lg border p-3 text-sm"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                        placeholder="Uw voornaam"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        Achternaam *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className="w-full rounded-lg border p-3 text-sm"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                        placeholder="Uw achternaam"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        E-mailadres *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="w-full rounded-lg border p-3 text-sm"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                        placeholder="uw@email.nl"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        Telefoonnummer *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full rounded-lg border p-3 text-sm"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                        placeholder="06-12345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Opmerkingen
                    </label>
                    <textarea
                      value={formData.remarks}
                      onChange={(e) => updateField('remarks', e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border p-3 text-sm"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      placeholder="Bijzondere wensen of opmerkingen..."
                    />
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mt-4 rounded-lg border border-coral/20 bg-coral-50 p-3 text-sm text-coral-700">
                  {error}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="mt-8 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="rounded-lg border px-6 py-3 text-sm font-semibold transition-colors"
                    style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-grey-dark, #475569)' }}
                  >
                    Vorige
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    onClick={() => canProceed() && setStep(step + 1)}
                    disabled={!canProceed()}
                    className="rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Volgende
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed() || submitting}
                    className="rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {submitting ? 'Bezig met boeken...' : 'Boeking bevestigen'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Booking summary */}
          <aside className="lg:col-span-1">
            <div
              className="rounded-xl border p-6 lg:sticky lg:top-6"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3
                className="mb-4 text-lg font-semibold"
                style={{ color: 'var(--color-navy, #1a2b4a)' }}
              >
                Boekingsoverzicht
              </h3>

              {/* Selected item */}
              {selectedTour && (
                <div className="mb-4 rounded-lg p-3" style={{ backgroundColor: 'var(--color-primary-glow, rgba(0,188,212,0.05))' }}>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {selectedTour.title}
                  </div>
                  {selectedTour.duration && (
                    <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                      {selectedTour.duration} dagen
                    </div>
                  )}
                  {selectedTour.price && (
                    <div className="mt-1 text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                      {formatPrice(selectedTour.earlyBirdPrice && selectedTour.earlyBirdPrice < selectedTour.price ? selectedTour.earlyBirdPrice : selectedTour.price)} p.p.
                    </div>
                  )}
                </div>
              )}

              {selectedAccommodation && (
                <div className="mb-4 rounded-lg p-3" style={{ backgroundColor: 'var(--color-primary-glow, rgba(0,188,212,0.05))' }}>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {selectedAccommodation.name}
                  </div>
                  {selectedAccommodation.priceFrom && (
                    <div className="mt-1 text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                      {formatPrice(selectedAccommodation.priceFrom)} p.p.p.n.
                    </div>
                  )}
                </div>
              )}

              {!selectedTour && !selectedAccommodation && (
                <div className="mb-4 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                  Selecteer een reis of accommodatie om te beginnen.
                </div>
              )}

              {/* Summary details */}
              <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}>
                {formData.travelers > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Reizigers</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {formData.travelers}
                    </span>
                  </div>
                )}
                {formData.departureDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Vertrek</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {new Date(formData.departureDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                )}
                {formData.returnDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Retour</span>
                    <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      {new Date(formData.returnDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                )}
                {formData.travelInsurance && (
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Reisverzekering</span>
                    <span className="font-medium" style={{ color: 'var(--color-primary)' }}>Ja</span>
                  </div>
                )}
              </div>

              {/* Total */}
              {calculateTotal() > 0 && (
                <div className="mt-4 border-t pt-4" style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Geschat totaal
                    </span>
                    <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                    Definitieve prijs ontvangt u in de bevestiging
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default BookingWizardTemplate
