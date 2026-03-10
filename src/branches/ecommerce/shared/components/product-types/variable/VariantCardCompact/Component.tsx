'use client'

import React, { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import type { VariantCardCompactProps } from './types'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

/**
 * VP08: VariantCardCompact
 *
 * Compact grid card for multi-variant selection
 * Features:
 * - 18×18px checkbox (top-left)
 * - Variant name + full name
 * - Price display (monospace)
 * - Stock indicator (3 states)
 * - Quantity stepper
 * - Hover: teal border + shadow + translateY(-2px)
 * - Selected: teal border + light teal bg
 */
export const VariantCardCompact: React.FC<VariantCardCompactProps> = ({
  variant,
  selected,
  quantity,
  onToggle,
  onQuantityChange,
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
    'in-stock': `${variant.stock} op voorraad`,
    'low-stock': `${variant.stock} op voorraad`,
    'pre-order': 'Op aanvraag',
    'out-of-stock': 'Uitverkocht',
  }

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
      onToggle(variant.id) // Deselect when quantity reaches 0
    }
  }

  const handleCheckboxToggle = () => {
    if (!isOutOfStock) {
      onToggle(variant.id)
      // Set quantity to 1 when selecting
      if (!selected && quantity === 0) {
        onQuantityChange(variant.id, 1)
      }
    }
  }

  return (
    <div
      className={`
        variant-card-compact
        relative rounded-lg border-2 transition-all duration-200
        ${selected ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)]/20' : 'border-gray-300 bg-white'}
        ${isHovered && !isOutOfStock ? 'shadow-lg -translate-y-0.5' : ''}
        ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-primary)]'}
        p-3
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox (top-left) */}
      <button
        type="button"
        onClick={handleCheckboxToggle}
        disabled={isOutOfStock}
        className={`
          absolute top-2 left-2 w-[18px] h-[18px] rounded border-2 flex items-center justify-center
          transition-colors duration-200
          ${selected ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'bg-white border-gray-400'}
          ${isOutOfStock ? 'cursor-not-allowed' : 'hover:border-[var(--color-primary)]'}
        `}
        aria-label={selected ? 'Deselecteer variant' : 'Selecteer variant'}
      >
        {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>

      {/* Variant Info */}
      <div className="pl-5 mb-2">
        {/* Variant Name */}
        <h4 className="text-[18px] font-extrabold text-gray-900 leading-tight mb-0.5">
          {variant.name}
        </h4>

        {/* Full Name (attributes) */}
        {Object.keys(variant.attributes).length > 0 && (
          <p className="text-[13px] text-gray-600 leading-tight mb-1">
            {Object.values(variant.attributes).join(' • ')}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[16px] font-mono font-bold text-gray-900">
            €{formatPriceStr(variant.price)}
          </span>
          {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
            <span className="text-[13px] font-mono text-gray-500 line-through">
              €{formatPriceStr(variant.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Stock Indicator */}
        <div className="mt-2">
          <span
            className={`
              inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
              ${stockIndicatorColors[stockStatus]}
            `}
          >
            {stockIndicatorLabels[stockStatus]}
          </span>
        </div>
      </div>

      {/* Quantity Stepper */}
      {!isOutOfStock && (
        <div className="flex items-center justify-center gap-1 mt-3">
          {/* Decrease Button */}
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity === 0}
            className={`
              w-10 h-11 flex items-center justify-center rounded-md border-2 transition-colors
              ${quantity === 0 ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-gray-400 text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}
            `}
            aria-label="Verminder hoeveelheid"
          >
            <Minus className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {/* Quantity Input */}
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
            className="w-[60px] h-11 text-center text-[16px] font-mono font-bold text-gray-900 border-2 border-gray-400 rounded-md focus:outline-none focus:border-[var(--color-primary)]"
            aria-label="Hoeveelheid"
          />

          {/* Increase Button */}
          <button
            type="button"
            onClick={handleIncrease}
            disabled={variant.stock > 0 && quantity >= variant.stock}
            className={`
              w-10 h-11 flex items-center justify-center rounded-md border-2 transition-colors
              ${variant.stock > 0 && quantity >= variant.stock ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-gray-400 text-gray-700 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}
            `}
            aria-label="Verhoog hoeveelheid"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
          <span className="text-gray-700 font-bold text-sm uppercase tracking-wide">
            Uitverkocht
          </span>
        </div>
      )}
    </div>
  )
}
