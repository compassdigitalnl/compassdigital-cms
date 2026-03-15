'use client'

import React from 'react'
import { Calculator, TrendingDown } from 'lucide-react'
import type { BundleTotalCalculatorProps } from './types'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

/**
 * BB05: BundleTotalCalculator
 *
 * Price breakdown calculator with subtotal, discount, shipping, tax, and total
 * Features:
 * - Subtotal calculation (items × price)
 * - Discount calculation (percentage-based)
 * - Shipping cost display
 * - Tax calculation
 * - Final total
 * - Clear visual separators
 * - Responsive layout
 */

export const BundleTotalCalculator: React.FC<BundleTotalCalculatorProps> = ({
  items,
  discountPercentage = 0,
  shipping = 0,
  tax = 0,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Calculate discount amount
  const discountAmount = discountPercentage > 0 ? (subtotal * discountPercentage) / 100 : 0

  // Calculate subtotal after discount
  const subtotalAfterDiscount = subtotal - discountAmount

  // Calculate total
  const total = subtotalAfterDiscount + shipping + tax

  return (
    <div className={`bundle-total-calculator ${className}`}>
      {/* Header */}
      <div className="mb-4 pb-3 border-b-2 border-grey-light">
        <h3 className="text-[18px] font-bold text-navy flex items-center gap-2">
          <Calculator className="w-5 h-5 text-teal" strokeWidth={2.5} />
          Prijs Overzicht
        </h3>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-grey-dark">Subtotaal ({items.length} {items.length === 1 ? 'item' : 'items'}):</span>
          <span className="text-[15px] font-mono font-semibold text-navy">
            €{formatPriceStr(subtotal)}
          </span>
        </div>

        {/* Discount */}
        {discountPercentage > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-grey-dark flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-green" strokeWidth={2.5} />
              Korting ({discountPercentage}%):
            </span>
            <span className="text-[15px] font-mono font-semibold text-green">
              -€{formatPriceStr(discountAmount)}
            </span>
          </div>
        )}

        {/* Divider after discount */}
        {discountPercentage > 0 && (
          <div className="border-t border-grey-light my-2" />
        )}

        {/* Subtotal After Discount (if discount applied) */}
        {discountPercentage > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-grey-dark">Subtotaal na korting:</span>
            <span className="text-[15px] font-mono font-semibold text-navy">
              €{formatPriceStr(subtotalAfterDiscount)}
            </span>
          </div>
        )}

        {/* Shipping */}
        {shipping > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-grey-dark">Verzendkosten:</span>
            <span className="text-[15px] font-mono font-semibold text-navy">
              €{formatPriceStr(shipping)}
            </span>
          </div>
        )}

        {/* Free Shipping Message */}
        {shipping === 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-grey-dark">Verzendkosten:</span>
            <span className="text-[15px] font-semibold text-green">Gratis!</span>
          </div>
        )}

        {/* Tax */}
        {tax > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-grey-dark">BTW:</span>
            <span className="text-[15px] font-mono font-semibold text-navy">
              €{formatPriceStr(tax)}
            </span>
          </div>
        )}

        {/* Divider before total */}
        <div className="border-t-2 border-grey-light my-3" />

        {/* Total */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[18px] font-bold text-navy">Totaal:</span>
          <span className="text-[22px] font-mono font-bold text-teal">
            €{formatPriceStr(total)}
          </span>
        </div>
      </div>

      {/* Savings Summary (if discount applied) */}
      {discountPercentage > 0 && (
        <div className="mt-4 p-3 bg-green-50 border-2 border-green/20 rounded-lg">
          <p className="text-[13px] text-green-900 text-center">
            <span className="font-bold">Je bespaart €{formatPriceStr(discountAmount)}</span> met deze bundel!
          </p>
        </div>
      )}

      {/* Tax Notice (if tax included) */}
      {tax > 0 && (
        <div className="mt-3">
          <p className="text-[12px] text-grey-mid text-center">
            Inclusief €{formatPriceStr(tax)} BTW
          </p>
        </div>
      )}
    </div>
  )
}
