'use client'

import React, { useState } from 'react'
import type { TestDriveFormProps, TestDriveFormData } from './types'

const TIME_OPTIONS = [
  { value: 'ochtend', label: 'Ochtend (09:00 - 12:00)' },
  { value: 'middag', label: 'Middag (13:00 - 17:00)' },
]

export const TestDriveForm: React.FC<TestDriveFormProps> = ({
  vehicleId,
  vehicleTitle,
  className = '',
}) => {
  const [formData, setFormData] = useState<TestDriveFormData>({
    vehicleId,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: 'ochtend',
    remarks: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const canSubmit =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    formData.preferredDate !== ''

  const handleSubmit = async () => {
    if (!canSubmit) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/automotive/test-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        setSubmitResult({
          success: true,
          message: 'Uw proefrit is aangevraagd! U ontvangt een bevestiging per e-mail.',
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

  if (submitResult?.success) {
    return (
      <div className={`rounded-xl border border-green-200 bg-green-50 p-8 text-center ${className}`}>
        <div className="mb-4 text-4xl">&#10003;</div>
        <h3 className="mb-2 text-xl font-bold text-green-800">Proefrit aangevraagd!</h3>
        <p className="text-green-700">{submitResult.message}</p>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] ${className}`}>
      <div
        className="rounded-t-xl p-5"
        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-base-800))' }}
      >
        <h3 className="text-lg font-bold text-white">Proefrit aanvragen</h3>
        <p className="mt-1 text-sm text-white/70">{vehicleTitle}</p>
      </div>

      <div className="space-y-4 p-5 md:p-6">
        {/* Name */}
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
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        {/* Date & Time */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Voorkeursdatum *</label>
            <input
              type="date"
              value={formData.preferredDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData((prev) => ({ ...prev, preferredDate: e.target.value }))}
              className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Voorkeurstijd *</label>
            <select
              value={formData.preferredTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, preferredTime: e.target.value as 'ochtend' | 'middag' }))}
              className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            >
              {TIME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Opmerkingen</label>
          <textarea
            value={formData.remarks}
            onChange={(e) => setFormData((prev) => ({ ...prev, remarks: e.target.value }))}
            rows={3}
            className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            placeholder="Eventuele opmerkingen of vragen..."
          />
        </div>

        {submitResult && !submitResult.success && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitResult.message}
          </div>
        )}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Bezig met verzenden...' : 'Proefrit aanvragen'}
        </button>
      </div>
    </div>
  )
}

export default TestDriveForm
