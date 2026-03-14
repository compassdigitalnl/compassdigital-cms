'use client'

import React, { useState, useCallback } from 'react'
import type { WorkshopBookingFormProps, WorkshopBookingFormData } from './types'

const STEPS = ['Service & Voertuig', 'Datum & Tijd', 'Gegevens']

const TIME_SLOTS = [
  { value: 'ochtend', label: 'Ochtend (08:00 - 12:00)' },
  { value: 'middag', label: 'Middag (13:00 - 17:00)' },
]

export const WorkshopBookingForm: React.FC<WorkshopBookingFormProps> = ({
  services,
  className = '',
}) => {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<WorkshopBookingFormData>({
    serviceId: null,
    licensePlate: '',
    vehicleInfo: '',
    date: '',
    timeSlot: 'ochtend',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    remarks: '',
  })
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)

  const selectedService = services.find((s) => s.id === formData.serviceId)

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const handleRdwLookup = useCallback(async () => {
    if (!formData.licensePlate.trim()) return
    setIsLookingUp(true)
    try {
      const res = await fetch('/api/automotive/rdw-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licensePlate: formData.licensePlate.replace(/[-\s]/g, '').toUpperCase() }),
      })
      const data = await res.json()
      if (data.success && data.vehicle) {
        setFormData((prev) => ({
          ...prev,
          vehicleInfo: `${data.vehicle.brand} ${data.vehicle.model} (${data.vehicle.year})`,
        }))
      }
    } catch {
      // RDW lookup is optional for workshop booking
    } finally {
      setIsLookingUp(false)
    }
  }, [formData.licensePlate])

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return formData.serviceId !== null
      case 1:
        return formData.date !== ''
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
      const res = await fetch('/api/automotive/workshop-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        setSubmitResult({
          success: true,
          message: 'Uw werkplaatsafspraak is ingepland! U ontvangt een bevestiging per e-mail.',
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
        <h3 className="mb-2 text-xl font-bold text-green-800">Afspraak bevestigd!</h3>
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
        <h3 className="text-lg font-bold text-white">Werkplaatsafspraak</h3>
        <p className="mt-1 text-sm text-white/70">Plan uw onderhouds- of reparatieafspraak</p>
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

        {/* Step 1: Service & vehicle */}
        {step === 0 && (
          <div>
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Kies een service *</label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, serviceId: service.id }))}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      formData.serviceId === service.id
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'border-[var(--color-base-200)] hover:border-[var(--color-base-400)]'
                    }`}
                  >
                    <div className={`text-sm font-semibold ${formData.serviceId === service.id ? 'text-[var(--color-primary)]' : 'text-[var(--color-base-800)]'}`}>
                      {service.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-base-500)]">
                      {service.price != null && <span>{formatPrice(service.price)}</span>}
                      {service.duration != null && <span>&middot; {service.duration} min</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Kenteken (optioneel)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                  placeholder="AB-123-CD"
                  maxLength={10}
                  className="flex-1 rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-sm font-bold tracking-wider text-[var(--color-base-1000)] uppercase focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
                <button
                  type="button"
                  onClick={handleRdwLookup}
                  disabled={isLookingUp || !formData.licensePlate.trim()}
                  className="shrink-0 rounded-lg bg-[var(--color-base-100)] px-4 py-3 text-sm font-medium text-[var(--color-base-700)] transition-colors hover:bg-[var(--color-base-200)] disabled:opacity-50"
                >
                  {isLookingUp ? 'Ophalen...' : 'Ophalen'}
                </button>
              </div>
              {formData.vehicleInfo && (
                <div className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                  {formData.vehicleInfo}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Date & time */}
        {step === 1 && (
          <div>
            {selectedService && (
              <div className="mb-5 rounded-lg bg-[var(--color-base-50,#f9fafb)] p-4 text-sm text-[var(--color-base-700)]">
                <span className="font-semibold">{selectedService.title}</span>
                {selectedService.price != null && <span> &middot; {formatPrice(selectedService.price)}</span>}
              </div>
            )}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Datum *</label>
              <input
                type="date"
                value={formData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Tijdvak *</label>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, timeSlot: slot.value as 'ochtend' | 'middag' }))}
                    className={`rounded-xl border p-3 text-left text-sm font-medium transition-all ${
                      formData.timeSlot === slot.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                        : 'border-[var(--color-base-200)] text-[var(--color-base-700)] hover:border-[var(--color-base-400)]'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
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

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Opmerkingen</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData((prev) => ({ ...prev, remarks: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                placeholder="Klachten, eerder onderhoud of andere bijzonderheden..."
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
              {isSubmitting ? 'Bezig...' : 'Afspraak inplannen'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkshopBookingForm
