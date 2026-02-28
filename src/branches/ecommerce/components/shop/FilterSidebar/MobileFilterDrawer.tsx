'use client'

import React, { useEffect } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { FilterCard } from './FilterCard'
import { ActiveFilterChips } from './ActiveFilterChips'
import type { FilterGroup, ActiveFilter } from './types'

interface MobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterGroup[]
  activeFilters: ActiveFilter[]
  onFilterChange: (filters: ActiveFilter[]) => void
  onResetAll: () => void
  defaultOpen?: string[]
  resultCount: number
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  activeFilters,
  onFilterChange,
  onResetAll,
  defaultOpen = [],
  resultCount,
}) => {
  const [openSections, setOpenSections] = React.useState<string[]>([])
  const [initialized, setInitialized] = React.useState(false)

  // Initialize open sections from defaultOpen or filter.defaultOpen
  useEffect(() => {
    if (!initialized) {
      const initialOpen = filters
        .filter((f) => defaultOpen.includes(f.id) || f.defaultOpen)
        .map((f) => f.id)
      setOpenSections(initialOpen)
      setInitialized(true)
    }
  }, [filters, defaultOpen, initialized])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const toggleSection = (filterId: string) => {
    setOpenSections((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId],
    )
  }

  const handleFilterChange = (groupId: string, values: string[]) => {
    const newFilters = activeFilters.filter((f) => f.groupId !== groupId)

    if (values.length > 0) {
      const filterGroup = filters.find((f) => f.id === groupId)
      if (filterGroup) {
        let label = ''

        if (filterGroup.type === 'range') {
          label = `€${values[0]} - €${values[1]}`
        } else if (values.length === 1) {
          const option = filterGroup.options?.find((o) => o.value === values[0])
          label = option?.label || values[0]
        } else {
          const labels = values
            .map((v) => filterGroup.options?.find((o) => o.value === v)?.label || v)
            .join(', ')
          label = `${filterGroup.label}: ${labels}`
        }

        newFilters.push({
          groupId,
          label,
          values,
        })
      }
    }

    onFilterChange(newFilters)
  }

  const handleRemoveFilter = (groupId: string) => {
    const newFilters = activeFilters.filter((f) => f.groupId !== groupId)
    onFilterChange(newFilters)
  }

  const getSelectedValues = (filterId: string): string[] => {
    const active = activeFilters.find((f) => f.groupId === filterId)
    return active?.values || []
  }

  const isFilterActive = (filterId: string): boolean => {
    return activeFilters.some((f) => f.groupId === filterId)
  }

  const handleApplyFilters = () => {
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[299] transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-[300] flex flex-col transition-transform duration-300 ease-out lg:hidden shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Filters</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Sluit filters"
          >
            <X className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
        </div>

        {/* Active Filter Chips */}
        {activeFilters.length > 0 && (
          <div className="px-5 pt-4">
            <ActiveFilterChips
              filters={activeFilters}
              onRemove={handleRemoveFilter}
              onReset={onResetAll}
            />
          </div>
        )}

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {filters.map((filter) => (
            <FilterCard
              key={filter.id}
              filter={filter}
              isOpen={openSections.includes(filter.id)}
              isActive={isFilterActive(filter.id)}
              onToggle={() => toggleSection(filter.id)}
              onFilterChange={handleFilterChange}
              selectedValues={getSelectedValues(filter.id)}
            />
          ))}
        </div>

        {/* Footer with Apply Button */}
        <div className="flex-shrink-0 p-5 border-t border-[var(--color-border)] bg-white">
          <button
            onClick={handleApplyFilters}
            className="w-full py-3.5 px-4 bg-[var(--color-primary)] text-white rounded-xl text-[15px] font-semibold hover:bg-opacity-90 transition-all shadow-sm"
          >
            Toon {resultCount} {resultCount === 1 ? 'product' : 'producten'}
          </button>
        </div>
      </div>
    </>
  )
}
