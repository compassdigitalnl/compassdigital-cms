/**
 * BackInStockNotifier Component (C8)
 *
 * Email signup widget for out-of-stock products. Captures email addresses
 * and sends notifications when product is back in stock. Reduces lost sales
 * from temporary stockouts.
 *
 * Features:
 * - Coral "Tijdelijk uitverkocht" label with dot
 * - Clear title and description
 * - Email input with focus state and validation
 * - Submit button with bell icon
 * - Green success confirmation
 * - Optional estimated restock date display
 * - GDPR-friendly (requires explicit opt-in)
 *
 * @category E-commerce / Inventory Management
 * @component C8
 */

'use client'

import React, { useState } from 'react'
import { Bell, CheckCircle } from 'lucide-react'
import type { BackInStockNotifierProps } from './types'

export const BackInStockNotifier: React.FC<BackInStockNotifierProps> = ({
  product,
  onSubmit,
  className = '',
  showEstimatedDate = false,
  customTitle,
  customDescription,
}) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Voer een geldig e-mailadres in')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit(email, product.id, product.variant)
      setIsSuccess(true)
      setEmail('')
    } catch (err) {
      setError('Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format estimated restock date
  const formatEstimatedDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div
      className={`
        bis-card bg-white border border-gray-200 rounded-2xl p-6 max-w-[440px]
        ${className}
      `}
      role="region"
      aria-label="Voorraad notificatie aanmelding"
    >
      {/* Header */}
      <div className="bis-header flex items-center gap-2 mb-3">
        <div className="bis-label text-xs font-bold text-red-500 flex items-center gap-1">
          <span className="dot w-[7px] h-[7px] rounded-full bg-red-500" aria-hidden="true" />
          Tijdelijk uitverkocht
        </div>
      </div>

      {/* Title */}
      <h3 className="bis-title font-['Plus_Jakarta_Sans'] text-[15px] font-extrabold text-navy-600 mb-1">
        {customTitle || 'Ontvang een melding wanneer dit product weer op voorraad is'}
      </h3>

      {/* Description */}
      <p className="bis-desc text-[13px] text-gray-500 mb-3.5 leading-snug">
        {customDescription ||
          'Vul uw e-mailadres in en wij sturen u automatisch een bericht zodra dit product weer leverbaar is.'}
      </p>

      {/* Estimated Restock Date */}
      {showEstimatedDate && product.estimatedRestock && (
        <p className="text-xs text-gray-600 mb-3 font-medium">
          Verwacht leverbaar: {formatEstimatedDate(product.estimatedRestock)}
        </p>
      )}

      {/* Form */}
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="bis-form flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Uw e-mailadres"
            required
            disabled={isSubmitting}
            className={`
              bis-input flex-1 h-[42px] px-3.5 border-2 border-gray-200 rounded-lg
              text-sm text-navy-600 bg-gray-50 outline-none transition-all duration-200
              placeholder:text-gray-400
              focus:border-teal-600 focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,137,123,0.12)]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            aria-label="E-mailadres voor voorraad notificatie"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-sm bis-btn flex items-center gap-1.5 whitespace-nowrap"
            aria-label="Melding aanvragen"
          >
            <Bell className="w-[15px] h-[15px]" aria-hidden="true" />
            {isSubmitting ? 'Bezig...' : 'Meld mij'}
          </button>
        </form>
      ) : (
        <div
          className="bis-success flex items-center gap-1.5 p-3 px-4 bg-green-50 rounded-lg text-[13px] text-green-600 font-semibold"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="w-4 h-4" aria-hidden="true" />
          U ontvangt een melding op het opgegeven adres.
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="bis-error mt-2 text-xs text-red-600 font-medium"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {/* GDPR Notice (optional) */}
      <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
        Door aan te melden gaat u akkoord met het ontvangen van één e-mail wanneer dit product weer
        op voorraad is.
      </p>
    </div>
  )
}

export default BackInStockNotifier
