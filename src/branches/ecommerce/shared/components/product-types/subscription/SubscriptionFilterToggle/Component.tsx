'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'
import type { SubscriptionFilterToggleProps } from './types'
export type { ToggleOption, SubscriptionFilterToggleProps } from './types'

export const SubscriptionFilterToggle: React.FC<SubscriptionFilterToggleProps> = ({
  leftOption,
  rightOption,
  activeId,
  onChange,
  className = '',
}) => {
  const isRightActive = activeId === rightOption.id
  const LeftIcon = leftOption.icon
    ? (LucideIcons[leftOption.icon] as React.ComponentType<{ className?: string }>)
    : null
  const RightIcon = rightOption.icon
    ? (LucideIcons[rightOption.icon] as React.ComponentType<{ className?: string }>)
    : null

  return (
    <div
      className={`toggle-filter flex justify-center items-center gap-4 p-4 bg-white border border-grey-light rounded-xl ${className}`}
    >
      {/* Left Option Label */}
      <div
        className={`toggle-label text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer select-none ${
          !isRightActive ? 'text-navy' : 'text-grey-mid'
        }`}
        onClick={() => onChange(leftOption.id)}
      >
        {LeftIcon && <LeftIcon className="w-4 h-4" />}
        {leftOption.label}
      </div>

      {/* Toggle Switch */}
      <div
        className={`toggle-switch relative w-14 h-7 rounded-full cursor-pointer transition-colors ${
          isRightActive ? 'bg-[var(--color-primary)]' : 'bg-grey-light'
        }`}
        onClick={() => onChange(isRightActive ? leftOption.id : rightOption.id)}
        tabIndex={0}
        role="switch"
        aria-checked={isRightActive}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onChange(isRightActive ? leftOption.id : rightOption.id)
          }
        }}
      >
        <div
          className={`toggle-dot absolute top-[3px] left-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-sm transition-transform ${
            isRightActive ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </div>

      {/* Right Option Label */}
      <div
        className={`toggle-label text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer select-none ${
          isRightActive ? 'text-navy' : 'text-grey-mid'
        }`}
        onClick={() => onChange(rightOption.id)}
      >
        {RightIcon && <RightIcon className="w-4 h-4" />}
        {rightOption.label}
      </div>
    </div>
  )
}

export default SubscriptionFilterToggle
