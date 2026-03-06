'use client'

import React from 'react'
import type { PricingToggleProps } from './types'

export const PricingToggle: React.FC<PricingToggleProps> = ({
  isYearly,
  onToggle,
  savingsLabel = 'Bespaar 20%',
  monthlyLabel = 'Maandelijks',
  yearlyLabel = 'Jaarlijks',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span
        className={`text-sm font-semibold transition-colors ${
          !isYearly ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'
        }`}
      >
        {monthlyLabel}
      </span>

      <button
        type="button"
        onClick={() => onToggle(!isYearly)}
        className="relative h-7 w-[52px] flex-shrink-0 cursor-pointer rounded-full border-none bg-[var(--color-primary)] transition-colors"
        aria-label={isYearly ? 'Schakel naar maandelijks' : 'Schakel naar jaarlijks'}
      >
        <div
          className="absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.15)] transition-all duration-200"
          style={{ right: isYearly ? '3px' : 'auto', left: isYearly ? 'auto' : '3px' }}
        />
      </button>

      <span
        className={`text-sm font-semibold transition-colors ${
          isYearly ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'
        }`}
      >
        {yearlyLabel}
      </span>

      {isYearly && savingsLabel && (
        <span className="rounded-full bg-[var(--color-success-light,#E8F5E9)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--color-success,#00C853)]">
          {savingsLabel}
        </span>
      )}
    </div>
  )
}
