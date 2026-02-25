/**
 * StaffelCalculator Placeholder
 *
 * Tijdelijke placeholder - wordt vervangen door volledige implementatie in Product Display batch
 */

'use client'

import React from 'react'

interface StaffelCalculatorProps {
  productId?: string
  currentQuantity?: number
  onQuantityChange?: (quantity: number) => void
}

export function StaffelCalculator({ productId, currentQuantity = 1, onQuantityChange }: StaffelCalculatorProps) {
  // Placeholder component - will be fully implemented in Phase 1: Product Display batch
  return null
}

export default StaffelCalculator
