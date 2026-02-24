'use client'

import { useState } from 'react'
import { Bell, BellRing, Check, X } from 'lucide-react'

/**
 * Notify Me Button Component
 *
 * Allows users to subscribe to notifications for new magazine editions.
 * Uses theme variables for styling - fully reusable across all clients.
 *
 * Feature: Aboland Magazine Notifications
 */

export type NotifyMeButtonProps = {
  productId: string | number
  magazineTitle: string
  userEmail?: string // Pre-fill if user is logged in
  className?: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export function NotifyMeButton({
  productId,
  magazineTitle,
  userEmail,
  className = '',
}: NotifyMeButtonProps) {
  const [email, setEmail] = useState(userEmail || '')
  const [status, setStatus] = useState<Status>('idle')
  const [showInput, setShowInput] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function subscribe() {
    if (!email) {
      setErrorMessage('Vul een geldig e-mailadres in')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrorMessage('Ongeldig e-mailadres')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/edition-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          magazineTitle,
          product: productId,
          active: true,
        }),
      })

      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json()
        setStatus('error')
        setErrorMessage(data.error || 'Er ging iets mis. Probeer het opnieuw.')
      }
    } catch {
      setStatus('error')
      setErrorMessage('Netwerkfout. Controleer je verbinding en probeer opnieuw.')
    }
  }

  // Success State
  if (status === 'success') {
    return (
      <div
        className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg ${className}`}
        style={{
          color: 'var(--color-success-text, #16a34a)',
          backgroundColor: 'var(--color-success-bg, #dcfce7)',
        }}
      >
        <Check className="w-4 h-4 flex-shrink-0" />
        <span>Je ontvangt een email bij de volgende editie van {magazineTitle}</span>
      </div>
    )
  }

  // Initial Button State
  if (!showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className={`flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-lg border transition-all duration-200 ${className}`}
        style={{
          borderColor: 'var(--color-border, #e5e7eb)',
          color: 'var(--color-text-primary, #0A1628)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary, #f8faf9)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <Bell className="w-4 h-4" style={{ color: 'var(--color-primary, #018360)' }} />
        Meld mij bij nieuwe editie
      </button>
    )
  }

  // Input Form State
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="je@email.nl"
          disabled={status === 'loading'}
          className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all"
          style={{
            borderColor: 'var(--color-border, #e5e7eb)',
            color: 'var(--color-text-primary, #0A1628)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary, #018360)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(var(--color-primary-rgb, 1, 131, 96), 0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border, #e5e7eb)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              subscribe()
            } else if (e.key === 'Escape') {
              setShowInput(false)
              setErrorMessage('')
            }
          }}
        />
        <button
          onClick={subscribe}
          disabled={status === 'loading' || !email}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--color-primary, #018360)',
          }}
          onMouseEnter={(e) => {
            if (status !== 'loading' && email) {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-hover, #016849)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-primary, #018360)'
          }}
        >
          <BellRing className="w-4 h-4" />
          {status === 'loading' ? 'Even geduld...' : 'Aanmelden'}
        </button>
        <button
          onClick={() => {
            setShowInput(false)
            setErrorMessage('')
          }}
          className="px-2 py-2 text-sm rounded-lg border transition-all"
          style={{
            borderColor: 'var(--color-border, #e5e7eb)',
            color: 'var(--color-text-secondary, #64748b)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary, #f8faf9)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div
          className="text-xs px-3 py-2 rounded flex items-center gap-2"
          style={{
            color: 'var(--color-error-text, #dc2626)',
            backgroundColor: 'var(--color-error-bg, #fee2e2)',
          }}
        >
          <span className="font-medium">⚠️</span>
          {errorMessage}
        </div>
      )}
    </div>
  )
}
