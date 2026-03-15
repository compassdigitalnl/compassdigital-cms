'use client'

/**
 * VP04: VariantImageRadio
 * Image-based radio selector for visual product options
 */

import React from 'react'
import Image from 'next/image'
import type { VariantImageRadioProps } from './types'
import type { Media } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

export function VariantImageRadio({
  product,
  option,
  selectedValue,
  onSelect,
  imageSize = 'md',
  className,
}: VariantImageRadioProps) {
  const { formatPriceStr } = usePriceMode()

  if (!option.values || option.values.length === 0) {
    return null
  }

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  }

  const getImageUrl = (image: Media | string | number | null | undefined): string | null => {
    if (!image) return null
    if (typeof image === 'string') return image
    if (typeof image === 'number') return null // ID only, can't display
    return image.url || null
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Option Label */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">
          {option.optionName}
          {option.required && <span className="ml-1 text-coral">*</span>}
        </label>
        {selectedValue && (
          <span className="text-sm text-gray-600">{selectedValue.label}</span>
        )}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {option.values.map(value => {
          const isSelected = selectedValue?.value === value.value
          const isDisabled = value.disabled || (value.stock !== undefined && value.stock !== null && value.stock <= 0)
          const hasStock = value.stock === undefined || value.stock === null || value.stock > 0
          const isLowStock = value.stock !== undefined && value.stock !== null && value.stock > 0 && value.stock <= 5
          const imageUrl = getImageUrl(value.image)

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
              {/* Image Container */}
              <div
                className={cn(
                  'relative overflow-hidden rounded-lg border-2 transition-all',
                  sizeClasses[imageSize],
                  isSelected
                    ? 'border-teal ring-2 ring-teal ring-offset-2'
                    : 'border-gray-300 hover:border-gray-400',
                  isDisabled && 'cursor-not-allowed',
                  !isDisabled && !isSelected && 'hover:scale-105',
                )}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={value.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100px, 150px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
                    No Image
                  </div>
                )}

                {/* Selected Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-teal/20">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal shadow-lg">
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Out of Stock Overlay */}
                {isDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60">
                    <span className="rounded bg-white px-2 py-1 text-xs font-bold text-gray-900">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Low Stock Badge */}
                {hasStock && isLowStock && !isSelected && (
                  <div className="absolute right-1 top-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {value.stock} left
                  </div>
                )}
              </div>

              {/* Label & Info */}
              <div className="flex w-full flex-col items-center gap-0.5 text-center">
                <span
                  className={cn(
                    'text-xs font-medium',
                    isSelected ? 'text-teal' : 'text-gray-700',
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
                      {value.priceModifier > 0 ? '+' : ''}€{formatPriceStr(value.priceModifier)}
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
