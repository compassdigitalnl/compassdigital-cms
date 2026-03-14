'use client'

import React, { useState, useCallback } from 'react'
import type { TourFiltersProps, TourFilterState } from './types'

const CONTINENTS = [
  { label: 'Europa', value: 'europa' },
  { label: 'Azië', value: 'azie' },
  { label: 'Afrika', value: 'afrika' },
  { label: 'Amerika', value: 'amerika' },
  { label: 'Oceanië', value: 'oceanie' },
]

const CATEGORIES = [
  { label: 'Bestseller', value: 'bestseller' },
  { label: 'Nieuw', value: 'nieuw' },
  { label: 'Avontuur', value: 'avontuur' },
  { label: 'Luxe', value: 'luxe' },
  { label: 'Familie', value: 'familie' },
  { label: 'Stedentrip', value: 'stedentrip' },
  { label: 'Strand', value: 'strand' },
  { label: 'Cultuur', value: 'cultuur' },
]

export const TourFilters: React.FC<TourFiltersProps> = ({
  selectedContinents = [],
  selectedCategories = [],
  priceMin,
  priceMax,
  durationMin,
  durationMax,
  onFilterChange,
  className = '',
}) => {
  const [filters, setFilters] = useState<TourFilterState>({
    continents: selectedContinents,
    categories: selectedCategories,
    priceMin,
    priceMax,
    durationMin,
    durationMax,
  })

  const updateFilters = useCallback(
    (update: Partial<TourFilterState>) => {
      const newFilters = { ...filters, ...update }
      setFilters(newFilters)
      onFilterChange?.(newFilters)
    },
    [filters, onFilterChange],
  )

  const toggleArrayItem = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item]

  const resetFilters = () => {
    const empty: TourFilterState = {
      continents: [],
      categories: [],
      priceMin: undefined,
      priceMax: undefined,
      durationMin: undefined,
      durationMax: undefined,
    }
    setFilters(empty)
    onFilterChange?.(empty)
  }

  const hasActiveFilters =
    filters.continents.length > 0 ||
    filters.categories.length > 0 ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.durationMin !== undefined ||
    filters.durationMax !== undefined

  return (
    <aside className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[var(--color-base-1000)]">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs font-medium text-[var(--color-primary)] hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Continent */}
      <div className="mb-5">
        <h4 className="mb-2 text-sm font-semibold text-[var(--color-base-800)]">Continent</h4>
        <div className="space-y-1.5">
          {CONTINENTS.map((c) => (
            <label key={c.value} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-base-700)]">
              <input
                type="checkbox"
                checked={filters.continents.includes(c.value)}
                onChange={() => updateFilters({ continents: toggleArrayItem(filters.continents, c.value) })}
                className="h-4 w-4 rounded border-[var(--color-base-300)] text-[var(--color-primary)]"
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-5">
        <h4 className="mb-2 text-sm font-semibold text-[var(--color-base-800)]">Prijs (p.p.)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin ?? ''}
            onChange={(e) => updateFilters({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2 text-sm"
          />
          <span className="text-[var(--color-base-400)]">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax ?? ''}
            onChange={(e) => updateFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Duration range */}
      <div className="mb-5">
        <h4 className="mb-2 text-sm font-semibold text-[var(--color-base-800)]">Reisduur (dagen)</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.durationMin ?? ''}
            onChange={(e) => updateFilters({ durationMin: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2 text-sm"
          />
          <span className="text-[var(--color-base-400)]">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.durationMax ?? ''}
            onChange={(e) => updateFilters({ durationMax: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Category */}
      <div className="mb-2">
        <h4 className="mb-2 text-sm font-semibold text-[var(--color-base-800)]">Categorie</h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((c) => (
            <label key={c.value} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-base-700)]">
              <input
                type="checkbox"
                checked={filters.categories.includes(c.value)}
                onChange={() => updateFilters({ categories: toggleArrayItem(filters.categories, c.value) })}
                className="h-4 w-4 rounded border-[var(--color-base-300)] text-[var(--color-primary)]"
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
