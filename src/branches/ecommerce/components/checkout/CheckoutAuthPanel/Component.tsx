'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { AuthTabSwitcher } from '@/branches/ecommerce/components/auth/AuthTabSwitcher'
import type { TabId } from '@/branches/ecommerce/components/auth/AuthTabSwitcher'
import { LoginForm } from '@/branches/ecommerce/components/auth/LoginForm'
import { RegisterForm } from '@/branches/ecommerce/components/auth/RegisterForm'
import { GuestCheckoutForm } from '@/branches/ecommerce/components/auth/GuestCheckoutForm'
import { TrustBadges } from '@/branches/ecommerce/components/auth/TrustBadges'
import type { CheckoutAuthPanelProps } from './types'

/**
 * CheckoutAuthPanel - Inline auth panel for checkout step 1
 *
 * Composes existing auth components (LoginForm, RegisterForm, GuestCheckoutForm)
 * with AuthTabSwitcher and TrustBadges into a checkout-optimized experience.
 *
 * Default tab is 'guest' for lowest friction in checkout.
 */
export function CheckoutAuthPanel({
  onAuthenticated,
  defaultTab = 'guest',
  className = '',
}: CheckoutAuthPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)
  const { login, create } = useAuth()

  return (
    <div className={className}>
      <AuthTabSwitcher activeTab={activeTab} onChange={setActiveTab} />

      {/* Login Tab */}
      {activeTab === 'login' && (
        <div role="tabpanel" id="panel-login" aria-labelledby="tab-login">
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
          <RegisterForm
            title="Account aanmaken"
            subtitle="Maak een account aan voor persoonlijke prijzen en snelle nabestellingen."
            showOAuth={false}
            showB2BNotice={false}
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
        </div>
      )}

      {/* Guest Checkout Tab */}
      {activeTab === 'guest' && (
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
