'use client'

import { useState } from 'react'
import type { TwoFactorSetupProps } from './types'
export type { TwoFactorSetupProps } from './types'

/**
 * TwoFactorSetup - Complete 2FA setup flow for account settings.
 *
 * Steps:
 * 1. Show QR code + manual secret
 * 2. Verify first TOTP code
 * 3. Show backup codes (one-time display)
 */

type Step = 'idle' | 'scanning' | 'verifying' | 'complete'

export function TwoFactorSetup({
  onComplete,
  onCancel,
  className = '',
}: TwoFactorSetupProps) {
  const [step, setStep] = useState<Step>('idle')
  const [qrCode, setQrCode] = useState('')
  const [manualSecret, setManualSecret] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showManualKey, setShowManualKey] = useState(false)

  const startSetup = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setQrCode(data.qrCode)
      setManualSecret(data.secret)
      setStep('scanning')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup mislukt')
    } finally {
      setIsLoading(false)
    }
  }

  const verifySetup = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      setError('Voer een 6-cijferige code in')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: verifyCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setBackupCodes(data.backupCodes)
      setStep('complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verificatie mislukt')
      setVerifyCode('')
    } finally {
      setIsLoading(false)
    }
  }

  const copyBackupCodes = () => {
    const text = backupCodes.join('\n')
    navigator.clipboard.writeText(text)
  }

  // ── Idle: Show enable button ──
  if (step === 'idle') {
    return (
      <div className={className}>
        <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'rgba(var(--color-primary-rgb, 10,22,40), 0.1)' }}
            >
              <svg className="w-6 h-6" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                Tweefactorauthenticatie (2FA)
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Beveilig je account met een extra verificatiestap bij het inloggen.
                Gebruik een authenticator app zoals Google Authenticator of Authy.
              </p>
              <button
                onClick={startSetup}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: 'var(--color-primary)' }}
              >
                {isLoading ? 'Laden...' : '2FA Inschakelen'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Scanning: Show QR code ──
  if (step === 'scanning') {
    return (
      <div className={className}>
        <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Stap 1: Scan de QR-code
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Open je authenticator app en scan onderstaande QR-code.
          </p>

          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>
          </div>

          {/* Manual key toggle */}
          <button
            type="button"
            onClick={() => setShowManualKey(!showManualKey)}
            className="text-sm hover:underline mb-4 block mx-auto"
            style={{ color: 'var(--color-primary)' }}
          >
            {showManualKey ? 'Verberg handmatige sleutel' : 'Kan je niet scannen? Voer de sleutel handmatig in'}
          </button>

          {showManualKey && (
            <div
              className="p-3 rounded-lg text-center mb-4 font-mono text-sm select-all"
              style={{ background: 'var(--color-bg-muted, #f5f5f5)', color: 'var(--color-text)' }}
            >
              {manualSecret}
            </div>
          )}

          {/* Verify code */}
          <h3 className="text-lg font-bold mb-2 mt-6" style={{ color: 'var(--color-text)' }}>
            Stap 2: Voer de code in
          </h3>

          {error && (
            <div
              className="p-3 mb-3 rounded-lg text-sm"
              style={{
                background: 'rgba(233,69,96,0.1)',
                border: '1px solid rgba(233,69,96,0.3)',
                color: 'var(--color-error-dark)',
              }}
            >
              {error}
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verifyCode}
              onChange={(e) => { setVerifyCode(e.target.value.replace(/\D/g, '')); setError('') }}
              placeholder="123456"
              className="flex-1 px-4 py-3 rounded-lg border-2 text-center text-lg font-mono focus:outline-none"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
            <button
              onClick={verifySetup}
              disabled={isLoading || verifyCode.length !== 6}
              className="px-6 py-3 rounded-lg text-white font-bold transition-all disabled:opacity-50"
              style={{ background: 'var(--color-primary)' }}
            >
              {isLoading ? '...' : 'Bevestig'}
            </button>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm hover:underline block mx-auto"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Annuleren
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Complete: Show backup codes ──
  return (
    <div className={className}>
      <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
        <div className="text-center mb-4">
          <div
            className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
            style={{ background: 'rgba(34,197,94,0.1)' }}
          >
            <svg className="w-8 h-8 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>
            2FA is geactiveerd!
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Bewaar onderstaande backup codes op een veilige plek. Elke code kan slechts 1x worden gebruikt.
          </p>
        </div>

        <div
          className="p-4 rounded-lg mb-4 grid grid-cols-2 gap-2"
          style={{ background: 'var(--color-bg-muted, #f5f5f5)' }}
        >
          {backupCodes.map((code, i) => (
            <div key={i} className="font-mono text-sm text-center py-1" style={{ color: 'var(--color-text)' }}>
              {code}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyBackupCodes}
            className="flex-1 py-2.5 px-4 rounded-lg text-sm font-bold border-2 transition-all hover:-translate-y-0.5"
            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
          >
            Kopieer codes
          </button>
          <button
            onClick={() => {
              setStep('idle')
              onComplete?.()
            }}
            className="flex-1 py-2.5 px-4 rounded-lg text-white text-sm font-bold transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--color-primary)' }}
          >
            Klaar
          </button>
        </div>
      </div>
    </div>
  )
}
