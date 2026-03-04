'use client'

import React, { useState } from 'react'
import { Check, Star } from 'lucide-react'
import Image from 'next/image'
import type { ConfiguratorOptionCardProps } from '@/branches/ecommerce/lib/product-types'
import type { Media } from '@/payload-types'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

/**
 * PC03: ConfiguratorOptionCard
 *
 * Single option selection card with image, title, price, and recommended badge
 * Features:
 * - Image display (optional)
 * - Option name + description
 * - Price display (optional)
 * - Recommended badge
 * - Radio-style selection
 * - Hover/active states
 * - Responsive layout
 */

export const ConfiguratorOptionCard: React.FC<ConfiguratorOptionCardProps> = ({
  option,
  isSelected,
  onSelect,
  showPrice = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const { formatPriceStr } = usePriceMode()

  // Get image URL
  const image = option.image
  const imageUrl =
    image && typeof image === 'object' && 'url' in image && image.url
      ? (image as Media).url
      : null

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        configurator-option-card
        relative w-full rounded-lg border-2 transition-all duration-200 text-left overflow-hidden
        ${isSelected ? 'border-teal-600 bg-teal-50/20 shadow-lg' : 'border-gray-300 bg-white'}
        ${isHovered && !isSelected ? 'border-teal-400 shadow-md' : ''}
        ${className}
      `}
      aria-pressed={isSelected}
    >
      {/* Recommended Badge (top-right) */}
      {option.recommended && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded-full shadow-md">
            <Star className="w-3 h-3" fill="white" strokeWidth={2} />
            <span className="text-[11px] font-bold uppercase">Aanbevolen</span>
          </div>
        </div>
      )}

      {/* Selection Indicator (top-left) */}
      {isSelected && (
        <div className="absolute top-3 left-3 z-10">
          <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center shadow-md">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        </div>
      )}

      {/* Image (if provided) */}
      {imageUrl && (
        <div className="relative w-full h-40 bg-gray-100">
          <Image
            src={imageUrl}
            alt={option.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Option Name */}
        <h4 className="text-[16px] font-bold text-gray-900 mb-1">
          {option.name}
        </h4>

        {/* Description */}
        {option.description && (
          <p className="text-[13px] text-gray-600 mb-3 line-clamp-2">
            {option.description}
          </p>
        )}

        {/* Price (if showPrice) */}
        {showPrice && (
          <div className="mt-2">
            {option.price === 0 ? (
              <p className="text-[14px] font-semibold text-green-600">Inbegrepen</p>
            ) : option.price > 0 ? (
              <p className="text-[15px] font-mono font-bold text-teal-600">
                +€{formatPriceStr(option.price)}
              </p>
            ) : (
              <p className="text-[15px] font-mono font-bold text-red-600">
                €{formatPriceStr(option.price)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Selected Overlay */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-teal-600 rounded-lg pointer-events-none" />
      )}
    </button>
  )
}
