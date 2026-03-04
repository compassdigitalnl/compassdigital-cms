'use client'

import React from 'react'
import { Tag } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

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
  tiers,
  currentQuantity,
  initialQuantity,
  unit = 'stuks',
  onQuantityChange,
}: StaffelCalculatorProps) {
  const { formatPriceStr } = usePriceMode()

  if (!tiers || tiers.length === 0) return null

  const qty = currentQuantity ?? initialQuantity ?? 1

  // Find active tier
  let activeTierIndex = -1
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (qty >= tiers[i].minQty) {
      activeTierIndex = i
      break
    }
  }

  return (
    <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-background,var(--color-surface))] border-b border-b-[var(--color-border)]">
        <Tag className="w-4 h-4 text-[var(--color-primary)]" />
        <span className="text-[13px] font-bold text-[var(--color-text-primary)]">Staffelprijzen</span>
      </div>
      <div className="divide-y divide-[var(--color-border)]">
        {tiers.map((tier, idx) => {
          const isActive = idx === activeTierIndex
          const rangeText = tier.maxQty
            ? `${tier.minQty} - ${tier.maxQty} ${unit}`
            : `${tier.minQty}+ ${unit}`

          return (
            <button
              key={idx}
              onClick={() => onQuantityChange?.(tier.minQty)}
              className="flex items-center justify-between w-full px-4 py-2.5 text-left transition-colors"
              style={{
                backgroundColor: isActive
                  ? 'color-mix(in srgb, var(--color-primary) 8%, white)'
                  : 'transparent',
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                  }}
                />
                <span
                  className="text-[13px] font-medium"
                  style={{
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {rangeText}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[13px] font-bold"
                  style={{
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  }}
                >
                  €{formatPriceStr(tier.price)}
                </span>
                {tier.savePercentage && tier.savePercentage > 0 && (
                  <span className="text-[11px] font-bold text-[#FF6B6B] bg-[#FFF0F0] px-1.5 py-0.5 rounded">
                    -{tier.savePercentage}%
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default StaffelCalculator
