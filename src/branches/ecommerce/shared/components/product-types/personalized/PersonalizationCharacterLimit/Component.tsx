'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import type { PersonalizationCharacterLimitProps } from './types'

/**
 * PP07: PersonalizationCharacterLimit
 *
 * Visual character counter with warning at 90% and block at 100%
 * Features:
 * - Progress bar showing character usage
 * - Color-coded status (green, yellow, red)
 * - Warning message at 90%
 * - Block indicator at 100%
 * - Character count display
 * - Percentage display
 */

export const PersonalizationCharacterLimit: React.FC<PersonalizationCharacterLimitProps> = ({
  currentLength,
  maxLength,
  warningThreshold = 90,
  className = '',
}) => {
  // Calculate percentage
  const percentage = (currentLength / maxLength) * 100

  // Determine status
  const isWarning = percentage >= warningThreshold && percentage < 100
  const isAtLimit = percentage >= 100
  const isNormal = percentage < warningThreshold

  // Determine colors
  const statusColors = {
    normal: {
      bg: 'bg-green',
      text: 'text-green',
      border: 'border-green',
    },
    warning: {
      bg: 'bg-amber-500',
      text: 'text-amber-600',
      border: 'border-amber-500',
    },
    limit: {
      bg: 'bg-coral',
      text: 'text-coral',
      border: 'border-coral',
    },
  }

  const currentStatus = isAtLimit ? statusColors.limit : isWarning ? statusColors.warning : statusColors.normal

  return (
    <div className={`personalization-character-limit ${className}`}>
      {/* Counter Display */}
      <div className="flex items-center justify-between mb-1">
        <span className={`text-[13px] font-semibold ${currentStatus.text}`}>
          {currentLength} / {maxLength} karakters
        </span>
        <span className={`text-[12px] font-mono font-bold ${currentStatus.text}`}>
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-grey-light rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${currentStatus.bg}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Warning Message (at 90%) */}
      {isWarning && (
        <div className="flex items-start gap-2 mt-2 p-2 bg-amber-50 border-l-4 border-amber-500 rounded">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className="text-[12px] text-amber-900">
            Je nadert de limiet. Nog {maxLength - currentLength} karakters beschikbaar.
          </p>
        </div>
      )}

      {/* Limit Reached Message (at 100%) */}
      {isAtLimit && (
        <div className="flex items-start gap-2 mt-2 p-2 bg-coral-50 border-l-4 border-coral rounded">
          <AlertTriangle className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <p className="text-[12px] text-red-800 font-semibold">
            Maximale limiet bereikt! Je kunt geen extra karakters meer toevoegen.
          </p>
        </div>
      )}
    </div>
  )
}
