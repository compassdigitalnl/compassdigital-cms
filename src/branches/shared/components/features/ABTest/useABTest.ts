'use client'

import { useState, useEffect } from 'react'
import type { UseABTestReturn, ConversionData } from './types'

/**
 * useABTest Hook
 *
 * Returns the assigned variant for an A/B test and provides conversion tracking.
 *
 * Usage:
 * ```tsx
 * const { variant, trackConversion } = useABTest('cart')
 *
 * if (variant === 'template1') {
 *   return <CartTemplate1 />
 * } else if (variant === 'template2') {
 *   return <CartTemplate2 />
 * }
 * ```
 *
 * @param targetPage - The page/component being tested (e.g., 'cart', 'checkout', 'login')
 * @returns Variant assignment and conversion tracking function
 */
export function useABTest(targetPage: string): UseABTestReturn {
  const [variant, setVariant] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConverted, setIsConverted] = useState(false)
  const [testId, setTestId] = useState<string | null>(null)

  // Get or assign variant on mount
  useEffect(() => {
    async function getVariant() {
      try {
        setIsLoading(true)

        const response = await fetch('/api/ab-test/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetPage }),
        })

        if (!response.ok) {
          console.error('Failed to get A/B test variant')
          setVariant(null)
          return
        }

        const data = await response.json()
        setVariant(data.variant)
        setTestId(data.testId)
        setIsConverted(data.isConverted || false)
      } catch (error) {
        console.error('Error fetching A/B test variant:', error)
        setVariant(null)
      } finally {
        setIsLoading(false)
      }
    }

    getVariant()
  }, [targetPage])

  // Track conversion
  const trackConversion = async (data?: ConversionData) => {
    if (!testId || isConverted) return

    try {
      const response = await fetch('/api/ab-test/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          targetPage,
          ...data,
        }),
      })

      if (response.ok) {
        setIsConverted(true)
      }
    } catch (error) {
      console.error('Error tracking A/B test conversion:', error)
    }
  }

  return {
    variant,
    isLoading,
    trackConversion,
    isConverted,
  }
}
