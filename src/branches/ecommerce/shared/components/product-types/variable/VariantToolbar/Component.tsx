'use client'

import React from 'react'
import { Grid, List, CheckSquare, Square } from 'lucide-react'
import type { VariantToolbarProps } from './types'

/**
 * VP11: VariantToolbar
 *
 * Toolbar with view toggle (grid/list) + bulk actions
 * Features:
 * - View toggle (grid/list) with icons
 * - Bulk select/deselect actions
 * - Variant count display
 * - Selected count display
 * - Responsive layout
 */
export const VariantToolbar: React.FC<VariantToolbarProps> = ({
  viewMode,
  onViewModeChange,
  totalVariants,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  className = '',
}) => {
  const hasSelection = selectedCount > 0
  const isAllSelected = selectedCount === totalVariants && totalVariants > 0

  return (
    <div
      className={`
        variant-toolbar
        flex items-center justify-between gap-4 px-0 py-3 border-b-2 border-grey-light
        ${className}
      `}
    >
      {/* Left: Variant Count */}
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-bold text-navy">
          {totalVariants}
        </span>
        <span className="text-[15px] text-grey-dark">
          {totalVariants === 1 ? 'variant beschikbaar' : 'varianten beschikbaar'}
        </span>

        {/* Selected Count (if any) */}
        {hasSelection && (
          <span className="ml-2 px-2 py-0.5 bg-[var(--color-primary-glow)] text-[var(--color-primary)] rounded-full text-xs font-bold">
            {selectedCount} geselecteerd
          </span>
        )}
      </div>

      {/* Right: View Toggle + Bulk Actions */}
      <div className="flex items-center gap-3">
        {/* View Toggle */}
        <div className="flex items-center bg-grey-light rounded-lg p-0.5">
          {/* Grid View Button */}
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`
              btn btn-sm flex items-center gap-1.5
              ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}
            `}
            aria-label="Grid weergave"
            aria-pressed={viewMode === 'grid'}
          >
            <Grid className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Grid</span>
          </button>

          {/* List View Button */}
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`
              btn btn-sm flex items-center gap-1.5
              ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}
            `}
            aria-label="Lijst weergave"
            aria-pressed={viewMode === 'list'}
          >
            <List className="w-4 h-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Lijst</span>
          </button>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          {/* Select All (only show if not all selected) */}
          {!isAllSelected && (
            <button
              type="button"
              onClick={onSelectAll}
              className="btn btn-outline-neutral btn-sm flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Selecteer alle</span>
            </button>
          )}

          {/* Deselect All (only show if has selection) */}
          {hasSelection && (
            <button
              type="button"
              onClick={onDeselectAll}
              className="btn btn-outline-neutral btn-sm flex items-center gap-1.5"
            >
              <Square className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Deselecteer alle</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
