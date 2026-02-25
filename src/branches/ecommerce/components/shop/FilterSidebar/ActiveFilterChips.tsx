'use client'

import React from 'react'
import { X } from 'lucide-react'
import type { ActiveFilterChipsProps } from './types'

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  filters,
  onRemove,
  onReset,
  className = '',
}) => {
  if (filters.length === 0) return null

  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter.groupId}
          type="button"
          onClick={() => onRemove(filter.groupId)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-theme-teal-glow border border-theme-teal rounded-lg text-[12px] font-semibold text-theme-teal hover:bg-theme-coral-light hover:border-theme-coral hover:text-theme-coral transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-theme-teal/30 focus:ring-offset-1"
          aria-label={`Verwijder filter: ${filter.label}`}
        >
          <span>{filter.label}</span>
          <X className="w-3 h-3" />
        </button>
      ))}

      {filters.length > 1 && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-theme-grey-mid hover:text-theme-coral transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-theme-coral/30 focus:ring-offset-1 rounded-lg"
          aria-label="Wis alle filters"
        >
          Alles wissen
        </button>
      )}
    </div>
  )
}
