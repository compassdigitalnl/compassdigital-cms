'use client'

import { useEcommerceSettings } from '../shared/hooks/useEcommerceSettings'

/**
 * Hook for displaying prices based on B2B/B2C price mode settings.
 *
 * Returns a `displayPrice` function that applies tax calculations
 * based on whether prices should be shown incl. or excl. BTW.
 */
export function usePriceMode() {
  const { settings } = useEcommerceSettings()

  const priceMode = (settings as any)?.priceDisplay || 'incl'

  const displayPrice = (price: number, taxClass?: string): number => {
    // Default: return price as-is (incl. BTW)
    if (priceMode === 'incl' || !taxClass) return price

    // For excl. BTW display, calculate based on tax class
    const taxRate = taxClass === 'high' ? 0.21 : taxClass === 'low' ? 0.09 : 0
    return price / (1 + taxRate)
  }

  return { displayPrice, priceMode }
}
