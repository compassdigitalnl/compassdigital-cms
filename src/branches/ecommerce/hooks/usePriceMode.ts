'use client'
import { useState, useEffect, useCallback } from 'react'
import { useEcommerceSettings } from './useEcommerceSettings'

export function usePriceMode() {
  const [mode, setMode] = useState<'b2c' | 'b2b'>(() => {
    if (typeof window === 'undefined') return 'b2b'
    const stored = localStorage.getItem('price-mode')
    return stored === 'b2c' || stored === 'b2b' ? stored : 'b2b'
  })
  const { settings } = useEcommerceSettings()
  const vatRate = (settings.vatPercentage || 21) / 100
  const showInclVAT = mode === 'b2c'

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.mode === 'b2c' || detail?.mode === 'b2b') setMode(detail.mode)
    }
    window.addEventListener('priceToggle', handler)
    return () => window.removeEventListener('priceToggle', handler)
  }, [])

  const displayPrice = useCallback(
    (priceExclVAT: number | null | undefined) => {
      if (priceExclVAT == null) return null
      return showInclVAT ? priceExclVAT * (1 + vatRate) : priceExclVAT
    },
    [showInclVAT, vatRate],
  )

  const displayPriceCents = useCallback(
    (centsExclVAT: number | null | undefined) => {
      if (centsExclVAT == null) return null
      return showInclVAT ? Math.round(centsExclVAT * (1 + vatRate)) : centsExclVAT
    },
    [showInclVAT, vatRate],
  )

  return {
    mode,
    showInclVAT,
    displayPrice,
    displayPriceCents,
    vatLabel: showInclVAT ? 'incl. BTW' : 'excl. BTW',
    taxNote: showInclVAT ? 'Inclusief BTW' : 'Exclusief BTW',
  }
}
