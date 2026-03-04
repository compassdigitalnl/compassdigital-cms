'use client'

import React from 'react'
import { Package, ShoppingCart, TrendingDown } from 'lucide-react'
import type { BundleOverviewCardProps } from '@/branches/ecommerce/lib/product-types'
import type { Product } from '@/payload-types'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

/**
 * BB01: BundleOverviewCard
 *
 * Bundle overview card showing all items, pricing, and savings
 * Features:
 * - Bundle title + description
 * - List of included items
 * - Price breakdown (original vs bundle)
 * - Savings display
 * - "Add to Cart" CTA
 * - Required vs optional items indicator
 */

export const BundleOverviewCard: React.FC<BundleOverviewCardProps> = ({
  title,
  description,
  items,
  totalPrice,
  originalPrice,
  discount,
  onAddToCart,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()
  const savings = originalPrice - totalPrice
  const savingsPercentage = originalPrice > 0 ? (savings / originalPrice) * 100 : 0

  // Count required vs optional items
  const requiredCount = items.filter((item) => item.required).length
  const optionalCount = items.filter((item) => !item.required).length

  return (
    <div className={`bundle-overview-card border-2 border-gray-300 rounded-lg bg-white overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="flex items-start gap-3">
          <Package className="w-6 h-6 flex-shrink-0 mt-1" strokeWidth={2.5} />
          <div className="flex-1">
            <h3 className="text-[20px] font-bold mb-1">{title}</h3>
            {description && <p className="text-[14px] text-purple-100">{description}</p>}
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="px-6 py-4 border-b-2 border-gray-200">
        <h4 className="text-[15px] font-bold text-gray-900 mb-3">Bundle bevat:</h4>
        <div className="space-y-2">
          {items.map((item, index) => {
            const product = typeof item.product === 'object' ? (item.product as Product) : null

            return (
              <div key={item.id || index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${item.required ? 'bg-purple-600' : 'bg-gray-400'}`}
                  />
                  <span className="text-[14px] text-gray-700">
                    {item.quantity}x {product?.title || 'Product'}
                  </span>
                  {!item.required && (
                    <span className="text-[11px] px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full font-semibold">
                      Optioneel
                    </span>
                  )}
                </div>
                {item.discount && item.discount > 0 && (
                  <span className="text-[12px] text-green-600 font-semibold">-{item.discount}%</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Item Count Summary */}
        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-4 text-[12px] text-gray-600">
          <span>
            <strong className="text-purple-600">{requiredCount}</strong> verplicht
          </span>
          {optionalCount > 0 && (
            <span>
              <strong className="text-gray-700">{optionalCount}</strong> optioneel
            </span>
          )}
        </div>
      </div>

      {/* Pricing */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="space-y-2">
          {/* Original Price */}
          <div className="flex items-center justify-between">
            <span className="text-[14px] text-gray-600">Losse producten:</span>
            <span className="text-[14px] text-gray-500 line-through font-mono">
              €{formatPriceStr(originalPrice)}
            </span>
          </div>

          {/* Bundle Discount */}
          {discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-gray-600">Bundle korting ({discount}%):</span>
              <span className="text-[14px] text-green-600 font-semibold font-mono">
                -€{formatPriceStr(savings)}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t-2 border-gray-300 my-2" />

          {/* Total Price */}
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-gray-900">Bundle prijs:</span>
            <span className="text-[22px] font-mono font-bold text-purple-600">
              €{formatPriceStr(totalPrice)}
            </span>
          </div>

          {/* Savings Badge */}
          {savings > 0 && (
            <div className="flex items-center justify-center gap-2 mt-3 px-3 py-2 bg-green-100 rounded-lg">
              <TrendingDown className="w-4 h-4 text-green-700" strokeWidth={2.5} />
              <span className="text-[14px] font-bold text-green-700">
                Je bespaart €{formatPriceStr(savings)} ({savingsPercentage.toFixed(0)}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="px-6 py-4">
        <button
          type="button"
          onClick={onAddToCart}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-[16px] font-bold shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
          Voeg Bundle Toe Aan Winkelwagen
        </button>
      </div>
    </div>
  )
}
