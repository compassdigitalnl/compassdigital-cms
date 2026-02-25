'use client'

import React from 'react'
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
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-4 flex-wrap ${className}`}
      role="toolbar"
      aria-label="Shop toolbar"
    >
      {/* Left: Result Count */}
      <div className="flex flex-col gap-2">
        {resultCount !== undefined && totalCount !== undefined && (
          <div className="text-[14px] text-theme-grey-mid">
            <strong className="text-theme-navy font-bold">{resultCount}</strong> van {totalCount}{' '}
            producten
          </div>
        )}
      </div>

      {/* Right: Sort + View Toggle */}
      <div className="flex items-center gap-3">
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
  )
}
