'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Building2, Search, CheckCircle, Lock, Package,
} from 'lucide-react'
import { FormInput } from '@/branches/ecommerce/shared/components/auth'
import type { BranchOption } from '@/branches/ecommerce/b2b/components/registration'

const BranchSelector = dynamic(
  () => import('@/branches/ecommerce/b2b/components/registration').then(m => ({ default: m.BranchSelector })),
  { ssr: false }
)
const StepNavigation = dynamic(
  () => import('@/branches/ecommerce/b2b/components/registration').then(m => ({ default: m.StepNavigation })),
  { ssr: false }
)
import { resolveIcon } from '@/branches/shared/components/branches/iconMap'
import type { RegistrationData } from './types'

interface StepCompanyDetailsProps {
  data: RegistrationData
  onChange: (updates: Partial<RegistrationData>) => void
  onBack: () => void
  onNext: () => void
  branches?: Array<{ id: string; name: string; icon?: string }>
}

export const StepCompanyDetails: React.FC<StepCompanyDetailsProps> = ({
  data,
  onChange,
  onBack,
  onNext,
  branches,
}) => {
  // Convert CMS branches to BranchOption format
  const branchOptions: BranchOption[] = branches
    ? branches.map((b) => ({
        id: b.id,
        label: b.name,
        icon: (b.icon ? resolveIcon(b.icon) : undefined) || Package,
      }))
    : []

  const [kvkLookedUp, setKvkLookedUp] = useState(false)
  const [kvkResult, setKvkResult] = useState<{ name: string; address: string } | null>(null)

  const handleKvkLookup = () => {
    // TODO: Implement actual KVK API lookup
    if (data.kvkNumber.length === 8) {
      setKvkLookedUp(true)
      setKvkResult({
        name: 'Bedrijfsnaam via KVK',
        address: 'Adres wordt opgehaald...',
      })
    }
  }

  return (
    <div
      className="rounded-[20px] border bg-white p-9"
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="mb-1.5 flex items-center gap-2.5 font-heading text-[22px] font-extrabold text-theme-navy">
        <Building2 className="h-[22px] w-[22px] text-theme-teal" />
        Bedrijfsgegevens
      </div>
      <p className="mb-7 text-[15px] leading-relaxed text-theme-grey-dark">
        Vul uw KVK-nummer in voor automatische bedrijfsgegevens, of voer de gegevens handmatig in.
      </p>

      {/* KVK Lookup */}
      <div className="mb-5">
        <label className="mb-1.5 flex items-center gap-1 text-[13px] font-bold text-theme-navy">
          KVK-nummer <span className="text-xs text-[var(--color-error)]">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={data.kvkNumber}
            onChange={(e) => onChange({ kvkNumber: e.target.value })}
            placeholder="bijv. 12345678"
            className="
              h-[46px] flex-1 rounded-xl border-2 bg-theme-grey-light px-4
              text-[14.5px] text-theme-navy outline-none
              transition-all duration-200
              placeholder:text-theme-grey-mid
              focus:border-theme-teal focus:bg-white focus:shadow-[0_0_0_4px_var(--color-primary-glow)]
            "
            style={{ borderColor: 'var(--color-border)' }}
          />
          <button
            type="button"
            onClick={handleKvkLookup}
            className="
              flex items-center gap-1.5 whitespace-nowrap rounded-xl border-none
              bg-theme-navy px-5 text-[13px] font-bold text-white
              transition-all duration-200 hover:bg-theme-teal cursor-pointer
            "
          >
            <Search className="h-[15px] w-[15px]" />
            Opzoeken
          </button>
        </div>

        {kvkResult && (
          <div className="mt-2 flex items-center gap-3 rounded-xl border bg-[var(--color-success-light)] px-[18px] py-3.5"
            style={{ borderColor: 'rgba(0,200,83,0.15)' }}
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white">
              <CheckCircle className="h-[18px] w-[18px] text-[var(--color-success)]" />
            </div>
            <div>
              <div className="text-sm font-bold text-theme-navy">{kvkResult.name}</div>
              <div className="text-xs text-theme-grey-dark">{kvkResult.address}</div>
            </div>
          </div>
        )}
      </div>

      {/* Company fields */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          label="Bedrijfsnaam"
          required
          value={data.companyName}
          onChange={(e) => onChange({ companyName: e.target.value })}
          placeholder="Bedrijfsnaam"
        />
        <FormInput
          label="BTW-nummer"
          required
          value={data.vatNumber}
          onChange={(e) => onChange({ vatNumber: e.target.value })}
          placeholder="NL123456789B01"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          label="Straat + huisnr."
          required
          value={data.street}
          onChange={(e) => onChange({ street: e.target.value })}
          placeholder="Straat + huisnummer"
        />
        <FormInput
          label="Postcode + Plaats"
          required
          value={data.postalCity}
          onChange={(e) => onChange({ postalCity: e.target.value })}
          placeholder="1234 AB  Plaatsnaam"
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-theme-navy">
            Land <span className="text-xs text-[var(--color-error)]">*</span>
          </label>
          <select
            value={data.country}
            onChange={(e) => onChange({ country: e.target.value })}
            className="
              h-[46px] appearance-none rounded-xl border-2 bg-theme-grey-light
              px-4 pr-10 text-[14.5px] text-theme-navy outline-none
              transition-all duration-200
              focus:border-theme-teal focus:bg-white focus:shadow-[0_0_0_4px_var(--color-primary-glow)]
            "
            style={{ borderColor: 'var(--color-border)' }}
          >
            <option value="NL">Nederland</option>
            <option value="BE">Belgie</option>
            <option value="DE">Duitsland</option>
          </select>
        </div>
        <FormInput
          label="Telefoon bedrijf"
          value={data.companyPhone}
          onChange={(e) => onChange({ companyPhone: e.target.value })}
          placeholder="bijv. 06-12345678"
        />
      </div>

      {/* Branch selector (only shown when CMS branches exist) */}
      {branchOptions.length > 0 && (
        <div className="mb-4 mt-2">
          <label className="mb-1.5 flex items-center gap-1 text-[13px] font-bold text-theme-navy">
            Branche <span className="text-xs text-[var(--color-error)]">*</span>
          </label>
          <BranchSelector
            options={branchOptions}
            selected={data.branch}
            onSelect={(id) => onChange({ branch: id })}
          />
        </div>
      )}

      {/* Referral */}
      <div className="mb-4 mt-4">
        <label className="mb-1.5 block text-[13px] font-bold text-theme-navy">
          Hoe heeft u ons gevonden?
        </label>
        <select
          value={data.referralSource}
          onChange={(e) => onChange({ referralSource: e.target.value })}
          className="
            h-[46px] w-full appearance-none rounded-xl border-2 bg-theme-grey-light
            px-4 pr-10 text-[14.5px] text-theme-navy outline-none
            transition-all duration-200
            focus:border-theme-teal focus:bg-white focus:shadow-[0_0_0_4px_var(--color-primary-glow)]
          "
          style={{ borderColor: 'var(--color-border)' }}
        >
          <option value="">Maak een keuze...</option>
          <option value="google">Google</option>
          <option value="referral">Collega / aanbeveling</option>
          <option value="social">Social media</option>
          <option value="event">Beurs / evenement</option>
          <option value="existing">Bestaande leverancier</option>
          <option value="other">Anders</option>
        </select>
      </div>

      {/* Separate billing address */}
      <label className="mt-4 flex cursor-pointer items-start gap-2.5 py-1.5">
        <div
          className={`
            flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-[6px]
            border-2 transition-all duration-150 mt-0.5
            ${data.separateBillingAddress
              ? 'border-theme-teal bg-theme-teal'
              : ''
            }
          `}
          style={!data.separateBillingAddress ? { borderColor: 'var(--color-border)' } : undefined}
        >
          {data.separateBillingAddress && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          checked={data.separateBillingAddress}
          onChange={(e) => onChange({ separateBillingAddress: e.target.checked })}
          className="sr-only"
        />
        <span className="text-sm text-theme-navy">Afwijkend factuuradres</span>
      </label>

      <StepNavigation onBack={onBack} onNext={onNext} />

      {/* Trust note */}
      <div className="mt-5 flex items-center gap-2 px-1 text-[13px] text-theme-grey-mid">
        <Lock className="h-3.5 w-3.5 text-theme-teal" />
        Uw gegevens worden beveiligd verwerkt en nooit gedeeld met derden.
      </div>
    </div>
  )
}
