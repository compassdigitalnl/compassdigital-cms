/**
 * StaffelHintBanner Component (EC10)
 *
 * Amber banner that encourages customers to increase quantity to unlock
 * volume discounts (staffelkorting). Shows how many more items needed
 * to reach next discount tier. Success variant celebrates when achieved.
 *
 * Features:
 * - Amber background (encouragement variant)
 * - Green background (success variant when discount achieved)
 * - Icon (gift/tag)
 * - Dynamic message: "Koop X meer voor Y% korting"
 * - Compact variant (smaller padding)
 * - Contextual placement (attaches to cart items or product forms)
 *
 * @category E-commerce / Conversion Optimization
 * @component EC10
 */

'use client'

import React from 'react'
import { Gift, CheckCircle } from 'lucide-react'
import type { StaffelHintBannerProps } from './types'

export const StaffelHintBanner: React.FC<StaffelHintBannerProps> = ({
  currentQuantity,
  nextTier,
  variant = 'default',
  achieved = false,
  className = '',
  customMessage,
}) => {
  const isCompact = variant === 'compact'
  const isSuccess = variant === 'success' || achieved

  // Calculate items needed to reach next tier
  const itemsNeeded = Math.max(0, nextTier.quantity - currentQuantity)

  // Generate message
  const getMessage = (): string => {
    if (customMessage) return customMessage

    if (isSuccess || itemsNeeded === 0) {
      return `Je ontvangt ${nextTier.discount}% korting op deze bestelling!`
    }

    return `Koop ${itemsNeeded} meer ${itemsNeeded === 1 ? 'product' : 'producten'} voor ${nextTier.discount}% korting`
  }

  return (
    <div
      className={`
        staffel-hint flex items-center gap-2.5 font-medium
        border-t transition-colors
        ${isCompact ? 'px-4 py-2.5 text-xs' : 'px-5 py-3 text-[13px]'}
        ${
          isSuccess
            ? 'bg-green-50 border-green/20 text-green-800'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label={isSuccess ? 'Korting behaald' : 'Korting suggestie'}
    >
      {/* Icon */}
      {isSuccess ? (
        <CheckCircle
          className={`flex-shrink-0 text-green ${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}
          aria-hidden="true"
        />
      ) : (
        <Gift
          className={`flex-shrink-0 text-amber-600 ${isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`}
          aria-hidden="true"
        />
      )}

      {/* Message */}
      <span className="flex-1">
        {getMessage().split(new RegExp(`(${nextTier.discount}%|${itemsNeeded})`)).map((part, i) =>
          part === `${nextTier.discount}%` || part === `${itemsNeeded}` ? (
            <strong key={i} className={isSuccess ? 'text-green-900' : 'text-amber-950'}>
              {part}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </span>
    </div>
  )
}

export default StaffelHintBanner
