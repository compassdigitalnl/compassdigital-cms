'use client'

import { useState } from 'react'
import { Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

/**
 * KvkLookup - KVK number lookup with auto-fill
 *
 * Allows users to enter a KVK number and look up company details.
 * When found, shows company name + address and calls onResult callback
 * so the parent form can auto-fill fields.
 *
 * Uses /api/kvk/lookup endpoint (to be connected to KVK API).
 */

export interface KvkResult {
  kvkNumber: string
  companyName: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  country: string
}

export interface KvkLookupProps {
  onResult: (result: KvkResult) => void
  onClear?: () => void
  className?: string
}

export function KvkLookup({ onResult, onClear, className = '' }: KvkLookupProps) {
  const [kvkNumber, setKvkNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<KvkResult | null>(null)
  const [error, setError] = useState('')

  const handleKvkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8)
    setKvkNumber(value)

    // Clear result when user edits
    if (result) {
      setResult(null)
      setError('')
      onClear?.()
    }
  }

  const handleLookup = async () => {
    if (kvkNumber.length !== 8) {
      setError('KVK-nummer moet 8 cijfers zijn')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`/api/kvk/lookup?kvk=${kvkNumber}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || data.error || 'KVK-nummer niet gevonden')
      }

      const data = await response.json()
      const company = data.company
      const kvkResult: KvkResult = {
        kvkNumber: company?.kvkNumber || kvkNumber,
        companyName: company?.name || company?.tradeName || '',
        street: company?.address?.street || '',
        houseNumber: company?.address?.houseNumber || '',
        postalCode: company?.address?.postalCode || '',
        city: company?.address?.city || '',
        country: company?.address?.country || 'Nederland',
      }

      setResult(kvkResult)
      onResult(kvkResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'KVK opzoeken mislukt')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleLookup()
    }
  }

  return (
    <div className={className}>
      <label
        className="block text-[13px] font-bold mb-1.5"
        style={{ color: 'var(--color-primary)' }}
      >
        KVK-nummer <span style={{ color: 'var(--color-error)' }}>*</span>
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={kvkNumber}
          onChange={handleKvkChange}
          onKeyDown={handleKeyDown}
          placeholder="bijv. 12345678"
          maxLength={8}
          className="flex-1 h-[46px] px-4 rounded-xl text-sm outline-none transition-all duration-200"
          style={{
            border: `2px solid ${result ? 'var(--color-success)' : error ? 'var(--color-error)' : 'var(--color-border)'}`,
            background: result ? 'var(--color-success-light)' : 'var(--color-background-secondary)',
            color: 'var(--color-primary)',
            fontFamily: 'inherit',
          }}
        />
        <button
          type="button"
          onClick={handleLookup}
          disabled={isLoading || kvkNumber.length !== 8}
          className="px-5 h-[46px] rounded-xl text-white text-[13px] font-bold flex items-center gap-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          style={{
            background: 'var(--color-primary)',
            border: 'none',
            cursor: isLoading ? 'wait' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) e.currentTarget.style.background = 'var(--color-primary-dark)'
          }}
          onMouseLeave={(e) => {
            if (!isLoading) e.currentTarget.style.background = 'var(--color-primary)'
          }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          Opzoeken
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: 'var(--color-error)' }}>
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      {/* Success result */}
      {result && (
        <div
          className="flex items-center gap-3 mt-2 p-3.5 rounded-xl"
          style={{
            background: 'var(--color-success-light)',
            border: '1px solid rgba(0,200,83,0.15)',
          }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'white' }}
          >
            <CheckCircle className="w-[18px] h-[18px]" style={{ color: 'var(--color-success)' }} />
          </div>
          <div>
            <div className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
              {result.companyName}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {result.street} {result.houseNumber}, {result.postalCode} {result.city}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
