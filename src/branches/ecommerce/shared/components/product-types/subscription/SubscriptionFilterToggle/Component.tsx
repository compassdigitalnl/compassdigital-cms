'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'

export interface ToggleOption {
  id: string
  label: string
  icon?: keyof typeof LucideIcons
}

export interface SubscriptionFilterToggleProps {
  leftOption: ToggleOption
  rightOption: ToggleOption
  activeId: string
  onChange: (optionId: string) => void
  className?: string
}

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
      className={`toggle-filter flex justify-center items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl ${className}`}
    >
      {/* Left Option Label */}
      <div
        className={`toggle-label text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer select-none ${
          !isRightActive ? 'text-gray-900' : 'text-gray-500'
        }`}
        onClick={() => onChange(leftOption.id)}
      >
        {LeftIcon && <LeftIcon className="w-4 h-4" />}
        {leftOption.label}
      </div>

      {/* Toggle Switch */}
      <div
        className={`toggle-switch relative w-14 h-7 rounded-full cursor-pointer transition-colors ${
          isRightActive ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
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
          isRightActive ? 'text-gray-900' : 'text-gray-500'
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
