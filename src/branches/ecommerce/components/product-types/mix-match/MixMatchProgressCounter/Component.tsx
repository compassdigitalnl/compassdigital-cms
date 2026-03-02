'use client'

import React from 'react'

export interface MixMatchProgressCounterProps {
  // Progress state
  currentCount: number
  maxCount: number

  // Labels
  label?: string
  completedLabel?: string

  // Display options
  variant?: 'default' | 'compact'
  showLabel?: boolean

  // Styling
  className?: string

  // Callbacks
  onChange?: (current: number, max: number) => void
}

export const MixMatchProgressCounter: React.FC<MixMatchProgressCounterProps> = ({
  currentCount,
  maxCount,
  label = 'items geselecteerd',
  completedLabel = 'Compleet!',
  variant = 'default',
  showLabel = true,
  className = '',
  onChange,
}) => {
  const percentage = Math.min((currentCount / maxCount) * 100, 100)
  const isComplete = currentCount >= maxCount

  React.useEffect(() => {
    onChange?.(currentCount, maxCount)
  }, [currentCount, maxCount, onChange])

  return (
    <div
      className={`box-progress bg-white border-[1.5px] border-gray-200 rounded-[14px] ${
        variant === 'compact' ? 'p-3' : 'p-3.5 px-4'
      } flex items-center gap-3.5 max-w-full sm:flex-row flex-col sm:items-center items-stretch ${className}`}
    >
      {/* Progress bar */}
      <div className="bp-bar flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden sm:order-1 order-1">
        <div
          className={`bp-fill h-full rounded-full transition-all duration-300 ease-out ${
            isComplete ? 'bg-green-500' : 'bg-teal-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Counter */}
      <div
        className={`bp-count font-heading text-lg font-extrabold whitespace-nowrap sm:order-2 order-2 ${
          isComplete ? 'complete' : ''
        } sm:text-left text-center`}
      >
        <em
          className={`not-italic ${isComplete ? 'text-green-500' : 'text-teal-600'}`}
        >
          {currentCount}
        </em>
        <span className="text-gray-900"> / {maxCount}</span>
      </div>

      {/* Label */}
      {showLabel && (
        <div className="bp-label text-[11px] text-gray-500 font-semibold whitespace-nowrap sm:order-3 order-3 sm:text-left text-center">
          {isComplete ? completedLabel : label}
        </div>
      )}
    </div>
  )
}

export default MixMatchProgressCounter
