'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ViewingRequestProps } from './types'

/**
 * ViewingRequestTemplate - Bezichtiging plannen (/bezichtiging)
 *
 * Client component met form state.
 * Standalone bezichtigingsformulier (met optioneel propertyId via URL).
 * Team cards sectie met makelaars.
 * Trust/USP sectie.
 */

export function ViewingRequestTemplate({
  teamMembers = [],
  preselectedPropertyId,
}: ViewingRequestProps) {
  const [formData, setFormData] = useState({
    propertyId: preselectedPropertyId ? String(preselectedPropertyId) : '',
    viewingType: 'fysiek',
    preferredDate: '',
    preferredTime: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    remarks: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Update propertyId if passed through URL
  useEffect(() => {
    if (preselectedPropertyId) {
      setFormData((prev) => ({ ...prev, propertyId: String(preselectedPropertyId) }))
    }
  }, [preselectedPropertyId])

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Vul alle verplichte velden in')
      setSubmitting(false)
      return
    }

    if (!formData.preferredDate || !formData.preferredTime) {
      setError('Selecteer een gewenste datum en tijdstip')
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/vastgoed/viewing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: formData.propertyId ? Number(formData.propertyId) : undefined,
          viewingType: formData.viewingType,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          remarks: formData.remarks || undefined,
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
            Bezichtiging aangevraagd!
          </h1>
          <p className="mb-8 text-lg" style={{ color: 'var(--color-grey-dark, #475569)' }}>
            Bedankt voor uw aanvraag. Onze makelaar neemt binnen 24 uur contact met u op
            om de bezichtiging te bevestigen.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/woningen"
              className="rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Meer woningen bekijken
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
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Bezichtiging</span>
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
            Bezichtiging Plannen
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Plan een fysieke of online bezichtiging. Onze makelaar neemt contact met u op om de afspraak te bevestigen.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl border p-6 md:p-8"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h2
                className="mb-6 text-xl font-bold"
                style={{
                  color: 'var(--color-navy, #1a2b4a)',
                  fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                }}
              >
                Plan uw bezichtiging
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Viewing type toggle */}
                <div>
                  <label className="mb-3 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    Type bezichtiging
                  </label>
                  <div className="flex gap-4">
                    {[
                      { value: 'fysiek', label: 'Fysieke bezichtiging', desc: 'Bezoek de woning persoonlijk' },
                      { value: 'online', label: 'Online bezichtiging', desc: 'Via videocall met onze makelaar' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => updateField('viewingType', type.value)}
                        className="flex flex-1 flex-col items-center gap-1 rounded-xl border p-4 text-center transition-colors"
                        style={{
                          borderColor: formData.viewingType === type.value ? 'var(--color-primary)' : 'var(--color-grey, #e2e8f0)',
                          backgroundColor: formData.viewingType === type.value ? 'var(--color-primary-glow, rgba(63,81,181,0.05))' : 'transparent',
                        }}
                      >
                        <span
                          className="text-sm font-semibold"
                          style={{ color: formData.viewingType === type.value ? 'var(--color-primary)' : 'var(--color-grey-dark, #475569)' }}
                        >
                          {type.label}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                          {type.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date + time */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Gewenste datum *
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => updateField('preferredDate', e.target.value)}
                      className="w-full rounded-lg border p-3 text-sm"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Gewenst tijdstip *
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => updateField('preferredTime', e.target.value)}
                      className="w-full rounded-lg border p-3 text-sm"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      required
                    >
                      <option value="">Kies een tijdstip...</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </div>
                </div>

                {/* Personal details */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Voornaam *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="w-full rounded-lg border p-3 text-sm"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      placeholder="Uw voornaam"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Achternaam *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField('lastName', e.target.value)}
                      className="w-full rounded-lg border p-3 text-sm"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      placeholder="Uw achternaam"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full rounded-lg border p-3 text-sm"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      placeholder="uw@email.nl"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Telefoonnummer *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full rounded-lg border p-3 text-sm"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      placeholder="06-12345678"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    Opmerkingen
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => updateField('remarks', e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border p-3 text-sm"
                    style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                    placeholder="Bijzondere wensen of vragen..."
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-coral/20 bg-coral-50 p-3 text-sm text-coral-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {submitting ? 'Aanvraag versturen...' : 'Bezichtiging aanvragen'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* USPs */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--color-primary-glow, rgba(63,81,181,0.05))' }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Waarom bij ons bezichtigen?
              </h3>
              <ul className="space-y-2">
                {[
                  'Persoonlijke rondleiding door de makelaar',
                  'Deskundig advies over de woning',
                  'Informatie over de buurt en voorzieningen',
                  'Vrijblijvend en zonder verplichtingen',
                  'Ook online bezichtiging mogelijk',
                ].map((usp) => (
                  <li key={usp} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                    <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {usp}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div
              className="rounded-xl border p-5"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Snelle links
              </h3>
              <div className="space-y-2">
                <Link
                  href="/woningen"
                  className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  Bekijk alle woningen
                </Link>
                <Link
                  href="/waardebepaling"
                  className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  Gratis waardebepaling
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  Contact opnemen
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Team members / Makelaars */}
        {teamMembers.length > 0 && (
          <div className="mt-16">
            <h2
              className="mb-8 text-center text-2xl font-bold"
              style={{
                color: 'var(--color-navy, #1a2b4a)',
                fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
              }}
            >
              Onze makelaars
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member: any) => {
                const photo = typeof member.photo === 'object' ? member.photo : null
                return (
                  <div
                    key={member.id}
                    className="overflow-hidden rounded-xl border text-center"
                    style={{
                      borderColor: 'var(--color-grey, #e2e8f0)',
                      backgroundColor: 'var(--color-white, #ffffff)',
                    }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {photo?.url ? (
                        <Image
                          src={photo.url}
                          alt={photo.alt || member.name || ''}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div
                          className="flex h-full w-full items-center justify-center"
                          style={{ backgroundColor: 'var(--color-grey-light, #f1f5f9)' }}
                        >
                          <svg className="h-16 w-16" style={{ color: 'var(--color-grey-mid, #94A3B8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        {member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim()}
                      </h3>
                      {member.role && (
                        <p className="mt-1 text-sm" style={{ color: 'var(--color-primary)' }}>
                          {member.role}
                        </p>
                      )}
                      {member.shortDescription && (
                        <p className="mt-2 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                          {member.shortDescription}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewingRequestTemplate
