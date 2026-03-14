'use client'

import React from 'react'
import type { CategoryFilterProps } from './types'

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onSelect,
  className = '',
}) => {
  if (categories.length <= 1) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          !selected
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-base-100)] text-[var(--color-base-700)] hover:bg-[var(--color-base-200)]'
        }`}
      >
        Alle
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selected === cat
              ? 'bg-[var(--color-primary)] text-white'
              : 'bg-[var(--color-base-100)] text-[var(--color-base-700)] hover:bg-[var(--color-base-200)]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
