'use client'

import React, { useState } from 'react'
import type { BookingFormProps, BookingFormData } from './types'

const STEPS = [
  { number: 1, label: 'Reis & Accommodatie' },
  { number: 2, label: 'Reizigers & Data' },
  { number: 3, label: 'Persoonsgegevens' },
]

export const BookingForm: React.FC<BookingFormProps> = ({
  tours = [],
  accommodations = [],
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<BookingFormData>({
    tourId: undefined,
    accommodationId: undefined,
    departureDate: '',
    returnDate: '',
    travelers: 2,
    travelInsurance: false,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    remarks: '',
  })

  const updateField = <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canProceed = (): boolean => {
    if (currentStep === 1) {
      return !!(formData.tourId || formData.accommodationId)
    }
    if (currentStep === 2) {
      return !!(formData.departureDate && formData.returnDate && formData.travelers >= 1)
    }
    if (currentStep === 3) {
      return !!(formData.firstName && formData.lastName && formData.email && formData.phone)
    }
    return false
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/toerisme/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Er is een fout opgetreden')
      }

      setIsSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={`rounded-2xl border border-green/20 bg-green/5 p-8 text-center ${className}`}>
        <div className="mb-4 text-4xl">✅</div>
        <h3 className="mb-2 text-xl font-bold text-green">Boeking ontvangen!</h3>
        <p className="text-sm text-green">
          Bedankt voor uw boeking. U ontvangt binnen 24 uur een bevestiging per e-mail.
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] ${className}`}>
      {/* Progress indicator */}
      <div className="border-b border-[var(--color-base-200)] p-4 md:p-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    currentStep >= step.number
                      ? 'text-white'
                      : 'border-2 border-[var(--color-base-300)] text-[var(--color-base-400)]'
                  }`}
                  style={currentStep >= step.number ? { backgroundColor: 'var(--color-primary)' } : undefined}
                >
                  {step.number}
                </div>
                <span
                  className={`hidden text-sm font-medium md:block ${
                    currentStep >= step.number
                      ? 'text-[var(--color-base-1000)]'
                      : 'text-[var(--color-base-400)]'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 ${
                    currentStep > step.number
                      ? 'bg-[var(--color-primary)]'
                      : 'bg-[var(--color-base-200)]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="p-4 md:p-6">
        {error && (
          <div className="mb-4 rounded-lg border border-coral/20 bg-coral-50 p-3 text-sm text-coral-700">
            {error}
          </div>
        )}

        {/* Step 1: Reis & Accommodatie */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="mb-4 text-lg font-bold text-[var(--color-base-1000)]">
              Selecteer uw reis of accommodatie
            </h3>

            {tours.length > 0 && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-base-700)]">
                  Reis
                </label>
                <select
                  value={formData.tourId ?? ''}
                  onChange={(e) => updateField('tourId', e.target.value || undefined)}
                  className="w-full rounded-lg border border-[var(--color-base-200)] px-4 py-3 text-sm"
                >
                  <option value="">Selecteer een reis (optioneel)</option>
                  {tours.map((tour) => (
                    <option key={tour.id} value={tour.id}>
                      {tour.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {accommodations.length > 0 && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-base-700)]">
                  Accommodatie
                </label>
                <select
                  value={formData.accommodationId ?? ''}
                  onChange={(e) => updateField('accommodationId', e.target.value || undefined)}
                  className="w-full rounded-lg border border-[var(--color-base-200)] px-4 py-3 text-sm"
                >
                  <option value="">Selecteer een accommodatie (optioneel)</option>
                  {accommodations.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Reizigers & Data */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="mb-4 text-lg font-bold text-[var(--color-base-1000)]">
              Reisdetails
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-base-700)]">
                  Vertrekdatum *
                </label>
                <input
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => updateField('departureDate', e.target.value)}
                  required
                  className="w-full rounded-lg border border-[var(--color-base-200)] px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-base-700)]">
                  Retourdatum *
                </label>
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => updateField('returnDate', e.target.value)}
                  required
                  className="w-full rounded-lg border border-[var(--color-base-200)] px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-base-700)]">
                Aantal reizigers *
              </label>
              <select
                value={formData.travelers}
                onChange={(e) => updateField('travelers', Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--color-base-200)] px-4 py-3 text-sm"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'reiziger' : 'reizigers'}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[var(--color-base-200)] p-4">
              <input
                type="checkbox"
                checked={formData.travelInsurance}
                onChange={(e) => updateField('travelInsurance', e.target.checked)}
                className="h-5 w-5 rounded border-[var(--color-base-300)] text-[var(--color-primary)]"
              />
              <div>
                <span className="text-sm font-medium text-[var(--color-base-1000)]">Reisverzekering</span>
                <p className="text-xs text-[var(--color-base-500)]">
                  Voeg een uitgebreide reisverzekering toe aan uw boeking
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Step 3: Persoonsgegevens */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="mb-4 text-lg font-bold text-[var(--color-base-1000)]">
              Uw gegevens
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-base-700)]">
                  Voornaam *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  required
                  className="w-full rounded-lg border border-[var(--color-base-200)] px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-base-700)]">
                  Achternaam *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  required
                  className="w-full rounded-lg border border-[var(--color-base-200)] px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-base-700)]">
                  E-mailadres *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  required
                  className="w-full rounded-lg border border-[var(--color-base-200)] px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-base-700)]">
                  Telefoonnummer *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  required
                  className="w-full rounded-lg border border-[var(--color-base-200)] px-4 py-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-base-700)]">
                Opmerkingen
              </label>
              <textarea
                value={formData.remarks}
                onChange={(e) => updateField('remarks', e.target.value)}
                rows={3}
                placeholder="Speciale wensen, dieetvereisten, etc."
                className="w-full rounded-lg border border-[var(--color-base-200)] px-4 py-3 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between border-t border-[var(--color-base-200)] p-4 md:p-6">
        {currentStep > 1 ? (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="rounded-lg border border-[var(--color-base-200)] px-6 py-2.5 text-sm font-medium text-[var(--color-base-700)] transition-colors hover:bg-[var(--color-base-50)]"
          >
            Vorige
          </button>
        ) : (
          <div />
        )}

        {currentStep < 3 ? (
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            disabled={!canProceed()}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Volgende
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {isSubmitting ? 'Bezig met boeken...' : 'Boek nu'}
          </button>
        )}
      </div>
    </div>
  )
}
