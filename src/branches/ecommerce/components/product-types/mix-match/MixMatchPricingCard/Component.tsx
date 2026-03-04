'use client'

import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/branches/shared/components/ui/button'
import { MixMatchSelectionSummary, type SelectedItem } from '../MixMatchSelectionSummary'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'

export interface MixMatchPricingCardProps {
  // Box configuration
  title?: string
  totalSlots: number
  filledSlots: number

  // Selected items
  selectedItems: SelectedItem[]

  // Pricing
  boxPrice: number
  individualTotal?: number
  savings?: number

  // Callbacks
  onRemoveItem?: (itemId: string) => void
  onAddToCart?: () => void

  // State
  isAddingToCart?: boolean

  // Styling
  className?: string
}

export const MixMatchPricingCard: React.FC<MixMatchPricingCardProps> = ({
  title = 'Je Lunchbox',
  totalSlots,
  filledSlots,
  selectedItems,
  boxPrice,
  individualTotal,
  savings,
  onRemoveItem,
  onAddToCart,
  isAddingToCart = false,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()
  const isComplete = filledSlots >= totalSlots
  const canAddToCart = isComplete && selectedItems.length > 0

  return (
    <div
      className={`box-card bg-white border-[1.5px] border-gray-200 rounded-[20px] overflow-hidden shadow-[0_8px_24px_rgba(10,22,40,0.08)] max-w-[360px] ${className}`}
    >
      {/* Visual Header with Slots */}
      <div className="box-visual bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-center relative overflow-hidden">
        {/* Decorative glow */}
        <div
          className="absolute -top-8 -right-8 w-30 h-30 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0, 137, 123, 0.12), transparent 70%)',
          }}
        />

        {/* Title */}
        <div className="bv-title font-heading text-lg font-extrabold text-white mb-1 relative z-10">
          {title}
        </div>

        {/* Slot Grid */}
        <div className="bv-slots grid grid-cols-6 gap-1 mt-2.5 relative z-10">
          {Array.from({ length: totalSlots }).map((_, index) => {
            const isFilled = index < filledSlots
            const item = selectedItems[index]

            return (
              <div
                key={index}
                className={`bv-slot aspect-square rounded-lg border-[1.5px] flex items-center justify-center text-base transition-all ${
                  isFilled
                    ? 'bg-teal-600/15 border-solid border-teal-600/30'
                    : 'bg-white/5 border-dashed border-white/10 animate-pulse-subtle'
                }`}
              >
                {item?.emoji}
              </div>
            )
          })}
        </div>
      </div>

      {/* Body */}
      <div className="box-body p-4">
        {/* Items List */}
        <MixMatchSelectionSummary
          items={selectedItems}
          onRemove={onRemoveItem}
          maxHeight="260px"
          className="mb-3"
        />

        {/* Pricing Breakdown */}
        <div className="box-pricing border-t border-gray-100 pt-3 space-y-2">
          {/* Individual total (if shown) */}
          {individualTotal !== undefined && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>Losse prijs</span>
              <span className="font-mono line-through">€{formatPriceStr(individualTotal)}</span>
            </div>
          )}

          {/* Savings (if any) */}
          {savings !== undefined && savings > 0 && (
            <div className="flex justify-between text-xs text-green-600 font-bold">
              <span>Besparing</span>
              <span className="font-mono">-€{formatPriceStr(savings)}</span>
            </div>
          )}

          {/* Box price */}
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold">Boxprijs</span>
            <span className="text-2xl font-extrabold font-heading">
              €{formatPriceStr(boxPrice)}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={onAddToCart}
          disabled={!canAddToCart || isAddingToCart}
          className="w-full mt-4 h-12 text-base font-extrabold bg-teal-600 hover:bg-gray-900 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
        >
          {isAddingToCart ? (
            'Toevoegen...'
          ) : !isComplete ? (
            `Selecteer nog ${totalSlots - filledSlots} item${totalSlots - filledSlots !== 1 ? 's' : ''}`
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Toevoegen aan winkelwagen
            </>
          )}
        </Button>

        {/* Helper text */}
        {!isComplete && (
          <p className="text-center text-xs text-gray-400 mt-2">
            Kies {totalSlots - filledSlots} van de {totalSlots} items om verder te gaan
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse-subtle {
          0%,
          100% {
            border-color: rgba(255, 255, 255, 0.08);
          }
          50% {
            border-color: rgba(0, 137, 123, 0.3);
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default MixMatchPricingCard
