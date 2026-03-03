'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { AuthTabSwitcher } from '@/branches/ecommerce/components/auth/AuthTabSwitcher'
import type { TabId } from '@/branches/ecommerce/components/auth/AuthTabSwitcher'
import { LoginForm } from '@/branches/ecommerce/components/auth/LoginForm'
import { RegisterForm } from '@/branches/ecommerce/components/auth/RegisterForm'
import { GuestCheckoutForm } from '@/branches/ecommerce/components/auth/GuestCheckoutForm'
import { OAuthButtons } from '@/branches/ecommerce/components/auth/OAuthButtons'
import { TrustBadges } from '@/branches/ecommerce/components/auth/TrustBadges'
import { FormInput } from '@/branches/ecommerce/components/auth/FormInput'
import { Building2, User } from 'lucide-react'
import type { CheckoutAuthPanelProps } from './types'

/**
 * CheckoutAuthPanel - Inline auth panel for checkout step 1
 *
 * Composes existing auth components with AuthTabSwitcher and TrustBadges.
 * Default tab is 'guest' for lowest friction in checkout.
 * Includes OAuth (Google), B2B/B2C register toggle, and trust badges.
 */
export function CheckoutAuthPanel({
  onAuthenticated,
  defaultTab = 'guest',
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

  const handleOAuthLogin = (provider: string) => {
    // Redirect to OAuth provider login
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
                  ? 'border-[var(--color-accent,#00897B)] bg-[rgba(0,137,123,0.06)] text-[var(--color-accent,#00897B)]'
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
                  ? 'border-[var(--color-accent,#00897B)] bg-[rgba(0,137,123,0.06)] text-[var(--color-accent,#00897B)]'
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
                      : 'var(--color-accent, #00897B)',
                    boxShadow: b2cLoading ? 'none' : '0 4px 16px rgba(0,137,123,0.3)',
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
                  style={{ color: 'var(--color-accent, #00897B)' }}
                >
                  Log hier in
                </button>
              </p>
            </div>
          ) : (
            /* B2B: Full registration with org/kvk */
            <RegisterForm
              title="Zakelijk account aanmaken"
              subtitle="Maak een zakelijk account aan voor persoonlijke prijzen en snelle nabestellingen."
              showOAuth={false}
              showB2BNotice={true}
              onSubmit={async (data) => {
                await create({
                  email: data.email,
                  password: data.password,
                  passwordConfirm: data.password,
                })
                onAuthenticated({ email: data.email, isGuest: false })
              }}
              onLoginClick={() => setActiveTab('login')}
            />
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
