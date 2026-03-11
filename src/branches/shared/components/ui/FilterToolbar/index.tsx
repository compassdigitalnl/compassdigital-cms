'use client'

import React from 'react'
import type { FilterToolbarProps } from './types'

/**
 * FilterToolbar - Category filter pills + sort dropdown
 *
 * Used by: construction (projects archive), experiences (archive),
 * blog (archive), any collection with categories.
 */
export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  activeFilter,
  onFilterChange,
  sortOptions,
  activeSort,
  onSortChange,
  allLabel = 'Alles',
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            !activeFilter
              ? 'bg-primary text-white shadow-sm'
              : 'bg-grey-light text-grey-dark hover:bg-grey hover:text-navy'
          }`}
        >
          {allLabel}
        </button>
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeFilter === filter.value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-grey-light text-grey-dark hover:bg-grey hover:text-navy'
            }`}
          >
            {filter.label}
            {filter.count !== undefined && (
              <span className="ml-1.5 text-xs opacity-70">({filter.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      {sortOptions && sortOptions.length > 0 && onSortChange && (
        <select
          value={activeSort || ''}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-grey bg-white px-3 py-2 text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

export default FilterToolbar
