'use client'

import React, { useState, useCallback } from 'react'
import type { AccommodationFiltersProps, AccommodationFilterState } from './types'

const TYPES = [
  { label: 'Hotel', value: 'hotel' },
  { label: 'Resort', value: 'resort' },
  { label: 'Villa', value: 'villa' },
  { label: 'Appartement', value: 'appartement' },
  { label: 'Hostel', value: 'hostel' },
  { label: 'B&B', value: 'b-and-b' },
  { label: 'Glamping', value: 'glamping' },
]

const FACILITIES = [
  { label: 'Zwembad', value: 'zwembad' },
  { label: 'Spa', value: 'spa' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'Bar', value: 'bar' },
  { label: 'Fitness', value: 'fitness' },
  { label: 'WiFi', value: 'wifi' },
  { label: 'Parkeren', value: 'parkeren' },
  { label: 'Airco', value: 'airco' },
  { label: 'Kindvriendelijk', value: 'kindvriendelijk' },
  { label: 'Huisdieren', value: 'huisdieren' },
]

const MEAL_PLANS = [
  { label: 'Logies', value: 'logies' },
  { label: 'Logies & Ontbijt', value: 'ontbijt' },
  { label: 'Halfpension', value: 'halfpension' },
  { label: 'Volpension', value: 'volpension' },
  { label: 'All-inclusive', value: 'allinclusive' },
]

export const AccommodationFilters: React.FC<AccommodationFiltersProps> = ({
  selectedTypes = [],
  selectedFacilities = [],
  selectedMealPlans = [],
  starsMin,
  starsMax,
  priceMin,
  priceMax,
  onFilterChange,
  className = '',
}) => {
  const [filters, setFilters] = useState<AccommodationFilterState>({
    types: selectedTypes,
    facilities: selectedFacilities,
    mealPlans: selectedMealPlans,
    starsMin,
    starsMax,
    priceMin,
    priceMax,
  })

  const updateFilters = useCallback(
    (update: Partial<AccommodationFilterState>) => {
      const newFilters = { ...filters, ...update }
      setFilters(newFilters)
      onFilterChange?.(newFilters)
    },
    [filters, onFilterChange],
  )

  const toggleArrayItem = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item]

  const resetFilters = () => {
    const empty: AccommodationFilterState = {
      types: [],
      facilities: [],
      mealPlans: [],
      starsMin: undefined,
      starsMax: undefined,
      priceMin: undefined,
      priceMax: undefined,
    }
    setFilters(empty)
    onFilterChange?.(empty)
  }

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.facilities.length > 0 ||
    filters.mealPlans.length > 0 ||
    filters.starsMin !== undefined ||
    filters.starsMax !== undefined ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined

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

      {/* Type */}
      <div className="mb-5">
        <h4 className="mb-2 text-sm font-semibold text-[var(--color-base-800)]">Type</h4>
        <div className="space-y-1.5">
          {TYPES.map((t) => (
            <label key={t.value} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-base-700)]">
              <input
                type="checkbox"
                checked={filters.types.includes(t.value)}
                onChange={() => updateFilters({ types: toggleArrayItem(filters.types, t.value) })}
                className="h-4 w-4 rounded border-[var(--color-base-300)] text-[var(--color-primary)]"
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      {/* Stars */}
      <div className="mb-5">
        <h4 className="mb-2 text-sm font-semibold text-[var(--color-base-800)]">Sterren</h4>
        <div className="flex items-center gap-2">
          <select
            value={filters.starsMin ?? ''}
            onChange={(e) => updateFilters({ starsMin: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2 text-sm"
          >
            <option value="">Min</option>
            {[1, 2, 3, 4, 5].map((s) => (
              <option key={s} value={s}>{s} {'★'.repeat(s)}</option>
            ))}
          </select>
          <span className="text-[var(--color-base-400)]">—</span>
          <select
            value={filters.starsMax ?? ''}
            onChange={(e) => updateFilters({ starsMax: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2 text-sm"
          >
            <option value="">Max</option>
            {[1, 2, 3, 4, 5].map((s) => (
              <option key={s} value={s}>{s} {'★'.repeat(s)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Facilities */}
      <div className="mb-5">
        <h4 className="mb-2 text-sm font-semibold text-[var(--color-base-800)]">Faciliteiten</h4>
        <div className="space-y-1.5">
          {FACILITIES.map((f) => (
            <label key={f.value} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-base-700)]">
              <input
                type="checkbox"
                checked={filters.facilities.includes(f.value)}
                onChange={() => updateFilters({ facilities: toggleArrayItem(filters.facilities, f.value) })}
                className="h-4 w-4 rounded border-[var(--color-base-300)] text-[var(--color-primary)]"
              />
              {f.label}
            </label>
          ))}
        </div>
      </div>

      {/* Meal plan */}
      <div className="mb-5">
        <h4 className="mb-2 text-sm font-semibold text-[var(--color-base-800)]">Maaltijdplan</h4>
        <div className="space-y-1.5">
          {MEAL_PLANS.map((m) => (
            <label key={m.value} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-base-700)]">
              <input
                type="checkbox"
                checked={filters.mealPlans.includes(m.value)}
                onChange={() => updateFilters({ mealPlans: toggleArrayItem(filters.mealPlans, m.value) })}
                className="h-4 w-4 rounded border-[var(--color-base-300)] text-[var(--color-primary)]"
              />
              {m.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-2">
        <h4 className="mb-2 text-sm font-semibold text-[var(--color-base-800)]">Prijs (p.p.p.n.)</h4>
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
    </aside>
  )
}
