'use client'

/**
 * VP11: VariantComparisonTable
 * Side-by-side variant comparison for informed decision making
 */

import React, { useState } from 'react'
import type { VariantComparisonTableProps } from './types'
import { cn } from '@/utilities/cn'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

export function VariantComparisonTable({
  product,
  options,
  selectedVariants,
  onVariantsChange,
  maxCompare = 3,
  className,
}: VariantComparisonTableProps) {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)
  const { formatPriceStr } = usePriceMode()

  if (!options || options.length === 0) {
    return null
  }

  // Generate available variants from first option for comparison
  const availableVariants = options[0].values || []

  const handleVariantToggle = (variantValue: string) => {
    if (selectedVariants.includes(variantValue)) {
      onVariantsChange(selectedVariants.filter(v => v !== variantValue))
    } else {
      if (selectedVariants.length < maxCompare) {
        onVariantsChange([...selectedVariants, variantValue])
      }
    }
  }

  const getVariantDetails = (variantValue: string) => {
    return options[0].values?.find(v => v.value === variantValue)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Compare Variants</h3>
          <p className="text-sm text-gray-600">
            Select up to {maxCompare} variants to compare side-by-side
          </p>
        </div>
        <span className="text-sm font-medium text-blue-600">
          {selectedVariants.length} / {maxCompare} selected
        </span>
      </div>

      {/* Variant Selector */}
      <div className="rounded-lg border-2 border-gray-200 p-4">
        <div className="mb-3 text-sm font-medium text-gray-700">Select Variants to Compare:</div>
        <div className="flex flex-wrap gap-2">
          {availableVariants.map(variant => {
            const isSelected = selectedVariants.includes(variant.value)
            const isDisabled =
              !isSelected &&
              (selectedVariants.length >= maxCompare ||
                variant.disabled ||
                (variant.stock !== undefined && variant.stock !== null && variant.stock <= 0))

            return (
              <button
                key={variant.value}
                type="button"
                onClick={() => !isDisabled && handleVariantToggle(variant.value)}
                disabled={isDisabled}
                className={cn(
                  'rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all',
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50',
                  isDisabled && 'cursor-not-allowed opacity-50',
                )}
              >
                {variant.label}
                {isSelected && ' ✓'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedVariants.length > 0 && (
        <div className="overflow-x-auto rounded-lg border-2 border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="sticky left-0 z-10 border-b-2 border-r-2 border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Feature
                </th>
                {selectedVariants.map(variantValue => {
                  const variant = getVariantDetails(variantValue)
                  return (
                    <th
                      key={variantValue}
                      className="border-b-2 border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-900"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{variant?.label}</span>
                        <button
                          type="button"
                          onClick={() => handleVariantToggle(variantValue)}
                          className="btn btn-ghost btn-sm text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Price Row */}
              <tr className="hover:bg-gray-50">
                <td className="sticky left-0 z-10 border-r-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                  Price Modifier
                </td>
                {selectedVariants.map(variantValue => {
                  const variant = getVariantDetails(variantValue)
                  return (
                    <td key={variantValue} className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          variant?.priceModifier && variant.priceModifier > 0
                            ? 'text-red-600'
                            : variant?.priceModifier && variant.priceModifier < 0
                              ? 'text-green-600'
                              : 'text-gray-600',
                        )}
                      >
                        {variant?.priceModifier !== undefined &&
                        variant?.priceModifier !== null &&
                        variant?.priceModifier !== 0
                          ? `${variant.priceModifier > 0 ? '+' : ''}€${formatPriceStr(variant.priceModifier)}`
                          : `€${formatPriceStr(0)}`}
                      </span>
                    </td>
                  )
                })}
              </tr>

              {/* Stock Row */}
              <tr className="hover:bg-gray-50">
                <td className="sticky left-0 z-10 border-r-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                  Stock Availability
                </td>
                {selectedVariants.map(variantValue => {
                  const variant = getVariantDetails(variantValue)
                  const hasStock = variant?.stock === undefined || variant?.stock === null || variant.stock > 0
                  const isLowStock =
                    variant?.stock !== undefined && variant?.stock !== null && variant.stock > 0 && variant.stock <= 5

                  return (
                    <td key={variantValue} className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'inline-block rounded-full px-3 py-1 text-xs font-medium',
                          hasStock
                            ? isLowStock
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800',
                        )}
                      >
                        {variant?.stock === undefined
                          ? 'In Stock'
                          : variant.stock === 0
                            ? 'Out of Stock'
                            : isLowStock
                              ? `${variant.stock} left`
                              : 'In Stock'}
                      </span>
                    </td>
                  )
                })}
              </tr>

              {/* Color Row (if applicable) */}
              {options[0].values?.some(v => v.colorHex) && (
                <tr className="hover:bg-gray-50">
                  <td className="sticky left-0 z-10 border-r-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                    Color
                  </td>
                  {selectedVariants.map(variantValue => {
                    const variant = getVariantDetails(variantValue)
                    return (
                      <td key={variantValue} className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {variant?.colorHex && (
                            <>
                              <div
                                className="h-8 w-8 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: variant.colorHex }}
                              />
                              <span className="text-xs text-gray-600">{variant.colorHex}</span>
                            </>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )}

              {/* Status Row */}
              <tr className="hover:bg-gray-50">
                <td className="sticky left-0 z-10 border-r-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                  Status
                </td>
                {selectedVariants.map(variantValue => {
                  const variant = getVariantDetails(variantValue)
                  const isDisabled =
                    variant?.disabled || (variant?.stock !== undefined && variant?.stock !== null && variant.stock <= 0)

                  return (
                    <td key={variantValue} className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'inline-block rounded-full px-3 py-1 text-xs font-medium',
                          isDisabled ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800',
                        )}
                      >
                        {isDisabled ? 'Unavailable' : 'Available'}
                      </span>
                    </td>
                  )
                })}
              </tr>

              {/* Additional features from other options */}
              {options.slice(1).map(option => (
                <tr key={option.optionName} className="hover:bg-gray-50">
                  <td className="sticky left-0 z-10 border-r-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                    {option.optionName}
                  </td>
                  {selectedVariants.map(variantValue => (
                    <td key={variantValue} className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-600">
                        {option.values?.[0]?.label || '-'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Winner Recommendation */}
      {selectedVariants.length > 1 && (
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-blue-900">Recommendation</div>
              <p className="mt-1 text-sm text-blue-800">
                Based on availability and value, we recommend:{' '}
                <span className="font-semibold">
                  {(() => {
                    // Find variant with best combination of availability and price
                    const bestVariant = selectedVariants
                      .map(v => ({
                        value: v,
                        details: getVariantDetails(v),
                      }))
                      .filter(v => {
                        const available =
                          !v.details?.disabled &&
                          (v.details?.stock === undefined || v.details?.stock === null || v.details.stock > 0)
                        return available
                      })
                      .sort((a, b) => {
                        const priceA = a.details?.priceModifier || 0
                        const priceB = b.details?.priceModifier || 0
                        return priceA - priceB
                      })[0]

                    return bestVariant?.details?.label || 'None available'
                  })()}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedVariants.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <svg
            className="mb-3 h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <h4 className="text-sm font-medium text-gray-900">No variants selected</h4>
          <p className="mt-1 text-sm text-gray-600">
            Select variants above to compare their features side-by-side
          </p>
        </div>
      )}
    </div>
  )
}
