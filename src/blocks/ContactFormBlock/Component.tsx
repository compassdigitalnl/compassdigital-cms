'use client'

import React, { useState } from 'react'
import type { ContactFormBlock } from '@/payload-types'
import { useRecaptcha } from '@/hooks/useRecaptcha'

type FormData = {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export const ContactFormBlockComponent: React.FC<ContactFormBlock> = ({ heading, intro }) => {
  const { executeRecaptcha, isConfigured } = useRecaptcha()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Naam is verplicht'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'E-mailadres is verplicht'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ongeldig e-mailadres'
    }

    // Phone validation (optional, but if provided, check format)
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Ongeldig telefoonnummer'
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Bericht is verplicht'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Bericht moet minimaal 10 karakters bevatten'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      // Get reCAPTCHA token (if configured)
      let recaptchaToken: string | null = null
      if (isConfigured) {
        recaptchaToken = await executeRecaptcha('contact_form')

        if (!recaptchaToken) {
          throw new Error('reCAPTCHA verification failed')
        }
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to send message')
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error('[Contact Form] Submission error:', error)
      setSubmitStatus('error')
      setErrorMessage(
        error instanceof Error && error.message.includes('reCAPTCHA')
          ? 'Spam verificatie mislukt. Probeer het opnieuw.'
          : 'Er is iets misgegaan. Probeer het later opnieuw.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <section className="contact-form py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        {heading && <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>}
        {intro && <p className="text-center mb-8 text-gray-600">{intro}</p>}

        {submitStatus === 'success' ? (
          <div className="p-6 rounded-lg text-center" style={{ backgroundColor: '#dcfce7', border: '2px solid #86efac' }}>
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#15803d' }}>Bericht verzonden!</h3>
            <p style={{ color: '#166534' }}>Bedankt voor uw bericht. We nemen zo snel mogelijk contact met u op.</p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="mt-4 px-6 py-2 rounded font-semibold"
              style={{ backgroundColor: '#22c55e', color: 'white' }}
            >
              Nog een bericht versturen
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block mb-2 font-semibold">
                Naam <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Uw naam"
              />
              {errors.name && <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-2 font-semibold">
                E-mailadres <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="uw.email@voorbeeld.nl"
              />
              {errors.email && <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>{errors.email}</p>}
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label htmlFor="phone" className="block mb-2 font-semibold">
                Telefoonnummer
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                  errors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="06 12345678"
              />
              {errors.phone && <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>{errors.phone}</p>}
            </div>

            {/* Subject Field (Optional) */}
            <div>
              <label htmlFor="subject" className="block mb-2 font-semibold">
                Onderwerp
              </label>
              <input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Waar gaat uw bericht over?"
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block mb-2 font-semibold">
                Bericht <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                rows={6}
                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 ${
                  errors.message ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Typ hier uw bericht..."
              />
              {errors.message && <p className="mt-1 text-sm" style={{ color: '#ef4444' }}>{errors.message}</p>}
            </div>

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="p-4 rounded" style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5' }}>
                <p style={{ color: '#dc2626' }}>{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 rounded font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: 'var(--color-primary, #3b82f6)' }}
            >
              {isSubmitting ? 'Bezig met verzenden...' : 'Verstuur bericht'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
