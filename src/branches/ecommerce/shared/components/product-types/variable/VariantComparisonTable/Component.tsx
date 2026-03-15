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
          <h3 className="text-base font-semibold text-navy">Compare Variants</h3>
          <p className="text-sm text-grey-dark">
            Select up to {maxCompare} variants to compare side-by-side
          </p>
        </div>
        <span className="text-sm font-medium text-teal">
          {selectedVariants.length} / {maxCompare} selected
        </span>
      </div>

      {/* Variant Selector */}
      <div className="rounded-lg border-2 border-grey-light p-4">
        <div className="mb-3 text-sm font-medium text-grey-dark">Select Variants to Compare:</div>
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
                    ? 'border-teal bg-teal-50 text-navy'
                    : 'border-grey-light bg-white text-grey-dark hover:border-grey-light hover:bg-grey-light',
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
        <div className="overflow-x-auto rounded-lg border-2 border-grey-light">
          <table className="w-full">
            <thead>
              <tr className="bg-grey-light">
                <th className="sticky left-0 z-10 border-b-2 border-r-2 border-grey-light bg-grey-light px-4 py-3 text-left text-sm font-semibold text-grey-dark">
                  Feature
                </th>
                {selectedVariants.map(variantValue => {
                  const variant = getVariantDetails(variantValue)
                  return (
                    <th
                      key={variantValue}
                      className="border-b-2 border-grey-light px-4 py-3 text-center text-sm font-semibold text-navy"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{variant?.label}</span>
                        <button
                          type="button"
                          onClick={() => handleVariantToggle(variantValue)}
                          className="btn btn-ghost btn-sm text-coral"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-light">
              {/* Price Row */}
              <tr className="hover:bg-grey-light">
                <td className="sticky left-0 z-10 border-r-2 border-grey-light bg-white px-4 py-3 text-sm font-medium text-grey-dark">
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
                            ? 'text-coral'
                            : variant?.priceModifier && variant.priceModifier < 0
                              ? 'text-green'
                              : 'text-grey-dark',
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
              <tr className="hover:bg-grey-light">
                <td className="sticky left-0 z-10 border-r-2 border-grey-light bg-white px-4 py-3 text-sm font-medium text-grey-dark">
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
                              ? 'bg-amber-50 text-amber-900'
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
                <tr className="hover:bg-grey-light">
                  <td className="sticky left-0 z-10 border-r-2 border-grey-light bg-white px-4 py-3 text-sm font-medium text-grey-dark">
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
                                className="h-8 w-8 rounded-full border-2 border-grey-light"
                                style={{ backgroundColor: variant.colorHex }}
                              />
                              <span className="text-xs text-grey-dark">{variant.colorHex}</span>
                            </>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )}

              {/* Status Row */}
              <tr className="hover:bg-grey-light">
                <td className="sticky left-0 z-10 border-r-2 border-grey-light bg-white px-4 py-3 text-sm font-medium text-grey-dark">
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
                          isDisabled ? 'bg-grey-light text-navy' : 'bg-teal-100 text-teal-800',
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
                <tr key={option.optionName} className="hover:bg-grey-light">
                  <td className="sticky left-0 z-10 border-r-2 border-grey-light bg-white px-4 py-3 text-sm font-medium text-grey-dark">
                    {option.optionName}
                  </td>
                  {selectedVariants.map(variantValue => (
                    <td key={variantValue} className="px-4 py-3 text-center">
                      <span className="text-sm text-grey-dark">
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
        <div className="rounded-lg bg-gradient-to-r from-teal-50 to-teal-100 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-navy">Recommendation</div>
              <p className="mt-1 text-sm text-teal-800">
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
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-grey-light p-12 text-center">
          <svg
            className="mb-3 h-12 w-12 text-grey-mid"
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
          <h4 className="text-sm font-medium text-navy">No variants selected</h4>
          <p className="mt-1 text-sm text-grey-dark">
            Select variants above to compare their features side-by-side
          </p>
        </div>
      )}
    </div>
  )
}
