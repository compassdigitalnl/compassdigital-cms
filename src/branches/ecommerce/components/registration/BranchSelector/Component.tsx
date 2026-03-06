'use client'

import React from 'react'
import type { BranchSelectorProps } from './types'

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  options,
  selected,
  onSelect,
  className = '',
}) => {
  return (
    <div className={`mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 ${className}`}>
      {options.map((option) => {
        const isActive = selected === option.id
        const Icon = option.icon

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={`
              flex flex-col items-center gap-1 rounded-[10px] border-2 px-3 py-3
              text-[13px] font-semibold text-theme-navy
              transition-all duration-150 cursor-pointer
              ${isActive
                ? 'border-theme-teal bg-[var(--color-primary-glow)]'
                : 'hover:border-theme-teal hover:bg-[var(--color-primary-glow)]'
              }
            `}
            style={!isActive ? { borderColor: 'var(--color-border)' } : undefined}
          >
            <Icon className="h-6 w-6 text-theme-teal" />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
