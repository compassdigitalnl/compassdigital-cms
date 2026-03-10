'use client'

import React from 'react'
import { Check, Lock, TrendingUp } from 'lucide-react'
import type { BundleDiscountTiersProps } from './types'

/**
 * BB04: BundleDiscountTiers
 *
 * Display discount tiers with current quantity status
 * Features:
 * - List of all discount tiers
 * - Current active tier highlighted
 * - Unlocked vs locked tier states
 * - Visual progress indicators
 * - "Next tier" messaging
 * - Responsive layout
 */

export const BundleDiscountTiers: React.FC<BundleDiscountTiersProps> = ({
  tiers,
  currentQuantity,
  className = '',
}) => {
  // Sort tiers by minQuantity ascending
  const sortedTiers = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity)

  // Find current active tier
  const activeTier = sortedTiers
    .filter((tier) => currentQuantity >= tier.minQuantity)
    .pop()

  // Find next tier
  const nextTier = sortedTiers.find((tier) => currentQuantity < tier.minQuantity)
  const itemsToNextTier = nextTier ? nextTier.minQuantity - currentQuantity : 0

  return (
    <div className={`bundle-discount-tiers ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-[18px] font-bold text-gray-900 mb-1 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
          Volume Korting
        </h3>
        <p className="text-[14px] text-gray-600">
          Hoe meer je koopt, hoe meer je bespaart!
        </p>
      </div>

      {/* Tiers List */}
      <div className="space-y-3">
        {sortedTiers.map((tier, index) => {
          const isUnlocked = currentQuantity >= tier.minQuantity
          const isActive = activeTier?.minQuantity === tier.minQuantity

          return (
            <div
              key={index}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${isActive ? 'border-green-600 bg-green-50' : isUnlocked ? 'border-green-400 bg-green-50/50' : 'border-gray-300 bg-gray-50'}
              `}
            >
              {/* Tier Content */}
              <div className="flex items-center justify-between gap-3">
                {/* Left: Icon + Info */}
                <div className="flex items-center gap-3 flex-1">
                  {/* Status Icon */}
                  <div
                    className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      ${isUnlocked ? 'bg-green-600' : 'bg-gray-400'}
                    `}
                  >
                    {isUnlocked ? (
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    ) : (
                      <Lock className="w-4 h-4 text-white" strokeWidth={2.5} />
                    )}
                  </div>

                  {/* Tier Details */}
                  <div className="flex-1">
                    <p
                      className={`text-[15px] font-bold ${isUnlocked ? 'text-green-900' : 'text-gray-700'}`}
                    >
                      {tier.label || `Koop ${tier.minQuantity}+ items`}
                    </p>
                    <p
                      className={`text-[13px] ${isUnlocked ? 'text-green-700' : 'text-gray-600'}`}
                    >
                      {tier.minQuantity} {tier.minQuantity === 1 ? 'item' : 'items'} of meer
                    </p>
                  </div>
                </div>

                {/* Right: Discount Badge */}
                <div
                  className={`
                    flex-shrink-0 px-3 py-1.5 rounded-md
                    ${isUnlocked ? 'bg-green-600' : 'bg-gray-400'}
                  `}
                >
                  <span className="text-[14px] font-bold text-white">
                    {tier.discountPercentage}% korting
                  </span>
                </div>
              </div>

              {/* Active Indicator */}
              {isActive && (
                <div className="mt-2 pt-2 border-t border-green-300">
                  <p className="text-[12px] font-bold text-green-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    Actieve korting
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Next Tier Message */}
      {nextTier && (
        <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
          <p className="text-[14px] text-purple-900">
            <span className="font-bold">Bijna daar!</span> Voeg nog{' '}
            <span className="font-bold text-purple-600">{itemsToNextTier}</span>{' '}
            {itemsToNextTier === 1 ? 'item' : 'items'} toe om{' '}
            <span className="font-bold text-purple-600">{nextTier.discountPercentage}% korting</span>{' '}
            te ontgrendelen.
          </p>
        </div>
      )}

      {/* Max Tier Reached */}
      {!nextTier && activeTier && (
        <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-[14px] text-green-900 font-bold flex items-center gap-2">
            <Check className="w-4 h-4" strokeWidth={3} />
            Maximale korting bereikt! ({activeTier.discountPercentage}%)
          </p>
        </div>
      )}
    </div>
  )
}
