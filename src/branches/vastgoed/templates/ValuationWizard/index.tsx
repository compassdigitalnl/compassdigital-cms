'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { ValuationWizardProps } from './types'

/**
 * ValuationWizardTemplate - Gratis waardebepaling formulier (/waardebepaling)
 *
 * Client component met form state.
 * Dark gradient formulier met adres, woningtype, oppervlakte, contactgegevens.
 * "Hoe werkt het?" info sectie met 3 stappen.
 */

const propertyTypeOptions = [
  { value: 'appartement', label: 'Appartement' },
  { value: 'woonhuis', label: 'Woonhuis' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
]

export function ValuationWizardTemplate({}: ValuationWizardProps) {
  const [formData, setFormData] = useState({
    address: '',
    propertyType: '',
    area: '',
    name: '',
    email: '',
    phone: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.address || !formData.propertyType || !formData.name || !formData.email) {
      setError('Vul alle verplichte velden in')
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/vastgoed/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: formData.address,
          propertyType: formData.propertyType,
          area: formData.area ? Number(formData.area) : undefined,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Er is een fout opgetreden')
        return
      }

      setSuccess(true)
    } catch {
      setError('Er is een fout opgetreden bij het versturen van uw aanvraag')
    } finally {
      setSubmitting(false)
    }
  }

  // Success state
  if (success) {
    return (
      <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: 'var(--color-primary-glow, rgba(63,81,181,0.1))' }}
          >
            <svg className="h-10 w-10" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1
            className="mb-4 text-3xl font-bold"
            style={{
              color: 'var(--color-navy, #1a2b4a)',
              fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
            }}
          >
            Aanvraag ontvangen!
          </h1>
          <p className="mb-8 text-lg" style={{ color: 'var(--color-grey-dark, #475569)' }}>
            Bedankt voor uw aanvraag voor een gratis waardebepaling.
            Wij nemen binnen 24 uur contact met u op om een afspraak in te plannen.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/woningen"
              className="rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Bekijk woningen
            </Link>
            <Link
              href="/"
              className="rounded-lg border px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-grey-dark, #475569)' }}
            >
              Naar homepage
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Waardebepaling</span>
        </nav>
      </div>

      {/* Hero */}
      <section
        className="py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, var(--color-primary, #3F51B5), var(--color-secondary, #303F9F))' }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1
            className="text-3xl text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Gratis Waardebepaling
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Benieuwd naar de waarde van uw woning? Vraag geheel vrijblijvend een gratis waardebepaling aan.
          </p>
        </div>
      </section>

      {/* Form section */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div
          className="rounded-2xl p-6 md:p-10"
          style={{ background: 'linear-gradient(135deg, var(--color-primary, #3F51B5), var(--color-secondary, #303F9F))' }}
        >
          <h2
            className="mb-2 text-center text-2xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Vraag uw waardebepaling aan
          </h2>
          <p className="mb-8 text-center text-sm text-white/70">
            Vul het formulier in en wij nemen binnen 24 uur contact met u op
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/90">
                Adres van de woning *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full rounded-lg border-0 p-3 text-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                placeholder="Bijv. Keizersgracht 100, Amsterdam"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/90">
                  Woningtype *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => updateField('propertyType', e.target.value)}
                  className="w-full rounded-lg border-0 p-3 text-sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                  required
                >
                  <option value="" style={{ color: '#333' }}>Selecteer type...</option>
                  {propertyTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ color: '#333' }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/90">
                  Oppervlakte (m{'\u00b2'})
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => updateField('area', e.target.value)}
                  className="w-full rounded-lg border-0 p-3 text-sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                  placeholder="Bijv. 120"
                />
              </div>
            </div>

            <div className="border-t border-white/20 pt-4">
              <p className="mb-4 text-sm text-white/70">Uw contactgegevens</p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    Naam *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full rounded-lg border-0 p-3 text-sm"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                    placeholder="Uw volledige naam"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/90">
                    E-mailadres *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full rounded-lg border-0 p-3 text-sm"
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                    placeholder="uw@email.nl"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-white/90">
                  Telefoonnummer
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full rounded-lg border-0 p-3 text-sm"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}
                  placeholder="06-12345678"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-300/30 bg-red-500/20 p-3 text-sm text-white">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-white px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ color: 'var(--color-primary, #3F51B5)' }}
            >
              {submitting ? 'Aanvraag versturen...' : 'Gratis waardebepaling aanvragen'}
            </button>
          </form>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-white/60">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              100% gratis
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Vrijblijvend
            </span>
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Binnen 24 uur reactie
            </span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mx-auto max-w-5xl px-6 pb-16">
        <h2
          className="mb-10 text-center text-2xl font-bold"
          style={{
            color: 'var(--color-navy, #1a2b4a)',
            fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
          }}
        >
          Hoe werkt het?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Vul formulier in',
              description: 'Vul het formulier hierboven in met het adres van uw woning en uw contactgegevens.',
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              ),
            },
            {
              step: '2',
              title: 'Wij analyseren uw woning',
              description: 'Onze makelaar bezoekt u thuis en maakt een uitgebreide analyse van uw woning en de omgeving.',
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              ),
            },
            {
              step: '3',
              title: 'Ontvang uw waardebepaling',
              description: 'U ontvangt een professioneel rapport met de geschatte marktwaarde van uw woning.',
              icon: (
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              ),
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  backgroundColor: 'var(--color-primary-glow, rgba(63,81,181,0.08))',
                  color: 'var(--color-primary)',
                }}
              >
                {item.icon}
              </div>
              <div
                className="mb-1 text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--color-primary)' }}
              >
                Stap {item.step}
              </div>
              <h3
                className="mb-2 text-lg font-semibold"
                style={{ color: 'var(--color-navy, #1a2b4a)' }}
              >
                {item.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ValuationWizardTemplate
