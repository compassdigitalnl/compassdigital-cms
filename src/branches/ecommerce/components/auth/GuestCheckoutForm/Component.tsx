'use client'

import { useState } from 'react'
import { FormInput } from '../FormInput'
import { GuestInfoBox } from '../GuestInfoBox'

/**
 * GuestCheckoutForm - Guest checkout form (no account required)
 *
 * Features:
 * - Title: "Bestellen als gast" (DM Serif Display)
 * - Subtitle text
 * - Guest info box with account benefits
 * - Personal info: First name, Last name (2-column grid)
 * - Contact: Email, Phone (with icons)
 * - Organization (optional)
 * - Terms & conditions checkbox
 * - Teal submit button: "Doorgaan naar bezorging"
 * - Secondary button: "Toch liever een zakelijk account?"
 * - Form validation
 * - Error message display
 *
 * @component
 * @example
 * <GuestCheckoutForm
 *   onSubmit={(data) => handleGuestCheckout(data)}
 *   onRegisterClick={() => switchToRegister()}
 * />
 */

export interface GuestCheckoutFormData {
  firstName: string
  lastName: string
  email: string
  organization?: string
  phone: string
  acceptTerms: boolean
}

export interface GuestCheckoutFormProps {
  onSubmit: (data: GuestCheckoutFormData) => Promise<void>
  onRegisterClick?: () => void
  onTermsClick?: () => void
  onPrivacyClick?: () => void
  title?: string
  subtitle?: string
  showInfoBox?: boolean
  submitButtonText?: string
  registerButtonText?: string
  className?: string
}

export function GuestCheckoutForm({
  onSubmit,
  onRegisterClick,
  onTermsClick,
  onPrivacyClick,
  title = 'Bestellen als gast',
  subtitle = 'Geen account nodig — vul uw gegevens in en bestel direct. U kunt na uw bestelling alsnog een account aanmaken.',
  showInfoBox = true,
  submitButtonText = 'Doorgaan naar bezorging',
  registerButtonText = '🏥 Toch liever een zakelijk account?',
  className = '',
}: GuestCheckoutFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [phone, setPhone] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate terms acceptance
    if (!acceptTerms) {
      setError('U moet akkoord gaan met de algemene voorwaarden en het privacybeleid')
      return
    }

    setIsLoading(true)

    try {
      await onSubmit({
        firstName,
        lastName,
        email,
        organization: organization || undefined,
        phone,
        acceptTerms,
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Er is een fout opgetreden bij het verwerken van uw gegevens.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      {/* Title */}
      <h2
        className="text-3xl mb-2"
        style={{
          fontFamily: 'var(--font-heading, "DM Serif Display", serif)',
          color: 'var(--color-primary, #0A1628)',
        }}
      >
        {title}
      </h2>

      {/* Subtitle */}
      <p
        className="text-sm mb-7 leading-relaxed"
        style={{ color: 'var(--color-text-secondary, #94A3B8)' }}
      >
        {subtitle}
      </p>

      {/* Guest Info Box */}
      {showInfoBox && <GuestInfoBox className="mb-6" />}

      {/* Error Message */}
      {error && (
        <div
          className="p-3 mb-4 rounded-lg text-sm"
          style={{
            background: 'rgba(233,69,96,0.1)',
            border: '1px solid rgba(233,69,96,0.3)',
            color: '#C62828',
          }}
        >
          {error}
        </div>
      )}

      {/* Guest Checkout Form */}
      <form onSubmit={handleSubmit}>
        {/* First Name + Last Name (2-column grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <FormInput
            type="text"
            label="Voornaam"
            placeholder="Jan"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <FormInput
            type="text"
            label="Achternaam"
            placeholder="de Vries"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <FormInput
            type="email"
            label="E-mailadres"
            placeholder="naam@organisatie.nl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="Mail"
            required
          />
        </div>

        {/* Organization (optional) */}
        <div className="mb-4">
          <FormInput
            type="text"
            label="Organisatie (optioneel)"
            placeholder="Naam organisatie of praktijk"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <FormInput
            type="tel"
            label="Telefoonnummer"
            placeholder="06 12345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon="Phone"
            required
          />
        </div>

        {/* Terms & Privacy Checkbox */}
        <div className="mb-6">
          <label
            className="flex items-start gap-2 text-sm cursor-pointer"
            style={{ color: 'var(--color-text, #64748B)' }}
          >
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
              className="w-4 h-4 mt-0.5 rounded border-2 cursor-pointer flex-shrink-0"
              style={{
                borderColor: 'var(--color-border, #E8ECF1)',
                accentColor: 'var(--color-accent, #00897B)',
              }}
            />
            <span>
              Ik ga akkoord met de{' '}
              {onTermsClick ? (
                <button
                  type="button"
                  onClick={onTermsClick}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--color-accent, #00897B)' }}
                >
                  algemene voorwaarden
                </button>
              ) : (
                <span className="font-semibold" style={{ color: 'var(--color-accent, #00897B)' }}>
                  algemene voorwaarden
                </span>
              )}{' '}
              en het{' '}
              {onPrivacyClick ? (
                <button
                  type="button"
                  onClick={onPrivacyClick}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--color-accent, #00897B)' }}
                >
                  privacybeleid
                </button>
              ) : (
                <span className="font-semibold" style={{ color: 'var(--color-accent, #00897B)' }}>
                  privacybeleid
                </span>
              )}
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-lg text-white text-base font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            background: isLoading
              ? 'var(--color-text-secondary, #94A3B8)'
              : 'var(--color-accent, #00897B)',
            boxShadow: isLoading ? 'none' : '0 4px 16px rgba(0,137,123,0.3)',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = 'var(--color-accent-dark, #00695C)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = 'var(--color-accent, #00897B)'
            }
          }}
        >
          {isLoading ? 'Bezig met verwerken...' : submitButtonText}
        </button>

        {/* Secondary Button: Register Instead */}
        {onRegisterClick && (
          <button
            type="button"
            onClick={onRegisterClick}
            className="w-full py-3.5 px-4 mt-3 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-opacity-100"
            style={{
              background: 'transparent',
              border: '1.5px solid var(--color-accent, #00897B)',
              color: 'var(--color-accent, #00897B)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,137,123,0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {registerButtonText}
          </button>
        )}
      </form>
    </div>
  )
}
