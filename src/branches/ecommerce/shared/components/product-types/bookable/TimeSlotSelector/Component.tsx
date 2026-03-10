'use client'

import React from 'react'
import { Clock } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import type { TimeSlotSelectorProps } from './types'

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  slots,
  selectedSlotId,
  onSlotSelect,
  showPrices = false,
  showDuration = false,
  layout = 'grid',
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  const layoutClasses = {
    grid: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2',
    list: 'flex flex-col gap-2',
  }

  return (
    <div className={`time-slot-selector ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-base font-extrabold text-gray-900">
          Selecteer tijdstip
        </h3>
      </div>

      {/* Slots */}
      <div className={layoutClasses[layout]}>
        {slots.map((slot) => {
          const isSelected = slot.id === selectedSlotId
          const isDisabled = !slot.available
          const isAlmostFull = slot.spotsLeft !== undefined && slot.spotsLeft <= 3 && slot.spotsLeft > 0

          return (
            <button
              key={slot.id}
              onClick={() => !isDisabled && onSlotSelect(slot.id)}
              disabled={isDisabled}
              className={`
                time-slot relative p-3 rounded-lg border-[1.5px] transition-all text-left
                ${layout === 'list' ? 'flex items-center justify-between' : 'flex flex-col'}
                ${isDisabled ? 'opacity-40 cursor-not-allowed border-gray-200 bg-gray-50' : 'cursor-pointer'}
                ${isSelected && !isDisabled ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : ''}
                ${!isSelected && !isDisabled ? 'bg-white border-gray-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-glow)]' : ''}
              `}
            >
              {/* Almost full indicator */}
              {isAlmostFull && !isSelected && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
              )}

              <div className={layout === 'list' ? 'flex items-center gap-3 flex-1' : ''}>
                {/* Time */}
                <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {slot.time}
                </div>

                {/* Duration */}
                {showDuration && slot.duration && (
                  <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    {slot.duration} min
                  </div>
                )}
              </div>

              {/* Price or spots left */}
              <div className={`flex items-center gap-2 ${layout === 'list' ? '' : 'mt-1'}`}>
                {showPrices && slot.price && (
                  <div className={`text-xs font-semibold font-mono ${isSelected ? 'text-white' : 'text-[var(--color-primary)]'}`}>
                    €{formatPriceStr(slot.price)}
                  </div>
                )}
                {slot.spotsLeft !== undefined && slot.spotsLeft <= 5 && slot.spotsLeft > 0 && !isDisabled && (
                  <div className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-amber-600'}`}>
                    {slot.spotsLeft} {slot.spotsLeft === 1 ? 'plek' : 'plekken'}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* No slots available message */}
      {slots.length === 0 && (
        <div className="text-center py-8 text-sm text-gray-400">
          Geen tijdslots beschikbaar voor deze datum
        </div>
      )}
    </div>
  )
}

export default TimeSlotSelector
