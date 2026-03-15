'use client'

import React, { useState, useCallback } from 'react'
import type { CourseFiltersProps, CourseFilterState } from './types'

const LEVEL_OPTIONS = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Gevorderd', value: 'gevorderd' },
  { label: 'Expert', value: 'expert' },
]

const RATING_OPTIONS = [
  { label: 'Alle beoordelingen', value: 'alle' },
  { label: '4+ sterren', value: '4' },
  { label: '3+ sterren', value: '3' },
]

const DURATION_OPTIONS = [
  { label: 'Minder dan 5 uur', value: '<5' },
  { label: '5 - 10 uur', value: '5-10' },
  { label: '10 - 20 uur', value: '10-20' },
  { label: '20+ uur', value: '20+' },
]

const emptyFilters: CourseFilterState = {
  category: '',
  priceType: 'alle',
  priceMin: undefined,
  priceMax: undefined,
  levels: [],
  minRating: 'alle',
  durations: [],
}

export const CourseFilters: React.FC<CourseFiltersProps> = ({
  categories,
  onFilterChange,
  initialFilters,
  className = '',
}) => {
  const [filters, setFilters] = useState<CourseFilterState>({
    ...emptyFilters,
    ...initialFilters,
  })

  const updateFilters = useCallback(
    (update: Partial<CourseFilterState>) => {
      const newFilters = { ...filters, ...update }
      setFilters(newFilters)
      onFilterChange?.(newFilters)
    },
    [filters, onFilterChange],
  )

  const toggleLevel = (level: string) => {
    const current = filters.levels
    const next = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level]
    updateFilters({ levels: next })
  }

  const toggleDuration = (duration: string) => {
    const current = filters.durations
    const next = current.includes(duration)
      ? current.filter((d) => d !== duration)
      : [...current, duration]
    updateFilters({ durations: next })
  }

  const resetFilters = () => {
    setFilters(emptyFilters)
    onFilterChange?.(emptyFilters)
  }

  const hasActiveFilters =
    filters.category !== '' ||
    filters.priceType !== 'alle' ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.levels.length > 0 ||
    filters.minRating !== 'alle' ||
    filters.durations.length > 0

  return (
    <aside className={`space-y-4 ${className}`}>
      {/* Categorie */}
      <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <svg
            className="h-[18px] w-[18px] text-[var(--color-primary)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
          <h3 className="text-sm font-bold text-[var(--color-base-1000)]">Categorie</h3>
        </div>
        <select
          value={filters.category}
          onChange={(e) => updateFilters({ category: e.target.value })}
          className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-3 py-2.5 text-[13px] text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
        >
          <option value="">Alle categorieën</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Prijsklasse */}
      <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <svg
            className="h-[18px] w-[18px] text-[var(--color-primary)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" x2="12" y1="1" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <h3 className="text-sm font-bold text-[var(--color-base-1000)]">Prijsklasse</h3>
        </div>
        <div className="space-y-2">
          {(['alle', 'gratis', 'betaald'] as const).map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-base-700)]"
            >
              <input
                type="radio"
                name="priceType"
                checked={filters.priceType === type}
                onChange={() => updateFilters({ priceType: type })}
                className="h-4 w-4 text-[var(--color-primary)]"
              />
              {type === 'alle' ? 'Alle prijzen' : type === 'gratis' ? 'Gratis' : 'Betaald'}
            </label>
          ))}
        </div>
        {filters.priceType === 'betaald' && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min €"
              value={filters.priceMin ?? ''}
              onChange={(e) =>
                updateFilters({
                  priceMin: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2 font-mono text-xs focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
            <input
              type="number"
              placeholder="Max €"
              value={filters.priceMax ?? ''}
              onChange={(e) =>
                updateFilters({
                  priceMax: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full rounded-lg border border-[var(--color-base-200)] px-3 py-2 font-mono text-xs focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/10"
            />
          </div>
        )}
      </div>

      {/* Niveau */}
      <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <svg
            className="h-[18px] w-[18px] text-[var(--color-primary)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" x2="18" y1="20" y2="10" />
            <line x1="12" x2="12" y1="20" y2="4" />
            <line x1="6" x2="6" y1="20" y2="16" />
          </svg>
          <h3 className="text-sm font-bold text-[var(--color-base-1000)]">Niveau</h3>
        </div>
        <div className="space-y-2">
          {LEVEL_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-base-700)]"
            >
              <input
                type="checkbox"
                checked={filters.levels.includes(opt.value)}
                onChange={() => toggleLevel(opt.value)}
                className="h-4 w-4 rounded border-[var(--color-base-300)] text-[var(--color-primary)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Beoordeling */}
      <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <svg
            className="h-[18px] w-[18px] text-[var(--color-primary)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <h3 className="text-sm font-bold text-[var(--color-base-1000)]">Beoordeling</h3>
        </div>
        <div className="space-y-2">
          {RATING_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-base-700)]"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === opt.value}
                onChange={() => updateFilters({ minRating: opt.value })}
                className="h-4 w-4 text-[var(--color-primary)]"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Duur */}
      <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <svg
            className="h-[18px] w-[18px] text-[var(--color-primary)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h3 className="text-sm font-bold text-[var(--color-base-1000)]">Duur</h3>
        </div>
        <div className="space-y-2">
          {DURATION_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-base-700)]"
            >
              <input
                type="checkbox"
                checked={filters.durations.includes(opt.value)}
                onChange={() => toggleDuration(opt.value)}
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
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-50)] px-4 py-2.5 text-[13px] font-semibold text-[var(--color-base-500)] transition-colors hover:border-coral/30 hover:text-coral"
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
