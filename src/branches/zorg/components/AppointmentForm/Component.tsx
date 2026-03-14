'use client'

import React, { useState, useCallback } from 'react'
import type { AppointmentFormProps, AppointmentFormData } from './types'
import { trackZorgEvent } from '@/branches/zorg/lib/analytics'
import { generateTimeSlots, getInsuranceLabel } from '@/branches/zorg/lib/appointmentUtils'

const STEPS = ['Behandeling', 'Datum & Tijd', 'Gegevens']

const INSURANCE_PROVIDERS = [
  { value: '', label: 'Selecteer verzekeraar...' },
  { value: 'zilveren_kruis', label: 'Zilveren Kruis' },
  { value: 'vgz', label: 'VGZ' },
  { value: 'cz', label: 'CZ' },
  { value: 'menzis', label: 'Menzis' },
  { value: 'ohra', label: 'OHRA' },
  { value: 'dsr', label: 'DSW' },
  { value: 'eno', label: 'ENO' },
  { value: 'zorg_en_zekerheid', label: 'Zorg en Zekerheid' },
  { value: 'salland', label: 'Salland Zorgverzekeringen' },
  { value: 'anderzorg', label: 'AnderZorg' },
  { value: 'interpolis', label: 'Interpolis' },
  { value: 'unive', label: 'Univé' },
  { value: 'asr', label: 'a.s.r.' },
  { value: 'national_nederlanden', label: 'Nationale-Nederlanden' },
  { value: 'ditzo', label: 'Ditzo' },
  { value: 'other', label: 'Overige' },
]

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  treatments = [],
  practitioners = [],
  className = '',
}) => {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<AppointmentFormData>({
    treatmentSlug: '',
    practitionerSlug: '',
    date: '',
    time: '',
    period: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    insuranceProvider: '',
    complaint: '',
    hasReferral: false,
    remarks: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  // Get selected treatment to determine duration for time slots
  const selectedTreatment = treatments.find((t) => t.slug === formData.treatmentSlug)
  const slotDuration = selectedTreatment?.duration || 30

  const timeSlots = formData.date ? generateTimeSlots(formData.date, slotDuration) : []
  const morningSlots = timeSlots.filter((s) => s.period === 'ochtend')
  const afternoonSlots = timeSlots.filter((s) => s.period === 'middag')
  const isWeekend = timeSlots.length === 0 && formData.date !== ''

  React.useEffect(() => {
    trackZorgEvent('appointment_form_start')
  }, [])

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return formData.treatmentSlug !== ''
      case 1:
        return formData.date !== '' && formData.time !== ''
      case 2:
        return (
          formData.firstName !== '' &&
          formData.lastName !== '' &&
          formData.email !== '' &&
          formData.phone !== ''
        )
      default:
        return false
    }
  }, [step, formData])

  const handleNext = () => {
    if (canProceed() && step < STEPS.length - 1) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!canProceed()) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/zorg/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        trackZorgEvent('appointment_form_complete', {
          treatment: formData.treatmentSlug,
          practitioner: formData.practitionerSlug || 'geen-voorkeur',
        })
        setSubmitResult({
          success: true,
          message: 'Uw afspraak is ontvangen! U ontvangt een bevestiging per e-mail.',
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
      <div className={`rounded-xl border border-green-200 bg-green-50 p-8 text-center ${className}`}>
        <div className="mb-4 text-4xl">&#10003;</div>
        <h3 className="mb-2 text-xl font-bold text-green-800">Afspraak bevestigd!</h3>
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

      {/* Step 1: Behandeling & Behandelaar */}
      {step === 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-[var(--color-base-1000)]">Kies uw behandeling</h2>

          {/* Treatment selection */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">
              Behandeling *
            </label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {treatments.map((treatment) => (
                <button
                  key={treatment.slug}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, treatmentSlug: treatment.slug }))}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    formData.treatmentSlug === treatment.slug
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                      : 'border-[var(--color-base-200)] hover:border-[var(--color-base-400)]'
                  }`}
                >
                  <span className={`block text-sm font-semibold ${
                    formData.treatmentSlug === treatment.slug
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-base-1000)]'
                  }`}>
                    {treatment.title}
                  </span>
                  {treatment.duration && (
                    <span className="mt-0.5 block text-xs text-[var(--color-base-500)]">
                      {treatment.duration} min
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Practitioner selection (optional) */}
          {practitioners.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">
                Behandelaar <span className="text-[var(--color-base-400)]">(optioneel)</span>
              </label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, practitionerSlug: '' }))}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    formData.practitionerSlug === ''
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                      : 'border-[var(--color-base-200)] hover:border-[var(--color-base-400)]'
                  }`}
                >
                  <span className={`block text-sm font-semibold ${
                    formData.practitionerSlug === ''
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-base-1000)]'
                  }`}>
                    Geen voorkeur
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--color-base-500)]">
                    Eerste beschikbare behandelaar
                  </span>
                </button>
                {practitioners.map((prac) => (
                  <button
                    key={prac.slug}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, practitionerSlug: prac.slug }))}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      formData.practitionerSlug === prac.slug
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'border-[var(--color-base-200)] hover:border-[var(--color-base-400)]'
                    }`}
                  >
                    <span className={`block text-sm font-semibold ${
                      formData.practitionerSlug === prac.slug
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-base-1000)]'
                    }`}>
                      {prac.name}
                    </span>
                    {prac.role && (
                      <span className="mt-0.5 block text-xs text-[var(--color-base-500)]">
                        {prac.role}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Datum & Tijd */}
      {step === 1 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-[var(--color-base-1000)]">Kies datum en tijd</h2>

          {/* Date */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Datum *</label>
            <input
              type="date"
              value={formData.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value, time: '' }))}
              className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Weekend notice */}
          {isWeekend && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              De praktijk is in het weekend gesloten. Kies een dag van maandag t/m vrijdag.
            </div>
          )}

          {/* Time slots - Morning */}
          {morningSlots.length > 0 && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Ochtend</label>
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                {morningSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, time: slot.time, period: 'ochtend' }))}
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
          )}

          {/* Time slots - Afternoon */}
          {afternoonSlots.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Middag</label>
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                {afternoonSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, time: slot.time, period: 'middag' }))}
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
          )}
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
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Geboortedatum</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, birthDate: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Zorgverzekeraar</label>
              <select
                value={formData.insuranceProvider}
                onChange={(e) => setFormData((prev) => ({ ...prev, insuranceProvider: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              >
                {INSURANCE_PROVIDERS.map((provider) => (
                  <option key={provider.value} value={provider.value}>
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Klacht / reden van bezoek</label>
            <textarea
              value={formData.complaint}
              onChange={(e) => setFormData((prev) => ({ ...prev, complaint: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              placeholder="Beschrijf kort uw klacht of reden van bezoek..."
            />
          </div>

          {/* Referral */}
          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-base-700)]">
              <input
                type="checkbox"
                checked={formData.hasReferral}
                onChange={(e) => setFormData((prev) => ({ ...prev, hasReferral: e.target.checked }))}
                className="h-4 w-4 rounded border-[var(--color-base-300)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              Ik heb een verwijzing van de huisarts of specialist
            </label>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Opmerkingen</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData((prev) => ({ ...prev, remarks: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              placeholder="Eventuele opmerkingen..."
            />
          </div>

          {submitResult && !submitResult.success && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
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
            {isSubmitting ? 'Bezig...' : 'Afspraak inplannen'}
          </button>
        )}
      </div>
    </div>
  )
}

export default AppointmentForm
