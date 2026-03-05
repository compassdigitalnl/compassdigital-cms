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
} from '@/branches/ecommerce/components/auth'
import type { LoginTemplate1Props } from './types'

export default function LoginTemplate1({ defaultTab = 'login' }: LoginTemplate1Props) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)

  const handleLogin = async (data: LoginFormData) => {
    // TODO: Implement login logic
    console.log('Login:', data)
  }

  const handleRegister = async (data: RegisterFormData) => {
    // TODO: Implement registration logic
    console.log('Register:', data)
  }

  const handleGuestCheckout = async (data: GuestCheckoutFormData) => {
    // TODO: Implement guest checkout logic
    console.log('Guest checkout:', data)
  }

  const handleOAuthLogin = (provider: OAuthProvider) => {
    // TODO: Implement OAuth login
    console.log('OAuth login:', provider)
  }

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password
    console.log('Forgot password clicked')
  }

  const handleTermsClick = () => {
    // TODO: Open terms page
    window.open('/algemene-voorwaarden', '_blank')
  }

  const handlePrivacyClick = () => {
    // TODO: Open privacy page
    window.open('/privacy', '_blank')
  }

  return (
    <AuthLayout>
      <AuthTabSwitcher activeTab={activeTab} onChange={setActiveTab} />

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
