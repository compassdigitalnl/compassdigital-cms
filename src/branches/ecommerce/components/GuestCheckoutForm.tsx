'use client'

import { useState } from 'react'
import { Mail, Phone, User, Building } from 'lucide-react'
import Link from 'next/link'

/**
 * Guest Checkout Form Component
 *
 * Allows users to checkout without creating an account.
 * Collects minimal information needed for order processing.
 *
 * Features:
 * - Email (required - for order confirmation)
 * - Name fields (required)
 * - Organization (optional)
 * - Phone (required)
 * - Terms & conditions acceptance
 * - Info box showing benefits of account creation
 *
 * @example
 * ```tsx
 * <GuestCheckoutForm
 *   onSubmit={(data) => handleGuestCheckout(data)}
 *   onRegisterClick={() => router.push('/register')}
 * />
 * ```
 */

export interface GuestCheckoutData {
  email: string
  firstName: string
  lastName: string
  organization?: string
  phone: string
  acceptTerms: boolean
}

export interface GuestCheckoutFormProps {
  onSubmit: (data: GuestCheckoutData) => void | Promise<void>
  onRegisterClick?: () => void
  isLoading?: boolean
  error?: string | null
}

export function GuestCheckoutForm({
  onSubmit,
  onRegisterClick,
  isLoading = false,
  error = null,
}: GuestCheckoutFormProps) {
  const [formData, setFormData] = useState<GuestCheckoutData>({
    email: '',
    firstName: '',
    lastName: '',
    organization: '',
    phone: '',
    acceptTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const updateField = (field: keyof GuestCheckoutData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const benefits = [
    'Persoonlijke staffelprijzen',
    'Bestelhistorie inzien',
    'Snelle nabestellingen',
    'Bestellijsten opslaan',
  ]

  return (
    <div>
      {/* Info Box */}
      <div
        className="p-5 rounded-xl mb-6"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 137, 123, 0.04), rgba(10, 38, 71, 0.02))',
          border: '1px solid rgba(0, 137, 123, 0.12)',
        }}
      >
        <h4
          className="text-sm font-bold mb-2 flex items-center gap-2"
          style={{ color: 'var(--color-text-primary, #1e293b)' }}
        >
          ℹ️ Goed om te weten
        </h4>
        <p className="text-sm mb-3" style={{ color: 'var(--color-text-muted, #64748b)' }}>
          Als gast kunt u eenmalig bestellen zonder account. Met een account profiteert u van:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-2 text-xs font-semibold"
              style={{ color: 'var(--color-text-muted, #64748b)' }}
            >
              <span className="text-sm" style={{ color: 'var(--color-primary, #00897b)' }}>
                ✓
              </span>
              {benefit}
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="p-4 rounded-xl mb-4 text-sm"
          style={{
            background: 'var(--color-error-bg, #fef2f2)',
            border: '1px solid var(--color-error, #dc2626)',
            color: 'var(--color-error, #dc2626)',
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Voornaam">
            <input
              type="text"
              placeholder="Jan"
              required
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              disabled={isLoading}
              className="input-base"
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm, 8px)',
                border: '1.5px solid var(--color-border, #e2e8f0)',
                fontSize: '14px',
                outline: 'none',
                opacity: isLoading ? 0.6 : 1,
              }}
            />
          </FormField>

          <FormField label="Achternaam">
            <input
              type="text"
              placeholder="de Vries"
              required
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              disabled={isLoading}
              className="input-base"
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm, 8px)',
                border: '1.5px solid var(--color-border, #e2e8f0)',
                fontSize: '14px',
                outline: 'none',
                opacity: isLoading ? 0.6 : 1,
              }}
            />
          </FormField>
        </div>

        {/* Email */}
        <FormField label="E-mailadres">
          <InputWithIcon
            icon={<Mail className="w-4 h-4" />}
            type="email"
            placeholder="naam@organisatie.nl"
            required
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        {/* Organization (Optional) */}
        <FormField label="Organisatie (optioneel)">
          <InputWithIcon
            icon={<Building className="w-4 h-4" />}
            type="text"
            placeholder="Naam organisatie of praktijk"
            value={formData.organization}
            onChange={(e) => updateField('organization', e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        {/* Phone */}
        <FormField label="Telefoonnummer">
          <InputWithIcon
            icon={<Phone className="w-4 h-4" />}
            type="tel"
            placeholder="06 12345678"
            required
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            disabled={isLoading}
          />
        </FormField>

        {/* Terms Acceptance */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => updateField('acceptTerms', e.target.checked)}
            required
            disabled={isLoading}
            className="w-4 h-4 mt-0.5 rounded"
            style={{ accentColor: 'var(--color-primary, #00897b)' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-text-muted, #64748b)' }}>
            Ik ga akkoord met de{' '}
            <Link
              href="/algemene-voorwaarden"
              className="font-semibold hover:underline"
              style={{ color: 'var(--color-primary, #00897b)' }}
            >
              algemene voorwaarden
            </Link>{' '}
            en het{' '}
            <Link
              href="/privacy"
              className="font-semibold hover:underline"
              style={{ color: 'var(--color-primary, #00897b)' }}
            >
              privacybeleid
            </Link>
          </span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 text-white rounded-xl font-bold text-base transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--color-primary, #00897b)' }}
        >
          {isLoading ? 'Bezig...' : 'Doorgaan naar bezorging'}
        </button>

        {/* Register CTA */}
        {onRegisterClick && (
          <button
            type="button"
            onClick={onRegisterClick}
            disabled={isLoading}
            className="w-full py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:bg-opacity-5 disabled:opacity-50"
            style={{
              borderColor: 'var(--color-primary, #00897b)',
              color: 'var(--color-primary, #00897b)',
            }}
          >
            🏥 Toch liever een zakelijk account?
          </button>
        )}
      </form>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-sm font-semibold mb-1.5"
        style={{ color: 'var(--color-text-primary, #334155)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function InputWithIcon({
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode
}) {
  return (
    <div className="relative">
      <div
        className="absolute left-3.5 top-1/2 -translate-y-1/2"
        style={{ color: 'var(--color-text-muted, #94a3b8)' }}
      >
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-11 py-3 pr-4 rounded-xl border-2 outline-none transition-all focus:border-current disabled:opacity-60"
        style={{
          borderColor: 'var(--color-border, #e2e8f0)',
          fontSize: '14px',
        }}
      />
    </div>
  )
}

export default GuestCheckoutForm
