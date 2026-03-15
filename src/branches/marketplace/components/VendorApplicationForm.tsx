'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle } from 'lucide-react'

export function VendorApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      companyName: formData.get('companyName'),
      contactPerson: formData.get('contactPerson'),
      email: formData.get('email'),
      phone: formData.get('phone') || undefined,
      website: formData.get('website') || undefined,
      description: formData.get('description'),
      estimatedProducts: formData.get('estimatedProducts') || undefined,
    }

    try {
      const res = await fetch('/api/vendor-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (res.ok && result.success) {
        setIsSuccess(true)
      } else {
        setError(result.error || 'Er is een fout opgetreden.')
      }
    } catch {
      setError('Er is een fout opgetreden. Probeer het later opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--color-success)' }} />
        <h3 className="text-xl font-extrabold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Aanvraag ontvangen!
        </h3>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Wij nemen zo snel mogelijk contact met u op.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Bedrijfsnaam *
          </label>
          <input
            name="companyName"
            required
            className="w-full h-11 px-4 rounded-xl text-sm border-2 focus:outline-none"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Contactpersoon *
          </label>
          <input
            name="contactPerson"
            required
            className="w-full h-11 px-4 rounded-xl text-sm border-2 focus:outline-none"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            E-mailadres *
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full h-11 px-4 rounded-xl text-sm border-2 focus:outline-none"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Telefoonnummer
          </label>
          <input
            name="phone"
            type="tel"
            className="w-full h-11 px-4 rounded-xl text-sm border-2 focus:outline-none"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Website
        </label>
        <input
          name="website"
          type="url"
          placeholder="https://"
          className="w-full h-11 px-4 rounded-xl text-sm border-2 focus:outline-none"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Beschrijving bedrijf *
        </label>
        <textarea
          name="description"
          required
          rows={4}
          className="w-full px-4 py-3 rounded-xl text-sm border-2 focus:outline-none resize-none"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Geschat aantal producten
        </label>
        <select
          name="estimatedProducts"
          className="w-full h-11 px-4 rounded-xl text-sm border-2 bg-white focus:outline-none"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
        >
          <option value="">Selecteer...</option>
          <option value="1-50">1 – 50</option>
          <option value="51-200">51 – 200</option>
          <option value="201-500">201 – 500</option>
          <option value="500+">500+</option>
        </select>
      </div>

      {error && (
        <div className="text-sm font-semibold" style={{ color: 'var(--color-error, #ef4444)' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isSubmitting ? 'Verzenden...' : 'Aanvraag versturen'}
      </button>
    </form>
  )
}
