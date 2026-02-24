'use client'

import { useState } from 'react'

/**
 * Subscription Price Table Component
 *
 * Displays a selectable pricing table for magazine subscription products.
 * Uses theme variables for styling - fully reusable across all clients.
 *
 * Feature: Aboland Magazine Features
 */

export type SubscriptionVariant = {
  label: string
  value: string
  priceModifier?: number
  subscriptionType?: 'personal' | 'gift' | 'trial'
  issues?: number
  discountPercentage?: number
  autoRenew?: boolean
}

export type SubscriptionPriceTableProps = {
  basePrice: number
  variants: SubscriptionVariant[]
  onSelect: (variant: SubscriptionVariant) => void
  currency?: string
  className?: string
}

export function SubscriptionPriceTable({
  basePrice,
  variants,
  onSelect,
  currency = '€',
  className = '',
}: SubscriptionPriceTableProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  function handleSelect(index: number) {
    setSelectedIndex(index)
    onSelect(variants[index])
  }

  // Filter only subscription variants (those with subscriptionType field)
  const subscriptionVariants = variants.filter((v) => v.subscriptionType)

  if (subscriptionVariants.length === 0) {
    return null // No subscription variants available
  }

  return (
    <div className={`border rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{
          backgroundColor: 'var(--color-surface-secondary, #f8faf9)',
          borderColor: 'var(--color-border, #e5e7eb)',
        }}
      >
        <h3
          className="font-bold text-sm"
          style={{ color: 'var(--color-text-primary, #0A1628)' }}
        >
          Kies je abonnement
        </h3>
      </div>

      {/* Variants List */}
      <div className="divide-y" style={{ borderColor: 'var(--color-border, #e5e7eb)' }}>
        {subscriptionVariants.map((variant, i) => {
          const price = basePrice + (variant.priceModifier || 0)
          const isSelected = selectedIndex === i

          return (
            <button
              key={variant.value}
              onClick={() => handleSelect(i)}
              className="w-full flex items-center gap-4 px-4 py-3 text-left transition-all duration-200"
              style={{
                backgroundColor: isSelected
                  ? 'rgba(var(--color-primary-rgb, 1, 131, 96), 0.05)'
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-secondary, #f8faf9)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {/* Radio Circle */}
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  borderColor: isSelected
                    ? 'var(--color-primary, #018360)'
                    : 'var(--color-border-strong, #d1d5db)',
                }}
              >
                {isSelected && (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary, #018360)' }}
                  />
                )}
              </div>

              {/* Type */}
              <span
                className="text-sm font-medium min-w-[100px]"
                style={{ color: 'var(--color-text-primary, #0A1628)' }}
              >
                {getSubscriptionTypeLabel(variant.subscriptionType)}
              </span>

              {/* Issues Count */}
              {variant.issues && (
                <span
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary, #64748b)' }}
                >
                  {variant.issues} {variant.issues === 1 ? 'nummer' : 'nummers'}
                </span>
              )}

              {/* Discount Badge */}
              {variant.discountPercentage && variant.discountPercentage > 0 && (
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    color: 'var(--color-success-text, #16a34a)',
                    backgroundColor: 'var(--color-success-bg, #dcfce7)',
                  }}
                >
                  -{variant.discountPercentage}%
                </span>
              )}

              {/* Price */}
              <span
                className="font-bold text-sm ml-auto"
                style={{ color: 'var(--color-text-primary, #0A1628)' }}
              >
                {currency}
                {price.toFixed(2).replace('.', ',')}
              </span>
            </button>
          )
        })}
      </div>

      {/* Auto-Renew Info (if applicable) */}
      {subscriptionVariants[selectedIndex]?.autoRenew && (
        <div
          className="px-4 py-2 text-xs border-t"
          style={{
            color: 'var(--color-text-secondary, #64748b)',
            backgroundColor: 'var(--color-surface-tertiary, #f1f5f9)',
            borderColor: 'var(--color-border, #e5e7eb)',
          }}
        >
          ℹ️ Dit abonnement wordt automatisch verlengd
        </div>
      )}
    </div>
  )
}

/**
 * Helper: Get translated label for subscription type
 */
function getSubscriptionTypeLabel(type?: string): string {
  switch (type) {
    case 'personal':
      return 'Persoonlijk'
    case 'gift':
      return 'Cadeau'
    case 'trial':
      return 'Proef'
    default:
      return type || 'Standaard'
  }
}
