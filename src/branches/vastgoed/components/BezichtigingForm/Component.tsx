'use client'

import React, { useState } from 'react'
import type { BezichtigingFormProps, BezichtigingFormState } from './types'

const TIME_SLOTS = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30']

const initialState: BezichtigingFormState = {
  viewingType: 'fysiek',
  preferredDate: '',
  preferredTime: '',
  naam: '',
  email: '',
  telefoon: '',
  opmerking: '',
}

export const BezichtigingForm: React.FC<BezichtigingFormProps> = ({
  propertyId,
  propertyAddress,
  className = '',
}) => {
  const [form, setForm] = useState<BezichtigingFormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = <K extends keyof BezichtigingFormState>(
    key: K,
    value: BezichtigingFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/vastgoed/viewing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          viewingType: form.viewingType,
          preferredDate: form.preferredDate,
          preferredTime: form.preferredTime,
          firstName: form.naam.split(' ')[0],
          lastName: form.naam.split(' ').slice(1).join(' ') || '',
          email: form.email,
          phone: form.telefoon,
          remarks: form.opmerking || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Er is iets misgegaan. Probeer het opnieuw.')
      }

      setIsSuccess(true)
      setForm(initialState)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={`rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-7 text-center ${className}`}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green/10">
          <svg className="h-7 w-7 text-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-bold text-[var(--color-base-1000)]">
          Bezichtiging aangevraagd
        </h3>
        <p className="text-sm text-[var(--color-base-500)]">
          U ontvangt een bevestiging per e-mail. Wij nemen zo snel mogelijk contact met u op.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-4 text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          Nieuwe aanvraag
        </button>
      </div>
    )
  }

  return (
    <div
      className={`rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-7 ${className}`}
    >
      {/* Header */}
      <div className="mb-1.5 flex items-center gap-2.5">
        <svg
          className="h-5 w-5 text-[var(--color-primary)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
        <h3 className="text-xl font-extrabold text-[var(--color-base-1000)]">
          Bezichtiging plannen
        </h3>
      </div>
      <p className="mb-6 text-[13px] text-[var(--color-base-500)]">
        {propertyAddress
          ? `Plan een bezichtiging voor ${propertyAddress}`
          : 'Kies een datum en tijdstip'}
      </p>

      <form onSubmit={handleSubmit}>
        {/* Type toggle */}
        <div className="mb-5 flex gap-2">
          {(['fysiek', 'online'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateField('viewingType', type)}
              className={`flex-1 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-colors ${
                form.viewingType === type
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-base-200)] bg-[var(--color-base-50)] text-[var(--color-base-500)] hover:bg-[var(--color-base-100)]'
              }`}
            >
              {type === 'fysiek' ? 'Fysiek' : 'Online'}
            </button>
          ))}
        </div>

        {/* Date picker */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
            Gewenste datum
          </label>
          <input
            type="date"
            required
            value={form.preferredDate}
            onChange={(e) => updateField('preferredDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2.5 text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
          />
        </div>

        {/* Time slots */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
            Voorkeurstijd
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => updateField('preferredTime', slot)}
                className={`rounded-lg border px-3 py-2.5 text-center text-xs font-semibold transition-colors ${
                  form.preferredTime === slot
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                    : 'border-[var(--color-base-200)] bg-[var(--color-base-0)] text-[var(--color-base-700)] hover:bg-[var(--color-base-50)]'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Contact fields */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
            Naam
          </label>
          <input
            type="text"
            required
            value={form.naam}
            onChange={(e) => updateField('naam', e.target.value)}
            placeholder="Uw volledige naam"
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2.5 text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
              E-mail
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="uw@email.nl"
              className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2.5 text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
              Telefoon
            </label>
            <input
              type="tel"
              value={form.telefoon}
              onChange={(e) => updateField('telefoon', e.target.value)}
              placeholder="06-12345678"
              className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2.5 text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
            Opmerking (optioneel)
          </label>
          <textarea
            value={form.opmerking}
            onChange={(e) => updateField('opmerking', e.target.value)}
            placeholder="Heeft u specifieke wensen of vragen?"
            rows={3}
            className="w-full resize-y rounded-lg border border-[var(--color-base-200)] px-3 py-2.5 text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg bg-coral-50 px-4 py-3 text-sm text-coral-700">{error}</div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            'Bezig met versturen...'
          ) : (
            <>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="m9 16 2 2 4-4" />
              </svg>
              Bezichtiging aanvragen
            </>
          )}
        </button>

        <p className="mt-3 text-center text-[11px] text-[var(--color-base-400)]">
          U ontvangt een bevestiging per e-mail
        </p>
      </form>
    </div>
  )
}
