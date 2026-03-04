'use client'
import { useState, useEffect, useCallback } from 'react'
import { useEcommerceSettings } from './useEcommerceSettings'
import { getTaxRate, type TaxClass } from '@/lib/pricing/calculatePrice'

export function usePriceMode() {
  const [mode, setMode] = useState<'b2c' | 'b2b'>(() => {
    if (typeof window === 'undefined') return 'b2b'
    const stored = localStorage.getItem('price-mode')
    return stored === 'b2c' || stored === 'b2b' ? stored : 'b2b'
  })
  const { settings } = useEcommerceSettings()
  const globalVatRate = (settings.vatPercentage || 21) / 100
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
    (priceExclVAT: number | null | undefined, taxClass?: TaxClass) => {
      if (priceExclVAT == null) return null
      const rate = taxClass ? getTaxRate(taxClass) : globalVatRate
      return showInclVAT ? priceExclVAT * (1 + rate) : priceExclVAT
    },
    [showInclVAT, globalVatRate],
  )

  const displayPriceCents = useCallback(
    (centsExclVAT: number | null | undefined, taxClass?: TaxClass) => {
      if (centsExclVAT == null) return null
      const rate = taxClass ? getTaxRate(taxClass) : globalVatRate
      return showInclVAT ? Math.round(centsExclVAT * (1 + rate)) : centsExclVAT
    },
    [showInclVAT, globalVatRate],
  )

  const vatLabelForClass = useCallback(
    (taxClass?: TaxClass) => {
      if (!showInclVAT) return 'excl. BTW'
      const rate = taxClass ? getTaxRate(taxClass) : globalVatRate
      if (rate === 0) return 'excl. BTW'
      const pct = Math.round(rate * 100)
      return `incl. ${pct}% BTW`
    },
    [showInclVAT, globalVatRate],
  )

  /** Format price as Dutch locale string: "12,50" (without currency symbol) */
  const formatPriceStr = useCallback(
    (priceExclVAT: number | null | undefined, taxClass?: TaxClass) => {
      const val = displayPrice(priceExclVAT, taxClass)
      if (val == null) return '0,00'
      return val.toFixed(2).replace('.', ',')
    },
    [displayPrice],
  )

  /** Format price with euro sign: "€ 12,50" */
  const formatPriceFull = useCallback(
    (priceExclVAT: number | null | undefined, taxClass?: TaxClass) => {
      return `€ ${formatPriceStr(priceExclVAT, taxClass)}`
    },
    [formatPriceStr],
  )

  return {
    mode,
    showInclVAT,
    displayPrice,
    displayPriceCents,
    formatPriceStr,
    formatPriceFull,
    vatLabelForClass,
    vatLabel: showInclVAT ? 'incl. BTW' : 'excl. BTW',
    taxNote: showInclVAT ? 'Inclusief BTW' : 'Exclusief BTW',
  }
}
