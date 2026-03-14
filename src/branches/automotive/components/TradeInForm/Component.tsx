'use client'

import React, { useState, useCallback } from 'react'
import type { TradeInFormProps, TradeInFormData, RdwVehicleInfo } from './types'

const CONDITION_OPTIONS = [
  { value: 'uitstekend', label: 'Uitstekend', description: 'Geen gebreken, als nieuw' },
  { value: 'goed', label: 'Goed', description: 'Lichte gebruikssporen' },
  { value: 'redelijk', label: 'Redelijk', description: 'Normale slijtage' },
  { value: 'matig', label: 'Matig', description: 'Zichtbare schade of gebreken' },
]

const STEPS = ['Kenteken', 'Voertuiginfo', 'Contactgegevens']

export const TradeInForm: React.FC<TradeInFormProps> = ({ className = '' }) => {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<TradeInFormData>({
    licensePlate: '',
    rdwInfo: null,
    mileage: 0,
    condition: 'goed',
    remarks: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleRdwLookup = useCallback(async () => {
    if (!formData.licensePlate.trim()) return
    setIsLookingUp(true)
    setLookupError(null)

    try {
      const res = await fetch('/api/automotive/rdw-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licensePlate: formData.licensePlate.replace(/[-\s]/g, '').toUpperCase() }),
      })
      const data = await res.json()

      if (data.success && data.vehicle) {
        const rdwInfo: RdwVehicleInfo = {
          brand: data.vehicle.brand || '',
          model: data.vehicle.model || '',
          year: data.vehicle.year || 0,
          fuelType: data.vehicle.fuelType || '',
        }
        setFormData((prev) => ({ ...prev, rdwInfo }))
        setStep(1)
      } else {
        setLookupError(data.error || 'Kenteken niet gevonden. Controleer het kenteken en probeer opnieuw.')
      }
    } catch {
      setLookupError('Er ging iets mis bij het ophalen. Probeer het opnieuw.')
    } finally {
      setIsLookingUp(false)
    }
  }, [formData.licensePlate])

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return formData.licensePlate.trim() !== '' && formData.rdwInfo !== null
      case 1:
        return formData.mileage > 0
      case 2:
        return (
          formData.firstName.trim() !== '' &&
          formData.lastName.trim() !== '' &&
          formData.email.trim() !== '' &&
          formData.phone.trim() !== ''
        )
      default:
        return false
    }
  }, [step, formData])

  const handleSubmit = async () => {
    if (!canProceed()) return
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/automotive/trade-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        setSubmitResult({
          success: true,
          message: 'Uw inruilaanvraag is ontvangen! Wij nemen zo snel mogelijk contact met u op.',
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
        <h3 className="mb-2 text-xl font-bold text-green-800">Aanvraag ontvangen!</h3>
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
        <h3 className="text-lg font-bold text-white">Auto inruilen</h3>
        <p className="mt-1 text-sm text-white/70">Voer uw kenteken in voor een vrijblijvende taxatie</p>
      </div>

      <div className="p-5 md:p-6">
        {/* Progress */}
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  i === step
                    ? 'bg-[var(--color-primary)] text-white'
                    : i < step
                      ? 'bg-[var(--color-base-100)] text-[var(--color-primary)] cursor-pointer hover:bg-[var(--color-base-200)]'
                      : 'bg-[var(--color-base-100)] text-[var(--color-base-400)] cursor-default'
                }`}
                disabled={i > step}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                  {i < step ? '\u2713' : i + 1}
                </span>
                {label}
              </button>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-6 shrink-0 ${i < step ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-base-200)]'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: License plate lookup */}
        {step === 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Kenteken *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) => setFormData((prev) => ({ ...prev, licensePlate: e.target.value.toUpperCase(), rdwInfo: null }))}
                placeholder="AB-123-CD"
                maxLength={10}
                className="flex-1 rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-lg font-bold tracking-wider text-[var(--color-base-1000)] uppercase focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
              <button
                type="button"
                onClick={handleRdwLookup}
                disabled={isLookingUp || !formData.licensePlate.trim()}
                className="shrink-0 rounded-lg bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isLookingUp ? 'Ophalen...' : 'Ophalen'}
              </button>
            </div>

            {lookupError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {lookupError}
              </div>
            )}

            {formData.rdwInfo && (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                <h4 className="mb-2 text-sm font-semibold text-green-800">Voertuig gevonden</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                  <div>
                    <span className="text-green-600">Merk:</span> {formData.rdwInfo.brand}
                  </div>
                  <div>
                    <span className="text-green-600">Model:</span> {formData.rdwInfo.model}
                  </div>
                  <div>
                    <span className="text-green-600">Bouwjaar:</span> {formData.rdwInfo.year}
                  </div>
                  <div>
                    <span className="text-green-600">Brandstof:</span> {formData.rdwInfo.fuelType}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Vehicle info */}
        {step === 1 && (
          <div>
            {formData.rdwInfo && (
              <div className="mb-5 rounded-lg bg-[var(--color-base-50,#f9fafb)] p-4 text-sm text-[var(--color-base-700)]">
                <span className="font-semibold">{formData.rdwInfo.brand} {formData.rdwInfo.model}</span>
                {' '}&middot; {formData.rdwInfo.year} &middot; {formData.rdwInfo.fuelType}
              </div>
            )}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Kilometerstand *</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.mileage || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mileage: Number(e.target.value) }))}
                  min={0}
                  placeholder="Bijv. 85000"
                  className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 pr-12 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-base-500)]">km</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Staat van het voertuig</label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {CONDITION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, condition: opt.value as TradeInFormData['condition'] }))}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      formData.condition === opt.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'border-[var(--color-base-200)] hover:border-[var(--color-base-400)]'
                    }`}
                  >
                    <div className={`text-sm font-medium ${formData.condition === opt.value ? 'text-[var(--color-primary)]' : 'text-[var(--color-base-800)]'}`}>
                      {opt.label}
                    </div>
                    <div className="text-xs text-[var(--color-base-500)]">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Opmerkingen</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData((prev) => ({ ...prev, remarks: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                placeholder="Eventuele schade, recente onderhoudsbeurten, accessoires..."
              />
            </div>
          </div>
        )}

        {/* Step 3: Contact details */}
        {step === 2 && (
          <div>
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

            {submitResult && !submitResult.success && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submitResult.message}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => step > 0 && setStep(step - 1)}
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
              onClick={() => canProceed() && setStep(step + 1)}
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
              {isSubmitting ? 'Bezig...' : 'Inruilaanvraag versturen'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TradeInForm
