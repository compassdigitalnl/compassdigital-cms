'use client'

import React, { useState, useCallback } from 'react'
import type { BookingFormProps, BookingFormData } from './types'
import { trackBeautyEvent } from '@/branches/beauty/lib/analytics'

const STEPS = ['Behandeling', 'Specialist', 'Datum & Tijd', 'Gegevens']

export const BookingForm: React.FC<BookingFormProps> = ({
  services,
  stylists = [],
  preselectedService,
  preselectedStylist,
  className = '',
}) => {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: null,
    staffMemberId: null,
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isFirstVisit: false,
    remarks: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Pre-select service from URL params
  React.useEffect(() => {
    if (preselectedService) {
      const service = services.find((s) => s.slug === preselectedService)
      if (service) {
        setFormData((prev) => ({ ...prev, serviceId: service.id }))
        setStep(1)
      }
    }
    if (preselectedStylist && stylists.length > 0) {
      const stylist = stylists.find((s) => s.slug === preselectedStylist)
      if (stylist) {
        setFormData((prev) => ({ ...prev, staffMemberId: stylist.id }))
      }
    }
    trackBeautyEvent('booking_form_start')
  }, [])

  const categories = [...new Set(services.map((s) => s.category).filter(Boolean))] as string[]
  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services

  const selectedService = services.find((s) => s.id === formData.serviceId)

  const canProceed = useCallback(() => {
    switch (step) {
      case 0: return formData.serviceId !== null
      case 1: return true // stylist is optional
      case 2: return formData.date !== '' && formData.time !== ''
      case 3: return formData.firstName && formData.lastName && formData.email && formData.phone
      default: return false
    }
  }, [step, formData])

  const handleNext = () => {
    if (canProceed() && step < STEPS.length - 1) {
      trackBeautyEvent('booking_form_step', { step: step + 1, step_name: STEPS[step + 1] })
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!canProceed()) return
    setIsSubmitting(true)
    trackBeautyEvent('booking_form_submit')

    try {
      const res = await fetch('/api/beauty/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        trackBeautyEvent('booking_form_success')
        setSubmitResult({ success: true, message: 'Je afspraak is aangevraagd! Je ontvangt een bevestiging per e-mail.' })
      } else {
        setSubmitResult({ success: false, message: data.error || 'Er ging iets mis. Probeer het opnieuw.' })
      }
    } catch {
      setSubmitResult({ success: false, message: 'Er ging iets mis. Probeer het opnieuw.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100)

  const formatDuration = (min: number) => {
    if (min < 60) return `${min} min`
    const h = Math.floor(min / 60)
    const m = min % 60
    return m > 0 ? `${h}u ${m}min` : `${h} uur`
  }

  // Success state
  if (submitResult?.success) {
    return (
      <div className={`rounded-xl border border-green/20 bg-green/5 p-8 text-center ${className}`}>
        <div className="mb-4 text-4xl">&#10003;</div>
        <h3 className="mb-2 text-xl font-bold text-green">Afspraak aangevraagd!</h3>
        <p className="text-green">{submitResult.message}</p>
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

      {/* Step 1: Behandeling */}
      {step === 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-[var(--color-base-1000)]">Kies een behandeling</h2>

          {/* Category pills */}
          {categories.length > 1 && (
            <div className="mb-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-base-100)] text-[var(--color-base-700)] hover:bg-[var(--color-base-200)]'
                }`}
              >
                Alle
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-base-100)] text-[var(--color-base-700)] hover:bg-[var(--color-base-200)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredServices.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, serviceId: service.id }))}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  formData.serviceId === service.id
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-sm'
                    : 'border-[var(--color-base-200)] bg-[var(--color-base-0)] hover:border-[var(--color-base-400)]'
                }`}
              >
                <div className="flex-1">
                  <div className="font-semibold text-[var(--color-base-1000)]">{service.title}</div>
                  <div className="mt-1 flex items-center gap-3 text-sm text-[var(--color-base-600)]">
                    {service.duration && <span>{formatDuration(service.duration)}</span>}
                    {service.price && <span className="font-medium text-[var(--color-primary)]">{formatPrice(service.price)}</span>}
                  </div>
                </div>
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    formData.serviceId === service.id
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-[var(--color-base-300)]'
                  }`}
                >
                  {formData.serviceId === service.id && (
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M13.3 4.7L6 12l-3.3-3.3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Specialist */}
      {step === 1 && (
        <div>
          <h2 className="mb-2 text-xl font-bold text-[var(--color-base-1000)]">Kies een specialist</h2>
          <p className="mb-6 text-sm text-[var(--color-base-600)]">Optioneel — wij wijzen een beschikbare specialist toe als je geen voorkeur hebt.</p>

          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, staffMemberId: null }))}
            className={`mb-3 w-full rounded-xl border p-4 text-left transition-all ${
              formData.staffMemberId === null
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                : 'border-[var(--color-base-200)] hover:border-[var(--color-base-400)]'
            }`}
          >
            <span className="font-medium text-[var(--color-base-1000)]">Geen voorkeur</span>
          </button>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {stylists.map((stylist) => (
              <button
                key={stylist.id}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, staffMemberId: stylist.id }))}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                  formData.staffMemberId === stylist.id
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-base-200)] hover:border-[var(--color-base-400)]'
                }`}
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--color-base-100)]">
                  {stylist.avatar?.url ? (
                    <img src={stylist.avatar.url} alt={stylist.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[var(--color-base-400)]">
                      {stylist.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[var(--color-base-1000)]">{stylist.name}</div>
                  {stylist.specialties && stylist.specialties.length > 0 && (
                    <div className="mt-0.5 text-xs text-[var(--color-base-600)]">
                      {stylist.specialties.slice(0, 3).map((s) => s.specialty).join(', ')}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Datum & Tijd */}
      {step === 2 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-[var(--color-base-1000)]">Kies datum en tijd</h2>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Datum</label>
            <input
              type="date"
              value={formData.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Tijd</label>
            <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
              {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, time }))}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    formData.time === time
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : 'border-[var(--color-base-200)] text-[var(--color-base-700)] hover:border-[var(--color-base-400)]'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Gegevens */}
      {step === 3 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-[var(--color-base-1000)]">Jouw gegevens</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Voornaam *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                placeholder="Je voornaam"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">Achternaam *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                placeholder="Je achternaam"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--color-base-700)]">E-mail *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                placeholder="je@email.nl"
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
              placeholder="Bijzonderheden of wensen..."
            />
          </div>

          <label className="mt-4 flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFirstVisit}
              onChange={(e) => setFormData((prev) => ({ ...prev, isFirstVisit: e.target.checked }))}
              className="h-5 w-5 rounded border-[var(--color-base-300)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span className="text-sm text-[var(--color-base-700)]">Dit is mijn eerste bezoek</span>
          </label>

          {submitResult && !submitResult.success && (
            <div className="mt-4 rounded-lg border border-coral/20 bg-coral/5 p-3 text-sm text-coral">
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
            {isSubmitting ? 'Bezig...' : 'Afspraak aanvragen'}
          </button>
        )}
      </div>
    </div>
  )
}

export default BookingForm
