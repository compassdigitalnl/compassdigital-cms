'use client'

import React from 'react'
import { ShoppingCart, X, Truck } from 'lucide-react'
import type { VariantSelectionSidebarProps } from './types'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

/**
 * VP10: VariantSelectionSidebar
 *
 * Sticky sidebar showing selected variants + price summary
 * Features:
 * - Width: 340px (desktop), full-width (mobile)
 * - Position: sticky, top: 24px
 * - Scrollable items list (max-height: 400px)
 * - Price summary with discount
 * - CTA button
 * - Trust signals
 */
export const VariantSelectionSidebar: React.FC<VariantSelectionSidebarProps> = ({
  selectedVariants,
  subtotal,
  discount = 0,
  total,
  onRemoveVariant,
  onClearAll,
  onAddToCart,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()
  const itemCount = selectedVariants.length
  const hasItems = itemCount > 0
  const hasDiscount = discount > 0

  return (
    <aside
      className={`
        variant-selection-sidebar
        sticky top-6 w-full max-w-[340px]
        bg-white border-2 border-grey-light rounded-xl shadow-lg
        flex flex-col
        ${className}
      `}
      style={{
        maxHeight: 'calc(100vh - 48px)',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b-2 border-grey-light flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[var(--color-primary)]" strokeWidth={2.5} />
          <h3 className="text-lg font-bold text-navy">
            Geselecteerd
            {hasItems && (
              <span className="ml-1 text-sm font-normal text-grey-dark">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h3>
        </div>

        {hasItems && (
          <button
            type="button"
            onClick={onClearAll}
            className="btn btn-ghost btn-sm"
          >
            Wis alles
          </button>
        )}
      </div>

      {/* Empty State */}
      {!hasItems && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <ShoppingCart className="w-12 h-12 text-grey-mid mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-grey-dark text-sm">
              Selecteer varianten om toe te voegen
            </p>
          </div>
        </div>
      )}

      {/* Selected Items List (scrollable) */}
      {hasItems && (
        <>
          <div
            className="flex-1 overflow-y-auto p-4 space-y-2"
            style={{
              maxHeight: '400px',
            }}
          >
            {selectedVariants.map(({ variant, quantity }) => (
              <div
                key={variant.id}
                className="flex items-center justify-between gap-2 p-2 bg-grey-light rounded-lg hover:bg-grey-light transition-colors"
              >
                {/* Variant Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-navy truncate">
                    {variant.name}
                  </h4>
                  <p className="text-xs text-grey-dark">
                    {quantity} × €{formatPriceStr(variant.price)}
                  </p>
                </div>

                {/* Total Price */}
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-mono font-bold text-navy">
                    €{formatPriceStr(variant.price * quantity)}
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => onRemoveVariant(variant.id)}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 text-grey-mid hover:text-coral transition-colors"
                  aria-label={`Verwijder ${variant.name}`}
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="p-4 border-t-2 border-grey-light space-y-2">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-grey-dark">Subtotaal</span>
              <span className="font-mono font-semibold text-navy">
                €{formatPriceStr(subtotal)}
              </span>
            </div>

            {/* Discount (if applicable) */}
            {hasDiscount && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green font-semibold">
                  Staffelkorting (−{((discount / subtotal) * 100).toFixed(0)}%)
                </span>
                <span className="font-mono font-semibold text-green">
                  −€{formatPriceStr(discount)}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t border-grey-light">
              <span className="text-lg font-bold text-navy">Totaal</span>
              <span className="text-xl font-mono font-extrabold text-[var(--color-primary)]">
                €{formatPriceStr(total)}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="p-4 pt-0">
            <button
              type="button"
              onClick={onAddToCart}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
              <span>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} toevoegen
              </span>
            </button>
          </div>

          {/* Trust Signals */}
          <div className="p-4 pt-0 space-y-2">
            <div className="flex items-center gap-2 text-xs text-grey-dark">
              <Truck className="w-4 h-4 text-[var(--color-primary)]" strokeWidth={2} />
              <span>Gratis verzending vanaf €60</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-grey-dark">
              <svg
                className="w-4 h-4 text-[var(--color-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>14 dagen bedenktijd</span>
            </div>
          </div>
        </>
      )}
    </aside>
  )
}
