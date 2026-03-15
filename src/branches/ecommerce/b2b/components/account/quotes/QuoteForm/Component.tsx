'use client'

import React from 'react'
import { Send, Clock, Check } from 'lucide-react'
import type { QuoteFormProps } from './types'

const INPUT_BASE =
  'w-full h-11 px-3.5 border-2 rounded-lg text-sm outline-none transition-all bg-grey-light focus:bg-white'

const SECTORS = [
  'Huisarts',
  'Tandarts',
  'Verloskunde',
  'Fysiotherapie',
  'Thuiszorg',
  'Ziekenhuis',
  'Anders',
]

const FREQUENCIES = ['Eenmalig', 'Wekelijks', 'Tweewekelijks', 'Maandelijks', 'Per kwartaal']

function FormField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold" style={{ color: 'var(--color-foreground)' }}>
        {label}
        {required && <span className="text-coral ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function StyledInput({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={INPUT_BASE}
      style={{ borderColor: 'var(--color-border)', fontFamily: 'inherit' }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary)'
        e.currentTarget.style.boxShadow = '0 0 0 4px var(--color-primary-glow)'
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)'
        e.currentTarget.style.boxShadow = 'none'
        props.onBlur?.(e)
      }}
    />
  )
}

function StyledSelect({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={INPUT_BASE + ' appearance-none'}
      style={{
        borderColor: 'var(--color-border)',
        fontFamily: 'inherit',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        paddingRight: '36px',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary)'
        e.currentTarget.style.boxShadow = '0 0 0 4px var(--color-primary-glow)'
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)'
        e.currentTarget.style.boxShadow = 'none'
        props.onBlur?.(e)
      }}
    >
      {children}
    </select>
  )
}

function CheckboxRow({
  checked,
  onToggle,
  children,
}: {
  checked: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <label
      className="flex items-start gap-2.5 py-1.5 cursor-pointer select-none"
      onClick={onToggle}
    >
      <div
        className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
        style={{
          background: checked ? 'var(--color-primary)' : 'white',
          borderColor: checked ? 'var(--color-primary)' : 'var(--color-border)',
        }}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
      <span className="text-sm leading-relaxed" style={{ color: 'var(--color-foreground)' }}>
        {children}
      </span>
    </label>
  )
}

export function QuoteForm({ formData, onChange, onSubmit, isSubmitting }: QuoteFormProps) {
  return (
    <div className="space-y-5">
      {/* Section 2: Company details */}
      <div className="bg-white border rounded-2xl p-6 md:p-7" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
            style={{ background: 'var(--color-primary)' }}
          >
            2
          </span>
          <h2 className="text-base font-extrabold" style={{ color: 'var(--color-foreground)', fontFamily: 'var(--font-heading)' }}>
            Bedrijfsgegevens
          </h2>
        </div>
        <p className="text-sm mb-5 ml-9" style={{ color: 'var(--color-muted-foreground)' }}>
          Vul uw contactgegevens in zodat wij de offerte op naam kunnen stellen.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <FormField label="Bedrijfsnaam" required>
            <StyledInput
              placeholder="Huisartsenpraktijk De Vries"
              value={formData.companyName}
              onChange={(e) => onChange('companyName', e.target.value)}
            />
          </FormField>
          <FormField label="KVK-nummer">
            <StyledInput
              placeholder="12345678"
              value={formData.kvkNumber}
              onChange={(e) => onChange('kvkNumber', e.target.value)}
            />
          </FormField>
          <FormField label="Contactpersoon" required>
            <StyledInput
              placeholder="Jan de Vries"
              value={formData.contactPerson}
              onChange={(e) => onChange('contactPerson', e.target.value)}
            />
          </FormField>
          <FormField label="E-mailadres" required>
            <StyledInput
              type="email"
              placeholder="jan@bedrijf.nl"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </FormField>
          <FormField label="Telefoonnummer" required>
            <StyledInput
              type="tel"
              placeholder="06-12345678"
              value={formData.phone}
              onChange={(e) => onChange('phone', e.target.value)}
            />
          </FormField>
          <FormField label="Branche">
            <StyledSelect
              value={formData.sector}
              onChange={(e) => onChange('sector', e.target.value)}
            >
              <option value="">Selecteer…</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </StyledSelect>
          </FormField>
        </div>
      </div>

      {/* Section 3: Delivery preferences + submit */}
      <div className="bg-white border rounded-2xl p-6 md:p-7" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
            style={{ background: 'var(--color-primary)' }}
          >
            3
          </span>
          <h2 className="text-base font-extrabold" style={{ color: 'var(--color-foreground)', fontFamily: 'var(--font-heading)' }}>
            Leveringsvoorkeuren
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-5">
          <FormField label="Gewenste leverdatum">
            <StyledInput
              type="date"
              value={formData.desiredDeliveryDate}
              onChange={(e) => onChange('desiredDeliveryDate', e.target.value)}
            />
          </FormField>
          <FormField label="Leverfrequentie">
            <StyledSelect
              value={formData.deliveryFrequency}
              onChange={(e) => onChange('deliveryFrequency', e.target.value)}
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </StyledSelect>
          </FormField>
        </div>

        <div className="mt-3.5">
          <FormField label="Opmerkingen">
            <textarea
              className="w-full px-3.5 py-3 border-2 rounded-lg text-sm outline-none transition-all bg-grey-light focus:bg-white resize-y min-h-[100px] leading-relaxed"
              placeholder="Eventuele wensen, specificaties of vragen…"
              value={formData.notes}
              onChange={(e) => onChange('notes', e.target.value)}
              style={{ borderColor: 'var(--color-border)', fontFamily: 'inherit' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-primary)'
                e.currentTarget.style.boxShadow = '0 0 0 4px var(--color-primary-glow)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </FormField>
        </div>

        <div className="mt-4 space-y-1">
          <CheckboxRow
            checked={formData.wantsConsultation}
            onToggle={() => onChange('wantsConsultation', !formData.wantsConsultation)}
          >
            Ik wil graag een persoonlijk adviesgesprek over de mogelijkheden
          </CheckboxRow>
          <CheckboxRow
            checked={formData.agreedToPrivacy}
            onToggle={() => onChange('agreedToPrivacy', !formData.agreedToPrivacy)}
          >
            Ik ga akkoord met de{' '}
            <a
              href="/privacy"
              className="underline"
              style={{ color: 'var(--color-primary)' }}
              onClick={(e) => e.stopPropagation()}
            >
              privacyverklaring
            </a>
          </CheckboxRow>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="btn btn-primary btn-lg inline-flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Versturen…' : 'Offerte aanvragen'}
          </button>

          <div className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: 'var(--color-muted)' }}>
            <Clock className="w-3.5 h-3.5" />
            U ontvangt uw offerte binnen 24 uur op werkdagen
          </div>
        </div>
      </div>
    </div>
  )
}
