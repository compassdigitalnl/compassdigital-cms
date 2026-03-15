'use client'

import { useState, useEffect } from 'react'

interface ShippingMethod {
  id: number | string
  name: string
  carrier: string
}

interface CreateLabelButtonProps {
  orderId: string
  orderNumber: string
  hasTrackingCode: boolean
  trackingCode?: string
  trackingUrl?: string
}

export function CreateLabelButton({
  orderId,
  orderNumber,
  hasTrackingCode,
  trackingCode,
  trackingUrl,
}: CreateLabelButtonProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [methods, setMethods] = useState<ShippingMethod[]>([])
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [weight, setWeight] = useState(1000)
  const [provider, setProvider] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch available shipping methods
    fetch('/api/carrier/shipping-methods', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setMethods(data.methods || [])
        setProvider(data.provider || '')
      })
      .catch(() => {})
  }, [])

  const handleCreateLabel = async () => {
    setIsCreating(true)
    setError('')

    try {
      const res = await fetch(`/api/orders/${orderId}/create-label`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          shippingMethodId: selectedMethod || undefined,
          weight,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      setResult(data)
      setShowOptions(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Label aanmaken mislukt')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDownloadLabel = async () => {
    setIsDownloading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/label`, {
        credentials: 'include',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `label-${orderNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Label downloaden mislukt')
    } finally {
      setIsDownloading(false)
    }
  }

  // Already has tracking - show download button
  if (hasTrackingCode || result) {
    const code = result?.trackingNumber || trackingCode
    const url = result?.trackingUrl || trackingUrl

    return (
      <div className="p-4 rounded-lg border border-green/20 bg-green-50">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-bold text-green-700">Verzendlabel aangemaakt</span>
        </div>

        {code && (
          <p className="text-xs text-green mb-2 font-mono">{code}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleDownloadLabel}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-white bg-green hover:bg-green-700 disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isDownloading ? 'Downloaden...' : 'Download label'}
          </button>

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-green-700 border border-green-300 hover:bg-green-100"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Track & Trace
            </a>
          )}
        </div>

        {error && <p className="text-xs text-coral mt-2">{error}</p>}
      </div>
    )
  }

  // No carrier configured
  if (!provider) {
    return (
      <div className="p-4 rounded-lg border border-grey-light bg-grey-light">
        <p className="text-xs text-grey-mid">
          Geen carrier geconfigureerd. Ga naar{' '}
          <strong>E-commerce Instellingen → Carrier Integratie</strong> om Sendcloud of MyParcel te koppelen.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-lg border border-grey-light bg-white">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-grey-dark">Verzending</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal font-bold uppercase">
          {provider}
        </span>
      </div>

      {error && (
        <div className="p-2 mb-3 rounded text-xs bg-coral-50 border border-coral/20 text-coral">
          {error}
        </div>
      )}

      {!showOptions ? (
        <button
          onClick={() => setShowOptions(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:-translate-y-0.5"
          style={{ background: '#0a1628' }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Verzendlabel aanmaken
        </button>
      ) : (
        <div className="space-y-3">
          {/* Shipping method select */}
          {methods.length > 0 && (
            <div>
              <label className="text-xs font-medium text-grey-dark block mb-1">Verzendmethode</label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                style={{ borderColor: '#d1d5db' }}
              >
                <option value="">Automatisch (standaard)</option>
                {methods.map((m) => (
                  <option key={String(m.id)} value={String(m.id)}>
                    {m.name} ({m.carrier})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Weight */}
          <div>
            <label className="text-xs font-medium text-grey-dark block mb-1">Gewicht (gram)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min={1}
              max={30000}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { setShowOptions(false); setError('') }}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-bold border border-grey-light text-grey-dark hover:bg-grey-light"
            >
              Annuleren
            </button>
            <button
              onClick={handleCreateLabel}
              disabled={isCreating}
              className="flex-1 px-3 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50"
              style={{ background: '#059669' }}
            >
              {isCreating ? 'Aanmaken...' : 'Label aanmaken'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
