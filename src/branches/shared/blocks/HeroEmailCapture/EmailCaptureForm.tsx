'use client'

import React, { useState, useRef } from 'react'

interface EmailCaptureFormProps {
  formLabel?: string | null
  submitButtonText?: string | null
  variant?: 'centered' | 'split' | 'compact'
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({
  formLabel = 'Vul je e-mailadres in',
  submitButtonText = 'Aan de slag',
  variant = 'centered',
}) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email
    if (!email.trim()) {
      setStatus('error')
      setErrorMessage('Vul een e-mailadres in')
      return
    }

    if (!emailRegex.test(email)) {
      setStatus('error')
      setErrorMessage('Vul een geldig e-mailadres in')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Er is iets misgegaan')
      }

      setStatus('success')
      setEmail('')

      // Reset form after 3 seconds
      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Er is iets misgegaan')
    }
  }

  const isCompact = variant === 'compact'
  const isDark = variant === 'centered' || variant === 'compact'

  if (status === 'success') {
    return (
      <div className={`flex items-center justify-center gap-2 py-3 ${isDark ? 'text-white' : 'text-navy'}`}>
        <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-medium">Gelukt!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${isCompact ? 'max-w-md' : 'max-w-lg mx-auto'}`}>
      <div className={`flex ${isCompact ? 'flex-row' : 'flex-col sm:flex-row'} gap-2`}>
        <div className="relative flex-1">
          {/* Mail icon */}
          <svg
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? 'text-white/40' : 'text-grey-dark'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          <input
            ref={inputRef}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') {
                setStatus('idle')
                setErrorMessage('')
              }
            }}
            placeholder={formLabel || 'Vul je e-mailadres in'}
            className={`w-full rounded-lg border px-4 py-3 pl-10 text-sm outline-none transition-colors ${
              status === 'error'
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : isDark
                  ? 'border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-teal focus:ring-2 focus:ring-teal/20'
                  : 'border-grey bg-white text-navy placeholder:text-grey-dark focus:border-teal focus:ring-2 focus:ring-teal/20'
            }`}
            disabled={status === 'loading'}
            aria-label={formLabel || 'E-mailadres'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`btn btn-primary whitespace-nowrap px-6 py-3 text-sm font-medium rounded-lg transition-all ${
            status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {status === 'loading' ? 'Even geduld...' : submitButtonText || 'Aan de slag'}
        </button>
      </div>
      {status === 'error' && errorMessage && (
        <p className="mt-2 text-xs text-red-400">{errorMessage}</p>
      )}
    </form>
  )
}

export default EmailCaptureForm
