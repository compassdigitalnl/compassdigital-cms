/**
 * QuoteForm Component
 *
 * Multi-step form for construction quote requests.
 * Features: Project type selection, timeline, budget, contact details, file uploads.
 */

'use client'

import React, { useState } from 'react'
import './styles.scss'

export interface QuoteFormProps {
  onSuccess?: (data: QuoteFormData) => void
  className?: string
}

export interface QuoteFormData {
  // Step 1: Project basics
  projectType: string[]
  projectDescription: string

  // Step 2: Project details
  propertyType: string
  squareMeters?: number
  timeline: string
  budget: string

  // Step 3: Contact
  name: string
  email: string
  phone: string
  address?: string
  postalCode?: string
  city?: string

  // Step 4: Preferences
  contactMethod: string
  preferredDate?: string
  additionalNotes?: string
}

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

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Toggle array value (for checkboxes)
  const toggleArrayValue = (field: string, value: string) => {
    const currentArray = (formData[field as keyof QuoteFormData] as string[]) || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value]
    updateFormData(field, newArray)
  }

  // Validate current step
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

  // Next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  // Previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) {
      return
    }

    setIsSubmitting(true)

    try {
      // Submit to API
      const response = await fetch('/api/quote-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'website',
          status: 'new',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit quote request')
      }

      const data = await response.json()

      // Success callback
      if (onSuccess) {
        onSuccess(formData as QuoteFormData)
      }

      // Move to success step
      setCurrentStep(5)
    } catch (error) {
      console.error('Error submitting quote request:', error)
      setErrors({ submit: 'Er is iets misgegaan. Probeer het opnieuw.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`quote-form ${className}`}>
      {/* Progress bar */}
      {currentStep <= totalSteps && (
        <div className="quote-form__progress">
          <div className="quote-form__progress-bar">
            <div
              className="quote-form__progress-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <span className="quote-form__progress-text">
            Stap {currentStep} van {totalSteps}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="quote-form__form">
        {/* Step 1: Project Basics */}
        {currentStep === 1 && (
          <div className="quote-form__step">
            <h2 className="quote-form__step-title">Wat voor soort project heeft u?</h2>

            <div className="quote-form__field">
              <label className="quote-form__label">Projecttype (meerdere mogelijk)</label>
              <div className="quote-form__checkbox-grid">
                {[
                  { value: 'new-construction', label: 'Nieuwbouw' },
                  { value: 'renovation', label: 'Renovatie' },
                  { value: 'extension', label: 'Aanbouw' },
                  { value: 'kitchen-bathroom', label: 'Keuken/Badkamer' },
                  { value: 'garage', label: 'Garage' },
                  { value: 'other', label: 'Anders' },
                ].map((type) => (
                  <label key={type.value} className="quote-form__checkbox">
                    <input
                      type="checkbox"
                      checked={formData.projectType?.includes(type.value)}
                      onChange={() => toggleArrayValue('projectType', type.value)}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
              {errors.projectType && <span className="quote-form__error">{errors.projectType}</span>}
            </div>

            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="projectDescription">
                Beschrijf uw project
              </label>
              <textarea
                id="projectDescription"
                className="quote-form__textarea"
                rows={5}
                placeholder="Beschrijf zo gedetailleerd mogelijk wat u wilt laten doen..."
                value={formData.projectDescription || ''}
                onChange={(e) => updateFormData('projectDescription', e.target.value)}
              />
              {errors.projectDescription && <span className="quote-form__error">{errors.projectDescription}</span>}
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {currentStep === 2 && (
          <div className="quote-form__step">
            <h2 className="quote-form__step-title">Vertel ons meer over het project</h2>

            <div className="quote-form__field">
              <label className="quote-form__label">Type woning/gebouw</label>
              <div className="quote-form__radio-grid">
                {[
                  { value: 'house', label: 'Woonhuis' },
                  { value: 'apartment', label: 'Appartement' },
                  { value: 'commercial', label: 'Bedrijfspand' },
                  { value: 'other', label: 'Anders' },
                ].map((type) => (
                  <label key={type.value} className="quote-form__radio">
                    <input
                      type="radio"
                      name="propertyType"
                      value={type.value}
                      checked={formData.propertyType === type.value}
                      onChange={(e) => updateFormData('propertyType', e.target.value)}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
              {errors.propertyType && <span className="quote-form__error">{errors.propertyType}</span>}
            </div>

            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="squareMeters">
                Oppervlakte (optioneel)
              </label>
              <div className="quote-form__input-wrapper">
                <input
                  id="squareMeters"
                  type="number"
                  className="quote-form__input"
                  placeholder="Bijv. 150"
                  value={formData.squareMeters || ''}
                  onChange={(e) => updateFormData('squareMeters', parseInt(e.target.value))}
                />
                <span className="quote-form__input-suffix">m²</span>
              </div>
            </div>

            <div className="quote-form__field">
              <label className="quote-form__label">Gewenste planning</label>
              <select
                className="quote-form__select"
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
              {errors.timeline && <span className="quote-form__error">{errors.timeline}</span>}
            </div>

            <div className="quote-form__field">
              <label className="quote-form__label">Budgetindicatie</label>
              <select
                className="quote-form__select"
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
              {errors.budget && <span className="quote-form__error">{errors.budget}</span>}
            </div>
          </div>
        )}

        {/* Step 3: Contact Details */}
        {currentStep === 3 && (
          <div className="quote-form__step">
            <h2 className="quote-form__step-title">Hoe kunnen we u bereiken?</h2>

            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="name">
                Naam *
              </label>
              <input
                id="name"
                type="text"
                className="quote-form__input"
                placeholder="Voor- en achternaam"
                value={formData.name || ''}
                onChange={(e) => updateFormData('name', e.target.value)}
              />
              {errors.name && <span className="quote-form__error">{errors.name}</span>}
            </div>

            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="email">
                E-mailadres *
              </label>
              <input
                id="email"
                type="email"
                className="quote-form__input"
                placeholder="uw@email.nl"
                value={formData.email || ''}
                onChange={(e) => updateFormData('email', e.target.value)}
              />
              {errors.email && <span className="quote-form__error">{errors.email}</span>}
            </div>

            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="phone">
                Telefoonnummer *
              </label>
              <input
                id="phone"
                type="tel"
                className="quote-form__input"
                placeholder="06 12345678"
                value={formData.phone || ''}
                onChange={(e) => updateFormData('phone', e.target.value)}
              />
              {errors.phone && <span className="quote-form__error">{errors.phone}</span>}
            </div>

            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="address">
                Adres projectlocatie (optioneel)
              </label>
              <input
                id="address"
                type="text"
                className="quote-form__input"
                placeholder="Straat en huisnummer"
                value={formData.address || ''}
                onChange={(e) => updateFormData('address', e.target.value)}
              />
            </div>

            <div className="quote-form__field-row">
              <div className="quote-form__field">
                <label className="quote-form__label" htmlFor="postalCode">
                  Postcode
                </label>
                <input
                  id="postalCode"
                  type="text"
                  className="quote-form__input"
                  placeholder="1234 AB"
                  value={formData.postalCode || ''}
                  onChange={(e) => updateFormData('postalCode', e.target.value)}
                />
              </div>

              <div className="quote-form__field">
                <label className="quote-form__label" htmlFor="city">
                  Plaats
                </label>
                <input
                  id="city"
                  type="text"
                  className="quote-form__input"
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
          <div className="quote-form__step">
            <h2 className="quote-form__step-title">Laatste stap!</h2>

            <div className="quote-form__field">
              <label className="quote-form__label">Voorkeur voor contact</label>
              <div className="quote-form__radio-grid">
                {[
                  { value: 'phone', label: 'Telefonisch' },
                  { value: 'email', label: 'E-mail' },
                  { value: 'whatsapp', label: 'WhatsApp' },
                ].map((method) => (
                  <label key={method.value} className="quote-form__radio">
                    <input
                      type="radio"
                      name="contactMethod"
                      value={method.value}
                      checked={formData.contactMethod === method.value}
                      onChange={(e) => updateFormData('contactMethod', e.target.value)}
                    />
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="preferredDate">
                Gewenste datum voor kennismaking (optioneel)
              </label>
              <input
                id="preferredDate"
                type="date"
                className="quote-form__input"
                value={formData.preferredDate || ''}
                onChange={(e) => updateFormData('preferredDate', e.target.value)}
              />
            </div>

            <div className="quote-form__field">
              <label className="quote-form__label" htmlFor="additionalNotes">
                Aanvullende opmerkingen (optioneel)
              </label>
              <textarea
                id="additionalNotes"
                className="quote-form__textarea"
                rows={4}
                placeholder="Heeft u nog specifieke wensen of vragen?"
                value={formData.additionalNotes || ''}
                onChange={(e) => updateFormData('additionalNotes', e.target.value)}
              />
            </div>

            {errors.submit && (
              <div className="quote-form__error-message">
                {errors.submit}
              </div>
            )}
          </div>
        )}

        {/* Success Step */}
        {currentStep === 5 && (
          <div className="quote-form__success">
            <svg className="quote-form__success-icon" width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" fill="#10B981" opacity="0.1"/>
              <circle cx="32" cy="32" r="24" fill="#10B981"/>
              <path d="M20 32l8 8 16-16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="quote-form__success-title">Bedankt voor uw aanvraag!</h2>
            <p className="quote-form__success-message">
              We hebben uw offerte-aanvraag ontvangen en nemen zo spoedig mogelijk contact met u op.
              U ontvangt binnen 24 uur een bevestiging per e-mail.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep <= totalSteps && (
          <div className="quote-form__actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="quote-form__btn quote-form__btn--secondary"
                onClick={handlePrevious}
                disabled={isSubmitting}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Vorige
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                className="quote-form__btn quote-form__btn--primary"
                onClick={handleNext}
              >
                Volgende
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                className="quote-form__btn quote-form__btn--primary"
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
