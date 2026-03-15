'use client'

import React, { useState, useCallback } from 'react'
import type { ReservationFormProps, ReservationFormData } from './types'
import { trackHorecaEvent } from '@/branches/horeca/lib/analytics'
import { generateTimeSlots, formatGuests, formatOccasion, getPreferenceLabel } from '@/branches/horeca/lib/reservationUtils'
import type { TimeSlot } from '@/branches/horeca/lib/reservationUtils'

const STEPS = ['Datum & Tijd', 'Voorkeuren', 'Gegevens']

const OCCASIONS = [
  { value: 'regular', label: 'Gewoon diner' },
  { value: 'birthday', label: 'Verjaardag' },
  { value: 'anniversary', label: 'Jubileum' },
  { value: 'business', label: 'Zakelijk diner' },
  { value: 'romantic', label: 'Romantisch diner' },
  { value: 'group', label: 'Groepsdiner' },
  { value: 'other', label: 'Anders' },
]

const PREFERENCES = [
  { value: 'window', label: 'Raam' },
  { value: 'terrace', label: 'Terras' },
  { value: 'inside', label: 'Binnen' },
  { value: 'quiet', label: 'Rustig hoekje' },
  { value: 'bar', label: 'Aan de bar' },
]

export const ReservationForm: React.FC<ReservationFormProps> = ({ className = '' }) => {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<ReservationFormData>({
    date: '',
    time: '',
    guests: 2,
    occasion: 'regular',
    preferences: [],
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    remarks: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const timeSlots = generateTimeSlots()
  const lunchSlots = timeSlots.filter((s) => s.period === 'lunch')
  const dinnerSlots = timeSlots.filter((s) => s.period === 'diner')

  React.useEffect(() => {
    trackHorecaEvent('reservation_form_start')
  }, [])

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return formData.date !== '' && formData.time !== '' && formData.guests > 0
      case 1:
        return true // preferences are optional
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      default:
        return false
    }
  }, [step, formData])

  const handleNext = () => {
    if (canProceed() && step < STEPS.length - 1) {
      trackHorecaEvent('reservation_form_step', { step: step + 1, step_name: STEPS[step + 1] })
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const togglePreference = (pref: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }))
  }

  const handleSubmit = async () => {
    if (!canProceed()) return
    setIsSubmitting(true)
    trackHorecaEvent('reservation_form_submit')

    try {
      const res = await fetch('/api/horeca/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        trackHorecaEvent('reservation_form_success')
        setSubmitResult({
          success: true,
          message: 'Uw reservering is ontvangen! U ontvangt een bevestiging per e-mail.',
        })
      } else {
        setSubmitResult({
          success: false,
          message: data.error || 'Er ging iets mis. Probeer het opnieuw.',
        })
      }
    } catch {
      setSubmitResult({ success: false, message: 'Er ging iets mis. Probeer het opnieuw.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (submitResult?.success) {
    return (
      <div className={`rounded-xl border border-green/20 bg-green-50 p-8 text-center ${className}`}>
        <div className="mb-4 text-4xl">&#10003;</div>
        <h3 className="mb-2 text-xl font-bold text-green-800">Reservering bevestigd!</h3>
        <p className="text-green-700">{submitResult.message}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Progress Steps */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <button
              type="button"
              onClick={() => i < step && setStep(i)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                i === step
                  ? 'bg-[var(--color-primary)] text-white'
                  : i < step
                    ? 'bg-[var(--color-base-100)] text-[var(--color-primary)] cursor-pointer hover:bg-[var(--color-base-200)]'
                    : 'bg-[var(--color-base-100)] text-[var(--color-base-400)] cursor-default'
              }`}
              disabled={i > step}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {i < step ? '\u2713' : i + 1}
              </span>
              {label}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 shrink-0 ${i < step ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-base-200)]'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Datum, Tijd & Gasten */}
      {step === 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-[var(--color-base-1000)]">Datum, Tijd & Gasten</h2>

          {/* Date */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Datum *</label>
            <input
              type="date"
              value={formData.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Guests */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">
              Aantal gasten: <span className="font-bold text-[var(--color-primary)]">{formatGuests(formData.guests)}</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] text-lg font-bold text-[var(--color-base-700)] transition-colors hover:bg-[var(--color-base-100)]"
              >
                &minus;
              </button>
              <span className="w-12 text-center text-lg font-bold text-[var(--color-base-1000)]">
                {formData.guests}
              </span>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, guests: Math.min(20, prev.guests + 1) }))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] text-lg font-bold text-[var(--color-base-700)] transition-colors hover:bg-[var(--color-base-100)]"
              >
                +
              </button>
            </div>
          </div>

          {/* Time slots - Lunch */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Lunch</label>
            <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
              {lunchSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, time: slot.time }))}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    formData.time === slot.time
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-[var(--color-base-200)] text-[var(--color-base-700)] hover:border-[var(--color-base-400)]'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>

          {/* Time slots - Diner */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Diner</label>
            <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
              {dinnerSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, time: slot.time }))}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    formData.time === slot.time
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-[var(--color-base-200)] text-[var(--color-base-700)] hover:border-[var(--color-base-400)]'
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Voorkeuren */}
      {step === 1 && (
        <div>
          <h2 className="mb-2 text-xl font-bold text-[var(--color-base-1000)]">Voorkeuren</h2>
          <p className="mb-6 text-sm text-[var(--color-base-600)]">
            Optioneel — geef uw voorkeuren aan voor een perfecte avond.
          </p>

          {/* Occasion */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Gelegenheid</label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, occasion: occ.value }))}
                  className={`rounded-xl border p-3 text-left text-sm font-medium transition-all ${
                    formData.occasion === occ.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                      : 'border-[var(--color-base-200)] text-[var(--color-base-700)] hover:border-[var(--color-base-400)]'
                  }`}
                >
                  {occ.label}
                </button>
              ))}
            </div>
          </div>

          {/* Seating preferences */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Zitvoorkeur</label>
            <div className="flex flex-wrap gap-2">
              {PREFERENCES.map((pref) => (
                <button
                  key={pref.value}
                  type="button"
                  onClick={() => togglePreference(pref.value)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                    formData.preferences.includes(pref.value)
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-[var(--color-base-200)] text-[var(--color-base-700)] hover:border-[var(--color-base-400)]'
                  }`}
                >
                  {formData.preferences.includes(pref.value) && (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M13.3 4.7L6 12l-3.3-3.3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {pref.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Gegevens */}
      {step === 2 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-[var(--color-base-1000)]">Uw gegevens</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Voornaam *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                placeholder="Uw voornaam"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Achternaam *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                placeholder="Uw achternaam"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">E-mail *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                placeholder="uw@email.nl"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Telefoon *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                placeholder="06-12345678"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Opmerkingen</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData((prev) => ({ ...prev, remarks: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              placeholder="Allergieën, dieetwensen of andere bijzonderheden..."
            />
          </div>

          {submitResult && !submitResult.success && (
            <div className="mt-4 rounded-lg border border-coral/20 bg-coral-50 p-3 text-sm text-coral-700">
              {submitResult.message}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-colors ${
            step > 0
              ? 'bg-[var(--color-base-100)] text-[var(--color-base-700)] hover:bg-[var(--color-base-200)]'
              : 'invisible'
          }`}
        >
          Vorige
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            Volgende
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="rounded-lg bg-[var(--color-primary)] px-8 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Bezig...' : 'Reservering plaatsen'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ReservationForm
