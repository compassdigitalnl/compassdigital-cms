'use client'

import React from 'react'
import { Grid3x3, List } from 'lucide-react'
import type { ViewToggleProps } from './types'

export const ViewToggle: React.FC<ViewToggleProps> = ({
  view,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const containerSizeClasses = {
    sm: '',
    md: '',
    lg: '',
  }

  const buttonSizeClasses = {
    sm: 'w-9 h-[34px]',
    md: 'w-10 h-[38px]',
    lg: 'w-11 h-[42px]',
  }

  const iconSizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-[18px] h-[18px]',
  }

  const buttons: Array<{ view: 'grid' | 'list'; icon: typeof Grid3x3; label: string }> = [
    { view: 'grid', icon: Grid3x3, label: 'Grid weergave' },
    { view: 'list', icon: List, label: 'Lijst weergave' },
  ]

  return (
    <div
      className={`inline-flex border-[1.5px] border-theme-border rounded-[10px] overflow-hidden ${containerSizeClasses[size]} ${className}`}
      role="group"
      aria-label="Weergave wijzigen"
    >
      {buttons.map((button, index) => {
        const isActive = view === button.view
        const Icon = button.icon

        return (
          <button
            key={button.view}
            type="button"
            onClick={() => onChange(button.view)}
            disabled={disabled}
            className={`
              ${buttonSizeClasses[size]}
              flex items-center justify-center bg-white transition-all duration-150
              ${index > 0 ? 'border-l border-theme-border' : ''}
              ${isActive ? 'bg-theme-teal-glow' : 'hover:bg-theme-bg'}
              ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
              focus:outline-none focus:z-10 focus:ring-2 focus:ring-theme-teal/30
            `}
            aria-label={button.label}
            aria-pressed={isActive}
          >
            <Icon
              className={`${iconSizeClasses[size]} ${isActive ? 'text-theme-teal' : 'text-theme-grey-mid'}`}
            />
          </button>
        )
      })}
    </div>
  )
}
