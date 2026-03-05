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
          className="btn btn-outline-primary btn-sm inline-flex items-center gap-1.5"
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
          className="btn btn-ghost btn-sm inline-flex items-center gap-1.5"
          aria-label="Wis alle filters"
        >
          Alles wissen
        </button>
      )}
    </div>
  )
}
