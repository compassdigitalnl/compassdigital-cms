'use client'

/**
 * VP12: VariantQuickAdd
 * Quick add multiple variants to cart with inline quantity selection
 */

import React, { useState } from 'react'
import type { VariantQuickAddProps } from './types'
import { cn } from '@/utilities/cn'

export function VariantQuickAdd({
  product,
  options,
  onAddToCart,
  showImages = true,
  compactMode = false,
  className,
}: VariantQuickAddProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [isAdding, setIsAdding] = useState(false)

  if (!options || options.length === 0) {
    return null
  }

  // Get all variants from first option
  const variants = options[0].values || []

  const handleQuantityChange = (variantValue: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [variantValue]: Math.max(0, quantity),
    }))
  }

  const handleAddToCart = async (variantValue: string) => {
    const quantity = quantities[variantValue] || 1
    setIsAdding(true)
    try {
      await onAddToCart(variantValue, quantity)
      // Reset quantity after successful add
      setQuantities(prev => ({ ...prev, [variantValue]: 0 }))
    } finally {
      setIsAdding(false)
    }
  }

  const handleAddAllToCart = async () => {
    setIsAdding(true)
    try {
      const promises = Object.entries(quantities)
        .filter(([_, qty]) => qty > 0)
        .map(([variantValue, quantity]) => onAddToCart(variantValue, quantity))
      await Promise.all(promises)
      setQuantities({})
    } finally {
      setIsAdding(false)
    }
  }

  const totalSelectedItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Quick Add to Cart</h3>
        {totalSelectedItems > 0 && (
          <button
            type="button"
            onClick={handleAddAllToCart}
            disabled={isAdding}
            className="btn btn-primary btn-sm"
          >
            {isAdding ? 'Adding...' : `Add All (${totalSelectedItems})`}
          </button>
        )}
      </div>

      {/* Variants List */}
      <div
        className={cn(
          'space-y-3',
          compactMode ? 'divide-y divide-gray-200' : 'grid gap-3 sm:grid-cols-2',
        )}
      >
        {variants.map(variant => {
          const quantity = quantities[variant.value] || 0
          const isDisabled = variant.disabled || (variant.stock !== undefined && variant.stock !== null && variant.stock <= 0)
          const hasStock = variant.stock === undefined || variant.stock === null || variant.stock > 0
          const isLowStock = variant.stock !== undefined && variant.stock !== null && variant.stock > 0 && variant.stock <= 5
          const maxQuantity = variant.stock !== undefined && variant.stock !== null ? variant.stock : 999

          return (
            <div
              key={variant.value}
              className={cn(
                'rounded-lg border-2 transition-all',
                compactMode ? 'border-0 border-b-2 p-3 last:border-b-0' : 'border-gray-200 p-4',
                quantity > 0 && 'border-teal bg-teal-50',
                isDisabled && 'opacity-50',
              )}
            >
              <div className={cn('flex items-center gap-4', compactMode ? 'gap-3' : 'gap-4')}>
                {/* Image (if enabled) */}
                {showImages && variant.image && (
                  <div
                    className={cn(
                      'relative shrink-0 overflow-hidden rounded-lg border-2 border-gray-200',
                      compactMode ? 'h-12 w-12' : 'h-16 w-16',
                    )}
                  >
                    {typeof variant.image === 'string' ? (
                      <img
                        src={variant.image}
                        alt={variant.label}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                  </div>
                )}

                {/* Color Swatch (if applicable) */}
                {!showImages && variant.colorHex && (
                  <div
                    className={cn(
                      'shrink-0 rounded-full border-2 border-gray-300',
                      compactMode ? 'h-8 w-8' : 'h-10 w-10',
                    )}
                    style={{ backgroundColor: variant.colorHex }}
                  />
                )}

                {/* Variant Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4
                        className={cn(
                          'font-medium text-gray-900',
                          compactMode ? 'text-sm' : 'text-base',
                        )}
                      >
                        {variant.label}
                      </h4>
                      <div className="mt-1 flex items-center gap-2">
                        {/* Stock Status */}
                        {variant.stock !== undefined && (
                          <span
                            className={cn(
                              'text-xs font-medium',
                              hasStock
                                ? isLowStock
                                  ? 'text-orange-600'
                                  : 'text-green'
                                : 'text-coral',
                            )}
                          >
                            {hasStock
                              ? isLowStock
                                ? `${variant.stock} left`
                                : 'In stock'
                              : 'Out of stock'}
                          </span>
                        )}
                        {/* Price Modifier */}
                        {variant.priceModifier !== undefined &&
                          variant.priceModifier !== null &&
                          variant.priceModifier !== 0 && (
                            <span className="text-xs font-semibold text-gray-600">
                              {variant.priceModifier > 0 ? '+' : ''}€
                              {variant.priceModifier.toFixed(2)}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                {!isDisabled && (
                  <div className="flex items-center gap-2">
                    {/* Quantity Input Group */}
                    <div className="flex items-center rounded-lg border-2 border-gray-300">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(variant.value, quantity - 1)}
                        disabled={quantity <= 0}
                        className="flex h-8 w-8 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Decrease quantity"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>

                      <input
                        type="number"
                        value={quantity}
                        onChange={e =>
                          handleQuantityChange(variant.value, parseInt(e.target.value) || 0)
                        }
                        min={0}
                        max={maxQuantity}
                        className="w-12 border-x-2 border-gray-300 px-2 py-1 text-center text-sm focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => handleQuantityChange(variant.value, quantity + 1)}
                        disabled={quantity >= maxQuantity}
                        className="flex h-8 w-8 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Increase quantity"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Quick Add Button */}
                    {quantity > 0 && (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(variant.value)}
                        disabled={isAdding}
                        className="btn btn-primary btn-sm"
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}

                {/* Disabled State */}
                {isDisabled && (
                  <div className="shrink-0 rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                    Unavailable
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      {totalSelectedItems > 0 && (
        <div className="rounded-lg bg-teal-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-navy">Cart Summary</div>
              <div className="mt-1 text-sm text-teal-800">
                {totalSelectedItems} {totalSelectedItems === 1 ? 'item' : 'items'} ready to add
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddAllToCart}
              disabled={isAdding}
              className="btn btn-primary"
            >
              {isAdding ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                `Add All to Cart (${totalSelectedItems})`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalSelectedItems === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <p className="text-sm text-gray-600">
            Select quantities above to quickly add multiple variants to your cart
          </p>
        </div>
      )}
    </div>
  )
}
