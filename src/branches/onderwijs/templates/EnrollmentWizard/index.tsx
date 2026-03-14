'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatDuration, formatLevel, calculateDiscount } from '@/branches/onderwijs/lib/courseUtils'
import type { EnrollmentWizardProps } from './types'

/**
 * EnrollmentWizardTemplate - Inschrijfformulier voor een cursus (/cursussen/[slug]/inschrijven)
 *
 * Client component met multi-step wizard:
 * Stap 1: Account (nieuw/bestaand)
 * Stap 2: Betaling (iDEAL/creditcard/PayPal)
 * Stap 3: Bevestiging
 *
 * 2-kolom layout: form (main) + sidebar (cursus-samenvatting, prijs, garanties)
 */

type Step = 1 | 2 | 3

const steps = [
  { number: 1, label: 'Account' },
  { number: 2, label: 'Betaling' },
  { number: 3, label: 'Bevestiging' },
]

export function EnrollmentWizardTemplate({ course }: EnrollmentWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [enrollmentResult, setEnrollmentResult] = useState<{
    enrollmentNumber?: string
    courseSlug?: string
  } | null>(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    isNewAccount: true,
    paymentMethod: 'ideal' as 'ideal' | 'creditcard' | 'paypal',
    agreeTerms: false,
  })

  const thumbnail = typeof course.thumbnail === 'object' ? course.thumbnail : null
  const instructor = typeof course.instructor === 'object' ? course.instructor : null
  const discount = course.originalPrice && course.price
    ? calculateDiscount(course.price, course.originalPrice)
    : 0

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleStepOne = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Vul alle verplichte velden in')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Vul een geldig e-mailadres in')
      return
    }
    setCurrentStep(2)
  }

  const handleStepTwo = async () => {
    if (!formData.agreeTerms) {
      setError('Je moet akkoord gaan met de voorwaarden')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // Step 1: Create enrollment
      const enrollRes = await fetch('/api/onderwijs/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.isNewAccount ? formData.password : undefined,
          paymentMethod: formData.paymentMethod,
          isNewAccount: formData.isNewAccount,
        }),
      })

      if (!enrollRes.ok) {
        const enrollData = await enrollRes.json()
        throw new Error(enrollData.error || 'Inschrijving mislukt')
      }

      const enrollData = await enrollRes.json()

      // Step 2: Process payment
      const payRes = await fetch('/api/onderwijs/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: enrollData.enrollmentId,
          paymentMethod: formData.paymentMethod,
        }),
      })

      if (!payRes.ok) {
        const payData = await payRes.json()
        throw new Error(payData.error || 'Betaling mislukt')
      }

      const payData = await payRes.json()

      setEnrollmentResult({
        enrollmentNumber: payData.enrollmentNumber || enrollData.enrollmentNumber,
        courseSlug: payData.courseSlug || course.slug,
      })
      setCurrentStep(3)
    } catch (err: any) {
      setError(err.message || 'Er is een fout opgetreden')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/cursussen" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Cursussen
          </Link>
          <span>/</span>
          <Link href={`/cursussen/${course.slug}`} className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            {course.title}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Inschrijven</span>
        </nav>
      </div>

      {/* Progress stepper */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, idx) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: currentStep >= step.number ? 'var(--color-primary)' : 'var(--color-grey-light, #f1f5f9)',
                    color: currentStep >= step.number ? '#fff' : 'var(--color-grey-mid, #94A3B8)',
                  }}
                >
                  {currentStep > step.number ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </span>
                <span
                  className="hidden text-sm font-medium md:block"
                  style={{ color: currentStep >= step.number ? 'var(--color-navy, #1a2b4a)' : 'var(--color-grey-mid, #94A3B8)' }}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className="h-0.5 w-12 md:w-20"
                  style={{
                    backgroundColor: currentStep > step.number ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16 pt-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main form area */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl border p-6 md:p-8"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              {/* Step 1: Account */}
              {currentStep === 1 && (
                <>
                  <h2
                    className="mb-6 text-xl font-bold"
                    style={{
                      color: 'var(--color-navy, #1a2b4a)',
                      fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                    }}
                  >
                    Jouw gegevens
                  </h2>

                  {/* Account type toggle */}
                  <div className="mb-6 flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}>
                    <button
                      type="button"
                      onClick={() => updateField('isNewAccount', true)}
                      className="flex-1 px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: formData.isNewAccount ? 'var(--color-primary)' : 'transparent',
                        color: formData.isNewAccount ? '#fff' : 'var(--color-grey-dark, #475569)',
                      }}
                    >
                      Nieuw account
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField('isNewAccount', false)}
                      className="flex-1 px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: !formData.isNewAccount ? 'var(--color-primary)' : 'transparent',
                        color: !formData.isNewAccount ? '#fff' : 'var(--color-grey-dark, #475569)',
                      }}
                    >
                      Bestaand account
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                          Voornaam *
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          className="w-full rounded-lg border p-3 text-sm"
                          style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                          placeholder="Je voornaam"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                          Achternaam *
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          className="w-full rounded-lg border p-3 text-sm"
                          style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                          placeholder="Je achternaam"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        E-mailadres *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="w-full rounded-lg border p-3 text-sm"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                        placeholder="je@email.nl"
                        required
                      />
                    </div>

                    {formData.isNewAccount && (
                      <div>
                        <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                          Wachtwoord
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          className="w-full rounded-lg border p-3 text-sm"
                          style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                          placeholder="Kies een wachtwoord"
                        />
                        <p className="mt-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          Optioneel. Maak een account aan om je voortgang bij te houden.
                        </p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleStepOne}
                    className="mt-6 w-full rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Doorgaan naar betaling
                  </button>
                </>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <>
                  <h2
                    className="mb-6 text-xl font-bold"
                    style={{
                      color: 'var(--color-navy, #1a2b4a)',
                      fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                    }}
                  >
                    Betaalmethode kiezen
                  </h2>

                  <div className="space-y-3">
                    {[
                      { value: 'ideal' as const, label: 'iDEAL', description: 'Betaal veilig via je eigen bank' },
                      { value: 'creditcard' as const, label: 'Creditcard', description: 'Visa, Mastercard, American Express' },
                      { value: 'paypal' as const, label: 'PayPal', description: 'Betaal met je PayPal account' },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className="flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors"
                        style={{
                          borderColor: formData.paymentMethod === method.value ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                          backgroundColor: formData.paymentMethod === method.value ? 'rgba(37, 99, 235, 0.03)' : 'transparent',
                        }}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={(e) => updateField('paymentMethod', e.target.value)}
                          className="h-4 w-4 shrink-0"
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <div>
                          <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                            {method.label}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                            {method.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Terms */}
                  <div className="mt-6">
                    <label className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => updateField('agreeTerms', e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 rounded"
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <span>
                        Ik ga akkoord met de algemene voorwaarden en het privacybeleid.
                        Ik begrijp dat ik recht heb op 30 dagen niet-goed-geld-terug garantie.
                      </span>
                    </label>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => { setCurrentStep(1); setError(''); }}
                      className="rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
                      style={{
                        borderColor: 'var(--color-grey, #e2e8f0)',
                        color: 'var(--color-grey-dark, #475569)',
                      }}
                    >
                      Terug
                    </button>
                    <button
                      type="button"
                      onClick={handleStepTwo}
                      disabled={submitting}
                      className="flex-1 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      {submitting ? 'Verwerken...' : `Betaal ${formatPrice(course.price)}`}
                    </button>
                  </div>
                </>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="py-8 text-center">
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                  >
                    <svg className="h-8 w-8" style={{ color: '#22c55e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3
                    className="mb-2 text-2xl font-bold"
                    style={{
                      color: 'var(--color-navy, #1a2b4a)',
                      fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                    }}
                  >
                    Inschrijving geslaagd!
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                    Je bent succesvol ingeschreven voor <strong>{course.title}</strong>.
                  </p>
                  {enrollmentResult?.enrollmentNumber && (
                    <p className="mt-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                      Inschrijfnummer: <strong style={{ color: 'var(--color-navy, #1a2b4a)' }}>{enrollmentResult.enrollmentNumber}</strong>
                    </p>
                  )}
                  <p className="mt-4 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                    Een bevestiging is verstuurd naar <strong>{formData.email}</strong>.
                    Je kunt direct beginnen met de cursus.
                  </p>
                  <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Link
                      href={`/cursussen/${course.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Start met leren
                    </Link>
                    <Link
                      href="/cursussen"
                      className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-colors"
                      style={{
                        borderColor: 'var(--color-grey, #e2e8f0)',
                        color: 'var(--color-grey-dark, #475569)',
                      }}
                    >
                      Meer cursussen bekijken
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            {/* Course summary */}
            <div
              className="overflow-hidden rounded-xl border"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              {thumbnail?.url && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={thumbnail.url}
                    alt={thumbnail.alt || course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="p-5">
                <h3 className="text-base font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                  {course.title}
                </h3>
                {instructor && (
                  <p className="mt-1 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                    Door {instructor.name || `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim()}
                  </p>
                )}

                {/* Price breakdown */}
                <div className="mt-4 space-y-2 border-t pt-4" style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>Originele prijs</span>
                      <span className="line-through" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                        {formatPrice(course.originalPrice)}
                      </span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: '#22c55e' }}>Korting ({discount}%)</span>
                      <span style={{ color: '#22c55e' }}>
                        - {formatPrice(course.originalPrice - course.price)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t pt-2 text-base font-bold" style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}>
                    <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Totaal</span>
                    <span style={{ color: 'var(--color-primary)' }}>{formatPrice(course.price)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Includes */}
            {course.includes && course.includes.length > 0 && (
              <div
                className="rounded-xl border p-5"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                <h4 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                  Wat krijg je?
                </h4>
                <ul className="space-y-1.5">
                  {course.includes.map((item: any, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                      <svg className="h-4 w-4 shrink-0" style={{ color: '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Guarantees */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
            >
              <h4 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Onze garanties
              </h4>
              <ul className="space-y-2">
                {[
                  '30 dagen niet-goed-geld-terug',
                  'Veilig betalen via iDEAL, creditcard of PayPal',
                  'Levenslang toegang tot de cursus',
                  course.certificate ? 'Certificaat bij voltooiing' : null,
                ].filter(Boolean).map((guarantee) => (
                  <li key={guarantee!} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                    <svg className="h-4 w-4 shrink-0" style={{ color: '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                    {guarantee}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default EnrollmentWizardTemplate
