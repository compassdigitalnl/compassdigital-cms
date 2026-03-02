/**
 * StaffelCalculator Placeholder
 *
 * Tijdelijke placeholder - wordt vervangen door volledige implementatie in Product Display batch
 */

'use client'

import React from 'react'

interface StaffelCalculatorProps {
  productId?: string
  productName?: string
  tiers?: Array<{
    minQty: number
    maxQty?: number
    price: number
    savePercentage?: number
  }>
  currentQuantity?: number
  initialQuantity?: number
  unit?: string
  onQuantityChange?: (quantity: number) => void
}

export function StaffelCalculator({
  productId,
  productName,
  tiers,
  currentQuantity = 1,
  initialQuantity,
  unit,
  onQuantityChange
}: StaffelCalculatorProps) {
  // Placeholder component - will be fully implemented in Phase 1: Product Display batch
  return null
}

export default StaffelCalculator
