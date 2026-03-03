'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { AuthTabSwitcher } from '@/branches/ecommerce/components/auth/AuthTabSwitcher'
import type { TabId } from '@/branches/ecommerce/components/auth/AuthTabSwitcher'
import { LoginForm } from '@/branches/ecommerce/components/auth/LoginForm'
import { GuestCheckoutForm } from '@/branches/ecommerce/components/auth/GuestCheckoutForm'
import { OAuthButtons } from '@/branches/ecommerce/components/auth/OAuthButtons'
import { TrustBadges } from '@/branches/ecommerce/components/auth/TrustBadges'
import { FormInput } from '@/branches/ecommerce/components/auth/FormInput'
import { KvkLookup } from '@/branches/ecommerce/components/auth/KvkLookup'
import type { KvkResult } from '@/branches/ecommerce/components/auth/KvkLookup'
import { PasswordStrengthMeter } from '@/branches/ecommerce/components/auth/PasswordStrengthMeter'
import { Building2, User } from 'lucide-react'
import type { CheckoutAuthPanelProps } from './types'

/**
 * CheckoutAuthPanel - Inline auth panel for checkout step 1
 *
 * Default tab is 'login'. Includes OAuth (Google), B2B/B2C register toggle,
 * KvK lookup for B2B, guest checkout tab, and trust badges.
 */
