'use client'

import React, { useState } from 'react'
import type { ConsultationFormProps, ConsultationFormData } from './types'

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<ConsultationFormData>>({
    serviceType: [],
    contactMethod: 'phone',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 4

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const toggleArrayValue = (field: string, value: string) => {
    const currentArray = (formData[field as keyof ConsultationFormData] as string[]) || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value]
    updateFormData(field, newArray)
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.serviceType || formData.serviceType.length === 0) {
        newErrors.serviceType = 'Selecteer minimaal één type dienstverlening'
      }
    } else if (step === 2) {
      if (!formData.projectDescription || formData.projectDescription.trim().length < 20) {
        newErrors.projectDescription = 'Geef een beschrijving van minimaal 20 tekens'
      }
      if (!formData.budget) {
        newErrors.budget = 'Selecteer een budgetindicatie'
      }
      if (!formData.timeline) {
        newErrors.timeline = 'Selecteer een gewenste planning'
      }
    } else if (step === 3) {
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = 'Vul uw naam in'
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Vul een geldig e-mailadres in'
      }
      if (!formData.phone || formData.phone.trim().length < 10) {
        newErrors.phone = 'Vul een geldig telefoonnummer in'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/consultation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          companyName: formData.companyName,
          website: formData.website,
          serviceType: formData.serviceType?.[0] || 'consultancy',
          budget: formData.budget,
          timeline: formData.timeline,
          description: formData.projectDescription,
          contactMethod: formData.contactMethod,
          preferredDate: formData.preferredDate,
          additionalNotes: formData.additionalNotes,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to submit consultation request')
      }

      if (onSuccess) onSuccess(formData as ConsultationFormData)
      setCurrentStep(5)
    } catch (error) {
      console.error('Error submitting consultation request:', error)
      setErrors({ submit: 'Er is iets misgegaan. Probeer het opnieuw.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClasses =
    'w-full rounded-lg border-2 border-[var(--color-base-300)] bg-[var(--color-base-0)] px-4 py-3.5 text-base text-[var(--color-base-1000)] transition-all placeholder:text-[var(--color-base-400)] focus:border-[var(--color-base-800)] focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)] focus:outline-none'

  const checkboxRadioClasses = (checked: boolean) =>
    `flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
      checked
        ? 'border-[var(--color-base-800)] bg-[var(--color-base-50)]'
        : 'border-[var(--color-base-300)] hover:border-[var(--color-base-400)]'
    }`

  return (
    <div className={`mx-auto max-w-[720px] ${className}`}>
      {/* Progress bar */}
      {currentStep <= totalSteps && (
        <div className="mb-12">
          <div className="relative mb-3 h-2 w-full overflow-hidden rounded-full bg-[var(--color-base-200)]">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[var(--color-base-800)] to-[var(--color-base-600)] transition-[width] duration-400"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <span className="block text-center text-sm font-semibold text-[var(--color-base-600)]">
            Stap {currentStep} van {totalSteps}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 md:p-12">
        {/* Step 1: Service Type */}
        {currentStep === 1 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="mb-8 text-2xl font-bold text-[var(--color-base-1000)] md:text-[1.75rem]">
              Welk type dienstverlening zoekt u?
            </h2>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]">
                Type dienstverlening (meerdere mogelijk)
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { value: 'accountancy', label: 'Accountancy & Boekhouding' },
                  { value: 'juridisch', label: 'Juridisch advies' },
                  { value: 'vastgoed', label: 'Vastgoed & Makelaardij' },
                  { value: 'marketing', label: 'Marketing & Communicatie' },
                  { value: 'it', label: 'IT & Digitalisering' },
                  { value: 'consultancy', label: 'Consultancy & Advies' },
                  { value: 'hr', label: 'HR & Personeelszaken' },
                  { value: 'anders', label: 'Anders' },
                ].map((type) => (
                  <label key={type.value} className={checkboxRadioClasses(formData.serviceType?.includes(type.value) || false)}>
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer"
                      checked={formData.serviceType?.includes(type.value)}
                      onChange={() => toggleArrayValue('serviceType', type.value)}
                    />
                    <span className={`text-base ${formData.serviceType?.includes(type.value) ? 'font-semibold text-[var(--color-base-1000)]' : 'text-[var(--color-base-700)]'}`}>
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.serviceType && <span className="mt-2 block text-sm text-coral">{errors.serviceType}</span>}
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {currentStep === 2 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="mb-8 text-2xl font-bold text-[var(--color-base-1000)] md:text-[1.75rem]">
              Vertel ons meer over uw vraag
            </h2>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="projectDescription">
                Beschrijf uw vraag of project
              </label>
              <textarea
                id="projectDescription"
                className={`${inputClasses} resize-y font-[inherit]`}
                rows={5}
                placeholder="Beschrijf zo gedetailleerd mogelijk wat u nodig heeft..."
                value={formData.projectDescription || ''}
                onChange={(e) => updateFormData('projectDescription', e.target.value)}
              />
              {errors.projectDescription && <span className="mt-2 block text-sm text-coral">{errors.projectDescription}</span>}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]">
                Budgetindicatie
              </label>
              <select
                className={`${inputClasses} cursor-pointer`}
                value={formData.budget || ''}
                onChange={(e) => updateFormData('budget', e.target.value)}
              >
                <option value="">Selecteer...</option>
                <option value="0-5k">Tot € 5.000</option>
                <option value="5-15k">€ 5.000 - € 15.000</option>
                <option value="15-50k">€ 15.000 - € 50.000</option>
                <option value="50-100k">€ 50.000 - € 100.000</option>
                <option value="100k+">€ 100.000+</option>
                <option value="unknown">Nog niet bekend</option>
              </select>
              {errors.budget && <span className="mt-2 block text-sm text-coral">{errors.budget}</span>}
            </div>

            <div>
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]">
                Gewenste planning
              </label>
              <select
                className={`${inputClasses} cursor-pointer`}
                value={formData.timeline || ''}
                onChange={(e) => updateFormData('timeline', e.target.value)}
              >
                <option value="">Selecteer...</option>
                <option value="asap">Zo snel mogelijk</option>
                <option value="1-4-weeks">Binnen 1-4 weken</option>
                <option value="1-3-months">Binnen 1-3 maanden</option>
                <option value="3-6-months">Binnen 3-6 maanden</option>
                <option value="flexible">Flexibel</option>
              </select>
              {errors.timeline && <span className="mt-2 block text-sm text-coral">{errors.timeline}</span>}
            </div>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {currentStep === 3 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="mb-8 text-2xl font-bold text-[var(--color-base-1000)] md:text-[1.75rem]">
              Hoe kunnen we u bereiken?
            </h2>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="name">
                Naam *
              </label>
              <input
                id="name"
                type="text"
                className={inputClasses}
                placeholder="Voor- en achternaam"
                value={formData.name || ''}
                onChange={(e) => updateFormData('name', e.target.value)}
              />
              {errors.name && <span className="mt-2 block text-sm text-coral">{errors.name}</span>}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="email">
                E-mailadres *
              </label>
              <input
                id="email"
                type="email"
                className={inputClasses}
                placeholder="uw@email.nl"
                value={formData.email || ''}
                onChange={(e) => updateFormData('email', e.target.value)}
              />
              {errors.email && <span className="mt-2 block text-sm text-coral">{errors.email}</span>}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="phone">
                Telefoonnummer *
              </label>
              <input
                id="phone"
                type="tel"
                className={inputClasses}
                placeholder="06 12345678"
                value={formData.phone || ''}
                onChange={(e) => updateFormData('phone', e.target.value)}
              />
              {errors.phone && <span className="mt-2 block text-sm text-coral">{errors.phone}</span>}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="companyName">
                Bedrijfsnaam (optioneel)
              </label>
              <input
                id="companyName"
                type="text"
                className={inputClasses}
                placeholder="Uw bedrijfsnaam"
                value={formData.companyName || ''}
                onChange={(e) => updateFormData('companyName', e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="website">
                Website (optioneel)
              </label>
              <input
                id="website"
                type="url"
                className={inputClasses}
                placeholder="https://www.uwbedrijf.nl"
                value={formData.website || ''}
                onChange={(e) => updateFormData('website', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 4: Preferences */}
        {currentStep === 4 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="mb-8 text-2xl font-bold text-[var(--color-base-1000)] md:text-[1.75rem]">
              Laatste stap!
            </h2>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]">
                Voorkeur voor contact
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { value: 'phone', label: 'Telefonisch' },
                  { value: 'email', label: 'E-mail' },
                  { value: 'whatsapp', label: 'WhatsApp' },
                ].map((method) => (
                  <label key={method.value} className={checkboxRadioClasses(formData.contactMethod === method.value)}>
                    <input
                      type="radio"
                      name="contactMethod"
                      className="h-5 w-5 cursor-pointer"
                      value={method.value}
                      checked={formData.contactMethod === method.value}
                      onChange={(e) => updateFormData('contactMethod', e.target.value)}
                    />
                    <span className={`text-base ${formData.contactMethod === method.value ? 'font-semibold text-[var(--color-base-1000)]' : 'text-[var(--color-base-700)]'}`}>
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="preferredDate">
                Gewenste datum voor adviesgesprek (optioneel)
              </label>
              <input
                id="preferredDate"
                type="date"
                className={inputClasses}
                value={formData.preferredDate || ''}
                onChange={(e) => updateFormData('preferredDate', e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="additionalNotes">
                Aanvullende opmerkingen (optioneel)
              </label>
              <textarea
                id="additionalNotes"
                className={`${inputClasses} resize-y font-[inherit]`}
                rows={4}
                placeholder="Heeft u nog specifieke wensen of vragen?"
                value={formData.additionalNotes || ''}
                onChange={(e) => updateFormData('additionalNotes', e.target.value)}
              />
            </div>

            {errors.submit && (
              <div className="mt-4 rounded-lg border border-coral/20 bg-coral-50 p-4 text-[0.9375rem] text-coral-700">
                {errors.submit}
              </div>
            )}
          </div>
        )}

        {/* Success Step */}
        {currentStep === 5 && (
          <div className="py-12 text-center">
            <svg className="mx-auto mb-8 animate-[scaleIn_0.5s_ease]" width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" fill="#10B981" opacity="0.1" />
              <circle cx="32" cy="32" r="24" fill="#10B981" />
              <path d="M20 32l8 8 16-16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 className="mb-4 text-2xl font-bold text-[var(--color-base-1000)] md:text-3xl">
              Bedankt voor uw aanvraag!
            </h2>
            <p className="mx-auto max-w-[500px] text-base leading-relaxed text-[var(--color-base-700)] md:text-lg">
              We hebben uw aanvraag voor een adviesgesprek ontvangen en nemen zo spoedig mogelijk contact met u op.
              U ontvangt binnen 24 uur een bevestiging per e-mail.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep <= totalSteps && (
          <div className="mt-8 flex flex-col gap-4 border-t border-[var(--color-base-200)] pt-8 sm:flex-row">
            {currentStep > 1 && (
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-base-100)] px-8 py-4 text-base font-semibold text-[var(--color-base-800)] transition-all hover:bg-[var(--color-base-200)] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Vorige
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                className="order-first inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-base-800)] px-8 py-4 text-base font-semibold text-[var(--color-base-0)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-base-1000)] hover:shadow-lg sm:order-none sm:ml-auto"
                onClick={handleNext}
              >
                Volgende
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                className="order-first inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-base-800)] px-8 py-4 text-base font-semibold text-[var(--color-base-0)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-base-1000)] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:order-none sm:ml-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Verzenden...' : 'Verstuur aanvraag'}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}

export default ConsultationForm
