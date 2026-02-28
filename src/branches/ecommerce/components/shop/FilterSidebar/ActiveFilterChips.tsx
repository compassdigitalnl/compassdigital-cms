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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-primary)]/10 border border-[var(--color-primary)] rounded-lg text-[12px] font-semibold text-[var(--color-primary)] hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:ring-offset-1"
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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-[var(--color-text-muted)] hover:text-red-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:ring-offset-1 rounded-lg"
          aria-label="Wis alle filters"
        >
          Alles wissen
        </button>
      )}
    </div>
  )
}
