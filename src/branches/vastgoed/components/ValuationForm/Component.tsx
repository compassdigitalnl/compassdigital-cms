'use client'

import React, { useState } from 'react'
import type { ValuationFormProps, ValuationFormState } from './types'

const PROPERTY_TYPES = [
  { label: 'Selecteer type', value: '' },
  { label: 'Appartement', value: 'appartement' },
  { label: 'Woonhuis', value: 'woonhuis' },
  { label: 'Villa', value: 'villa' },
  { label: 'Penthouse', value: 'penthouse' },
]

const initialState: ValuationFormState = {
  adres: '',
  woningtype: '',
  oppervlakte: '',
  naam: '',
  email: '',
  telefoon: '',
}

export const ValuationForm: React.FC<ValuationFormProps> = ({ className = '' }) => {
  const [form, setForm] = useState<ValuationFormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateField = <K extends keyof ValuationFormState>(
    key: K,
    value: ValuationFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/vastgoed/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: form.adres,
          propertyType: form.woningtype,
          area: form.oppervlakte ? Number(form.oppervlakte) : undefined,
          name: form.naam,
          email: form.email,
          phone: form.telefoon || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Er is iets misgegaan. Probeer het opnieuw.')
      }

      setIsSuccess(true)
      setForm(initialState)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl p-10 text-center shadow-lg ${className}`}
        style={{ background: 'linear-gradient(135deg, #00695C, #00897B)' }}
      >
        <div className="relative z-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <svg
              className="h-8 w-8 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="mb-2 text-2xl font-extrabold text-white">
            Aanvraag ontvangen!
          </h3>
          <p className="mb-6 text-sm text-white/80">
            Wij nemen binnen 24 uur contact met u op voor uw gratis waardebepaling.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="rounded-xl bg-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/30"
          >
            Terug naar formulier
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-10 shadow-lg ${className}`}
      style={{ background: 'linear-gradient(135deg, #1a1f3d, #2d3352)' }}
    >
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute -right-[100px] -top-[100px] h-[300px] w-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(63,81,181,0.15), transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 mb-8 text-center">
        <h2 className="mb-2 text-[28px] font-extrabold text-white">
          Wat is uw woning waard?
        </h2>
        <p className="text-sm text-white/70">
          Ontvang binnen 24 uur een gratis waardebepaling
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
        {/* Adres */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-white/90">
            Adres <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              type="text"
              required
              value={form.adres}
              onChange={(e) => updateField('adres', e.target.value)}
              placeholder="Bijv. Wilhelminastraat 42, Amsterdam"
              className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-3 text-[13px] text-white placeholder:text-white/40 focus:border-[#5C6BC0] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#3F51B5]/10"
            />
          </div>
        </div>

        {/* Woningtype + Oppervlakte */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/90">
              Woningtype <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={form.woningtype}
              onChange={(e) => updateField('woningtype', e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-[13px] text-white focus:border-[#5C6BC0] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#3F51B5]/10"
            >
              {PROPERTY_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#1a1f3d', color: 'white' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/90">
              Oppervlakte
            </label>
            <div className="relative">
              <input
                type="number"
                value={form.oppervlakte}
                onChange={(e) => updateField('oppervlakte', e.target.value)}
                placeholder="90"
                min="10"
                max="9999"
                className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-3 pr-10 text-[13px] text-white placeholder:text-white/40 focus:border-[#5C6BC0] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#3F51B5]/10"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50">
                m&sup2;
              </span>
            </div>
          </div>
        </div>

        {/* Naam + Email */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/90">
              Naam <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.naam}
              onChange={(e) => updateField('naam', e.target.value)}
              placeholder="Uw volledige naam"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-[13px] text-white placeholder:text-white/40 focus:border-[#5C6BC0] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#3F51B5]/10"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-white/90">
              E-mail <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="uw@email.nl"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-[13px] text-white placeholder:text-white/40 focus:border-[#5C6BC0] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#3F51B5]/10"
            />
          </div>
        </div>

        {/* Telefoon */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-white/90">
            Telefoon (optioneel)
          </label>
          <input
            type="tel"
            value={form.telefoon}
            onChange={(e) => updateField('telefoon', e.target.value)}
            placeholder="06-12345678"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-3 text-[13px] text-white placeholder:text-white/40 focus:border-[#5C6BC0] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#3F51B5]/10"
          />
        </div>

        {/* Photo upload placeholder */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-white/90">
            Foto&apos;s (optioneel)
          </label>
          <div className="cursor-pointer rounded-xl border-2 border-dashed border-white/30 bg-transparent px-6 py-7 text-center transition-colors hover:border-white/50 hover:bg-white/5">
            <svg
              className="mx-auto mb-2 h-8 w-8 text-white/60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            <div className="text-xs text-white/70">Sleep foto&apos;s hierheen of klik om te uploaden</div>
            <div className="mt-1 text-[10px] text-white/50">JPG, PNG tot 10MB</div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-500/20 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-[15px] font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #3F51B5, #5C6BC0)',
            boxShadow: '0 4px 12px rgba(63,81,181,0.3)',
          }}
        >
          {isSubmitting ? (
            'Bezig met versturen...'
          ) : (
            <>
              <svg
                className="h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" x2="11" y1="2" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Gratis waardebepaling aanvragen
            </>
          )}
        </button>

        {/* Trust badges */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-5 text-[11px] text-white/60">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            100% gratis
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            24u reactie
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Privacy gegarandeerd
          </span>
        </div>
      </form>
    </div>
  )
}
