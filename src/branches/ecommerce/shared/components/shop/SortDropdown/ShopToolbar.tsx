'use client'

import React from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { SortDropdown } from './SortDropdown'
import { ViewToggle } from './ViewToggle'
import type { ShopToolbarProps } from './types'

export const ShopToolbar: React.FC<ShopToolbarProps> = ({
  sortValue,
  sortOptions,
  onSortChange,
  viewMode = 'grid',
  onViewChange,
  resultCount,
  totalCount,
  showViewToggle = true,
  size = 'md',
  className = '',
  activeFilters = [],
  onRemoveFilter,
  onResetFilters,
  onOpenMobileFilters,
}) => {
  return (
    <div
      className={`flex flex-col gap-3 ${className}`}
      role="toolbar"
      aria-label="Shop toolbar"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Result Count */}
        <div className="flex flex-col gap-2">
          {resultCount !== undefined && totalCount !== undefined && (
            <div className="text-[14px] text-theme-grey-mid">
              <strong className="text-theme-navy font-bold">{resultCount}</strong> van {totalCount}{' '}
              producten
            </div>
          )}
        </div>

        {/* Right: Mobile Filter Button + Sort + View Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button (visible only on mobile) */}
          {onOpenMobileFilters && (
            <button
              onClick={onOpenMobileFilters}
              className="btn btn-outline-neutral btn-sm lg:hidden inline-flex items-center gap-2"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilters.length > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-theme-teal text-white text-[10px] font-bold">
                  {activeFilters.length}
                </span>
              )}
            </button>
          )}

          <SortDropdown
            value={sortValue}
            options={sortOptions}
            onChange={onSortChange}
            size={size}
          />

          {showViewToggle && onViewChange && (
            <ViewToggle view={viewMode} onChange={onViewChange} size={size} />
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {activeFilters.map((filter) => (
            <button
              key={filter.groupId}
              onClick={() => onRemoveFilter?.(filter.groupId)}
              className="btn btn-outline-primary btn-sm inline-flex items-center gap-1.5"
            >
              {filter.label}
              <X size={12} />
            </button>
          ))}
          <button
            onClick={onResetFilters}
            className="btn btn-ghost btn-sm"
          >
            Wis alles
          </button>
        </div>
      )}
    </div>
  )
}
