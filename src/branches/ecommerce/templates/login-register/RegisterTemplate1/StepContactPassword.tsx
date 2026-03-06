'use client'

import React from 'react'
import { UserCircle, Lock } from 'lucide-react'
import { FormInput, PasswordStrengthMeter } from '@/branches/ecommerce/components/auth'
import { StepNavigation } from '@/branches/ecommerce/components/registration'
import type { RegistrationData } from './types'

interface StepContactPasswordProps {
  data: RegistrationData
  onChange: (updates: Partial<RegistrationData>) => void
  onBack: () => void
  onNext: () => void
}

export const StepContactPassword: React.FC<StepContactPasswordProps> = ({
  data,
  onChange,
  onBack,
  onNext,
}) => {
  return (
    <div
      className="rounded-[20px] border bg-white p-9"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="mb-1.5 flex items-center gap-2.5 font-heading text-[22px] font-extrabold text-theme-navy">
        <UserCircle className="h-[22px] w-[22px] text-theme-teal" />
        Contact & wachtwoord
      </div>
      <p className="mb-7 text-[15px] leading-relaxed text-theme-grey-dark">
        Vul uw persoonlijke gegevens in en kies een wachtwoord voor uw account.
      </p>

      {/* Name fields */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          label="Voornaam"
          required
          value={data.firstName}
          onChange={(e) => onChange({ firstName: e.target.value })}
          placeholder="Voornaam"
          icon="user"
        />
        <FormInput
          label="Achternaam"
          required
          value={data.lastName}
          onChange={(e) => onChange({ lastName: e.target.value })}
          placeholder="Achternaam"
          icon="user"
        />
      </div>

      {/* Email & phone */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          label="E-mailadres"
          required
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="u@bedrijf.nl"
          icon="mail"
        />
        <FormInput
          label="Telefoonnummer"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="06-12345678"
          icon="phone"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <FormInput
          label="Wachtwoord"
          required
          type="password"
          value={data.password}
          onChange={(e) => onChange({ password: e.target.value })}
          placeholder="Minimaal 8 tekens"
          icon="lock"
          showPasswordToggle
        />
        <PasswordStrengthMeter password={data.password} className="mt-1" />
      </div>

      {/* Terms acceptance */}
      <label className="mt-6 flex cursor-pointer items-start gap-2.5 py-1.5">
        <div
          className={`
            flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[6px]
            border-2 transition-all duration-150 mt-0.5
            ${data.acceptTerms
              ? 'border-theme-teal bg-theme-teal'
              : ''
            }
          `}
          style={!data.acceptTerms ? { borderColor: 'var(--color-border)' } : undefined}
        >
          {data.acceptTerms && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          checked={data.acceptTerms}
          onChange={(e) => onChange({ acceptTerms: e.target.checked })}
          className="sr-only"
        />
        <span className="text-sm leading-snug text-theme-navy">
          Ik ga akkoord met de{' '}
          <a href="/algemene-voorwaarden" target="_blank" className="text-theme-teal underline underline-offset-2">
            algemene voorwaarden
          </a>{' '}
          en het{' '}
          <a href="/privacy" target="_blank" className="text-theme-teal underline underline-offset-2">
            privacybeleid
          </a>
        </span>
      </label>

      <StepNavigation onBack={onBack} onNext={onNext} isLastStep />

      <div className="mt-5 flex items-center gap-2 px-1 text-[13px] text-theme-grey-mid">
        <Lock className="h-3.5 w-3.5 text-theme-teal" />
        Uw gegevens worden beveiligd verwerkt en nooit gedeeld met derden.
      </div>
    </div>
  )
}
