'use client'

import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

/**
 * Checkout Summary Sidebar Component
 *
 * Sticky sidebar showing order summary during checkout.
 *
 * Features:
 * - Collapsible order items list
 * - Subtotal, discount, shipping calculation
 * - VAT breakdown
 * - Grand total (prominent)
 * - Payment method badges
 * - Trust indicators
 *
 * @example
 * ```tsx
 * <CheckoutSummary
 *   shippingCost={6.95}
 *   discount={10}
 *   freeShippingThreshold={150}
 * />
 * ```
 */

export interface CheckoutSummaryProps {
  shippingCost?: number
  discount?: number
  freeShippingThreshold?: number
  couponCode?: string
  onRemoveCoupon?: () => void
  className?: string
}

export function CheckoutSummary({
  shippingCost = 6.95,
  discount = 0,
  freeShippingThreshold = 150,
  couponCode,
  onRemoveCoupon,
  className = '',
}: CheckoutSummaryProps) {
  const { items, total, itemCount } = useCart()
  const [showItems, setShowItems] = useState(false)
  const { displayPrice, formatPriceStr, showInclVAT, vatLabel } = usePriceMode()

  // Calculate price-mode-aware subtotal from cart items
  const subtotal = items.reduce((sum, item) => {
    const unitPrice = displayPrice(item.unitPrice ?? item.price, item.taxClass as any) ?? (item.unitPrice ?? item.price)
    return sum + unitPrice * item.quantity
  }, 0)

  // Calculations
  const isFreeShipping = subtotal >= freeShippingThreshold
  const finalShippingCost = isFreeShipping ? 0 : shippingCost
  const discountAmount = (subtotal * discount) / 100
  const subtotalAfterDiscount = subtotal - discountAmount
  const grandTotal = subtotalAfterDiscount + finalShippingCost

  return (
    <div className={`lg:sticky lg:top-24 ${className}`}>
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: 'white',
          borderColor: 'var(--color-border, #e2e8f0)',
          boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.1))',
        }}
      >
        {/* Header */}
        <div className="p-5" style={{ background: 'var(--color-secondary, #0a2647)' }}>
          <h3
            className="text-xl font-bold text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Besteloverzicht
          </h3>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Collapsible Items */}
          <button
            onClick={() => setShowItems(!showItems)}
            className="w-full flex items-center justify-between py-3 px-4 -mx-4 rounded-lg transition-colors hover:bg-gray-50"
          >
            <span className="font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'}
            </span>
            {showItems ? (
              <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            ) : (
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
            )}
          </button>

          {/* Items List */}
          {showItems && (
            <div className="mt-3 space-y-3 pb-4 border-b" style={{ borderColor: 'var(--color-border, #e2e8f0)' }}>
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: 'var(--color-surface, #f1f5f9)' }}
                  >
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {item.title}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {item.quantity}x €{formatPriceStr(item.unitPrice ?? item.price, item.taxClass as any)}
                    </div>
                  </div>
                  <div className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    €{formatPriceStr((item.unitPrice ?? item.price) * item.quantity, item.taxClass as any)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary Rows */}
          <div className="space-y-2 py-4">
            <SummaryRow label={`Subtotaal`} value={`€${formatPriceStr(subtotal)}`} />

            {discount > 0 && couponCode && (
              <SummaryRow
                label={
                  <div className="flex items-center gap-2">
                    <span>Korting ({couponCode})</span>
                    {onRemoveCoupon && (
                      <button
                        onClick={onRemoveCoupon}
                        className="text-xs hover:underline"
                        style={{ color: 'var(--color-error, #dc2626)' }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                }
                value={`-€${formatPriceStr(discountAmount)}`}
                valueColor="var(--color-success, #16a34a)"
              />
            )}

            <SummaryRow
              label="Verzendkosten"
              value={isFreeShipping ? 'Gratis' : `€${formatPriceStr(finalShippingCost)}`}
              valueColor={isFreeShipping ? 'var(--color-success, #16a34a)' : undefined}
              bold={isFreeShipping}
            />
          </div>

          {/* Divider */}
          <div className="h-px my-4" style={{ background: 'var(--color-border, #e2e8f0)' }} />

          {/* Total */}
          <div className="flex justify-between items-baseline mb-2">
            <span
              className="font-bold text-base"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Totaal
            </span>
            <span
              className="font-bold text-3xl"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
              }}
            >
              €{formatPriceStr(grandTotal)}
            </span>
          </div>

          {/* VAT label */}
          <p
            className="text-right text-xs mb-6"
            style={{ color: 'var(--color-text-muted, #94a3b8)' }}
          >
            Prijzen {vatLabel}
          </p>

          {/* Free Shipping Notice */}
          {isFreeShipping && (
            <div
              className="p-3 rounded-lg mb-4 text-sm font-semibold text-center"
              style={{
                background: 'var(--color-success-bg, #f0fdf4)',
                color: 'var(--color-success, #16a34a)',
              }}
            >
              🎉 Gratis verzending bereikt!
            </div>
          )}
        </div>

        {/* Footer: Payment Methods */}
        <div
          className="px-6 py-4 border-t"
          style={{ borderColor: 'var(--color-border, #e2e8f0)' }}
        >
          <div className="flex flex-wrap justify-center gap-2">
            {['iDEAL', 'Visa', 'Mastercard', 'PayPal', 'Op rekening'].map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 rounded text-xs font-bold"
                style={{
                  background: 'var(--color-surface, #f1f5f9)',
                  color: 'var(--color-text-muted, #64748b)',
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div
        className="mt-4 p-5 rounded-xl border"
        style={{
          background: 'white',
          borderColor: 'var(--color-border, #e2e8f0)',
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <TrustBadge icon="🔒" text="SSL beveiligd" />
          <TrustBadge icon="🚚" text="Morgen in huis" />
          <TrustBadge icon="↩️" text="30 dagen retour" />
          <TrustBadge icon="📞" text="Persoonlijk advies" />
        </div>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

function SummaryRow({
  label,
  value,
  valueColor,
  bold,
}: {
  label: React.ReactNode
  value: string
  valueColor?: string
  bold?: boolean
}) {
  return (
    <div
      className="flex justify-between items-center text-sm"
      style={{ color: 'var(--color-text-muted, #64748b)' }}
    >
      <span>{label}</span>
      <span
        className={bold ? 'font-bold' : 'font-semibold'}
        style={{
          color: valueColor || 'var(--color-text-primary, #1e293b)',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function TrustBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      className="flex items-center gap-2 text-xs font-semibold"
      style={{ color: 'var(--color-text-muted, #64748b)' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--color-primary-bg, #e0f2f1)' }}
      >
        <span className="text-sm">{icon}</span>
      </div>
      {text}
    </div>
  )
}

export default CheckoutSummary
