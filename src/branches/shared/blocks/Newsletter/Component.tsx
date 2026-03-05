'use client'

import React, { useState } from 'react'
import { CheckCircle, Loader2, Lock } from 'lucide-react'

/**
 * B31 - Newsletter Block Component
 *
 * Email newsletter signup with success states and privacy messaging.
 *
 * FEATURES:
 * - Horizontal inline form (email input + button)
 * - 4 background color variants (white, grey, teal, navy)
 * - Email validation
 * - Success state with checkmark icon
 * - Custom success/error messages
 * - Privacy reassurance text
 * - Responsive: button full-width on mobile
 *
 * @see src/branches/shared/blocks/Newsletter/config.ts
 * @see docs/refactoring/sprint-7/b31-newsletter.html
 */

interface NewsletterBlockProps {
  title: string
  description?: string
  buttonLabel?: string
  placeholder?: string
  backgroundColor?: 'white' | 'grey' | 'teal' | 'navy'
  privacyText?: string
  successMessage?: string
  errorMessage?: string
}

export const NewsletterBlockComponent: React.FC<NewsletterBlockProps> = ({
  title,
  description,
  buttonLabel = 'Inschrijven',
  placeholder = 'Je email adres...',
  backgroundColor = 'teal',
  privacyText = 'We respecteren je privacy. Geen spam.',
  successMessage = 'Bedankt voor je inschrijving! Check je inbox.',
  errorMessage = 'Er ging iets mis. Probeer het opnieuw.',
}) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('Email is verplicht')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Ongeldig email adres')
      return false
    }
    setEmailError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Submit to newsletter API endpoint
      // For now, we'll use the contact API with a newsletter type
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'newsletter',
          message: `Newsletter subscription request from ${email}`,
        }),
      })

      if (!response.ok) {
        throw new Error('Newsletter subscription failed')
      }

      setSubmitStatus('success')
      setEmail('')
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Background variant styles
  const bgVariants = {
    white: 'bg-white',
    grey: 'bg-grey-light',
    teal: 'bg-gradient-to-r from-teal to-teal-dark',
    navy: 'bg-gradient-to-r from-navy to-navy-light',
  }

  const textVariants = {
    white: 'text-navy',
    grey: 'text-navy',
    teal: 'text-white',
    navy: 'text-white',
  }

  const textSecondaryVariants = {
    white: 'text-grey-dark',
    grey: 'text-grey-dark',
    teal: 'text-white/90',
    navy: 'text-white/90',
  }

  const inputVariants = {
    white: 'bg-grey-light border-grey text-navy placeholder:text-grey-mid focus:border-teal focus:ring-teal/20',
    grey: 'bg-white border-grey text-navy placeholder:text-grey-mid focus:border-teal focus:ring-teal/20',
    teal: 'bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20',
    navy: 'bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20',
  }

  const buttonVariants = {
    white: 'btn btn-primary',
    grey: 'btn btn-primary',
    teal: 'btn btn-outline-neutral',
    navy: 'btn btn-primary',
  }

  return (
    <section className={`py-16 md:py-20 ${bgVariants[backgroundColor]}`}>
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className={`font-display text-3xl md:text-4xl mb-3 ${textVariants[backgroundColor]}`}>
              {title}
            </h2>
            {description && (
              <p className={`text-base ${textSecondaryVariants[backgroundColor]}`}>
                {description}
              </p>
            )}
          </div>

          {/* Success State */}
          {submitStatus === 'success' ? (
            <div className={`${
              backgroundColor === 'white' || backgroundColor === 'grey'
                ? 'bg-green-light border-green text-green'
                : 'bg-white/10 border-white/30 text-white'
            } border rounded-xl p-8 text-center`}>
              <CheckCircle className={`w-16 h-16 mx-auto mb-4 ${
                backgroundColor === 'white' || backgroundColor === 'grey'
                  ? 'text-green'
                  : 'text-white'
              }`} />
              <h3 className={`text-lg font-bold mb-2 ${
                backgroundColor === 'white' || backgroundColor === 'grey'
                  ? 'text-green'
                  : 'text-white'
              }`}>
                Gelukt!
              </h3>
              <p className={`text-[13px] ${
                backgroundColor === 'white' || backgroundColor === 'grey'
                  ? 'text-green'
                  : 'text-white/90'
              }`}>
                {successMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input + Button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError('')
                      if (submitStatus === 'error') setSubmitStatus('idle')
                    }}
                    placeholder={placeholder}
                    className={`w-full px-5 py-3.5 text-[13px] border rounded-lg outline-none transition-colors ${inputVariants[backgroundColor]} focus:ring-2`}
                  />
                  {emailError && (
                    <p className={`mt-1.5 text-[11px] ${
                      backgroundColor === 'white' || backgroundColor === 'grey'
                        ? 'text-coral'
                        : 'text-white/90'
                    }`}>
                      {emailError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`whitespace-nowrap ${buttonVariants[backgroundColor]}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Even geduld...
                    </>
                  ) : (
                    buttonLabel
                  )}
                </button>
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className={`${
                  backgroundColor === 'white' || backgroundColor === 'grey'
                    ? 'bg-coral-light border-coral text-coral'
                    : 'bg-white/10 border-white/30 text-white'
                } border rounded-lg p-4 text-center`}>
                  <p className="text-[13px] font-semibold">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Privacy Text */}
              {privacyText && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Lock className={`w-3.5 h-3.5 ${textSecondaryVariants[backgroundColor]}`} />
                  <p className={`text-[11px] ${textSecondaryVariants[backgroundColor]}`}>
                    {privacyText}
                  </p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default NewsletterBlockComponent
