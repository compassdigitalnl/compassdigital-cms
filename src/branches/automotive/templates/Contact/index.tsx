'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import type { ContactTemplateProps } from './types'

/**
 * ContactTemplate - Contact pagina (/contact)
 *
 * 2-kolom layout met contactformulier (hoofdgedeelte) en sidebar
 * met openingstijden, adres en teamleden.
 * Formulier POST naar /api/contact.
 */
export function ContactTemplate({ settings, teamMembers }: ContactTemplateProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Er ging iets mis. Probeer het later opnieuw.')
      }

      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis.')
    } finally {
      setSubmitting(false)
    }
  }, [formData])

  const address = settings?.address || null
  const phoneNumber = settings?.phone || null
  const emailAddress = settings?.email || null

  return (
    <div style={{ backgroundColor: 'var(--color-bg, #ffffff)' }}>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
          <Link href="/" className="transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Contact</span>
        </nav>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pb-6">
        <h1
          className="text-3xl font-bold md:text-4xl"
          style={{
            color: 'var(--color-navy, #1a2b4a)',
            fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
          }}
        >
          Contact
        </h1>
        <p className="mt-2 text-lg" style={{ color: 'var(--color-grey-dark, #475569)' }}>
          Heeft u een vraag, wilt u een proefrit plannen of een afspraak maken? Neem gerust contact met ons op.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content - Contact form */}
          <div className="lg:col-span-2">
            <div
              className="rounded-xl border p-6 md:p-8"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mb-4 text-4xl">&#10003;</div>
                  <h2
                    className="mb-2 text-2xl font-bold"
                    style={{ color: 'var(--color-navy, #1a2b4a)' }}
                  >
                    Bedankt voor uw bericht!
                  </h2>
                  <p style={{ color: 'var(--color-grey-dark, #475569)' }}>
                    We nemen zo snel mogelijk contact met u op.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-sm font-medium"
                        style={{ color: 'var(--color-navy, #1a2b4a)' }}
                      >
                        Naam *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
                        style={{
                          borderColor: 'var(--color-grey, #e2e8f0)',
                          color: 'var(--color-navy, #1a2b4a)',
                        }}
                        placeholder="Uw volledige naam"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-sm font-medium"
                        style={{ color: 'var(--color-navy, #1a2b4a)' }}
                      >
                        E-mailadres *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
                        style={{
                          borderColor: 'var(--color-grey, #e2e8f0)',
                          color: 'var(--color-navy, #1a2b4a)',
                        }}
                        placeholder="u@email.nl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="mb-1.5 block text-sm font-medium"
                        style={{ color: 'var(--color-navy, #1a2b4a)' }}
                      >
                        Telefoonnummer
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
                        style={{
                          borderColor: 'var(--color-grey, #e2e8f0)',
                          color: 'var(--color-navy, #1a2b4a)',
                        }}
                        placeholder="06-12345678"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="mb-1.5 block text-sm font-medium"
                        style={{ color: 'var(--color-navy, #1a2b4a)' }}
                      >
                        Onderwerp *
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
                        style={{
                          borderColor: 'var(--color-grey, #e2e8f0)',
                          color: formData.subject ? 'var(--color-navy, #1a2b4a)' : 'var(--color-grey-mid, #94A3B8)',
                        }}
                      >
                        <option value="">Kies een onderwerp</option>
                        <option value="proefrit">Proefrit aanvragen</option>
                        <option value="occasions">Vraag over een occasion</option>
                        <option value="werkplaats">Werkplaats / APK</option>
                        <option value="inruil">Auto inruilen</option>
                        <option value="financiering">Financiering</option>
                        <option value="garantie">Garantie</option>
                        <option value="overig">Overig</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-sm font-medium"
                      style={{ color: 'var(--color-navy, #1a2b4a)' }}
                    >
                      Bericht *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:ring-2"
                      style={{
                        borderColor: 'var(--color-grey, #e2e8f0)',
                        color: 'var(--color-navy, #1a2b4a)',
                      }}
                      placeholder="Schrijf hier uw bericht..."
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {submitting ? 'Verzenden...' : 'Verstuur bericht'}
                    {!submitting && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Team members */}
            {teamMembers && teamMembers.length > 0 && (
              <div className="mt-8">
                <h2
                  className="mb-6 text-2xl font-bold"
                  style={{
                    color: 'var(--color-navy, #1a2b4a)',
                    fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
                  }}
                >
                  Ons team
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {teamMembers.map((member) => {
                    const photo = typeof member.photo === 'object' ? member.photo : null
                    return (
                      <div
                        key={member.id}
                        className="flex items-center gap-4 rounded-xl border p-4"
                        style={{
                          borderColor: 'var(--color-grey, #e2e8f0)',
                          backgroundColor: 'var(--color-white, #ffffff)',
                        }}
                      >
                        {photo?.url ? (
                          <img
                            src={photo.url}
                            alt={member.name || ''}
                            className="h-14 w-14 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                          >
                            {(member.name || '?').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                            {member.name}
                          </div>
                          {member.role && (
                            <div className="text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                              {member.role}
                            </div>
                          )}
                          {member.email && (
                            <a
                              href={'mailto:' + member.email}
                              className="text-xs transition-opacity hover:opacity-80"
                              style={{ color: 'var(--color-primary)' }}
                            >
                              {member.email}
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Opening hours */}
              <div
                className="rounded-xl border p-6"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                <h3
                  className="mb-4 text-lg font-semibold"
                  style={{ color: 'var(--color-navy, #1a2b4a)' }}
                >
                  Openingstijden
                </h3>
                <div className="space-y-2 text-sm">
                  {[
                    { day: 'Maandag', hours: settings?.openingHours?.monday || '08:00 - 17:30' },
                    { day: 'Dinsdag', hours: settings?.openingHours?.tuesday || '08:00 - 17:30' },
                    { day: 'Woensdag', hours: settings?.openingHours?.wednesday || '08:00 - 17:30' },
                    { day: 'Donderdag', hours: settings?.openingHours?.thursday || '08:00 - 17:30' },
                    { day: 'Vrijdag', hours: settings?.openingHours?.friday || '08:00 - 17:30' },
                    { day: 'Zaterdag', hours: settings?.openingHours?.saturday || '09:00 - 16:00' },
                    { day: 'Zondag', hours: settings?.openingHours?.sunday || 'Gesloten' },
                  ].map(({ day, hours }) => (
                    <div key={day} className="flex justify-between">
                      <span style={{ color: 'var(--color-grey-dark, #475569)' }}>{day}</span>
                      <span className="font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workshop info */}
              <div
                className="rounded-xl border p-6"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-white, #ffffff)',
                }}
              >
                <h3
                  className="mb-4 text-lg font-semibold"
                  style={{ color: 'var(--color-navy, #1a2b4a)' }}
                >
                  Werkplaats
                </h3>
                <p className="mb-3 text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                  Onze werkplaats is uitgerust voor alle merken en modellen. Van APK-keuring tot grote reparaties.
                </p>
                <Link
                  href="/werkplaats"
                  className="inline-flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Bekijk werkplaatsdiensten
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              {/* Address */}
              {address && (
                <div
                  className="rounded-xl border p-6"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    backgroundColor: 'var(--color-white, #ffffff)',
                  }}
                >
                  <h3
                    className="mb-4 text-lg font-semibold"
                    style={{ color: 'var(--color-navy, #1a2b4a)' }}
                  >
                    Adres
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                    {address}
                  </p>
                </div>
              )}

              {/* Phone & Email */}
              {(phoneNumber || emailAddress) && (
                <div
                  className="rounded-xl border p-6"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    backgroundColor: 'var(--color-white, #ffffff)',
                  }}
                >
                  <h3
                    className="mb-4 text-lg font-semibold"
                    style={{ color: 'var(--color-navy, #1a2b4a)' }}
                  >
                    Bereikbaarheid
                  </h3>
                  <div className="space-y-3">
                    {phoneNumber && (
                      <a
                        href={'tel:' + phoneNumber.replace(/\s/g, '')}
                        className="flex items-center gap-3 text-sm transition-colors hover:opacity-80"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{phoneNumber}</span>
                      </a>
                    )}
                    {emailAddress && (
                      <a
                        href={'mailto:' + emailAddress}
                        className="flex items-center gap-3 text-sm transition-colors hover:opacity-80"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{emailAddress}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Map placeholder */}
              <div
                className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border"
                style={{
                  borderColor: 'var(--color-grey, #e2e8f0)',
                  backgroundColor: 'var(--color-grey-light, #f1f5f9)',
                }}
              >
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8" style={{ color: 'var(--color-grey-mid, #94A3B8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <p className="mt-2 text-xs" style={{ color: 'var(--color-grey-mid, #94A3B8)' }}>
                    Kaart wordt hier geladen
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactTemplate
