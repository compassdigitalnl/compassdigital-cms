'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type {
  EnrollmentFormProps,
  EnrollmentStep,
  AccountType,
  PaymentMethod,
  AccountFormData,
  PaymentFormData,
} from './types'
import { formatPrice } from '../../lib/courseUtils'

const IDEAL_BANKS = [
  { label: 'Kies je bank...', value: '' },
  { label: 'ABN AMRO', value: 'abn_amro' },
  { label: 'ING', value: 'ing' },
  { label: 'Rabobank', value: 'rabobank' },
  { label: 'SNS', value: 'sns' },
  { label: 'ASN Bank', value: 'asn' },
  { label: 'Triodos Bank', value: 'triodos' },
  { label: 'Knab', value: 'knab' },
  { label: 'Bunq', value: 'bunq' },
  { label: 'RegioBank', value: 'regiobank' },
]

const STEPS = [
  { number: 1, label: 'Account' },
  { number: 2, label: 'Betaling' },
  { number: 3, label: 'Bevestiging' },
]

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ course, courseSlug }) => {
  const [currentStep, setCurrentStep] = useState<EnrollmentStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [enrollmentNumber, setEnrollmentNumber] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const [accountData, setAccountData] = useState<AccountFormData>({
    accountType: 'new',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    newsletter: false,
    terms: false,
  })

  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    method: 'ideal',
    idealBank: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
  })

  const handleAccountChange = (field: keyof AccountFormData, value: string | boolean) => {
    setAccountData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field: keyof PaymentFormData, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep1 = (): boolean => {
    if (accountData.accountType === 'new') {
      if (!accountData.firstName || !accountData.lastName || !accountData.email || !accountData.password) {
        setError('Vul alle verplichte velden in.')
        return false
      }
      if (accountData.password.length < 8) {
        setError('Wachtwoord moet minimaal 8 tekens bevatten.')
        return false
      }
      if (!accountData.terms) {
        setError('Accepteer de algemene voorwaarden om door te gaan.')
        return false
      }
    } else {
      if (!accountData.email || !accountData.password) {
        setError('Vul je e-mail en wachtwoord in.')
        return false
      }
    }
    setError(null)
    return true
  }

  const validateStep2 = (): boolean => {
    if (paymentData.method === 'ideal' && !paymentData.idealBank) {
      setError('Kies je bank om door te gaan.')
      return false
    }
    if (paymentData.method === 'creditcard') {
      if (!paymentData.cardNumber || !paymentData.cardExpiry || !paymentData.cardCvc || !paymentData.cardName) {
        setError('Vul alle creditcard gegevens in.')
        return false
      }
    }
    setError(null)
    return true
  }

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Step 1: Create enrollment
      const enrollRes = await fetch('/api/onderwijs/enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          firstName: accountData.firstName,
          lastName: accountData.lastName,
          email: accountData.email,
          password: accountData.accountType === 'new' ? accountData.password : undefined,
          isNewAccount: accountData.accountType === 'new',
          paymentMethod: paymentData.method,
        }),
      })

      const enrollData = await enrollRes.json()

      if (!enrollRes.ok || !enrollData.success) {
        setError(enrollData.error || 'Er is een fout opgetreden bij het aanmaken van de inschrijving.')
        setIsSubmitting(false)
        return
      }

      // Step 2: Process payment
      const payRes = await fetch('/api/onderwijs/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: enrollData.enrollmentId,
          paymentMethod: paymentData.method,
          paymentDetails: {
            bank: paymentData.idealBank,
            cardNumber: paymentData.cardNumber,
            cardExpiry: paymentData.cardExpiry,
            cardCvc: paymentData.cardCvc,
            cardName: paymentData.cardName,
          },
        }),
      })

      const payData = await payRes.json()

      if (!payRes.ok || !payData.success) {
        setError(payData.error || 'Er is een fout opgetreden bij de betaling.')
        setIsSubmitting(false)
        return
      }

      setEnrollmentNumber(enrollData.enrollmentNumber || '')
      setCurrentStep(3)
    } catch {
      setError('Er is een onverwachte fout opgetreden. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Progress Stepper */}
      <div className="mb-8 rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6">
        <div className="relative mx-auto flex max-w-lg justify-between">
          {/* Connector line */}
          <div className="absolute left-0 right-0 top-4 h-0.5 bg-[var(--color-base-200)]">
            <div
              className="h-full bg-[var(--color-primary)] transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>

          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : step.number === currentStep
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'border-2 border-[var(--color-base-200)] bg-white text-[var(--color-base-400)]'
                }`}
              >
                {step.number < currentStep ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`mt-2 text-[11px] font-semibold ${
                  step.number <= currentStep
                    ? 'text-[var(--color-base-1000)]'
                    : 'text-[var(--color-base-400)]'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Account */}
      {currentStep === 1 && (
        <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 md:p-8">
          <div className="mb-6">
            <h2 className="flex items-center gap-2.5 text-2xl font-extrabold text-[var(--color-base-1000)]">
              <svg className="h-7 w-7 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" x2="19" y1="8" y2="14" />
                <line x1="22" x2="16" y1="11" y2="11" />
              </svg>
              Account
            </h2>
            <p className="text-sm text-[var(--color-base-500)]">
              Maak een account aan of log in met je bestaande account
            </p>
          </div>

          {/* Account type toggle */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            {([
              { type: 'new' as AccountType, title: 'Nieuw account', desc: 'Maak een nieuw account aan', icon: 'user-plus' },
              { type: 'existing' as AccountType, title: 'Bestaand account', desc: 'Log in met je account', icon: 'log-in' },
            ]).map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => handleAccountChange('accountType', option.type)}
                className={`rounded-xl border-2 p-5 text-left transition-all ${
                  accountData.accountType === option.type
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-base-200)] hover:border-[var(--color-primary)]'
                }`}
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                      accountData.accountType === option.type
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-base-100)] text-[var(--color-base-400)]'
                    }`}
                  >
                    {option.type === 'new' ? (
                      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" x2="19" y1="8" y2="14" />
                        <line x1="22" x2="16" y1="11" y2="11" />
                      </svg>
                    ) : (
                      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" x2="3" y1="12" y2="12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-bold text-[var(--color-base-1000)]">{option.title}</span>
                </div>
                <p className="text-xs text-[var(--color-base-500)]">{option.desc}</p>
              </button>
            ))}
          </div>

          {/* New account form */}
          {accountData.accountType === 'new' && (
            <>
              <div className="mb-5 grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--color-base-1000)]">
                    Voornaam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountData.firstName}
                    onChange={(e) => handleAccountChange('firstName', e.target.value)}
                    placeholder="Jan"
                    className="w-full rounded-lg border-[1.5px] border-[var(--color-base-200)] px-3.5 py-2.5 text-[13px] text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--color-base-1000)]">
                    Achternaam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountData.lastName}
                    onChange={(e) => handleAccountChange('lastName', e.target.value)}
                    placeholder="de Vries"
                    className="w-full rounded-lg border-[1.5px] border-[var(--color-base-200)] px-3.5 py-2.5 text-[13px] text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold text-[var(--color-base-1000)]">
                  E-mailadres <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={accountData.email}
                  onChange={(e) => handleAccountChange('email', e.target.value)}
                  placeholder="jan@voorbeeld.nl"
                  className="w-full rounded-lg border-[1.5px] border-[var(--color-base-200)] px-3.5 py-2.5 text-[13px] text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
              </div>
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold text-[var(--color-base-1000)]">
                  Wachtwoord <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={accountData.password}
                  onChange={(e) => handleAccountChange('password', e.target.value)}
                  placeholder="Minimaal 8 tekens"
                  className="w-full rounded-lg border-[1.5px] border-[var(--color-base-200)] px-3.5 py-2.5 text-[13px] text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
                <p className="mt-1.5 text-[11px] text-[var(--color-base-400)]">
                  Minimaal 8 tekens
                </p>
              </div>

              {/* Checkboxes */}
              <div className="mt-5 space-y-3">
                <label className="flex cursor-pointer gap-2.5">
                  <input
                    type="checkbox"
                    checked={accountData.newsletter}
                    onChange={(e) => handleAccountChange('newsletter', e.target.checked)}
                    className="mt-0.5 h-[18px] w-[18px] rounded border-[var(--color-base-300)]"
                  />
                  <span className="text-xs leading-relaxed text-[var(--color-base-500)]">
                    Ja, ik wil graag nieuws en aanbiedingen ontvangen per e-mail
                  </span>
                </label>
                <label className="flex cursor-pointer gap-2.5">
                  <input
                    type="checkbox"
                    checked={accountData.terms}
                    onChange={(e) => handleAccountChange('terms', e.target.checked)}
                    className="mt-0.5 h-[18px] w-[18px] rounded border-[var(--color-base-300)]"
                  />
                  <span className="text-xs leading-relaxed text-[var(--color-base-500)]">
                    Ik ga akkoord met de{' '}
                    <a href="/voorwaarden" className="text-[var(--color-primary)] no-underline hover:underline">
                      algemene voorwaarden
                    </a>{' '}
                    en het{' '}
                    <a href="/privacy" className="text-[var(--color-primary)] no-underline hover:underline">
                      privacybeleid
                    </a>{' '}
                    <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
            </>
          )}

          {/* Existing account form */}
          {accountData.accountType === 'existing' && (
            <>
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold text-[var(--color-base-1000)]">
                  E-mailadres <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={accountData.email}
                  onChange={(e) => handleAccountChange('email', e.target.value)}
                  placeholder="jan@voorbeeld.nl"
                  className="w-full rounded-lg border-[1.5px] border-[var(--color-base-200)] px-3.5 py-2.5 text-[13px] text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
              </div>
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold text-[var(--color-base-1000)]">
                  Wachtwoord <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={accountData.password}
                  onChange={(e) => handleAccountChange('password', e.target.value)}
                  placeholder="Je wachtwoord"
                  className="w-full rounded-lg border-[1.5px] border-[var(--color-base-200)] px-3.5 py-2.5 text-[13px] text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
                <a
                  href="/wachtwoord-vergeten"
                  className="mt-1.5 inline-block text-xs text-[var(--color-primary)] no-underline hover:underline"
                >
                  Wachtwoord vergeten?
                </a>
              </div>
            </>
          )}

          {/* Button group */}
          <div className="mt-8 flex gap-3 border-t border-[var(--color-base-100)] pt-6">
            <button
              type="button"
              onClick={handleNextStep}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Doorgaan naar betaling
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" x2="19" y1="12" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {currentStep === 2 && (
        <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 md:p-8">
          <div className="mb-6">
            <h2 className="flex items-center gap-2.5 text-2xl font-extrabold text-[var(--color-base-1000)]">
              <svg className="h-7 w-7 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              Betaling
            </h2>
            <p className="text-sm text-[var(--color-base-500)]">
              Kies je betaalmethode
            </p>
          </div>

          {/* Payment methods */}
          <div className="mb-6 space-y-3">
            {([
              { method: 'ideal' as PaymentMethod, name: 'iDEAL', desc: 'Betaal direct via je eigen bank' },
              { method: 'creditcard' as PaymentMethod, name: 'Creditcard', desc: 'Visa, Mastercard, American Express' },
              { method: 'paypal' as PaymentMethod, name: 'PayPal', desc: 'Betaal veilig met PayPal' },
            ]).map((option) => (
              <button
                key={option.method}
                type="button"
                onClick={() => handlePaymentChange('method', option.method)}
                className={`flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                  paymentData.method === option.method
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-base-200)] hover:border-[var(--color-primary)]'
                }`}
              >
                <div
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                    paymentData.method === option.method
                      ? 'border-[var(--color-primary)]'
                      : 'border-[var(--color-base-300)]'
                  }`}
                >
                  {paymentData.method === option.method && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                  )}
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-base-100)]">
                  <svg className="h-[18px] w-[18px] text-[var(--color-base-500)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-[var(--color-base-1000)]">{option.name}</div>
                  <div className="text-[11px] text-[var(--color-base-400)]">{option.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* iDEAL bank selector */}
          {paymentData.method === 'ideal' && (
            <div className="mb-5">
              <label className="mb-2 block text-xs font-semibold text-[var(--color-base-1000)]">
                Kies je bank <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentData.idealBank}
                onChange={(e) => handlePaymentChange('idealBank', e.target.value)}
                className="w-full rounded-lg border-[1.5px] border-[var(--color-base-200)] bg-[var(--color-base-0)] px-3.5 py-2.5 text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
              >
                {IDEAL_BANKS.map((bank) => (
                  <option key={bank.value} value={bank.value}>
                    {bank.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Creditcard fields */}
          {paymentData.method === 'creditcard' && (
            <>
              <div className="mb-5">
                <label className="mb-2 block text-xs font-semibold text-[var(--color-base-1000)]">
                  Kaartnummer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={paymentData.cardNumber}
                  onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full rounded-lg border-[1.5px] border-[var(--color-base-200)] px-3.5 py-2.5 font-mono text-[13px] text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
              </div>
              <div className="mb-5 grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--color-base-1000)]">
                    Vervaldatum <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardExpiry}
                    onChange={(e) => handlePaymentChange('cardExpiry', e.target.value)}
                    placeholder="MM/JJ"
                    maxLength={5}
                    className="w-full rounded-lg border-[1.5px] border-[var(--color-base-200)] px-3.5 py-2.5 font-mono text-[13px] text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--color-base-1000)]">
                    CVC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardCvc}
                    onChange={(e) => handlePaymentChange('cardCvc', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="w-full rounded-lg border-[1.5px] border-[var(--color-base-200)] px-3.5 py-2.5 font-mono text-[13px] text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--color-base-1000)]">
                    Naam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardName}
                    onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                    placeholder="J. de Vries"
                    className="w-full rounded-lg border-[1.5px] border-[var(--color-base-200)] px-3.5 py-2.5 text-[13px] text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
                  />
                </div>
              </div>
            </>
          )}

          {/* PayPal notice */}
          {paymentData.method === 'paypal' && (
            <div className="mb-5 rounded-lg bg-[var(--color-base-50)] p-4 text-[13px] text-[var(--color-base-600)]">
              Je wordt doorgestuurd naar PayPal om de betaling af te ronden.
            </div>
          )}

          {/* Button group */}
          <div className="mt-8 flex gap-3 border-t border-[var(--color-base-100)] pt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="rounded-lg border-[1.5px] border-[var(--color-base-200)] px-6 py-3 text-sm font-semibold text-[var(--color-base-500)] transition-colors hover:border-[var(--color-base-1000)] hover:text-[var(--color-base-1000)]"
            >
              Terug
            </button>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Verwerken...
                </>
              ) : (
                <>
                  Betalen — {formatPrice(course.price)}
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === 3 && (
        <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-8 md:p-12">
          <div className="text-center">
            {/* Success icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 className="mb-3 text-2xl font-extrabold text-[var(--color-base-1000)] md:text-3xl">
              Gelukt! Welkom bij de cursus
            </h2>
            <p className="mb-6 text-sm text-[var(--color-base-500)]">
              Je inschrijving voor <strong>{course.title}</strong> is succesvol verwerkt.
              Je ontvangt een bevestiging per e-mail.
            </p>

            {/* Enrollment number */}
            {enrollmentNumber && (
              <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-lg bg-[var(--color-base-50)] px-5 py-3">
                <svg className="h-4 w-4 text-[var(--color-base-500)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="text-xs text-[var(--color-base-500)]">Inschrijfnummer:</span>
                <span className="font-mono text-sm font-bold text-[var(--color-base-1000)]">
                  {enrollmentNumber}
                </span>
              </div>
            )}

            {/* Guarantees */}
            <div className="mx-auto mb-8 flex max-w-md justify-center gap-6">
              {[
                { label: '30 dagen retour', icon: 'shield' },
                { label: 'Levenslang toegang', icon: 'infinity' },
                { label: 'Certificaat', icon: 'award' },
              ].map((guarantee) => (
                <div
                  key={guarantee.label}
                  className="flex items-center gap-1.5 text-xs text-[var(--color-base-500)]"
                >
                  <svg className="h-3.5 w-3.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {guarantee.label}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/cursussen/${courseSlug}`}
                className="flex items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-8 py-3 text-sm font-bold text-white no-underline transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Start met leren
              </Link>
              <Link
                href="/cursussen"
                className="flex items-center justify-center gap-2 rounded-lg border-[1.5px] border-[var(--color-base-200)] px-8 py-3 text-sm font-semibold text-[var(--color-base-500)] no-underline transition-colors hover:border-[var(--color-base-1000)] hover:text-[var(--color-base-1000)]"
              >
                Terug naar cursussen
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
