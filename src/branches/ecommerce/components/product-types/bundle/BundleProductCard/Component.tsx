'use client'

import React from 'react'
import Image from 'next/image'
import { Check, Package, Tag } from 'lucide-react'
import type { BundleProductCardProps } from '@/branches/ecommerce/lib/product-types'
import type { Product, Media } from '@/payload-types'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

/**
 * BB02: BundleProductCard
 *
 * Individual product card for bundle selection with image and details
 * Features:
 * - Product image with fallback
 * - Product title + short description
 * - Quantity display
 * - Discount badge (if applicable)
 * - Required vs optional indicator
 * - Selection state with checkbox
 * - Optional toggle handler
 * - Hover states and animations
 */

export const BundleProductCard: React.FC<BundleProductCardProps> = ({
  item,
  selected,
  onToggle,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()
  const product = typeof item.product === 'object' ? (item.product as Product) : null
  const isSelectable = !item.required && onToggle
  const hasDiscount = item.discount && item.discount > 0

  // Get product image (first image from images array)
  const firstImage = product?.images?.[0]
  const productImage =
    firstImage && typeof firstImage === 'object'
      ? (firstImage as Media)
      : null

  // Get product price (if available)
  const productPrice = product?.price || 0
  const discountedPrice =
    hasDiscount && productPrice > 0 ? productPrice * (1 - item.discount! / 100) : productPrice

  const handleClick = () => {
    if (isSelectable) {
      onToggle(item.id)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        bundle-product-card
        border-2 rounded-lg overflow-hidden bg-white
        transition-all duration-200
        ${selected ? 'border-purple-600 shadow-lg' : 'border-gray-300 hover:border-purple-400'}
        ${isSelectable ? 'cursor-pointer' : 'cursor-default'}
        ${isSelectable && 'hover:shadow-md'}
        ${className}
      `}
    >
      {/* Image Section */}
      <div className="relative w-full aspect-square bg-gray-100">
        {productImage && productImage.url ? (
          <Image
            src={productImage.url}
            alt={product?.title || 'Product'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
          </div>
        )}

        {/* Selection Indicator (Top Right) */}
        {isSelectable && (
          <div
            className={`
              absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center
              transition-all duration-200
              ${selected ? 'bg-purple-600 border-purple-600' : 'bg-white border-gray-400'}
            `}
          >
            {selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
          </div>
        )}

        {/* Discount Badge (Top Left) */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-600 text-white rounded-md flex items-center gap-1">
            <Tag className="w-3 h-3" strokeWidth={2.5} />
            <span className="text-[11px] font-bold">-{item.discount}%</span>
          </div>
        )}

        {/* Required Badge (Bottom Left) */}
        {item.required && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-purple-600 text-white rounded-md">
            <span className="text-[11px] font-bold">Verplicht</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Product Title */}
        <h3 className="text-[16px] font-bold text-gray-900 mb-1 line-clamp-2">
          {product?.title || 'Product'}
        </h3>

        {/* Product Description */}
        {product?.shortDescription && (
          <p className="text-[13px] text-gray-600 mb-3 line-clamp-2">{product.shortDescription}</p>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[13px] text-gray-600">Aantal:</span>
          <span className="text-[13px] font-bold text-gray-900">{item.quantity}x</span>
        </div>

        {/* Price Display */}
        {productPrice > 0 && (
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="text-[16px] font-mono font-bold text-purple-600">
                  €{formatPriceStr(discountedPrice * item.quantity)}
                </span>
                <span className="text-[13px] font-mono text-gray-400 line-through">
                  €{formatPriceStr(productPrice * item.quantity)}
                </span>
              </>
            ) : (
              <span className="text-[16px] font-mono font-bold text-gray-900">
                €{formatPriceStr(productPrice * item.quantity)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Selected State Overlay (Optional Visual Feedback) */}
      {selected && (
        <div className="px-4 pb-3">
          <div className="w-full h-1 bg-purple-600 rounded-full" />
        </div>
      )}
    </div>
  )
}
