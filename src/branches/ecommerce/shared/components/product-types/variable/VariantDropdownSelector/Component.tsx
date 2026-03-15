'use client'

/**
 * VP03: VariantDropdownSelector
 * Dropdown selector for materials, finishes, and other text-based options
 */

import React from 'react'
import type { VariantDropdownSelectorProps } from './types'
import { cn } from '@/utilities/cn'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

export function VariantDropdownSelector({
  product,
  option,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  className,
}: VariantDropdownSelectorProps) {
  const { formatPriceStr } = usePriceMode()

  if (!option.values || option.values.length === 0) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = option.values.find(v => v.value === e.target.value)
    if (value) {
      onSelect(value)
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Option Label */}
      <label htmlFor={`variant-${option.optionName}`} className="block text-sm font-medium text-navy">
        {option.optionName}
        {option.required && <span className="ml-1 text-coral">*</span>}
      </label>

      {/* Dropdown Select */}
      <div className="relative">
        <select
          id={`variant-${option.optionName}`}
          value={selectedValue?.value || ''}
          onChange={handleChange}
          className={cn(
            'block w-full appearance-none rounded-lg border-2 border-grey-light bg-white px-4 py-3 pr-10 text-base text-navy transition-colors',
            'focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20',
            !selectedValue && 'text-grey-mid',
          )}
          required={option.required}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {option.values.map(value => {
            const isDisabled = value.disabled || (value.stock !== undefined && value.stock !== null && value.stock <= 0)
            const hasStock = value.stock === undefined || value.stock === null || value.stock > 0
            const isLowStock = value.stock !== undefined && value.stock !== null && value.stock > 0 && value.stock <= 5

            let label = value.label

            // Add price modifier to label
            if (
              value.priceModifier !== undefined &&
              value.priceModifier !== null &&
              value.priceModifier !== 0
            ) {
              label += ` (${value.priceModifier > 0 ? '+' : ''}€${formatPriceStr(value.priceModifier)})`
            }

            // Add stock status to label
            if (value.stock !== undefined) {
              if (!hasStock) {
                label += ' - Out of Stock'
              } else if (isLowStock) {
                label += ` - Only ${value.stock} left`
              }
            }

            return (
              <option key={value.value} value={value.value} disabled={isDisabled}>
                {label}
              </option>
            )
          })}
        </select>

        {/* Dropdown Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-grey-mid"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Selected Value Info */}
      {selectedValue && (
        <div className="rounded-md bg-grey-light p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium text-navy">{selectedValue.label}</span>
            <div className="flex items-center gap-2">
              {/* Price Modifier */}
              {selectedValue.priceModifier !== undefined &&
                selectedValue.priceModifier !== null &&
                selectedValue.priceModifier !== 0 && (
                  <span className="font-semibold text-teal">
                    {selectedValue.priceModifier > 0 ? '+' : ''}€
                    {formatPriceStr(selectedValue.priceModifier)}
                  </span>
                )}

              {/* Stock Status */}
              {selectedValue.stock !== undefined && selectedValue.stock !== null && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    selectedValue.stock > 5
                      ? 'bg-green-100 text-green-800'
                      : selectedValue.stock > 0
                        ? 'bg-amber-50 text-amber-900'
                        : 'bg-red-100 text-red-800',
                  )}
                >
                  {selectedValue.stock > 5
                    ? 'In Stock'
                    : selectedValue.stock > 0
                      ? `${selectedValue.stock} left`
                      : 'Out of Stock'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Required Field Helper Text */}
      {option.required && !selectedValue && (
        <p className="text-xs text-grey-mid">Please select a {option.optionName.toLowerCase()}</p>
      )}
    </div>
  )
}
