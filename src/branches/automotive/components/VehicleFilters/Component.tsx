'use client'

import React, { useState, useCallback } from 'react'
import type { VehicleFiltersProps, VehicleFilterState } from './types'

const FUEL_OPTIONS = [
  { value: 'benzine', label: 'Benzine' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'elektrisch', label: 'Elektrisch' },
  { value: 'hybride', label: 'Hybride' },
  { value: 'lpg', label: 'LPG' },
]

const TRANSMISSION_OPTIONS = [
  { value: '', label: 'Alle' },
  { value: 'automaat', label: 'Automaat' },
  { value: 'handgeschakeld', label: 'Handgeschakeld' },
]

const BODY_TYPE_OPTIONS = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'stationwagen', label: 'Stationwagen' },
  { value: 'suv', label: 'SUV' },
  { value: 'cabrio', label: 'Cabrio' },
  { value: 'coupe', label: 'Coup\u00e9' },
  { value: 'mpv', label: 'MPV' },
  { value: 'bestelwagen', label: 'Bestelwagen' },
]

const COLOR_OPTIONS = [
  { value: '', label: 'Alle kleuren' },
  { value: 'zwart', label: 'Zwart' },
  { value: 'wit', label: 'Wit' },
  { value: 'grijs', label: 'Grijs' },
  { value: 'zilver', label: 'Zilver' },
  { value: 'blauw', label: 'Blauw' },
  { value: 'rood', label: 'Rood' },
  { value: 'groen', label: 'Groen' },
  { value: 'bruin', label: 'Bruin' },
  { value: 'geel', label: 'Geel' },
  { value: 'oranje', label: 'Oranje' },
]

const DEFAULT_FILTERS: VehicleFilterState = {
  brand: '',
  model: '',
  priceMin: 0,
  priceMax: 10000000,
  yearMin: 2000,
  yearMax: new Date().getFullYear(),
  mileageMax: 300000,
  fuelType: [],
  transmission: '',
  bodyType: [],
  color: '',
}

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  brands = [],
  onChange,
  initialFilters,
  className = '',
}) => {
  const [filters, setFilters] = useState<VehicleFilterState>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  })
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = useCallback(
    <K extends keyof VehicleFilterState>(key: K, value: VehicleFilterState[K]) => {
      setFilters((prev) => {
        const next = { ...prev, [key]: value }
        onChange(next)
        return next
      })
    },
    [onChange],
  )

  const toggleArrayFilter = useCallback(
    (key: 'fuelType' | 'bodyType', value: string) => {
      setFilters((prev) => {
        const arr = prev[key]
        const next = {
          ...prev,
          [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
        }
        onChange(next)
        return next
      })
    },
    [onChange],
  )

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS })
    onChange({ ...DEFAULT_FILTERS })
  }, [onChange])

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cents / 100)

  const currentYear = new Date().getFullYear()

  const filterContent = (
    <div className="space-y-6">
      {/* Brand */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Merk</label>
        <select
          value={filters.brand}
          onChange={(e) => updateFilter('brand', e.target.value)}
          className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-2.5 text-sm text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        >
          <option value="">Alle merken</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.title}
            </option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Model</label>
        <input
          type="text"
          value={filters.model}
          onChange={(e) => updateFilter('model', e.target.value)}
          placeholder="Bijv. Golf, 3-serie..."
          className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-2.5 text-sm text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>

      {/* Price range */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">
          Prijsrange: {formatPrice(filters.priceMin)} - {formatPrice(filters.priceMax)}
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={10000000}
            step={50000}
            value={filters.priceMin}
            onChange={(e) => updateFilter('priceMin', Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
          <input
            type="range"
            min={0}
            max={10000000}
            step={50000}
            value={filters.priceMax}
            onChange={(e) => updateFilter('priceMax', Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Year range */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">
          Bouwjaar: {filters.yearMin} - {filters.yearMax}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1990}
            max={currentYear}
            value={filters.yearMin}
            onChange={(e) => updateFilter('yearMin', Number(e.target.value))}
            className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-3 py-2 text-sm text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          <span className="text-[var(--color-base-500)]">-</span>
          <input
            type="number"
            min={1990}
            max={currentYear}
            value={filters.yearMax}
            onChange={(e) => updateFilter('yearMax', Number(e.target.value))}
            className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-3 py-2 text-sm text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Mileage max */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">
          Max. kilometerstand: {new Intl.NumberFormat('nl-NL').format(filters.mileageMax)} km
        </label>
        <input
          type="range"
          min={0}
          max={300000}
          step={5000}
          value={filters.mileageMax}
          onChange={(e) => updateFilter('mileageMax', Number(e.target.value))}
          className="w-full accent-[var(--color-primary)]"
        />
      </div>

      {/* Fuel type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Brandstof</label>
        <div className="flex flex-wrap gap-2">
          {FUEL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleArrayFilter('fuelType', opt.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.fuelType.includes(opt.value)
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-base-200)] text-[var(--color-base-700)] hover:border-[var(--color-base-400)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Transmissie</label>
        <select
          value={filters.transmission}
          onChange={(e) => updateFilter('transmission', e.target.value)}
          className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-2.5 text-sm text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        >
          {TRANSMISSION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Body type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Carrosserie</label>
        <div className="flex flex-wrap gap-2">
          {BODY_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleArrayFilter('bodyType', opt.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.bodyType.includes(opt.value)
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                  : 'border-[var(--color-base-200)] text-[var(--color-base-700)] hover:border-[var(--color-base-400)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-base-700)]">Kleur</label>
        <select
          value={filters.color}
          onChange={(e) => updateFilter('color', e.target.value)}
          className="w-full rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-2.5 text-sm text-[var(--color-base-1000)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        >
          {COLOR_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={resetFilters}
        className="w-full rounded-lg border border-[var(--color-base-300)] bg-[var(--color-base-0)] px-4 py-2.5 text-sm font-medium text-[var(--color-base-700)] transition-colors hover:bg-[var(--color-base-100)]"
      >
        Filters resetten
      </button>
    </div>
  )

  return (
    <div className={className}>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-[var(--color-base-200)] bg-[var(--color-base-0)] px-4 py-3 text-sm font-medium text-[var(--color-base-700)] lg:hidden"
      >
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          Filters
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Mobile collapsible */}
      <div className={`mt-3 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-5">
          {filterContent}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <div className="rounded-xl border border-[var(--color-base-200)] bg-[var(--color-base-0)] p-5">
          <h3 className="mb-5 text-lg font-bold text-[var(--color-base-1000)]">Filters</h3>
          {filterContent}
        </div>
      </div>
    </div>
  )
}

export default VehicleFilters
