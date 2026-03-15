'use client'

import React from 'react'
import { Users, Plus, Minus } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import type { ParticipantCategory, ParticipantSelectorProps } from './types'

export const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({
  categories,
  onChange,
  totalCapacity,
  showPrices = true,
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()
  const totalParticipants = categories.reduce((sum, cat) => sum + cat.count, 0)
  const isAtCapacity = totalCapacity !== undefined && totalParticipants >= totalCapacity

  const handleIncrement = (category: ParticipantCategory) => {
    const newCount = category.count + 1
    const maxAllowed = category.maxCount || Infinity
    const canIncrement = newCount <= maxAllowed && !isAtCapacity

    if (canIncrement) {
      onChange(category.id, newCount)
    }
  }

  const handleDecrement = (category: ParticipantCategory) => {
    const newCount = category.count - 1
    const minAllowed = category.minCount || 0

    if (newCount >= minAllowed) {
      onChange(category.id, newCount)
    }
  }

  return (
    <div className={`participant-selector bg-white border border-grey-light rounded-xl p-5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--color-primary)]" />
          <h3 className="text-base font-extrabold text-navy">
            Aantal deelnemers
          </h3>
        </div>
        {totalCapacity && (
          <div className="text-xs font-semibold text-grey-mid">
            {totalParticipants} / {totalCapacity}
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        {categories.map((category) => {
          const canDecrement = category.count > (category.minCount || 0)
          const canIncrement =
            category.count < (category.maxCount || Infinity) &&
            (!totalCapacity || totalParticipants < totalCapacity)

          return (
            <div
              key={category.id}
              className="participant-category flex items-center justify-between p-3 rounded-lg border border-grey-light hover:border-grey-light transition-colors"
            >
              {/* Left: Label & Description */}
              <div className="flex-1">
                <div className="text-sm font-bold text-navy">
                  {category.label}
                </div>
                {category.description && (
                  <div className="text-xs text-grey-mid mt-0.5">
                    {category.description}
                  </div>
                )}
                {showPrices && (
                  <div className="text-xs font-semibold text-[var(--color-primary)] mt-1">
                    €{formatPriceStr(category.price)} per persoon
                  </div>
                )}
              </div>

              {/* Right: Counter */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecrement(category)}
                  disabled={!canDecrement}
                  className="btn btn-outline-neutral btn-sm w-8 h-8 flex items-center justify-center"
                  aria-label={`Decrease ${category.label}`}
                >
                  <Minus className="w-4 h-4 text-grey-dark" />
                </button>

                <div className="w-10 text-center font-mono text-base font-bold text-navy">
                  {category.count}
                </div>

                <button
                  onClick={() => handleIncrement(category)}
                  disabled={!canIncrement}
                  className="btn btn-outline-neutral btn-sm w-8 h-8 flex items-center justify-center"
                  aria-label={`Increase ${category.label}`}
                >
                  <Plus className="w-4 h-4 text-grey-dark" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Capacity warning */}
      {isAtCapacity && (
        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 text-center font-semibold">
          Maximale capaciteit bereikt
        </div>
      )}
    </div>
  )
}

export default ParticipantSelector
