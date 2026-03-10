'use client'

import React from 'react'
import Image from 'next/image'
import { Minus, Plus, X, Package } from 'lucide-react'
import type { BundleItemRowProps } from './types'
import type { Product, Media } from '@/payload-types'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

/**
 * BB03: BundleItemRow
 *
 * Horizontal row for bundle item with quantity controls and remove option
 * Features:
 * - Compact horizontal layout
 * - Product image thumbnail
 * - Product name + required badge
 * - Quantity controls (- / + buttons)
 * - Price display (unit price × quantity)
 * - Optional remove button
 * - Responsive layout (stacks on mobile)
 */

export const BundleItemRow: React.FC<BundleItemRowProps> = ({
  item,
  quantity,
  onQuantityChange,
  onRemove,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()
  const product = typeof item.product === 'object' ? (item.product as Product) : null

  // Get product image (first image from images array)
  const firstImage = product?.images?.[0]
  const productImage =
    firstImage && typeof firstImage === 'object'
      ? (firstImage as Media)
      : null

  // Get product price
  const productPrice = product?.price || 0
  const totalPrice = productPrice * quantity

  const handleIncrement = () => {
    onQuantityChange(item.id, quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(item.id, quantity - 1)
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id)
    }
  }

  return (
    <div
      className={`
        bundle-item-row
        flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4
        p-3 sm:p-4
        border-2 border-gray-200 rounded-lg bg-white
        hover:border-gray-300 transition-colors
        ${className}
      `}
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 relative rounded-md overflow-hidden bg-gray-100">
        {productImage && productImage.url ? (
          <Image
            src={productImage.url}
            alt={product?.title || 'Product'}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <h4 className="text-[15px] font-bold text-gray-900 line-clamp-1 flex-1">
            {product?.title || 'Product'}
          </h4>
          {item.required && (
            <span className="text-[10px] px-2 py-0.5 bg-purple-600 text-white rounded-full font-semibold flex-shrink-0">
              Verplicht
            </span>
          )}
        </div>
        {productPrice > 0 && (
          <p className="text-[13px] text-gray-600">
            €{formatPriceStr(productPrice)} per stuk
          </p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="btn btn-outline-neutral btn-sm w-8 h-8 flex items-center justify-center"
          aria-label="Verminder aantal"
        >
          <Minus className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {/* Quantity Display */}
        <div className="w-12 text-center">
          <span className="text-[16px] font-bold text-gray-900">{quantity}</span>
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          className="btn btn-outline-neutral btn-sm w-8 h-8 flex items-center justify-center"
          aria-label="Verhoog aantal"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Total Price */}
      {productPrice > 0 && (
        <div className="text-right min-w-[80px]">
          <p className="text-[16px] font-mono font-bold text-gray-900">
            €{formatPriceStr(totalPrice)}
          </p>
        </div>
      )}

      {/* Remove Button (Optional) */}
      {onRemove && !item.required && (
        <button
          type="button"
          onClick={handleRemove}
          className="btn btn-danger btn-sm w-8 h-8 flex items-center justify-center flex-shrink-0"
          aria-label="Verwijder item"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
