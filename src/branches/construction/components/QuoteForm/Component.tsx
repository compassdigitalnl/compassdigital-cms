'use client'

import React, { useState } from 'react'
import type { QuoteFormProps, QuoteFormData } from './types'

export const QuoteForm: React.FC<QuoteFormProps> = ({
  onSuccess,
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<QuoteFormData>>({
    projectType: [],
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
    const currentArray = (formData[field as keyof QuoteFormData] as string[]) || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value]
    updateFormData(field, newArray)
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.projectType || formData.projectType.length === 0) {
        newErrors.projectType = 'Selecteer minimaal één projecttype'
      }
      if (!formData.projectDescription || formData.projectDescription.trim().length < 20) {
        newErrors.projectDescription = 'Geef een beschrijving van minimaal 20 tekens'
      }
    } else if (step === 2) {
      if (!formData.propertyType) {
        newErrors.propertyType = 'Selecteer een woningtype'
      }
      if (!formData.timeline) {
        newErrors.timeline = 'Selecteer een gewenste planning'
      }
      if (!formData.budget) {
        newErrors.budget = 'Selecteer een budgetindicatie'
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
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.projectType?.[0] || 'renovatie',
          budget: formData.budget,
          timeline: formData.timeline,
          description: formData.projectDescription,
          address: formData.address,
          postalCode: formData.postalCode,
          city: formData.city,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to submit quote request')
      }

      if (onSuccess) onSuccess(formData as QuoteFormData)
      setCurrentStep(5)
    } catch (error) {
      console.error('Error submitting quote request:', error)
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
        {/* Step 1: Project Basics */}
        {currentStep === 1 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="mb-8 text-2xl font-bold text-[var(--color-base-1000)] md:text-[1.75rem]">
              Wat voor soort project heeft u?
            </h2>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]">
                Projecttype (meerdere mogelijk)
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { value: 'new-construction', label: 'Nieuwbouw' },
                  { value: 'renovation', label: 'Renovatie' },
                  { value: 'extension', label: 'Aanbouw' },
                  { value: 'kitchen-bathroom', label: 'Keuken/Badkamer' },
                  { value: 'garage', label: 'Garage' },
                  { value: 'other', label: 'Anders' },
                ].map((type) => (
                  <label key={type.value} className={checkboxRadioClasses(formData.projectType?.includes(type.value) || false)}>
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer"
                      checked={formData.projectType?.includes(type.value)}
                      onChange={() => toggleArrayValue('projectType', type.value)}
                    />
                    <span className={`text-base ${formData.projectType?.includes(type.value) ? 'font-semibold text-[var(--color-base-1000)]' : 'text-[var(--color-base-700)]'}`}>
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.projectType && <span className="mt-2 block text-sm text-coral">{errors.projectType}</span>}
            </div>

            <div>
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="projectDescription">
                Beschrijf uw project
              </label>
              <textarea
                id="projectDescription"
                className={`${inputClasses} resize-y font-[inherit]`}
                rows={5}
                placeholder="Beschrijf zo gedetailleerd mogelijk wat u wilt laten doen..."
                value={formData.projectDescription || ''}
                onChange={(e) => updateFormData('projectDescription', e.target.value)}
              />
              {errors.projectDescription && <span className="mt-2 block text-sm text-coral">{errors.projectDescription}</span>}
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {currentStep === 2 && (
          <div className="animate-[fadeIn_0.3s_ease]">
            <h2 className="mb-8 text-2xl font-bold text-[var(--color-base-1000)] md:text-[1.75rem]">
              Vertel ons meer over het project
            </h2>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]">
                Type woning/gebouw
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { value: 'house', label: 'Woonhuis' },
                  { value: 'apartment', label: 'Appartement' },
                  { value: 'commercial', label: 'Bedrijfspand' },
                  { value: 'other', label: 'Anders' },
                ].map((type) => (
                  <label key={type.value} className={checkboxRadioClasses(formData.propertyType === type.value)}>
                    <input
                      type="radio"
                      name="propertyType"
                      className="h-5 w-5 cursor-pointer"
                      value={type.value}
                      checked={formData.propertyType === type.value}
                      onChange={(e) => updateFormData('propertyType', e.target.value)}
                    />
                    <span className={`text-base ${formData.propertyType === type.value ? 'font-semibold text-[var(--color-base-1000)]' : 'text-[var(--color-base-700)]'}`}>
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.propertyType && <span className="mt-2 block text-sm text-coral">{errors.propertyType}</span>}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="squareMeters">
                Oppervlakte (optioneel)
              </label>
              <div className="relative flex items-center">
                <input
                  id="squareMeters"
                  type="number"
                  className={`${inputClasses} pr-14`}
                  placeholder="Bijv. 150"
                  value={formData.squareMeters || ''}
                  onChange={(e) => updateFormData('squareMeters', parseInt(e.target.value))}
                />
                <span className="absolute right-4 text-base font-semibold text-[var(--color-base-600)]">m²</span>
              </div>
            </div>

            <div className="mb-6">
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
                <option value="1-3-months">Binnen 1-3 maanden</option>
                <option value="3-6-months">Binnen 3-6 maanden</option>
                <option value="6-12-months">Binnen 6-12 maanden</option>
                <option value="flexible">Flexibel</option>
              </select>
              {errors.timeline && <span className="mt-2 block text-sm text-coral">{errors.timeline}</span>}
            </div>

            <div>
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]">
                Budgetindicatie
              </label>
              <select
                className={`${inputClasses} cursor-pointer`}
                value={formData.budget || ''}
                onChange={(e) => updateFormData('budget', e.target.value)}
              >
                <option value="">Selecteer...</option>
                <option value="0-10k">€ 0 - € 10.000</option>
                <option value="10-25k">€ 10.000 - € 25.000</option>
                <option value="25-50k">€ 25.000 - € 50.000</option>
                <option value="50-100k">€ 50.000 - € 100.000</option>
                <option value="100k+">€ 100.000+</option>
                <option value="unknown">Nog niet bekend</option>
              </select>
              {errors.budget && <span className="mt-2 block text-sm text-coral">{errors.budget}</span>}
            </div>
          </div>
        )}

        {/* Step 3: Contact Details */}
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
              <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="address">
                Adres projectlocatie (optioneel)
              </label>
              <input
                id="address"
                type="text"
                className={inputClasses}
                placeholder="Straat en huisnummer"
                value={formData.address || ''}
                onChange={(e) => updateFormData('address', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr]">
              <div>
                <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="postalCode">
                  Postcode
                </label>
                <input
                  id="postalCode"
                  type="text"
                  className={inputClasses}
                  placeholder="1234 AB"
                  value={formData.postalCode || ''}
                  onChange={(e) => updateFormData('postalCode', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-base font-semibold text-[var(--color-base-800)]" htmlFor="city">
                  Plaats
                </label>
                <input
                  id="city"
                  type="text"
                  className={inputClasses}
                  placeholder="Amsterdam"
                  value={formData.city || ''}
                  onChange={(e) => updateFormData('city', e.target.value)}
                />
              </div>
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
                Gewenste datum voor kennismaking (optioneel)
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
              We hebben uw offerte-aanvraag ontvangen en nemen zo spoedig mogelijk contact met u op.
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

export default QuoteForm
