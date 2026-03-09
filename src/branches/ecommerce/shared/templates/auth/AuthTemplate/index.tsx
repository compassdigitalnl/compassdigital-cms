'use client'

import { useState } from 'react'
import {
  AuthLayout,
  AuthTabSwitcher,
  LoginForm,
  RegisterForm,
  GuestCheckoutForm,
  TrustBadges,
  type TabId,
  type LoginFormData,
  type RegisterFormData,
  type GuestCheckoutFormData,
  type OAuthProvider,
} from '@/branches/ecommerce/shared/components/auth'

/**
 * AuthTemplate - Complete authentication page template
 *
 * Features:
 * - 2-column layout (branding panel + form panel)
 * - Tab navigation (Login/Register/Guest)
 * - OAuth support (Google, Facebook, Apple)
 * - Complete form validation
 * - Password strength meter
 * - KVK validation for B2B registration
 * - Guest checkout flow
 * - Trust badges (SSL, GDPR, ISO)
 *
 * @component
 * @example
 * <AuthTemplate defaultTab="login" />
 *
 * @example
 * <AuthTemplate defaultTab="register" />
 */

interface AuthTemplateProps {
  defaultTab?: TabId
}

export default function AuthTemplate({ defaultTab = 'login' }: AuthTemplateProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const handleLogin = async (data: LoginFormData) => {
    // TODO: Implement login logic
    console.log('Login:', data)
    // Example: await loginUser(data)
  }

  const handleRegister = async (data: RegisterFormData) => {
    // TODO: Implement registration logic
    console.log('Register:', data)
    // Example: await registerUser(data)
  }

  const handleGuestCheckout = async (data: GuestCheckoutFormData) => {
    // TODO: Implement guest checkout logic
    console.log('Guest checkout:', data)
    // Example: await createGuestSession(data)
    // window.location.href = '/checkout?guest=true'
  }

  const handleOAuthLogin = (provider: OAuthProvider) => {
    // TODO: Implement OAuth login
    console.log('OAuth login:', provider)
    // Example: window.location.href = `/api/auth/oauth/${provider}`
  }

  const handleForgotPassword = () => {
    // TODO: Implement forgot password
    console.log('Forgot password clicked')
    // Example: window.location.href = '/forgot-password'
  }

  const handleTermsClick = () => {
    // TODO: Open terms modal or navigate to terms page
    console.log('Terms clicked')
    // Example: window.open('/algemene-voorwaarden', '_blank')
  }

  const handlePrivacyClick = () => {
    // TODO: Open privacy modal or navigate to privacy page
    console.log('Privacy clicked')
    // Example: window.open('/privacy', '_blank')
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <AuthLayout>
      {/* Tab Switcher */}
      <AuthTabSwitcher activeTab={activeTab} onChange={setActiveTab} />

      {/* Login Panel */}
      {activeTab === 'login' && (
        <div className="animate-fadeIn">
          <LoginForm
            onSubmit={handleLogin}
            onOAuthLogin={handleOAuthLogin}
            onForgotPassword={handleForgotPassword}
            onRegisterClick={() => setActiveTab('register')}
          />
          <TrustBadges className="mt-6" />
        </div>
      )}

      {/* Register Panel */}
      {activeTab === 'register' && (
        <div className="animate-fadeIn">
          <RegisterForm
            onSubmit={handleRegister}
            onOAuthRegister={handleOAuthLogin}
            onLoginClick={() => setActiveTab('login')}
            onTermsClick={handleTermsClick}
            showB2BNotice
            b2bNoticeVariant="info"
          />
        </div>
      )}

      {/* Guest Checkout Panel */}
      {activeTab === 'guest' && (
        <div className="animate-fadeIn">
          <GuestCheckoutForm
            onSubmit={handleGuestCheckout}
            onRegisterClick={() => setActiveTab('register')}
            onTermsClick={handleTermsClick}
            onPrivacyClick={handlePrivacyClick}
            showInfoBox
          />
        </div>
      )}
    </AuthLayout>
  )
}
