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
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 border-[1.5px] border-theme-border bg-white rounded-xl text-[13px] font-semibold text-theme-navy hover:border-theme-teal hover:text-theme-teal transition-all"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors"
              style={{
                background: 'var(--teal-glow, rgba(0, 137, 123, 0.1))',
                color: 'var(--teal, #00897B)',
                border: '1px solid rgba(0, 137, 123, 0.2)',
              }}
            >
              {filter.label}
              <X size={12} />
            </button>
          ))}
          <button
            onClick={onResetFilters}
            className="text-[12px] font-medium px-2 py-1 transition-colors"
            style={{ color: 'var(--grey-mid, #94A3B8)' }}
          >
            Wis alles
          </button>
        </div>
      )}
    </div>
  )
}
