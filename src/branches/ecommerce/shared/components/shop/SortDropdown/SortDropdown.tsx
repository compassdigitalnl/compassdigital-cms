'use client'

import React from 'react'
import type { SortDropdownProps } from './types'

export const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  options,
  onChange,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'py-2 px-3 pr-8 text-[12px] min-w-[140px] bg-[length:12px_8px] bg-[right_10px_center]',
    md: 'py-2.5 px-3.5 pr-9 text-[13px] min-w-[180px] bg-[length:12px_8px] bg-[right_12px_center]',
    lg: 'py-3 px-4 pr-10 text-[14px] min-w-[200px] bg-[length:12px_8px] bg-[right_14px_center]',
  }

  const chevronSvg = encodeURIComponent(`
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1.5L6 6.5L11 1.5" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `)

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        bg-white border-[1.5px] border-theme-border rounded-[10px] font-semibold text-theme-navy cursor-pointer appearance-none bg-no-repeat transition-all duration-200
        hover:border-theme-teal
        focus:outline-none focus:border-theme-teal focus:ring-[3px] focus:ring-theme-teal/20
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
        ${className}
      `}
      style={{
        backgroundImage: `url("data:image/svg+xml,${chevronSvg}")`,
      }}
      aria-label="Sorteer producten"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
