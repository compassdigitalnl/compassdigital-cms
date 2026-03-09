'use client'

import { useState } from 'react'
import { FormInput } from '../FormInput'
import { OAuthButtons } from '../OAuthButtons'
import type { OAuthProvider } from '../OAuthButtons'
import { TwoFactorInput } from '../TwoFactorInput'

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
  const [show2FA, setShow2FA] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Check if user has 2FA enabled
      const checkRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/2fa/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const checkData = await checkRes.json()

      if (checkData.twoFactorRequired) {
        // First verify password is correct via normal login
        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        })

        if (!loginRes.ok) {
          throw new Error('Onjuist e-mailadres of wachtwoord')
        }

        // Password is correct — now logout the partial session and show 2FA
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`, {
          method: 'POST',
          credentials: 'include',
        })

        setPendingEmail(email)
        setShow2FA(true)
        return
      }

      // No 2FA — normal login
      await onSubmit({ email, password, rememberMe })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het inloggen.')
    } finally {
      setIsLoading(false)
    }
  }

  const handle2FASubmit = async (code: string, isBackupCode: boolean) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/2fa/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: pendingEmail, code, isBackupCode }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    // 2FA validated — trigger the normal login callback to update auth state
    // The validate endpoint already set the cookie, so we just call onSubmit
    // to let the parent handle the post-login redirect
    window.location.reload()
  }

  // ── 2FA Step ──
  if (show2FA) {
    return (
      <div className={className}>
        <TwoFactorInput
          email={pendingEmail}
          onSubmit={handle2FASubmit}
          onCancel={() => { setShow2FA(false); setPendingEmail('') }}
        />
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Title */}
      <h2
        className="text-3xl mb-2"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-primary)',
        }}
      >
        {title}
      </h2>

      {/* Subtitle */}
      <p
        className="text-sm mb-7 leading-relaxed"
        style={{ color: 'var(--color-text-secondary)' }}
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
            color: 'var(--color-error-dark)',
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
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-2 cursor-pointer"
              style={{
                borderColor: 'var(--color-border)',
                accentColor: 'var(--color-primary)',
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
              style={{ color: 'var(--color-primary)' }}
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
              ? 'var(--color-text-secondary)'
              : 'var(--color-primary)',
            boxShadow: isLoading ? 'none' : '0 4px 16px var(--color-primary-glow, rgba(10,22,40,0.25))',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = 'var(--color-primary-dark)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.background = 'var(--color-primary)'
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
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Nog geen account?{' '}
          <button
            type="button"
            onClick={onRegisterClick}
            className="font-semibold hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            {registerLinkText}
          </button>
        </p>
      )}
    </div>
  )
}
