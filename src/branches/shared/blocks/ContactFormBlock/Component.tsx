'use client'

import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useRecaptcha } from '@/hooks/useRecaptcha'

/**
 * B25 - ContactForm Block Component
 *
 * Full-featured contact form with configurable fields and contact info sidebar.
 *
 * FEATURES:
 * - Form fields: name, email, phone (optional), subject (optional), message
 * - Configurable field visibility (showPhone, showSubject)
 * - Client-side validation with error messages
 * - Form submission to /api/contact endpoint
 * - Success/error states with custom messages
 * - Contact info sidebar (phone, email, address, hours)
 * - 2-column responsive layout (form left, sidebar right)
 * - reCAPTCHA integration for spam protection
 * - Loading state with spinner
 *
 * @see src/branches/shared/blocks/ContactFormBlock/config.ts
 * @see docs/refactoring/sprint-7/b25-contactform.html
 */

interface ContactInfo {
  phone?: string
  email?: string
  address?: string
  hours?: string
}

interface ContactFormBlockProps {
  title?: string
  description?: string
  showPhone?: boolean
  showSubject?: boolean
  submitTo: string
  contactInfo?: ContactInfo
  successMessage?: string
  errorMessage?: string
}

interface FormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export const ContactFormBlockComponent: React.FC<ContactFormBlockProps> = ({
  title = 'Neem contact op',
  description,
  showPhone = true,
  showSubject = true,
  submitTo,
  contactInfo,
  successMessage = 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
  errorMessage = 'Er ging iets mis. Probeer het opnieuw of neem direct contact op.',
}) => {
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

    // Phone validation (if shown and provided)
    if (showPhone && formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
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
          submitTo,
          recaptchaToken,
        }),
      })

      if (!response.ok) {
        throw new Error('Form submission failed')
      }

      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
      setErrors({})
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const hasContactInfo = contactInfo && (contactInfo.phone || contactInfo.email || contactInfo.address || contactInfo.hours)

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl text-navy mb-3">
            {title}
          </h2>
          {description && (
            <p className="text-base text-grey-dark max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Form Grid */}
        <div className={`max-w-6xl mx-auto grid grid-cols-1 ${hasContactInfo ? 'lg:grid-cols-3' : ''} gap-12`}>
          {/* Contact Form */}
          <div className={hasContactInfo ? 'lg:col-span-2' : 'max-w-2xl mx-auto w-full'}>
            {submitStatus === 'success' ? (
              <div className="bg-green-50 border border-green-500 rounded-xl p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-green-900 mb-2">
                  Bericht verstuurd!
                </h3>
                <p className="text-[13px] text-green-700 mb-6">
                  {successMessage}
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="text-[13px] font-semibold text-green-600 hover:text-green-700 transition-colors"
                >
                  Nieuw bericht verzenden →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-navy mb-2">
                      Naam *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange('name')}
                      className={`w-full px-4 py-3 text-[13px] border rounded-lg transition-colors ${
                        errors.name
                          ? 'border-coral bg-coral-50'
                          : 'border-grey bg-white hover:border-grey-dark focus:border-teal focus:ring-2 focus:ring-teal/20'
                      } outline-none`}
                      placeholder="Je volledige naam"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-[11px] text-coral">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange('email')}
                      className={`w-full px-4 py-3 text-[13px] border rounded-lg transition-colors ${
                        errors.email
                          ? 'border-coral bg-coral-50'
                          : 'border-grey bg-white hover:border-grey-dark focus:border-teal focus:ring-2 focus:ring-teal/20'
                      } outline-none`}
                      placeholder="je@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-[11px] text-coral">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone & Subject Row (conditional) */}
                {(showPhone || showSubject) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Phone */}
                    {showPhone && (
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-navy mb-2">
                          Telefoon
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange('phone')}
                          className={`w-full px-4 py-3 text-[13px] border rounded-lg transition-colors ${
                            errors.phone
                              ? 'border-coral bg-coral-50'
                              : 'border-grey bg-white hover:border-grey-dark focus:border-teal focus:ring-2 focus:ring-teal/20'
                          } outline-none`}
                          placeholder="020 - 123 45 67"
                        />
                        {errors.phone && (
                          <p className="mt-1.5 text-[11px] text-coral">{errors.phone}</p>
                        )}
                      </div>
                    )}

                    {/* Subject */}
                    {showSubject && (
                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-navy mb-2">
                          Onderwerp
                        </label>
                        <input
                          type="text"
                          id="subject"
                          value={formData.subject}
                          onChange={handleChange('subject')}
                          className="w-full px-4 py-3 text-[13px] border border-grey bg-white hover:border-grey-dark focus:border-teal focus:ring-2 focus:ring-teal/20 rounded-lg outline-none transition-colors"
                          placeholder="Waar gaat je vraag over?"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-navy mb-2">
                    Bericht *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange('message')}
                    rows={6}
                    className={`w-full px-4 py-3 text-[13px] border rounded-lg transition-colors resize-none ${
                      errors.message
                        ? 'border-coral bg-coral-50'
                        : 'border-grey bg-white hover:border-grey-dark focus:border-teal focus:ring-2 focus:ring-teal/20'
                    } outline-none`}
                    placeholder="Beschrijf je vraag of opmerking..."
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-[11px] text-coral">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-3.5 bg-teal text-white text-sm font-bold rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verzenden...
                      </>
                    ) : (
                      'Verstuur bericht'
                    )}
                  </button>
                </div>

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="bg-coral-50 border border-coral rounded-lg p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-coral-900 mb-1">
                        Er ging iets mis
                      </p>
                      <p className="text-[13px] text-coral-700">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Contact Info Sidebar */}
          {hasContactInfo && (
            <div className="bg-grey-light rounded-xl p-6 space-y-5">
              <h3 className="font-bold text-base text-navy mb-4">
                Contact informatie
              </h3>

              {contactInfo!.phone && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-grey-dark uppercase tracking-wide mb-1">
                      Telefoon
                    </p>
                    <a
                      href={`tel:${contactInfo!.phone.replace(/\s/g, '')}`}
                      className="text-sm font-semibold text-navy hover:text-teal transition-colors"
                    >
                      {contactInfo!.phone}
                    </a>
                  </div>
                </div>
              )}

              {contactInfo!.email && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-grey-dark uppercase tracking-wide mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${contactInfo!.email}`}
                      className="text-sm font-semibold text-navy hover:text-teal transition-colors break-all"
                    >
                      {contactInfo!.email}
                    </a>
                  </div>
                </div>
              )}

              {contactInfo!.address && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-grey-dark uppercase tracking-wide mb-1">
                      Adres
                    </p>
                    <p className="text-[13px] text-navy whitespace-pre-line">
                      {contactInfo!.address}
                    </p>
                  </div>
                </div>
              )}

              {contactInfo!.hours && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-glow flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-teal" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-grey-dark uppercase tracking-wide mb-1">
                      Openingstijden
                    </p>
                    <p className="text-[13px] text-navy">
                      {contactInfo!.hours}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
