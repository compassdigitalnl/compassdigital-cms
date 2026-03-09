'use client'

import React from 'react'
import { Timer, Check } from 'lucide-react'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

export interface DurationOption {
  id: string
  duration: number // in minutes
  label: string
  description?: string
  price: number
  popular?: boolean
}

export interface DurationSelectorProps {
  options: DurationOption[]
  selectedOptionId?: string
  onOptionSelect: (optionId: string) => void
  layout?: 'grid' | 'list'
  className?: string
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  options,
  selectedOptionId,
  onOptionSelect,
  layout = 'grid',
  className = '',
}) => {
  const { formatPriceStr } = usePriceMode()

  const layoutClasses = {
    grid: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3',
    list: 'flex flex-col gap-2',
  }

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) return `${hours} ${hours === 1 ? 'uur' : 'uur'}`
    return `${hours}u ${remainingMinutes}m`
  }

  return (
    <div className={`duration-selector ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-5 h-5 text-[var(--color-primary)]" />
        <h3 className="text-base font-extrabold text-gray-900">
          Selecteer duur
        </h3>
      </div>

      {/* Options */}
      <div className={layoutClasses[layout]}>
        {options.map((option) => {
          const isSelected = option.id === selectedOptionId

          return (
            <button
              key={option.id}
              onClick={() => onOptionSelect(option.id)}
              className={`
                duration-option relative p-4 rounded-xl border-[1.5px] transition-all text-left
                ${isSelected ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white shadow-md' : 'bg-white border-gray-200 hover:border-[var(--color-primary)] hover:shadow-sm'}
              `}
            >
              {/* Popular badge */}
              {option.popular && !isSelected && (
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-extrabold rounded-full uppercase">
                  Populair
                </div>
              )}

              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
              )}

              {/* Duration */}
              <div className={`text-xl font-extrabold mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {formatDuration(option.duration)}
              </div>

              {/* Label */}
              <div className={`text-sm font-semibold mb-2 ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                {option.label}
              </div>

              {/* Description */}
              {option.description && (
                <div className={`text-xs mb-3 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  {option.description}
                </div>
              )}

              {/* Price */}
              <div className={`text-lg font-bold font-mono ${isSelected ? 'text-white' : 'text-[var(--color-primary)]'}`}>
                €{formatPriceStr(option.price)}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DurationSelector
