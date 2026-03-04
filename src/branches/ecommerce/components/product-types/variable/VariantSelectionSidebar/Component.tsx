'use client'

import React from 'react'
import { ShoppingCart, X, Truck } from 'lucide-react'
import type { VariantSelectionSidebarProps } from '@/branches/ecommerce/lib/product-types'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

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
        bg-white border-2 border-gray-300 rounded-xl shadow-lg
        flex flex-col
        ${className}
      `}
      style={{
        maxHeight: 'calc(100vh - 48px)',
      }}
    >
      {/* Header */}
      <div className="p-4 border-b-2 border-gray-200 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-teal-600" strokeWidth={2.5} />
          <h3 className="text-lg font-bold text-gray-900">
            Geselecteerd
            {hasItems && (
              <span className="ml-1 text-sm font-normal text-gray-600">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h3>
        </div>

        {hasItems && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm text-gray-600 hover:text-teal-600 font-semibold transition-colors"
          >
            Wis alles
          </button>
        )}
      </div>

      {/* Empty State */}
      {!hasItems && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-gray-600 text-sm">
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
                className="flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Variant Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {variant.name}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {quantity} × €{formatPriceStr(variant.price)}
                  </p>
                </div>

                {/* Total Price */}
                <div className="text-right flex-shrink-0">
                  <span className="text-sm font-mono font-bold text-gray-900">
                    €{formatPriceStr(variant.price * quantity)}
                  </span>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => onRemoveVariant(variant.id)}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600 transition-colors"
                  aria-label={`Verwijder ${variant.name}`}
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="p-4 border-t-2 border-gray-200 space-y-2">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotaal</span>
              <span className="font-mono font-semibold text-gray-900">
                €{formatPriceStr(subtotal)}
              </span>
            </div>

            {/* Discount (if applicable) */}
            {hasDiscount && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-semibold">
                  Staffelkorting (−{((discount / subtotal) * 100).toFixed(0)}%)
                </span>
                <span className="font-mono font-semibold text-green-600">
                  −€{formatPriceStr(discount)}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-900">Totaal</span>
              <span className="text-xl font-mono font-extrabold text-teal-600">
                €{formatPriceStr(total)}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="p-4 pt-0">
            <button
              type="button"
              onClick={onAddToCart}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
              <span>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} toevoegen
              </span>
            </button>
          </div>

          {/* Trust Signals */}
          <div className="p-4 pt-0 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Truck className="w-4 h-4 text-teal-600" strokeWidth={2} />
              <span>Gratis verzending vanaf €60</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <svg
                className="w-4 h-4 text-teal-600"
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
