'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { OpeningHours } from '@/branches/beauty/components/OpeningHours'
import type { ContactTemplateProps } from './types'

/**
 * ContactTemplate - Contact page (/contact)
 *
 * 2-column layout with a contact form (main) and sidebar
 * showing opening hours, address, and phone number.
 * Form submits to /api/contact.
 */
export function ContactTemplate({ settings }: ContactTemplateProps) {
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
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-grey-mid">
          <Link href="/" className="text-teal transition-colors hover:opacity-80">
            Home
          </Link>
          <span>/</span>
          <span className="text-navy">Contact</span>
        </nav>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pb-6">
        <h1 className="font-display text-3xl font-bold text-navy md:text-4xl">
          Contact
        </h1>
        <p className="mt-2 text-lg text-grey-dark">
          Heb je een vraag of wil je een afspraak maken? Neem gerust contact met ons op.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content - Contact form */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-grey-light bg-white p-6 md:p-8">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mb-4 text-4xl">&#10003;</div>
                  <h2 className="mb-2 text-2xl font-bold text-navy">
                    Bedankt voor je bericht!
                  </h2>
                  <p className="text-grey-dark">
                    We nemen zo snel mogelijk contact met je op.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-sm font-medium text-navy"
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
                        className="w-full rounded-lg border border-grey-light px-4 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20"
                        placeholder="Je volledige naam"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-sm font-medium text-navy"
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
                        className="w-full rounded-lg border border-grey-light px-4 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20"
                        placeholder="je@email.nl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="mb-1.5 block text-sm font-medium text-navy"
                      >
                        Telefoonnummer
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-grey-light px-4 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20"
                        placeholder="06-12345678"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="mb-1.5 block text-sm font-medium text-navy"
                      >
                        Onderwerp *
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-lg border border-grey-light px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20 ${
                          formData.subject ? 'text-navy' : 'text-grey-mid'
                        }`}
                      >
                        <option value="">Kies een onderwerp</option>
                        <option value="afspraak">Afspraak maken</option>
                        <option value="informatie">Informatie opvragen</option>
                        <option value="klacht">Klacht</option>
                        <option value="samenwerking">Samenwerking</option>
                        <option value="overig">Overig</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-sm font-medium text-navy"
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
                      className="w-full resize-none rounded-lg border border-grey-light px-4 py-2.5 text-sm text-navy outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/20"
                      placeholder="Schrijf hier je bericht..."
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="rounded-lg bg-coral-50 p-3 text-sm text-coral">
                      {error}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary disabled:opacity-50"
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Opening Hours */}
              <div className="rounded-xl border border-grey-light bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-navy">
                  Openingstijden
                </h3>
                <OpeningHours hours={settings?.openingHours} />
              </div>

              {/* Address */}
              {address && (
                <div className="rounded-xl border border-grey-light bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold text-navy">
                    Adres
                  </h3>
                  <p className="text-sm leading-relaxed text-grey-dark">
                    {address}
                  </p>
                </div>
              )}

              {/* Phone & Email */}
              {(phoneNumber || emailAddress) && (
                <div className="rounded-xl border border-grey-light bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold text-navy">
                    Bereikbaarheid
                  </h3>
                  <div className="space-y-3">
                    {phoneNumber && (
                      <a
                        href={'tel:' + phoneNumber.replace(/\s/g, '')}
                        className="flex items-center gap-3 text-sm text-teal transition-colors hover:opacity-80"
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
                        className="flex items-center gap-3 text-sm text-teal transition-colors hover:opacity-80"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactTemplate
