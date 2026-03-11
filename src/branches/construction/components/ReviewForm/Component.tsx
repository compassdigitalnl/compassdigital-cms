'use client'

import React, { useState } from 'react'
import type { ReviewFormProps } from './types'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function ReviewForm({ projectSlug, serviceSlug, className }: ReviewFormProps) {
  const [clientName, setClientName] = useState('')
  const [clientRole, setClientRole] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [quote, setQuote] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName || !rating || !quote) {
      setErrorMessage('Vul alle verplichte velden in.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/construction-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          clientRole: clientRole || undefined,
          rating,
          quote,
          projectSlug,
          serviceSlug,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Er is een fout opgetreden')
      }

      setStatus('success')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Er is een fout opgetreden')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={`rounded-xl border border-green-200 bg-green-50 p-6 text-center ${className || ''}`}>
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-800">Bedankt voor uw review!</h3>
        <p className="mt-1 text-sm text-green-700">Na goedkeuring wordt uw review zichtbaar op de website.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className || ''}`}>
      {/* Name */}
      <div>
        <label htmlFor="review-name" className="mb-1 block text-sm font-medium text-gray-700">
          Uw naam <span className="text-red-500">*</span>
        </label>
        <input
          id="review-name"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Uw volledige naam"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Role */}
      <div>
        <label htmlFor="review-role" className="mb-1 block text-sm font-medium text-gray-700">
          Uw functie / rol
        </label>
        <input
          id="review-role"
          type="text"
          value={clientRole}
          onChange={(e) => setClientRole(e.target.value)}
          placeholder="Bijv. 'Eigenaar villa', 'Projectleider'"
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Star Rating */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Beoordeling <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="p-0.5 transition-transform hover:scale-110"
              aria-label={`${star} sterren`}
            >
              <svg
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating)
                    ? 'text-amber-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 self-center text-sm text-gray-500">{rating}/5</span>
          )}
        </div>
      </div>

      {/* Review text */}
      <div>
        <label htmlFor="review-quote" className="mb-1 block text-sm font-medium text-gray-700">
          Uw review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="Vertel over uw ervaring..."
          required
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Error message */}
      {status === 'error' && errorMessage && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Versturen...' : 'Review plaatsen'}
      </button>

      <p className="text-xs text-gray-500">
        Uw review wordt na goedkeuring door ons team gepubliceerd.
      </p>
    </form>
  )
}
