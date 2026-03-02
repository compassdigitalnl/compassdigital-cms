'use client'

/**
 * VP05: VariantCheckboxAddons
 * Checkbox selector for optional add-ons and extras (multi-select)
 */

import React from 'react'
import type { VariantCheckboxAddonsProps } from '@/branches/ecommerce/lib/product-types'
import { cn } from '@/utilities/cn'

export function VariantCheckboxAddons({
  product,
  option,
  selectedValues,
  onToggle,
  className,
}: VariantCheckboxAddonsProps) {
  if (!option.values || option.values.length === 0) {
    return null
  }

  const totalPrice = selectedValues.reduce((sum, value) => {
    const price = value.priceModifier || 0
    return sum + price
  }, 0)

  return (
    <div className={cn('space-y-3', className)}>
      {/* Option Label & Total */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">
          {option.optionName}
          {option.required && selectedValues.length === 0 && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
        {selectedValues.length > 0 && (
          <span className="text-sm font-semibold text-blue-600">
            {selectedValues.length} selected
            {totalPrice !== 0 && ` (+€${totalPrice.toFixed(2)})`}
          </span>
        )}
      </div>

      {/* Checkbox List */}
      <div className="space-y-2">
        {option.values.map(value => {
          const isSelected = selectedValues.some(v => v.value === value.value)
          const isDisabled = value.disabled || (value.stock !== undefined && value.stock !== null && value.stock <= 0)
          const hasStock = value.stock === undefined || value.stock === null || value.stock > 0
          const isLowStock = value.stock !== undefined && value.stock !== null && value.stock > 0 && value.stock <= 5

          return (
            <label
              key={value.value}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all',
                isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
                isDisabled && 'cursor-not-allowed opacity-60',
              )}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => !isDisabled && onToggle(value)}
                disabled={isDisabled}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {/* Content */}
              <div className="flex flex-1 items-center justify-between">
                <div className="flex flex-col">
                  {/* Label */}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-blue-900' : 'text-gray-900',
                      isDisabled && 'text-gray-500',
                    )}
                  >
                    {value.label}
                  </span>

                  {/* Stock Status */}
                  {value.stock !== undefined && (
                    <span
                      className={cn(
                        'text-xs',
                        hasStock
                          ? isLowStock
                            ? 'text-orange-600'
                            : 'text-green-600'
                          : 'text-red-600',
                      )}
                    >
                      {hasStock
                        ? isLowStock
                          ? `Only ${value.stock} left`
                          : 'In stock'
                        : 'Out of stock'}
                    </span>
                  )}
                </div>

                {/* Price Modifier */}
                {value.priceModifier !== undefined &&
                  value.priceModifier !== null &&
                  value.priceModifier !== 0 && (
                    <span
                      className={cn(
                        'text-sm font-semibold',
                        isSelected ? 'text-blue-600' : 'text-gray-600',
                      )}
                    >
                      {value.priceModifier > 0 ? '+' : ''}€{value.priceModifier.toFixed(2)}
                    </span>
                  )}
              </div>
            </label>
          )
        })}
      </div>

      {/* Summary Card */}
      {selectedValues.length > 0 && (
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="mb-2 text-sm font-semibold text-blue-900">Selected Add-ons:</div>
          <div className="space-y-1">
            {selectedValues.map(value => (
              <div key={value.value} className="flex items-center justify-between text-sm">
                <span className="text-blue-800">{value.label}</span>
                {value.priceModifier !== undefined &&
                  value.priceModifier !== null &&
                  value.priceModifier !== 0 && (
                    <span className="font-medium text-blue-900">
                      {value.priceModifier > 0 ? '+' : ''}€{value.priceModifier.toFixed(2)}
                    </span>
                  )}
              </div>
            ))}
          </div>
          {totalPrice !== 0 && (
            <div className="mt-2 flex items-center justify-between border-t border-blue-200 pt-2 text-sm font-bold text-blue-900">
              <span>Total Add-ons:</span>
              <span>+€{totalPrice.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}

      {/* Required Field Helper Text */}
      {option.required && selectedValues.length === 0 && (
        <p className="text-xs text-red-600">
          Please select at least one {option.optionName.toLowerCase()}
        </p>
      )}

      {/* Optional Helper Text */}
      {!option.required && selectedValues.length === 0 && (
        <p className="text-xs text-gray-500">Optional add-ons - select any that you want</p>
      )}
    </div>
  )
}
