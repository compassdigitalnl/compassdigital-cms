'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { PaginationButtonProps } from './types'

export function PaginationButton({
  page,
  isActive = false,
  isDisabled = false,
  onClick,
  href,
  children,
  'aria-label': ariaLabel,
  'aria-current': ariaCurrent,
}: PaginationButtonProps) {
  const baseClasses = cn(
    'flex items-center justify-center',
    'w-[42px] h-[42px]',
    'rounded-[10px]',
    'border-[1.5px]',
    'text-[14px] font-semibold',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[var(--teal)] focus:ring-offset-2',
    {
      // Active state
      'bg-[var(--teal)] border-[var(--teal)] text-[var(--white)]': isActive,
      // Default state
      'bg-white border-[var(--grey)] text-[var(--text)]': !isActive && !isDisabled,
      // Hover state (only if not active or disabled)
      'hover:border-[var(--teal)] hover:bg-[var(--bg)] hover:text-[var(--teal)]':
        !isActive && !isDisabled,
      // Disabled state
      'opacity-30 cursor-not-allowed pointer-events-none text-[var(--grey-mid)]': isDisabled,
    },
  )

  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled) {
      e.preventDefault()
      return
    }
    onClick()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isDisabled) {
        onClick()
      }
    }
  }

  // If href is provided, render as link (for SEO)
  if (href && !isDisabled) {
    return (
      <a
        href={href}
        className={baseClasses}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
      >
        {children}
      </a>
    )
  }

  // Otherwise render as button
  return (
    <button
      type="button"
      className={baseClasses}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
    >
      {children}
    </button>
  )
}
