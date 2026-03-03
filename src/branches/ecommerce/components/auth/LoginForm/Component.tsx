'use client'

import { useState } from 'react'
import { FormInput } from '../FormInput'
import { OAuthButtons } from '../OAuthButtons'
import type { OAuthProvider } from '../OAuthButtons'

/**
 * LoginForm - Complete login form with OAuth and email/password
 *
 * Features:
 * - Title: "Welkom terug" (DM Serif Display)
 * - Subtitle text
 * - OAuth buttons (Google, etc.)
 * - Email + Password inputs with icons
 * - "Remember me" checkbox
 * - "Forgot password?" link
 * - Teal submit button with loading state
 * - Footer with "Register here" link
 * - Form validation
 * - Error message display
 *
 * @component
 * @example
 * <LoginForm
 *   onSubmit={(data) => handleLogin(data)}
 *   onOAuthLogin={(provider) => handleOAuth(provider)}
 * />
 */

export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  onOAuthLogin?: (provider: OAuthProvider) => void
  onForgotPassword?: () => void
  onRegisterClick?: () => void
  title?: string
  subtitle?: string
  showOAuth?: boolean
  oauthProviders?: OAuthProvider[]
  registerLinkText?: string
  className?: string
}

export function LoginForm({
  onSubmit,
  onOAuthLogin,
  onForgotPassword,
  onRegisterClick,
  title = 'Welkom terug',
  subtitle = 'Log in met uw account om verder te gaan met uw bestelling.',
  showOAuth = true,
  oauthProviders = ['google'],
  registerLinkText = 'Registreer hier',
  className = '',
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await onSubmit({ email, password, rememberMe })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het inloggen.')
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
      {showOAuth && onOAuthLogin && (
        <OAuthButtons providers={oauthProviders} onProviderClick={onOAuthLogin} />
      )}

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

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit}>
        {/* Email Input */}
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

        {/* Password Input */}
        <div className="mb-4">
          <FormInput
            type="password"
            label="Wachtwoord"
            placeholder="Uw wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon="Lock"
            showPasswordToggle
            required
          />
        </div>

        {/* Helper Row: Remember Me + Forgot Password */}
        <div className="flex items-center justify-between mb-6">
          {/* Remember Me Checkbox */}
          <label
            className="flex items-center gap-2 text-sm cursor-pointer"
            style={{ color: 'var(--color-text-secondary, #94A3B8)' }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-2 cursor-pointer"
              style={{
                borderColor: 'var(--color-border, #E8ECF1)',
                accentColor: 'var(--color-primary, #0A1628)',
              }}
            />
            Onthoud mij
          </label>

          {/* Forgot Password Link */}
          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm font-semibold hover:underline"
              style={{ color: 'var(--color-primary, #0A1628)' }}
            >
              Wachtwoord vergeten?
            </button>
          )}
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
            boxShadow: isLoading ? 'none' : '0 4px 16px rgba(10,22,40,0.25)',
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
          {isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
        </button>
      </form>

      {/* Footer: Register Link */}
      {onRegisterClick && (
        <p
          className="text-center mt-5 text-sm"
          style={{ color: 'var(--color-text-secondary, #94A3B8)' }}
        >
          Nog geen account?{' '}
          <button
            type="button"
            onClick={onRegisterClick}
            className="font-semibold hover:underline"
            style={{ color: 'var(--color-primary, #0A1628)' }}
          >
            {registerLinkText}
          </button>
        </p>
      )}
    </div>
  )
}
