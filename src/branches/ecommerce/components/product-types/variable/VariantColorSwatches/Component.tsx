'use client'

/**
 * VP01: VariantColorSwatches
 * Color swatch selector with hex codes, stock display, and price modifiers
 */

import React from 'react'
import type { VariantColorSwatchesProps } from '@/branches/ecommerce/lib/product-types'
import { cn } from '@/utilities/cn'

export function VariantColorSwatches({
  product,
  option,
  selectedValue,
  onSelect,
  className,
}: VariantColorSwatchesProps) {
  if (!option.values || option.values.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Option Label */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">
          {option.optionName}
          {option.required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {selectedValue && (
          <span className="text-sm text-gray-600">{selectedValue.label}</span>
        )}
      </div>

      {/* Color Swatches Grid */}
      <div className="flex flex-wrap gap-3">
        {option.values.map(value => {
          const isSelected = selectedValue?.value === value.value
          const isDisabled = value.disabled || (value.stock !== undefined && value.stock !== null && value.stock <= 0)
          const hasStock = value.stock === undefined || value.stock === null || value.stock > 0
          const isLowStock = value.stock !== undefined && value.stock !== null && value.stock > 0 && value.stock <= 5
          const colorHex = value.colorHex || '#CCCCCC'

          return (
            <button
              key={value.value}
              type="button"
              onClick={() => !isDisabled && onSelect(value)}
              disabled={isDisabled}
              className={cn(
                'group relative flex flex-col items-center gap-2 transition-all',
                isDisabled && 'cursor-not-allowed opacity-50',
              )}
              aria-label={`Select ${value.label}`}
              aria-pressed={isSelected}
            >
              {/* Color Swatch Circle */}
              <div
                className={cn(
                  'relative h-12 w-12 rounded-full border-2 transition-all',
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                    : 'border-gray-300 hover:border-gray-400',
                  isDisabled && 'cursor-not-allowed',
                  !isDisabled && !isSelected && 'hover:scale-110',
                )}
                style={{ backgroundColor: colorHex }}
              >
                {/* Selected Checkmark */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="h-6 w-6 text-white drop-shadow-md"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Out of Stock Slash */}
                {isDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-0.5 w-16 rotate-45 bg-red-500" />
                  </div>
                )}

                {/* Low Stock Indicator */}
                {hasStock && isLowStock && !isSelected && (
                  <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                    !
                  </div>
                )}
              </div>

              {/* Label & Info */}
              <div className="flex flex-col items-center gap-0.5 text-center">
                <span
                  className={cn(
                    'text-xs font-medium',
                    isSelected ? 'text-blue-600' : 'text-gray-700',
                    isDisabled && 'text-gray-400',
                  )}
                >
                  {value.label}
                </span>

                {/* Price Modifier */}
                {value.priceModifier !== undefined &&
                  value.priceModifier !== null &&
                  value.priceModifier !== 0 && (
                    <span className="text-xs text-gray-500">
                      {value.priceModifier > 0 ? '+' : ''}€{value.priceModifier.toFixed(2)}
                    </span>
                  )}

                {/* Stock Info */}
                {value.stock !== undefined && (
                  <span
                    className={cn(
                      'text-[10px]',
                      hasStock
                        ? isLowStock
                          ? 'text-orange-600'
                          : 'text-green-600'
                        : 'text-red-600',
                    )}
                  >
                    {hasStock
                      ? isLowStock
                        ? `${value.stock} left`
                        : 'In stock'
                      : 'Out of stock'}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Required Field Helper Text */}
      {option.required && !selectedValue && (
        <p className="text-xs text-gray-500">Please select a {option.optionName.toLowerCase()}</p>
      )}
    </div>
  )
}
