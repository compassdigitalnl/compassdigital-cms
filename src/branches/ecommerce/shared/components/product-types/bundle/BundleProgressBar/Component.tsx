'use client'

import React from 'react'
import { Check } from 'lucide-react'
import type { BundleProgressBarProps } from './types'

/**
 * BB06: BundleProgressBar
 *
 * Visual progress indicator for bundle goals and milestones
 * Features:
 * - Animated progress bar
 * - Current vs goal display
 * - Percentage calculation
 * - Optional label
 * - Optional value display (e.g., "5 / 10")
 * - Color-coded (green when complete, purple otherwise)
 * - Completion checkmark
 * - Smooth animations
 */

export const BundleProgressBar: React.FC<BundleProgressBarProps> = ({
  current,
  min,
  max,
  label,
  showValue = true,
  className = '',
}) => {
  // Calculate percentage (clamped between 0 and 100)
  const range = max - min
  const progress = current - min
  const percentage = range > 0 ? Math.min(Math.max((progress / range) * 100, 0), 100) : 0
  const isComplete = current >= max

  return (
    <div className={`bundle-progress-bar ${className}`}>
      {/* Header (Label + Value) */}
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {/* Label */}
          {label && (
            <span className="text-[14px] font-semibold text-gray-700">
              {label}
            </span>
          )}

          {/* Value Display */}
          {showValue && (
            <span
              className={`text-[14px] font-bold ${isComplete ? 'text-green' : 'text-teal'}`}
            >
              {current} / {max}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
        {/* Progress Bar Fill */}
        <div
          className={`
            absolute top-0 left-0 h-full
            transition-all duration-500 ease-out
            ${isComplete ? 'bg-gradient-to-r from-green to-green' : 'bg-gradient-to-r from-teal to-teal'}
          `}
          style={{ width: `${percentage}%` }}
        />

        {/* Progress Text (Inside Bar) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isComplete ? (
            <div className="flex items-center gap-1 text-white font-bold text-[13px]">
              <Check className="w-4 h-4" strokeWidth={3} />
              <span>Compleet!</span>
            </div>
          ) : (
            <span className="text-white font-bold text-[13px] drop-shadow-md">
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      {/* Status Message */}
      {isComplete ? (
        <div className="mt-2 text-center">
          <p className="text-[13px] text-green-700 font-semibold">
            ✓ Doel bereikt!
          </p>
        </div>
      ) : (
        <div className="mt-2 text-center">
          <p className="text-[13px] text-gray-600">
            Nog <span className="font-bold text-teal">{max - current}</span>{' '}
            {max - current === 1 ? 'item' : 'items'} nodig
          </p>
        </div>
      )}
    </div>
  )
}
