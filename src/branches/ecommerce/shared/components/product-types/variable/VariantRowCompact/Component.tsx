'use client'

import React, { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import type { VariantRowCompactProps } from '@/branches/ecommerce/shared/lib/product-types'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

/**
 * VP09: VariantRowCompact
 *
 * Horizontal list row for multi-variant selection
 * Features:
 * - 24×24px checkbox (larger than VP08)
 * - Optional 80×80px image thumbnail
 * - Horizontal 6-column layout
 * - Quantity stepper inline
 * - Shows unit price + total price
 * - Compact vertical padding (10px)
 */
export const VariantRowCompact: React.FC<VariantRowCompactProps> = ({
  variant,
  selected,
  quantity,
  onToggle,
  onQuantityChange,
  showImage = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const { formatPriceStr } = usePriceMode()

  // Stock status logic
  const getStockStatus = (): 'in-stock' | 'low-stock' | 'pre-order' | 'out-of-stock' => {
    if (variant.stock === 0) return 'out-of-stock'
    if (variant.stock > 0 && variant.stock <= 5) return 'low-stock'
    if (variant.stock > 5) return 'in-stock'
    return 'pre-order'
  }

  const stockStatus = getStockStatus()
  const isOutOfStock = stockStatus === 'out-of-stock'

  // Stock indicator styling
  const stockIndicatorColors = {
    'in-stock': 'bg-green-500 text-white',
    'low-stock': 'bg-yellow-500 text-white',
    'pre-order': 'bg-blue-500 text-white',
    'out-of-stock': 'bg-gray-400 text-white',
  }

  const stockIndicatorLabels = {
    'in-stock': `${variant.stock} voorraad`,
    'low-stock': `${variant.stock} voorraad`,
    'pre-order': 'Op aanvraag',
    'out-of-stock': 'Uitverkocht',
  }

  // Calculate total price
  const totalPrice = variant.price * quantity

  // Handle quantity changes
  const handleIncrease = () => {
    if (!isOutOfStock) {
      onQuantityChange(variant.id, quantity + 1)
      if (!selected) {
        onToggle(variant.id)
      }
    }
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(variant.id, quantity - 1)
    } else if (quantity === 1) {
      onQuantityChange(variant.id, 0)
      onToggle(variant.id)
    }
  }

  const handleCheckboxToggle = () => {
    if (!isOutOfStock) {
      onToggle(variant.id)
      if (!selected && quantity === 0) {
        onQuantityChange(variant.id, 1)
      }
    }
  }

  return (
    <div
      className={`
        variant-row-compact
        grid gap-3 items-center rounded-lg border-2 transition-all duration-200 p-3
        ${selected ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)]/20' : 'border-gray-300 bg-white'}
        ${isHovered && !isOutOfStock ? 'shadow-md border-[var(--color-primary)]' : ''}
        ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        gridTemplateColumns: showImage ? '24px 80px 1fr auto auto 110px' : '24px 1fr auto auto 110px',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Column 1: Checkbox (24×24px) */}
      <button
        type="button"
        onClick={handleCheckboxToggle}
        disabled={isOutOfStock}
        className={`
          w-6 h-6 rounded border-2 flex items-center justify-center transition-colors duration-200
          ${selected ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'bg-white border-gray-400'}
          ${isOutOfStock ? 'cursor-not-allowed' : 'hover:border-[var(--color-primary)]'}
        `}
        aria-label={selected ? 'Deselecteer variant' : 'Selecteer variant'}
      >
        {selected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
      </button>

      {/* Column 2: Image Thumbnail (80×80px) - Optional */}
      {showImage && (
        <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
          {variant.image && typeof variant.image === 'object' && 'url' in variant.image && variant.image.url ? (
            <Image
              src={variant.image.url}
              alt={variant.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Geen afbeelding
            </div>
          )}
        </div>
      )}

      {/* Column 3: Variant Info */}
      <div className="flex flex-col gap-1 min-w-0">
        {/* Variant Name */}
        <h4 className="text-[16px] font-extrabold text-gray-900 leading-tight truncate">
          {variant.name}
        </h4>

        {/* Full Name (attributes) */}
        {Object.keys(variant.attributes).length > 0 && (
          <p className="text-[13px] text-gray-600 leading-tight truncate">
            {Object.values(variant.attributes).join(' • ')}
          </p>
        )}

        {/* Stock Badge + Unit Price */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Stock Badge */}
          <span
            className={`
              inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
              ${stockIndicatorColors[stockStatus]}
            `}
          >
            {stockIndicatorLabels[stockStatus]}
          </span>

          {/* Unit Price */}
          <span className="text-[14px] font-mono font-bold text-gray-900">
            €{formatPriceStr(variant.price)} /st
          </span>

          {/* Compare At Price */}
          {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
            <span className="text-[12px] font-mono text-gray-500 line-through">
              €{formatPriceStr(variant.compareAtPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Column 4: Quantity Stepper (Inline) */}
      {!isOutOfStock && (
        <div className="flex items-center gap-1">
          {/* Decrease Button */}
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity === 0}
            className={`
              w-9 h-9 flex items-center justify-center rounded-md border-2 transition-colors
              ${quantity === 0 ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-gray-400 text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}
            `}
            aria-label="Verminder hoeveelheid"
          >
            <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>

          {/* Quantity Input (smaller) */}
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              const newQty = Math.max(0, parseInt(e.target.value) || 0)
              onQuantityChange(variant.id, newQty)
              if (newQty > 0 && !selected) {
                onToggle(variant.id)
              } else if (newQty === 0 && selected) {
                onToggle(variant.id)
              }
            }}
            min="0"
            max={variant.stock > 0 ? variant.stock : 999}
            className="w-14 h-9 text-center text-[14px] font-mono font-bold text-gray-900 border-2 border-gray-400 rounded-md focus:outline-none focus:border-[var(--color-primary)]"
            aria-label="Hoeveelheid"
          />

          {/* Increase Button */}
          <button
            type="button"
            onClick={handleIncrease}
            disabled={variant.stock > 0 && quantity >= variant.stock}
            className={`
              w-9 h-9 flex items-center justify-center rounded-md border-2 transition-colors
              ${variant.stock > 0 && quantity >= variant.stock ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-gray-400 text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}
            `}
            aria-label="Verhoog hoeveelheid"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Column 5: Total Price */}
      {quantity > 0 && (
        <div className="text-right">
          <div className="text-[14px] font-mono font-bold text-[var(--color-primary)]">
            €{formatPriceStr(totalPrice)}
          </div>
          <div className="text-[11px] text-gray-500">
            {quantity} × €{formatPriceStr(variant.price)}
          </div>
        </div>
      )}

      {/* Column 6: Reserved (for future actions) */}
      <div className="w-[110px]">
        {/* Reserved for future: favorite button, compare button, etc. */}
      </div>
    </div>
  )
}