export function CheckoutAuthPanel({
  onAuthenticated,
  defaultTab = 'login',
  enableGuestCheckout = true,
  className = '',
}: CheckoutAuthPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)
  const [registerMode, setRegisterMode] = useState<'b2c' | 'b2b'>('b2c')
  const { login, create } = useAuth()

  // B2C register state
  const [b2cFirstName, setB2cFirstName] = useState('')
  const [b2cLastName, setB2cLastName] = useState('')
  const [b2cEmail, setB2cEmail] = useState('')
  const [b2cPassword, setB2cPassword] = useState('')
  const [b2cLoading, setB2cLoading] = useState(false)
  const [b2cError, setB2cError] = useState('')

  // B2B register state
  const [b2bFirstName, setB2bFirstName] = useState('')
  const [b2bLastName, setB2bLastName] = useState('')
  const [b2bOrganization, setB2bOrganization] = useState('')
  const [b2bKvkNumber, setB2bKvkNumber] = useState('')
  const [b2bEmail, setB2bEmail] = useState('')
  const [b2bPhone, setB2bPhone] = useState('')
  const [b2bPassword, setB2bPassword] = useState('')
  const [b2bAcceptTerms, setB2bAcceptTerms] = useState(false)
  const [b2bLoading, setB2bLoading] = useState(false)
  const [b2bError, setB2bError] = useState('')

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/users/oauth/${provider}`
  }

  // Build tabs based on enableGuestCheckout
  const tabs = enableGuestCheckout
    ? undefined // use defaults (login, register, guest)
    : [
        { id: 'login' as TabId, label: 'Inloggen' },
        { id: 'register' as TabId, label: 'Registreren' },
      ]

  const handleB2cSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setB2cError('')
    setB2cLoading(true)

    try {
      await create({
        email: b2cEmail,
        password: b2cPassword,
        passwordConfirm: b2cPassword,
      })
      onAuthenticated({ email: b2cEmail, isGuest: false })
    } catch (err) {
      setB2cError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het aanmaken van uw account.')
    } finally {
      setB2cLoading(false)
    }
  }

  const handleB2bSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setB2bError('')

    if (!b2bAcceptTerms) {
      setB2bError('U moet akkoord gaan met de algemene voorwaarden')
      return
    }

    setB2bLoading(true)

    try {
      await create({
        email: b2bEmail,
        password: b2bPassword,
        passwordConfirm: b2bPassword,
      })
      onAuthenticated({ email: b2bEmail, isGuest: false })
    } catch (err) {
      setB2bError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het aanmaken van uw account.')
    } finally {
      setB2bLoading(false)
    }
  }

  const handleKvkResult = (result: KvkResult) => {
    setB2bOrganization(result.companyName)
    setB2bKvkNumber(result.kvkNumber)
  }

  return (
    <div className={className}>
      <AuthTabSwitcher activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />

      {/* Login Tab */}
      {activeTab === 'login' && (
        <div role="tabpanel" id="panel-login" aria-labelledby="tab-login">
          <OAuthButtons
            providers={['google']}
            onProviderClick={handleOAuthLogin}
            dividerText="of met e-mail"
          />
          <LoginForm
            title="Welkom terug"
            subtitle="Log in om door te gaan met uw bestelling."
            showOAuth={false}
            onSubmit={async (data) => {
              const user = await login({ email: data.email, password: data.password })
              onAuthenticated({ email: user?.email || data.email, isGuest: false })
            }}
            onForgotPassword={() => {
              window.open('/forgot-password', '_blank')
            }}
            onRegisterClick={() => setActiveTab('register')}
          />
        </div>
      )}

      {/* Register Tab */}
      {activeTab === 'register' && (
        <div role="tabpanel" id="panel-register" aria-labelledby="tab-register">
          <OAuthButtons
            providers={['google']}
            onProviderClick={handleOAuthLogin}
            dividerText="of registreer met e-mail"
          />

          {/* B2C / B2B Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setRegisterMode('b2c')}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold
                transition-all duration-200 border-2
                ${registerMode === 'b2c'
                  ? 'border-[var(--color-primary,#0A1628)] bg-[rgba(10,22,40,0.05)] text-[var(--color-primary,#0A1628)]'
                  : 'border-[var(--color-border,#E8ECF1)] text-[var(--color-text-secondary,#94A3B8)] hover:border-[var(--color-text-secondary,#94A3B8)]'
                }
              `}
            >
              <User className="w-4 h-4" />
              Particulier
            </button>
            <button
              type="button"
              onClick={() => setRegisterMode('b2b')}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold
                transition-all duration-200 border-2
                ${registerMode === 'b2b'
                  ? 'border-[var(--color-primary,#0A1628)] bg-[rgba(10,22,40,0.05)] text-[var(--color-primary,#0A1628)]'
                  : 'border-[var(--color-border,#E8ECF1)] text-[var(--color-text-secondary,#94A3B8)] hover:border-[var(--color-text-secondary,#94A3B8)]'
                }
              `}
            >
              <Building2 className="w-4 h-4" />
              Zakelijk
            </button>
          </div>

          {registerMode === 'b2c' ? (
            /* B2C: Simplified registration */
            <div>
              <h2
                className="text-3xl mb-2"
                style={{
                  fontFamily: 'var(--font-heading, "DM Serif Display", serif)',
                  color: 'var(--color-primary, #0A1628)',
                }}
              >
                Account aanmaken
              </h2>
              <p
                className="text-sm mb-7 leading-relaxed"
                style={{ color: 'var(--color-text-secondary, #94A3B8)' }}
              >
                Maak een account aan om uw bestellingen bij te houden en sneller af te rekenen.
              </p>

              {b2cError && (
                <div
                  className="p-3 mb-4 rounded-lg text-sm"
                  style={{
                    background: 'rgba(233,69,96,0.1)',
                    border: '1px solid rgba(233,69,96,0.3)',
                    color: '#C62828',
                  }}
                >
                  {b2cError}
                </div>
              )}

              <form onSubmit={handleB2cSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <FormInput
                    type="text"
                    label="Voornaam"
                    placeholder="Jan"
                    value={b2cFirstName}
                    onChange={(e) => setB2cFirstName(e.target.value)}
                    required
                  />
                  <FormInput
                    type="text"
                    label="Achternaam"
                    placeholder="de Vries"
                    value={b2cLastName}
                    onChange={(e) => setB2cLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <FormInput
                    type="email"
                    label="E-mailadres"
                    placeholder="jan@voorbeeld.nl"
                    value={b2cEmail}
                    onChange={(e) => setB2cEmail(e.target.value)}
                    icon="Mail"
                    required
                  />
                </div>
                <div className="mb-6">
                  <FormInput
                    type="password"
                    label="Wachtwoord"
                    placeholder="Min. 8 tekens"
                    value={b2cPassword}
                    onChange={(e) => setB2cPassword(e.target.value)}
                    icon="Lock"
                    showPasswordToggle
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={b2cLoading}
                  className="w-full py-3.5 px-4 rounded-lg text-white text-base font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: b2cLoading
                      ? 'var(--color-text-secondary, #94A3B8)'
                      : 'var(--color-primary, #0A1628)',
                    boxShadow: b2cLoading ? 'none' : '0 4px 16px var(--color-primary-glow, rgba(10,22,40,0.25))',
                  }}
                >
                  {b2cLoading ? 'Account wordt aangemaakt...' : 'Account aanmaken'}
                </button>
              </form>

              <p
                className="text-center mt-4 text-sm"
                style={{ color: 'var(--color-text-secondary, #94A3B8)' }}
              >
                Al een account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--color-primary, #0A1628)' }}
                >
                  Log hier in
                </button>
              </p>
            </div>
          ) : (
            /* B2B: Full registration with KvK lookup */
            <div>
              <h2
                className="text-3xl mb-2"
                style={{
                  fontFamily: 'var(--font-heading, "DM Serif Display", serif)',
                  color: 'var(--color-primary, #0A1628)',
                }}
              >
                Zakelijk account aanmaken
              </h2>
              <p
                className="text-sm mb-7 leading-relaxed"
                style={{ color: 'var(--color-text-secondary, #94A3B8)' }}
              >
                Vul uw KVK-nummer in voor automatische bedrijfsgegevens, of voer de gegevens handmatig in.
              </p>

              {b2bError && (
                <div
                  className="p-3 mb-4 rounded-lg text-sm"
                  style={{
                    background: 'rgba(233,69,96,0.1)',
                    border: '1px solid rgba(233,69,96,0.3)',
                    color: '#C62828',
                  }}
                >
                  {b2bError}
                </div>
              )}

              <form onSubmit={handleB2bSubmit}>
                {/* KvK Lookup */}
                <KvkLookup
                  onResult={handleKvkResult}
                  onClear={() => {
                    setB2bOrganization('')
                    setB2bKvkNumber('')
                  }}
                  className="mb-4"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <FormInput
                    type="text"
                    label="Voornaam"
                    placeholder="Jan"
                    value={b2bFirstName}
                    onChange={(e) => setB2bFirstName(e.target.value)}
                    required
                  />
                  <FormInput
                    type="text"
                    label="Achternaam"
                    placeholder="de Vries"
                    value={b2bLastName}
                    onChange={(e) => setB2bLastName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <FormInput
                    type="text"
                    label="Organisatie / Praktijk"
                    placeholder="Huisartsenpraktijk De Vries"
                    value={b2bOrganization}
                    onChange={(e) => setB2bOrganization(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <FormInput
                    type="email"
                    label="Zakelijk e-mailadres"
                    placeholder="info@uwpraktijk.nl"
                    value={b2bEmail}
                    onChange={(e) => setB2bEmail(e.target.value)}
                    icon="Mail"
                    required
                  />
                </div>

                <div className="mb-4">
                  <FormInput
                    type="tel"
                    label="Telefoonnummer"
                    placeholder="06 12345678"
                    value={b2bPhone}
                    onChange={(e) => setB2bPhone(e.target.value)}
                    icon="Phone"
                  />
                </div>

                <div className="mb-4">
                  <FormInput
                    type="password"
                    label="Wachtwoord"
                    placeholder="Min. 8 tekens"
                    value={b2bPassword}
                    onChange={(e) => setB2bPassword(e.target.value)}
                    icon="Lock"
                    showPasswordToggle
                    required
                  />
                  <PasswordStrengthMeter password={b2bPassword} minLength={8} showRequirements={false} />
                </div>

                {/* Terms */}
                <div className="mb-6">
                  <label
                    className="flex items-start gap-2 text-sm cursor-pointer"
                    style={{ color: 'var(--color-text, #64748B)' }}
                  >
                    <input
                      type="checkbox"
                      checked={b2bAcceptTerms}
                      onChange={(e) => setB2bAcceptTerms(e.target.checked)}
                      required
                      className="w-4 h-4 mt-0.5 rounded border-2 cursor-pointer flex-shrink-0"
                      style={{
                        borderColor: 'var(--color-border, #E8ECF1)',
                        accentColor: 'var(--color-primary, #0A1628)',
                      }}
                    />
                    <span>
                      Ik ga akkoord met de{' '}
                      <span className="font-semibold" style={{ color: 'var(--color-primary, #0A1628)' }}>
                        algemene voorwaarden
                      </span>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={b2bLoading}
                  className="w-full py-3.5 px-4 rounded-lg text-white text-base font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: b2bLoading
                      ? 'var(--color-text-secondary, #94A3B8)'
                      : 'var(--color-primary, #0A1628)',
                    boxShadow: b2bLoading ? 'none' : '0 4px 16px var(--color-primary-glow, rgba(10,22,40,0.25))',
                  }}
                >
                  {b2bLoading ? 'Account wordt aangemaakt...' : 'Account aanvragen'}
                </button>
              </form>

              <p
                className="text-center mt-4 text-sm"
                style={{ color: 'var(--color-text-secondary, #94A3B8)' }}
              >
                Al een account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--color-primary, #0A1628)' }}
                >
                  Log hier in
                </button>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Guest Checkout Tab */}
      {activeTab === 'guest' && enableGuestCheckout && (
        <div role="tabpanel" id="panel-guest" aria-labelledby="tab-guest">
          <GuestCheckoutForm
            title="Bestellen als gast"
            subtitle="Geen account nodig — vul uw gegevens in en bestel direct."
            showInfoBox={false}
            submitButtonText="Doorgaan naar adres"
            onSubmit={async (data) => {
              onAuthenticated({
                email: data.email,
                isGuest: true,
                guestData: data,
              })
            }}
            onRegisterClick={() => setActiveTab('register')}
          />
        </div>
      )}

      {/* Trust Badges */}
      <div className="mt-6">
        <TrustBadges />
      </div>
    </div>
  )
}
