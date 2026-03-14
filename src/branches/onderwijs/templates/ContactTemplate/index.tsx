'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ContactTemplateProps } from './types'

/**
 * ContactTemplate - Contact pagina voor onderwijs branch (/contact)
 *
 * Client component met form state.
 * Contactformulier met onderwijs-specifieke onderwerpen.
 * Docenten grid (content-team where branch: 'onderwijs').
 * FAQ sectie met veelgestelde vragen.
 */

const subjectOptions = [
  { value: 'cursusinformatie', label: 'Cursusinformatie' },
  { value: 'technisch-probleem', label: 'Technisch probleem' },
  { value: 'betaling', label: 'Betaling & facturatie' },
  { value: 'bedrijfsoplossing', label: 'Bedrijfsoplossing' },
  { value: 'overig', label: 'Overig' },
]

const faqItems = [
  {
    question: 'Hoe schrijf ik me in voor een cursus?',
    answer: 'Ga naar de cursuspagina en klik op "Inschrijven". Volg de stappen: vul je gegevens in, kies een betaalmethode en je hebt direct toegang.',
  },
  {
    question: 'Welke betaalmethoden accepteren jullie?',
    answer: 'Wij accepteren iDEAL, creditcard (Visa, Mastercard, American Express) en PayPal.',
  },
  {
    question: 'Hoe werkt de 30 dagen garantie?',
    answer: 'Als je binnen 30 dagen na inschrijving niet tevreden bent, kun je een volledige terugbetaling aanvragen. Geen vragen, geen voorwaarden.',
  },
  {
    question: 'Krijg ik een certificaat?',
    answer: 'Ja, bij cursussen die een certificaat aanbieden ontvang je na voltooiing een officieel certificaat dat je kunt downloaden.',
  },
  {
    question: 'Hoe lang heb ik toegang tot een cursus?',
    answer: 'Je hebt levenslang toegang tot alle cursussen waarvoor je ingeschreven bent, inclusief toekomstige updates.',
  },
  {
    question: 'Bieden jullie bedrijfslicenties aan?',
    answer: 'Ja! Neem contact met ons op voor teams en bedrijven. We bieden volumekorting en beheertools voor meerdere gebruikers.',
  },
]

export function ContactTemplate({ team = [] }: ContactTemplateProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
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

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      setError('Vul alle verplichte velden in')
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: 'contact-onderwijs',
          ...formData,
        }),
      })

      if (response.ok) {
        setSuccess(true)
      } else {
        setError('Er is een fout opgetreden. Probeer het later opnieuw.')
      }
    } catch {
      setError('Er is een fout opgetreden. Probeer het later opnieuw.')
    } finally {
      setSubmitting(false)
    }
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
          <span style={{ color: 'var(--color-navy, #1a2b4a)' }}>Contact</span>
        </nav>
      </div>

      {/* Hero */}
      <section
        className="py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, #2563EB, #1E40AF)' }}
      >
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1
            className="text-3xl text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))' }}
          >
            Neem contact op
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Heb je een vraag over een cursus, je inschrijving of wil je meer weten over bedrijfsoplossingen?
            Ons team staat voor je klaar.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact form */}
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
                Stuur ons een bericht
              </h2>

              {success ? (
                <div className="py-8 text-center">
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}
                  >
                    <svg className="h-8 w-8" style={{ color: '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    Bericht verzonden!
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>
                    Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op, meestal binnen 24 uur.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder="Je voornaam"
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
                        placeholder="Je achternaam"
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
                        placeholder="je@email.nl"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                        Telefoonnummer
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full rounded-lg border p-3 text-sm"
                        style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                        placeholder="06-12345678"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Onderwerp *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => updateField('subject', e.target.value)}
                      className="w-full rounded-lg border p-3 text-sm"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      required
                    >
                      <option value="">Selecteer een onderwerp...</option>
                      {subjectOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                      Bericht *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      rows={5}
                      className="w-full rounded-lg border p-3 text-sm"
                      style={{ borderColor: 'var(--color-grey, #e2e8f0)', color: 'var(--color-navy, #1a2b4a)' }}
                      placeholder="Waar kunnen we je mee helpen?"
                      required
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {submitting ? 'Versturen...' : 'Bericht versturen'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Contact info */}
            <div
              className="rounded-xl border p-6"
              style={{
                borderColor: 'var(--color-grey, #e2e8f0)',
                backgroundColor: 'var(--color-white, #ffffff)',
              }}
            >
              <h3 className="mb-4 text-lg font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Contactgegevens
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0" style={{ color: '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>E-mail</div>
                    <div className="text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>Zie de contactpagina</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0" style={{ color: '#2563EB' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--color-navy, #1a2b4a)' }}>Reactietijd</div>
                    <div className="text-sm" style={{ color: 'var(--color-grey-dark, #475569)' }}>Binnen 24 uur op werkdagen</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
            >
              <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                Snelle links
              </h3>
              <div className="space-y-2">
                <Link
                  href="/cursussen"
                  className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                  style={{ color: '#2563EB' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  Bekijk alle cursussen
                </Link>
                <Link
                  href="/docenten"
                  className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
                  style={{ color: '#2563EB' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  Onze docenten
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2
            className="mb-8 text-center text-2xl font-bold"
            style={{
              color: 'var(--color-navy, #1a2b4a)',
              fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
            }}
          >
            Veelgestelde vragen
          </h2>
          <div className="mx-auto max-w-3xl space-y-3">
            {faqItems.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-xl border overflow-hidden"
                style={{ borderColor: 'var(--color-grey, #e2e8f0)' }}
              >
                <summary
                  className="flex cursor-pointer items-center justify-between p-4"
                  style={{ backgroundColor: 'var(--color-white, #ffffff)' }}
                >
                  <span className="pr-4 text-sm font-semibold" style={{ color: 'var(--color-navy, #1a2b4a)' }}>
                    {faq.question}
                  </span>
                  <svg
                    className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                    style={{ color: 'var(--color-grey-mid, #94A3B8)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div
                  className="border-t px-4 py-3 text-sm leading-relaxed"
                  style={{
                    borderColor: 'var(--color-grey, #e2e8f0)',
                    color: 'var(--color-grey-dark, #475569)',
                    backgroundColor: 'var(--color-grey-light, #f8fafc)',
                  }}
                >
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Docenten grid */}
        {team.length > 0 && (
          <div className="mt-16">
            <h2
              className="mb-8 text-center text-2xl font-bold"
              style={{
                color: 'var(--color-navy, #1a2b4a)',
                fontFamily: 'var(--font-display, var(--font-serif, Georgia, serif))',
              }}
            >
              Onze docenten
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {team.map((member: any) => {
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
                        <p className="mt-1 text-sm" style={{ color: '#2563EB' }}>
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

export default ContactTemplate
