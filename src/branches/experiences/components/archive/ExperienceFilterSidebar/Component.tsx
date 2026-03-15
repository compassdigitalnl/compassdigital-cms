'use client'

import React from 'react'
import type { ExperienceFilterSidebarProps, ExperienceFilters, FilterOption } from './types'

const RATING_OPTIONS = [
  { label: 'Alle beoordelingen', value: '0' },
  { label: '4+ sterren', value: '4' },
  { label: '3+ sterren', value: '3' },
  { label: '2+ sterren', value: '2' },
]

export const ExperienceFilterSidebar: React.FC<ExperienceFilterSidebarProps> = ({
  categories,
  locations,
  durations,
  groupSizes,
  filters,
  onFilterChange,
  resultCount,
  className = '',
}) => {
  const updateFilter = <K extends keyof ExperienceFilters>(
    key: K,
    value: ExperienceFilters[K],
  ) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const priceMin = filters.priceRange?.[0] ?? 0
  const priceMax = filters.priceRange?.[1] ?? 500

  return (
    <aside
      className={`sticky top-20 rounded-xl border p-5 ${className}`}
      style={{
        backgroundColor: 'var(--color-grey-light, #f9fafb)',
        borderColor: 'var(--color-border, #e5e7eb)',
      }}
    >
      {/* Title */}
      <h3
        className="mb-4 text-base font-bold"
        style={{ color: 'var(--color-navy, #1a2b4a)' }}
      >
        Filters
      </h3>

      {/* Result count */}
      {resultCount !== undefined && (
        <p className="mb-4 text-xs text-grey-mid">
          {resultCount} {resultCount === 1 ? 'resultaat' : 'resultaten'} gevonden
        </p>
      )}

      <div className="space-y-5">
        {/* Categorie */}
        <FilterGroup label="Categorie">
          <select
            value={filters.category || ''}
            onChange={(e) =>
              updateFilter('category', e.target.value || undefined)
            }
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-border, #e5e7eb)',
              '--tw-ring-color': 'var(--color-teal, #00a39b)',
            } as React.CSSProperties}
          >
            <option value="">Alle categorieën</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
                {cat.count !== undefined ? ` (${cat.count})` : ''}
              </option>
            ))}
          </select>
        </FilterGroup>

        {/* Prijs range */}
        <FilterGroup label="Prijs range">
          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={500}
              value={priceMax}
              onChange={(e) =>
                updateFilter('priceRange', [priceMin, Number(e.target.value)])
              }
              className="w-full"
              style={{ accentColor: 'var(--color-teal, #00a39b)' }}
            />
            <div className="flex items-center justify-between text-xs text-grey-mid">
              <span>&euro;{priceMin}</span>
              <span
                className="font-semibold"
                style={{ color: 'var(--color-teal, #00a39b)' }}
              >
                &euro;{priceMax}
              </span>
            </div>
          </div>
        </FilterGroup>

        {/* Groepsgrootte */}
        <FilterGroup label="Groepsgrootte">
          <select
            value={filters.groupSize || ''}
            onChange={(e) =>
              updateFilter('groupSize', e.target.value || undefined)
            }
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-border, #e5e7eb)',
              '--tw-ring-color': 'var(--color-teal, #00a39b)',
            } as React.CSSProperties}
          >
            <option value="">Alle grootten</option>
            {groupSizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
                {size.count !== undefined ? ` (${size.count})` : ''}
              </option>
            ))}
          </select>
        </FilterGroup>

        {/* Duur - checkboxes grid */}
        <FilterGroup label="Duur">
          <div className="grid grid-cols-2 gap-2">
            {durations.map((dur) => {
              const isActive = filters.duration === dur.value

              return (
                <button
                  key={dur.value}
                  type="button"
                  onClick={() =>
                    updateFilter(
                      'duration',
                      isActive ? undefined : dur.value,
                    )
                  }
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                    isActive ? 'text-white' : 'text-grey-dark hover:bg-white'
                  }`}
                  style={{
                    borderColor: isActive
                      ? 'var(--color-teal, #00a39b)'
                      : 'var(--color-border, #e5e7eb)',
                    backgroundColor: isActive
                      ? 'var(--color-teal, #00a39b)'
                      : 'transparent',
                  }}
                >
                  {dur.label}
                </button>
              )
            })}
          </div>
        </FilterGroup>

        {/* Locatie */}
        <FilterGroup label="Locatie">
          <select
            value={filters.location || ''}
            onChange={(e) =>
              updateFilter('location', e.target.value || undefined)
            }
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-border, #e5e7eb)',
              '--tw-ring-color': 'var(--color-teal, #00a39b)',
            } as React.CSSProperties}
          >
            <option value="">Alle locaties</option>
            {locations.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
                {loc.count !== undefined ? ` (${loc.count})` : ''}
              </option>
            ))}
          </select>
        </FilterGroup>

        {/* Minimale beoordeling */}
        <FilterGroup label="Minimale beoordeling">
          <select
            value={filters.rating?.toString() || '0'}
            onChange={(e) => {
              const val = Number(e.target.value)
              updateFilter('rating', val > 0 ? val : undefined)
            }}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-border, #e5e7eb)',
              '--tw-ring-color': 'var(--color-teal, #00a39b)',
            } as React.CSSProperties}
          >
            {RATING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </FilterGroup>
      </div>
    </aside>
  )
}

/** Filter group wrapper with label */
const FilterGroup: React.FC<{
  label: string
  children: React.ReactNode
}> = ({ label, children }) => (
  <div>
    <label
      className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-grey-mid"
    >
      {label}
    </label>
    {children}
  </div>
)
