'use client'

import React, { useState, useCallback } from 'react'
import type { PropertyFiltersProps, PropertyFilterState } from './types'

const PROPERTY_TYPES = [
  { label: 'Alle types', value: '' },
  { label: 'Appartement', value: 'appartement' },
  { label: 'Woonhuis', value: 'woonhuis' },
  { label: 'Villa', value: 'villa' },
  { label: 'Penthouse', value: 'penthouse' },
]

const BEDROOM_OPTIONS = [
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
]

const ENERGY_OPTIONS = [
  { label: 'A t/m A+++', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C t/m G', value: 'C' },
]

const emptyFilters: PropertyFilterState = {
  location: '',
  priceMin: undefined,
  priceMax: undefined,
  propertyType: '',
  minBedrooms: undefined,
  areaMin: undefined,
  areaMax: undefined,
  energyLabels: [],
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  initialFilters,
  onFilterChange,
  className = '',
}) => {
  const [filters, setFilters] = useState<PropertyFilterState>({
    ...emptyFilters,
    ...initialFilters,
  })

  const updateFilters = useCallback(
    (update: Partial<PropertyFilterState>) => {
      const newFilters = { ...filters, ...update }
      setFilters(newFilters)
      onFilterChange?.(newFilters)
    },
    [filters, onFilterChange],
  )

  const toggleEnergyLabel = (label: string) => {
    const current = filters.energyLabels
    const next = current.includes(label)
      ? current.filter((l) => l !== label)
      : [...current, label]
    updateFilters({ energyLabels: next })
  }

  const resetFilters = () => {
    setFilters(emptyFilters)
    onFilterChange?.(emptyFilters)
  }

  const hasActiveFilters =
    filters.location !== '' ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.propertyType !== '' ||
    filters.minBedrooms !== undefined ||
    filters.areaMin !== undefined ||
    filters.areaMax !== undefined ||
    filters.energyLabels.length > 0

  return (
    <aside
      className={`rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-6 ${className}`}
    >
      <div className="mb-5 flex items-center gap-2">
        <svg
          className="h-[18px] w-[18px] text-[var(--color-base-800)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <h3 className="text-base font-bold text-[var(--color-base-1000)]">Filters</h3>
      </div>

      {/* Locatie */}
      <div className="mb-6 border-b border-[var(--color-base-100)] pb-6">
        <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
          Locatie
        </label>
        <input
          type="text"
          placeholder="Bijv. Centrum, Oud-Zuid..."
          value={filters.location}
          onChange={(e) => updateFilters({ location: e.target.value })}
          className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-3 py-2.5 text-[13px] text-[var(--color-base-1000)] placeholder:text-[var(--color-base-400)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
        />
      </div>

      {/* Prijsklasse */}
      <div className="mb-6 border-b border-[var(--color-base-100)] pb-6">
        <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
          Prijsklasse
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin ?? ''}
            onChange={(e) =>
              updateFilters({ priceMin: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2.5 font-mono text-xs focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax ?? ''}
            onChange={(e) =>
              updateFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2.5 font-mono text-xs focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
          />
        </div>
      </div>

      {/* Woningtype */}
      <div className="mb-6 border-b border-[var(--color-base-100)] pb-6">
        <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
          Woningtype
        </label>
        <select
          value={filters.propertyType}
          onChange={(e) => updateFilters({ propertyType: e.target.value })}
          className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-3 py-2.5 text-[13px] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Slaapkamers */}
      <div className="mb-6 border-b border-[var(--color-base-100)] pb-6">
        <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
          Aantal slaapkamers
        </label>
        <div className="space-y-2">
          {BEDROOM_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-base-700)]"
            >
              <input
                type="checkbox"
                checked={filters.minBedrooms === opt.value}
                onChange={() =>
                  updateFilters({
                    minBedrooms: filters.minBedrooms === opt.value ? undefined : opt.value,
                  })
                }
                className="h-4 w-4 rounded border-[var(--color-base-300)] text-[var(--color-primary)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Oppervlakte */}
      <div className="mb-6 border-b border-[var(--color-base-100)] pb-6">
        <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
          Oppervlakte (m²)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.areaMin ?? ''}
            onChange={(e) =>
              updateFilters({ areaMin: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2.5 font-mono text-xs focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.areaMax ?? ''}
            onChange={(e) =>
              updateFilters({ areaMax: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2.5 font-mono text-xs focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
          />
        </div>
      </div>

      {/* Energielabel */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-semibold text-[var(--color-base-500)]">
          Energielabel
        </label>
        <div className="space-y-2">
          {ENERGY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-base-700)]"
            >
              <input
                type="checkbox"
                checked={filters.energyLabels.includes(opt.value)}
                onChange={() => toggleEnergyLabel(opt.value)}
                className="h-4 w-4 rounded border-[var(--color-base-300)] text-[var(--color-primary)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-50)] px-4 py-2.5 text-[13px] font-semibold text-[var(--color-base-500)] transition-colors hover:bg-[var(--color-base-100)]"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
          Filters resetten
        </button>
      )}
    </aside>
  )
}
