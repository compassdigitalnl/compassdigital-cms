'use client'

import { useState, useRef, useEffect } from 'react'
import type { TwoFactorInputProps } from './types'
export type { TwoFactorInputProps } from './types'

/**
 * TwoFactorInput - 6-digit code input for 2FA verification during login.
 *
 * Shows 6 individual digit boxes, auto-focuses next on input,
 * supports paste, and has a backup code toggle.
 */

export function TwoFactorInput({
  onSubmit,
  onCancel,
  email,
  className = '',
}: TwoFactorInputProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [isBackupMode, setIsBackupMode] = useState(false)
  const [backupCode, setBackupCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!isBackupMode) {
      inputRefs.current[0]?.focus()
    }
  }, [isBackupMode])

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newDigits = [...digits]
    newDigits[index] = value.slice(-1)
    setDigits(newDigits)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits filled
    if (value && index === 5) {
      const code = newDigits.join('')
      if (code.length === 6) {
        handleSubmit(code, false)
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      const newDigits = pasted.split('')
      setDigits(newDigits)
      handleSubmit(pasted, false)
    }
  }

  const handleSubmit = async (code: string, isBackup: boolean) => {
    setError('')
    setIsLoading(true)
    try {
      await onSubmit(code, isBackup)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ongeldige code')
      if (!isBackup) {
        setDigits(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (backupCode.trim()) {
      handleSubmit(backupCode.trim(), true)
    }
  }

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'rgba(var(--color-primary-rgb, 10,22,40), 0.1)' }}
        >
          <svg
            className="w-8 h-8"
            style={{ color: 'var(--color-primary)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2
          className="text-2xl mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
        >
          Verificatiecode
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Voer de 6-cijferige code in van je authenticator app.
        </p>
      </div>

      {error && (
        <div
          className="p-3 mb-4 rounded-lg text-sm text-center"
          style={{
            background: 'rgba(233,69,96,0.1)',
            border: '1px solid rgba(233,69,96,0.3)',
            color: 'var(--color-error-dark)',
          }}
        >
          {error}
        </div>
      )}

      {!isBackupMode ? (
        <>
          {/* 6-digit input */}
          <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={isLoading}
                className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 transition-colors focus:outline-none"
                style={{
                  borderColor: digit ? 'var(--color-primary)' : 'var(--color-border)',
                  color: 'var(--color-text)',
                  background: 'var(--color-bg-input, white)',
                }}
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsBackupMode(true)}
            className="w-full text-sm text-center mb-4 hover:underline"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Gebruik een backup code
          </button>
        </>
      ) : (
        <>
          {/* Backup code input */}
          <form onSubmit={handleBackupSubmit} className="mb-4">
            <input
              type="text"
              value={backupCode}
              onChange={(e) => { setBackupCode(e.target.value); setError('') }}
              placeholder="XXXX-XXXX"
              autoFocus
              disabled={isLoading}
              className="w-full px-4 py-3 text-center text-lg font-mono rounded-lg border-2 mb-4 focus:outline-none"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
                background: 'var(--color-bg-input, white)',
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !backupCode.trim()}
              className="w-full py-3 px-4 rounded-lg text-white font-bold transition-all duration-300 disabled:opacity-50"
              style={{ background: 'var(--color-primary)' }}
            >
              {isLoading ? 'Verifiëren...' : 'Backup code gebruiken'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => { setIsBackupMode(false); setError('') }}
            className="w-full text-sm text-center mb-4 hover:underline"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Terug naar authenticator code
          </button>
        </>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-sm text-center hover:underline"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Annuleren
        </button>
      )}
    </div>
  )
}
