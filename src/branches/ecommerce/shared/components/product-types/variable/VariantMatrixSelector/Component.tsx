'use client'

/**
 * VP08: VariantMatrixSelector
 * Grid-based multi-variant selection (e.g., Size x Color matrix)
 */

import React from 'react'
import type { VariantMatrixSelectorProps } from './types'
import { cn } from '@/utilities/cn'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

export function VariantMatrixSelector({
  product,
  primaryOption,
  secondaryOption,
  selectedCombination,
  onSelect,
  showStock = true,
  className,
}: VariantMatrixSelectorProps) {
  const { formatPriceStr } = usePriceMode()

  if (
    !primaryOption.values ||
    primaryOption.values.length === 0 ||
    !secondaryOption.values ||
    secondaryOption.values.length === 0
  ) {
    return null
  }

  // Helper to check if a combination exists and get its details
  const getCombinationDetails = (primaryValue: string, secondaryValue: string) => {
    // In a real implementation, this would check against product.variantCombinations
    // For now, we assume all combinations are valid
    return {
      available: true,
      stock: undefined as number | undefined,
      priceModifier: 0,
    }
  }

  const isSelected = (primaryValue: string, secondaryValue: string) => {
    return (
      selectedCombination?.primary === primaryValue &&
      selectedCombination?.secondary === secondaryValue
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          Select {primaryOption.optionName} & {secondaryOption.optionName}
        </h3>
        {selectedCombination && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Selected:</span>
            <span className="font-medium text-blue-600">
              {primaryOption.values.find(v => v.value === selectedCombination.primary)?.label} /{' '}
              {secondaryOption.values.find(v => v.value === selectedCombination.secondary)?.label}
            </span>
          </div>
        )}
      </div>

      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-2 border-gray-300 bg-gray-50 p-3 text-left text-sm font-semibold text-gray-700">
                {primaryOption.optionName} \ {secondaryOption.optionName}
              </th>
              {secondaryOption.values.map(secValue => (
                <th
                  key={secValue.value}
                  className="border-2 border-gray-300 bg-gray-50 p-3 text-center text-sm font-semibold text-gray-700"
                >
                  {secValue.label}
                  {secValue.priceModifier !== undefined &&
                    secValue.priceModifier !== null &&
                    secValue.priceModifier !== 0 && (
                      <div className="mt-1 text-xs font-normal text-gray-600">
                        {secValue.priceModifier > 0 ? '+' : ''}€{formatPriceStr(secValue.priceModifier)}
                      </div>
                    )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {primaryOption.values.map(primValue => (
              <tr key={primValue.value}>
                {/* Row Header */}
                <td className="border-2 border-gray-300 bg-gray-50 p-3 text-sm font-medium text-gray-700">
                  {primValue.label}
                  {primValue.priceModifier !== undefined &&
                    primValue.priceModifier !== null &&
                    primValue.priceModifier !== 0 && (
                      <div className="mt-1 text-xs font-normal text-gray-600">
                        {primValue.priceModifier > 0 ? '+' : ''}€
                        {formatPriceStr(primValue.priceModifier)}
                      </div>
                    )}
                </td>

                {/* Matrix Cells */}
                {secondaryOption.values.map(secValue => {
                  const combination = getCombinationDetails(primValue.value, secValue.value)
                  const selected = isSelected(primValue.value, secValue.value)
                  const disabled =
                    !combination.available ||
                    primValue.disabled ||
                    secValue.disabled ||
                    (combination.stock !== undefined && combination.stock <= 0)
                  const hasStock = combination.stock === undefined || combination.stock > 0
                  const isLowStock =
                    combination.stock !== undefined && combination.stock > 0 && combination.stock <= 5

                  return (
                    <td key={secValue.value} className="border-2 border-gray-300 p-0">
                      <button
                        type="button"
                        onClick={() =>
                          !disabled &&
                          onSelect({
                            primary: primValue.value,
                            secondary: secValue.value,
                          })
                        }
                        disabled={disabled}
                        className={cn(
                          'h-full w-full p-3 text-center transition-all',
                          selected
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50',
                          disabled && 'cursor-not-allowed bg-gray-100 text-gray-400',
                        )}
                        aria-label={`Select ${primValue.label} and ${secValue.label}`}
                        aria-pressed={selected}
                      >
                        {/* Selected Checkmark */}
                        {selected && (
                          <div className="mb-1 flex justify-center">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}

                        {/* Stock Status */}
                        {showStock && (
                          <div
                            className={cn(
                              'text-xs font-medium',
                              selected
                                ? 'text-white'
                                : hasStock
                                  ? isLowStock
                                    ? 'text-orange-600'
                                    : 'text-green-600'
                                  : 'text-red-600',
                            )}
                          >
                            {!hasStock
                              ? 'Out'
                              : isLowStock
                                ? `${combination.stock} left`
                                : selected
                                  ? 'Available'
                                  : '✓'}
                          </div>
                        )}

                        {/* Total Price Modifier */}
                        {!disabled &&
                          (primValue.priceModifier || secValue.priceModifier) && (
                            <div
                              className={cn(
                                'mt-1 text-xs',
                                selected ? 'text-blue-100' : 'text-gray-600',
                              )}
                            >
                              +€
                              {formatPriceStr(
                                (primValue.priceModifier || 0) + (secValue.priceModifier || 0)
                              )}
                            </div>
                          )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Combination Details */}
      {selectedCombination && (
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-blue-900">Selected Combination:</div>
              <div className="mt-1 text-sm text-blue-800">
                {primaryOption.values.find(v => v.value === selectedCombination.primary)?.label} +{' '}
                {secondaryOption.values.find(v => v.value === selectedCombination.secondary)?.label}
              </div>
            </div>
            {(() => {
              const primValue = primaryOption.values.find(
                v => v.value === selectedCombination.primary,
              )
              const secValue = secondaryOption.values.find(
                v => v.value === selectedCombination.secondary,
              )
              const totalModifier =
                (primValue?.priceModifier || 0) + (secValue?.priceModifier || 0)

              return (
                totalModifier !== 0 && (
                  <div className="text-base font-bold text-blue-900">
                    {totalModifier > 0 ? '+' : ''}€{formatPriceStr(totalModifier)}
                  </div>
                )
              )
            })()}
          </div>
        </div>
      )}

      {/* Helper Text */}
      {(primaryOption.required || secondaryOption.required) && !selectedCombination && (
        <p className="text-xs text-red-600">
          Please select a combination of {primaryOption.optionName.toLowerCase()} and{' '}
          {secondaryOption.optionName.toLowerCase()}
        </p>
      )}

      {/* Legend */}
      {showStock && (
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-green-600"></div>
            <span>In Stock</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-orange-600"></div>
            <span>Low Stock</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-red-600"></div>
            <span>Out of Stock</span>
          </div>
        </div>
      )}
    </div>
  )
}
