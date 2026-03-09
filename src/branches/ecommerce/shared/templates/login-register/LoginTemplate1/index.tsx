'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Tag, CreditCard, ClipboardList, Users, Headphones, ShieldCheck } from 'lucide-react'
import {
  LoginForm,
  TrustBadges,
  type LoginFormData,
  type OAuthProvider,
} from '@/branches/ecommerce/shared/components/auth'
import { useAuth } from '@/providers/Auth'
import { useFeatures } from '@/providers/Features'
import type { LoginTemplate1Props } from './types'

const B2B_BENEFITS = [
  { icon: Tag, title: 'Exclusieve B2B prijzen', description: 'Scherpe prijzen voor zakelijke klanten' },
  { icon: CreditCard, title: 'Betaal achteraf', description: 'Betaaltermijn op factuur' },
  { icon: ClipboardList, title: 'Bestellijsten & snel bestellen', description: 'Sla vaste bestellingen op' },
  { icon: Users, title: 'Meerdere gebruikers', description: 'Eigen inlog per collega' },
  { icon: Headphones, title: 'Persoonlijk advies', description: 'Direct contact met uw accountmanager' },
]

const B2C_BENEFITS = [
  { icon: Tag, title: 'Exclusieve aanbiedingen', description: 'Ontvang persoonlijke kortingen' },
  { icon: ClipboardList, title: 'Bestelgeschiedenis', description: 'Bekijk al uw eerdere bestellingen' },
  { icon: CreditCard, title: 'Sneller afrekenen', description: 'Uw gegevens worden onthouden' },
  { icon: Headphones, title: 'Klantenservice', description: 'Snelle hulp bij vragen' },
]

export default function LoginTemplate1({ defaultTab = 'login', siteConfig }: LoginTemplate1Props) {
  const { user, status } = useAuth()
  const router = useRouter()
  const featureFlags = useFeatures()
  const isB2B = featureFlags.b2b !== false // B2B is default unless explicitly disabled
  const benefits = isB2B ? B2B_BENEFITS : B2C_BENEFITS

  // Redirect to /account/ if already logged in
  useEffect(() => {
    if (status === 'loggedIn' && user) {
      router.replace('/account/')
    }
  }, [status, user, router])

  // Show nothing while checking auth or redirecting
  if (status === 'loggedIn' && user) {
    return null
  }

  const handleLogin = async (data: LoginFormData) => {
    // TODO: Implement login logic
    console.log('Login:', data)
  }

  const handleOAuthLogin = (provider: OAuthProvider) => {
    // TODO: Implement OAuth login
    console.log('OAuth login:', provider)
  }

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password
    console.log('Forgot password clicked')
  }

  return (
    <div
      className="min-h-[calc(100vh-140px)] py-8 lg:py-12 px-4 sm:px-6"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="mx-auto max-w-[1060px] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* LEFT: Login form */}
        <div
          className="rounded-2xl border bg-white p-8 lg:p-10"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <LoginForm
            onSubmit={handleLogin}
            onOAuthLogin={handleOAuthLogin}
            onForgotPassword={handleForgotPassword}
            showOAuth={false}
          />
          <TrustBadges className="mt-6" />
        </div>

        {/* RIGHT: Register CTA */}
        <div
          className="rounded-2xl border bg-white p-8 lg:p-10"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2
            className="text-2xl lg:text-3xl mb-2"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-foreground)',
            }}
          >
            Nieuw hier?
          </h2>
          <p
            className="text-sm mb-6 leading-relaxed"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            {isB2B
              ? 'Maak een zakelijk account aan en profiteer direct van exclusieve voordelen.'
              : 'Maak een account aan en profiteer direct van persoonlijke voordelen.'}
          </p>

          {/* Benefits */}
          <div className="flex flex-col gap-3 mb-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div key={benefit.title} className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px]"
                    style={{ background: 'var(--color-primary-glow)' }}
                  >
                    <Icon className="h-[18px] w-[18px]" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>
                      {benefit.title}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
                      {benefit.description}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA Button */}
          <Link
            href="/klant-worden/"
            className="flex w-full items-center justify-center gap-2 rounded-lg py-3.5 px-4 text-white text-base font-bold no-underline transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'var(--color-primary)',
              boxShadow: '0 4px 16px var(--color-primary-glow)',
            }}
          >
            {isB2B ? 'Zakelijk account aanmaken' : 'Account aanmaken'}
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Trust note */}
          <div
            className="flex items-center justify-center gap-1.5 mt-4 text-xs"
            style={{ color: 'var(--color-muted-foreground)' }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {isB2B ? 'Registratie is gratis en vrijblijvend' : 'Gratis en binnen 1 minuut aangemeld'}
          </div>
        </div>
      </div>
    </div>
  )
}
