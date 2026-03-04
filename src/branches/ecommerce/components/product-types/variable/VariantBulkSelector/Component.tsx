'use client'

/**
 * VP10: VariantBulkSelector
 * Bulk quantity selector for multiple variants (e.g., wholesale orders)
 */

import React from 'react'
import type { VariantBulkSelectorProps } from '@/branches/ecommerce/lib/product-types'
import { cn } from '@/utilities/cn'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

export function VariantBulkSelector({
  product,
  options,
  variantQuantities,
  onQuantityChange,
  showTotalSummary = true,
  minQuantity = 0,
  maxQuantity = 999,
  className,
}: VariantBulkSelectorProps) {
  const { formatPriceStr } = usePriceMode()

  if (!options || options.length === 0) {
    return null
  }

  // Generate all possible variant combinations
  const generateVariantCombinations = () => {
    if (options.length === 0) return []
    if (options.length === 1) {
      return (options[0].values || []).map(v => ({
        combination: [v],
        key: v.value,
        label: v.label,
        stock: v.stock,
        disabled: v.disabled || (v.stock !== undefined && v.stock !== null && v.stock <= 0),
        priceModifier: v.priceModifier || 0,
      }))
    }

    // For 2+ options, create combinations
    const combinations: any[] = []
    const firstOption = options[0].values || []
    const secondOption = options[1]?.values || []

    firstOption.forEach(first => {
      if (options.length === 2) {
        secondOption.forEach(second => {
          const totalModifier = (first.priceModifier || 0) + (second.priceModifier || 0)
          combinations.push({
            combination: [first, second],
            key: `${first.value}-${second.value}`,
            label: `${first.label} / ${second.label}`,
            stock: Math.min(
              first.stock ?? Infinity,
              second.stock ?? Infinity,
            ) === Infinity ? undefined : Math.min(first.stock ?? Infinity, second.stock ?? Infinity),
            disabled: first.disabled || second.disabled,
            priceModifier: totalModifier,
          })
        })
      } else {
        // Single option only
        combinations.push({
          combination: [first],
          key: first.value,
          label: first.label,
          stock: first.stock,
          disabled: first.disabled,
          priceModifier: first.priceModifier || 0,
        })
      }
    })

    return combinations
  }

  const variants = generateVariantCombinations()

  // Calculate totals
  const totalItems = Object.values(variantQuantities).reduce((sum, qty) => sum + qty, 0)
  const totalPrice = variants.reduce((sum, variant) => {
    const quantity = variantQuantities[variant.key] || 0
    return sum + quantity * variant.priceModifier
  }, 0)

  const handleQuantityChange = (variantKey: string, quantity: number) => {
    const clampedQuantity = Math.max(minQuantity, Math.min(maxQuantity, quantity))
    onQuantityChange(variantKey, clampedQuantity)
  }

  const handleIncrement = (variantKey: string, currentQuantity: number, maxStock?: number) => {
    const max = maxStock !== undefined ? Math.min(maxQuantity, maxStock) : maxQuantity
    if (currentQuantity < max) {
      handleQuantityChange(variantKey, currentQuantity + 1)
    }
  }

  const handleDecrement = (variantKey: string, currentQuantity: number) => {
    if (currentQuantity > minQuantity) {
      handleQuantityChange(variantKey, currentQuantity - 1)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Select Quantities</h3>
        {totalItems > 0 && (
          <span className="text-sm font-medium text-blue-600">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
          </span>
        )}
      </div>

      {/* Bulk Selector Table */}
      <div className="overflow-x-auto rounded-lg border-2 border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b-2 border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Variant
              </th>
              <th className="border-b-2 border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Price
              </th>
              <th className="border-b-2 border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Stock
              </th>
              <th className="border-b-2 border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                Quantity
              </th>
              <th className="border-b-2 border-gray-200 px-4 py-3 text-right text-sm font-semibold text-gray-700">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {variants.map(variant => {
              const quantity = variantQuantities[variant.key] || 0
              const subtotal = quantity * variant.priceModifier
              const isDisabled = variant.disabled || (variant.stock !== undefined && variant.stock <= 0)
              const isLowStock = variant.stock !== undefined && variant.stock > 0 && variant.stock <= 5

              return (
                <tr
                  key={variant.key}
                  className={cn(
                    'transition-colors',
                    isDisabled ? 'bg-gray-50 opacity-50' : 'hover:bg-gray-50',
                  )}
                >
                  {/* Variant Label */}
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{variant.label}</div>
                  </td>

                  {/* Price Modifier */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-700">
                      {variant.priceModifier > 0 ? '+' : ''}€{formatPriceStr(variant.priceModifier)}
                    </span>
                  </td>

                  {/* Stock Status */}
                  <td className="px-4 py-3 text-center">
                    {variant.stock !== undefined ? (
                      <span
                        className={cn(
                          'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                          variant.stock === 0
                            ? 'bg-red-100 text-red-800'
                            : isLowStock
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-green-100 text-green-800',
                        )}
                      >
                        {variant.stock === 0 ? 'Out' : `${variant.stock} left`}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">∞</span>
                    )}
                  </td>

                  {/* Quantity Controls */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecrement(variant.key, quantity)}
                        disabled={isDisabled || quantity <= minQuantity}
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded border-2 border-gray-300 text-gray-600 transition-colors',
                          isDisabled || quantity <= minQuantity
                            ? 'cursor-not-allowed opacity-50'
                            : 'hover:border-gray-400 hover:bg-gray-50',
                        )}
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
                          handleQuantityChange(variant.key, parseInt(e.target.value) || 0)
                        }
                        disabled={isDisabled}
                        min={minQuantity}
                        max={variant.stock !== undefined ? Math.min(maxQuantity, variant.stock) : maxQuantity}
                        className={cn(
                          'w-16 rounded border-2 border-gray-300 px-2 py-1 text-center text-sm',
                          isDisabled && 'cursor-not-allowed bg-gray-100',
                        )}
                      />

                      <button
                        type="button"
                        onClick={() => handleIncrement(variant.key, quantity, variant.stock)}
                        disabled={
                          isDisabled ||
                          (variant.stock !== undefined && quantity >= variant.stock) ||
                          quantity >= maxQuantity
                        }
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded border-2 border-gray-300 text-gray-600 transition-colors',
                          isDisabled ||
                            (variant.stock !== undefined && quantity >= variant.stock) ||
                            quantity >= maxQuantity
                            ? 'cursor-not-allowed opacity-50'
                            : 'hover:border-gray-400 hover:bg-gray-50',
                        )}
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
                  </td>

                  {/* Subtotal */}
                  <td className="px-4 py-3 text-right">
                    <span className={cn('text-sm font-medium', quantity > 0 ? 'text-blue-600' : 'text-gray-400')}>
                      {subtotal > 0 ? '+' : ''}€{formatPriceStr(subtotal)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Total Summary */}
      {showTotalSummary && totalItems > 0 && (
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-blue-900">Total Order Summary</div>
              <div className="mt-1 text-sm text-blue-800">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} across {Object.keys(variantQuantities).filter(k => variantQuantities[k] > 0).length} variants
              </div>
            </div>
            {totalPrice !== 0 && (
              <div className="text-right">
                <div className="text-xs text-blue-700">Total Price Adjustment</div>
                <div className="text-xl font-bold text-blue-900">
                  {totalPrice > 0 ? '+' : ''}€{formatPriceStr(totalPrice)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            const cleared: Record<string, number> = {}
            Object.keys(variantQuantities).forEach(key => {
              cleared[key] = 0
            })
            variants.forEach(v => {
              cleared[v.key] = 0
            })
            Object.entries(cleared).forEach(([key, val]) => onQuantityChange(key, val))
          }}
          className="rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}
