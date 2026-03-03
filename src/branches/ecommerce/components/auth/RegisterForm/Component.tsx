'use client'

import { useState } from 'react'
import { FormInput } from '../FormInput'
import { OAuthButtons } from '../OAuthButtons'
import { B2BNotice } from '../B2BNotice'
import { PasswordStrengthMeter } from '../PasswordStrengthMeter'
import type { OAuthProvider } from '../OAuthButtons'

/**
 * RegisterForm - B2B registration form with KVK validation
 *
 * Features:
 * - Title: "Account aanmaken" (DM Serif Display)
 * - Subtitle text
 * - OAuth buttons (Google, etc.)
 * - B2B notice banner
 * - Personal info: First name, Last name (2-column grid)
 * - Business info: Organization, KVK number, Email, Phone
 * - Password with strength meter
 * - Terms & conditions checkbox
 * - Navy submit button with loading state
 * - Footer with "Login here" link
 * - Form validation
 * - Error message display
 *
 * @component
 * @example
 * <RegisterForm
 *   onSubmit={(data) => handleRegister(data)}
 *   onOAuthRegister={(provider) => handleOAuth(provider)}
 * />
 */

export interface RegisterFormData {
  firstName: string
  lastName: string
  organization: string
  kvkNumber?: string
  email: string
  phone?: string
  password: string
  acceptTerms: boolean
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>
  onOAuthRegister?: (provider: OAuthProvider) => void
  onLoginClick?: () => void
  onTermsClick?: () => void
  title?: string
  subtitle?: string
  showOAuth?: boolean
  oauthProviders?: OAuthProvider[]
  showB2BNotice?: boolean
  b2bNoticeVariant?: 'info' | 'pending' | 'approved'
  loginLinkText?: string
  requireKvk?: boolean
  className?: string
}

export function RegisterForm({
  onSubmit,
  onOAuthRegister,
  onLoginClick,
  onTermsClick,
  title = 'Account aanmaken',
  subtitle = 'Maak een zakelijk account aan voor persoonlijke prijzen en snelle nabestellingen.',
  showOAuth = true,
  oauthProviders = ['google'],
  showB2BNotice = true,
  b2bNoticeVariant = 'info',
  loginLinkText = 'Log hier in',
  requireKvk = false,
  className = '',
}: RegisterFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [organization, setOrganization] = useState('')
  const [kvkNumber, setKvkNumber] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [kvkError, setKvkError] = useState('')

  const validateKvk = (value: string) => {
    // KVK number must be exactly 8 digits
    if (value && !/^\d{8}$/.test(value)) {
      setKvkError('KvK-nummer moet precies 8 cijfers bevatten')
      return false
    }
    setKvkError('')
    return true
  }

  const handleKvkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8) // Only digits, max 8
    setKvkNumber(value)
    validateKvk(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate KVK if required
    if (requireKvk && !validateKvk(kvkNumber)) {
      setError('Controleer uw KvK-nummer')
      return
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      setError('U moet akkoord gaan met de algemene voorwaarden')
      return
    }

    setIsLoading(true)

    try {
      await onSubmit({
        firstName,
        lastName,
        organization,
        kvkNumber: kvkNumber || undefined,
        email,
        phone: phone || undefined,
        password,
        acceptTerms,
      })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Er is een fout opgetreden bij het aanmaken van uw account.',
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

      {/* OAuth Buttons */}
      {showOAuth && onOAuthRegister && (
        <OAuthButtons providers={oauthProviders} onProviderClick={onOAuthRegister} />
      )}

      {/* B2B Notice */}
      {showB2BNotice && <B2BNotice variant={b2bNoticeVariant} className="mb-6" />}

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

      {/* Registration Form */}
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

        {/* Organization */}
        <div className="mb-4">
          <FormInput
            type="text"
            label="Organisatie / Praktijk"
            placeholder="Huisartsenpraktijk De Vries"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
        </div>

        {/* KvK Number */}
        <div className="mb-4">
          <FormInput
            type="text"
            label="KvK-nummer"
            placeholder="12345678"
            value={kvkNumber}
            onChange={handleKvkChange}
            error={kvkError}
            required={requireKvk}
            maxLength={8}
          />
        </div>

        {/* Business Email */}
        <div className="mb-4">
          <FormInput
            type="email"
            label="Zakelijk e-mailadres"
            placeholder="info@uwpraktijk.nl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon="Mail"
            required
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
          />
        </div>

        {/* Password with Strength Meter */}
        <div className="mb-4">
          <FormInput
            type="password"
            label="Wachtwoord"
            placeholder="Min. 8 tekens"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="Lock"
            showPasswordToggle
            required
          />
          <PasswordStrengthMeter password={password} minLength={8} showRequirements={false} />
        </div>

        {/* Terms & Conditions Checkbox */}
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
                accentColor: 'var(--color-primary, #0A1628)',
              }}
            />
            <span>
              Ik ga akkoord met de{' '}
              {onTermsClick ? (
                <button
                  type="button"
                  onClick={onTermsClick}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--color-primary, #0A1628)' }}
                >
                  algemene voorwaarden
                </button>
              ) : (
                <span className="font-semibold" style={{ color: 'var(--color-primary, #0A1628)' }}>
                  algemene voorwaarden
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
              : 'var(--color-primary, #0A1628)',
            boxShadow: isLoading ? 'none' : '0 4px 16px rgba(10,38,71,0.25)',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = 'var(--color-primary-dark, #121F33)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = 'var(--color-primary, #0A1628)'
            }
          }}
        >
          {isLoading ? 'Account wordt aangemaakt...' : 'Account aanvragen'}
        </button>
      </form>

      {/* Footer: Login Link */}
      {onLoginClick && (
        <p
          className="text-center mt-4 text-sm"
          style={{ color: 'var(--color-text-secondary, #94A3B8)' }}
        >
          Al een account?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="font-semibold hover:underline"
            style={{ color: 'var(--color-primary, #0A1628)' }}
          >
            {loginLinkText}
          </button>
        </p>
      )}
    </div>
  )
}
