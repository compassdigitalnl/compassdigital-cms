'use client'

/**
 * VP02: VariantSizeSelector
 * Size selector with radio buttons, stock status, and optional size guide
 */

import React, { useState } from 'react'
import type { VariantSizeSelectorProps } from '@/branches/ecommerce/lib/product-types'
import { cn } from '@/utilities/cn'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

export function VariantSizeSelector({
  product,
  option,
  selectedValue,
  onSelect,
  showSizeGuide = true,
  className,
}: VariantSizeSelectorProps) {
  const [showSizeGuideModal, setShowSizeGuideModal] = useState(false)
  const { formatPriceStr } = usePriceMode()

  if (!option.values || option.values.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Option Label & Size Guide */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">
          {option.optionName}
          {option.required && <span className="ml-1 text-red-500">*</span>}
        </label>
        {showSizeGuide && (
          <button
            type="button"
            onClick={() => setShowSizeGuideModal(true)}
            className="btn btn-ghost btn-sm"
          >
            Size Guide
          </button>
        )}
      </div>

      {/* Selected Size Display */}
      {selectedValue && (
        <div className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-900">
          Selected: <span className="font-semibold">{selectedValue.label}</span>
          {selectedValue.priceModifier !== undefined &&
            selectedValue.priceModifier !== null &&
            selectedValue.priceModifier !== 0 && (
              <span className="ml-2 text-blue-700">
                ({selectedValue.priceModifier > 0 ? '+' : ''}€
                {formatPriceStr(selectedValue.priceModifier)})
              </span>
            )}
        </div>
      )}

      {/* Size Button Grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {option.values.map(value => {
          const isSelected = selectedValue?.value === value.value
          const isDisabled = value.disabled || (value.stock !== undefined && value.stock !== null && value.stock <= 0)
          const hasStock = value.stock === undefined || value.stock === null || value.stock > 0
          const isLowStock = value.stock !== undefined && value.stock !== null && value.stock > 0 && value.stock <= 5

          return (
            <button
              key={value.value}
              type="button"
              onClick={() => !isDisabled && onSelect(value)}
              disabled={isDisabled}
              className={cn(
                'group relative flex flex-col items-center justify-center gap-1 rounded-lg border-2 px-4 py-3 text-center transition-all',
                isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400',
                isDisabled
                  ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 opacity-60'
                  : 'cursor-pointer',
                !isDisabled && !isSelected && 'hover:shadow-md',
              )}
              aria-label={`Select size ${value.label}`}
              aria-pressed={isSelected}
            >
              {/* Size Label */}
              <span className="text-sm font-semibold">{value.label}</span>

              {/* Stock Badge */}
              {hasStock && isLowStock && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                  {value.stock}
                </span>
              )}

              {/* Out of Stock */}
              {isDisabled && (
                <span className="text-[10px] font-medium text-red-500">Out</span>
              )}

              {/* Price Modifier */}
              {!isDisabled &&
                value.priceModifier !== undefined &&
                value.priceModifier !== null &&
                value.priceModifier !== 0 && (
                  <span className="text-[10px] text-gray-500">
                    {value.priceModifier > 0 ? '+' : ''}€{formatPriceStr(value.priceModifier)}
                  </span>
                )}

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Stock Status Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span>In Stock</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-orange-500" />
          <span>Low Stock</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-gray-300" />
          <span>Out of Stock</span>
        </div>
      </div>

      {/* Required Field Helper Text */}
      {option.required && !selectedValue && (
        <p className="text-xs text-gray-500">
          Please select a {option.optionName.toLowerCase()}
        </p>
      )}

      {/* Size Guide Modal (Simple Version) */}
      {showSizeGuideModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowSizeGuideModal(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Size Guide</h3>
              <button
                type="button"
                onClick={() => setShowSizeGuideModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">
                Size guide information would be displayed here. This can be customized per product
                or product category.
              </p>
              {/* Add your size guide content here */}
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest (cm)</th>
                    <th>Waist (cm)</th>
                    <th>Hips (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>80-85</td>
                    <td>60-65</td>
                    <td>85-90</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>85-90</td>
                    <td>65-70</td>
                    <td>90-95</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>90-95</td>
                    <td>70-75</td>
                    <td>95-100</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>95-100</td>
                    <td>75-80</td>
                    <td>100-105</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>100-105</td>
                    <td>80-85</td>
                    <td>105-110</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>105-110</td>
                    <td>85-90</td>
                    <td>110-115</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
