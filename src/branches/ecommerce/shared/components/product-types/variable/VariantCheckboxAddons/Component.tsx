'use client'

/**
 * VP05: VariantCheckboxAddons
 * Checkbox selector for optional add-ons and extras (multi-select)
 */

import React from 'react'
import type { VariantCheckboxAddonsProps } from './types'
import { cn } from '@/utilities/cn'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

export function VariantCheckboxAddons({
  product,
  option,
  selectedValues,
  onToggle,
  className,
}: VariantCheckboxAddonsProps) {
  const { formatPriceStr } = usePriceMode()

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
        <label className="text-sm font-medium text-navy">
          {option.optionName}
          {option.required && selectedValues.length === 0 && (
            <span className="ml-1 text-coral">*</span>
          )}
        </label>
        {selectedValues.length > 0 && (
          <span className="text-sm font-semibold text-teal">
            {selectedValues.length} selected
            {totalPrice !== 0 && ` (+€${formatPriceStr(totalPrice)})`}
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
                  ? 'border-teal bg-teal-50'
                  : 'border-grey-light bg-white hover:border-grey-light hover:bg-grey-light',
                isDisabled && 'cursor-not-allowed opacity-60',
              )}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => !isDisabled && onToggle(value)}
                disabled={isDisabled}
                className="h-5 w-5 rounded border-grey-light text-teal focus:ring-2 focus:ring-teal focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {/* Content */}
              <div className="flex flex-1 items-center justify-between">
                <div className="flex flex-col">
                  {/* Label */}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-navy' : 'text-navy',
                      isDisabled && 'text-grey-mid',
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
                            ? 'text-amber'
                            : 'text-green'
                          : 'text-coral',
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
                        isSelected ? 'text-teal' : 'text-grey-dark',
                      )}
                    >
                      {value.priceModifier > 0 ? '+' : ''}€{formatPriceStr(value.priceModifier)}
                    </span>
                  )}
              </div>
            </label>
          )
        })}
      </div>

      {/* Summary Card */}
      {selectedValues.length > 0 && (
        <div className="rounded-lg bg-teal-50 p-4">
          <div className="mb-2 text-sm font-semibold text-navy">Selected Add-ons:</div>
          <div className="space-y-1">
            {selectedValues.map(value => (
              <div key={value.value} className="flex items-center justify-between text-sm">
                <span className="text-teal-800">{value.label}</span>
                {value.priceModifier !== undefined &&
                  value.priceModifier !== null &&
                  value.priceModifier !== 0 && (
                    <span className="font-medium text-navy">
                      {value.priceModifier > 0 ? '+' : ''}€{formatPriceStr(value.priceModifier)}
                    </span>
                  )}
              </div>
            ))}
          </div>
          {totalPrice !== 0 && (
            <div className="mt-2 flex items-center justify-between border-t border-teal-200 pt-2 text-sm font-bold text-navy">
              <span>Total Add-ons:</span>
              <span>+€{formatPriceStr(totalPrice)}</span>
            </div>
          )}
        </div>
      )}

      {/* Required Field Helper Text */}
      {option.required && selectedValues.length === 0 && (
        <p className="text-xs text-coral">
          Please select at least one {option.optionName.toLowerCase()}
        </p>
      )}

      {/* Optional Helper Text */}
      {!option.required && selectedValues.length === 0 && (
        <p className="text-xs text-grey-mid">Optional add-ons - select any that you want</p>
      )}
    </div>
  )
}
