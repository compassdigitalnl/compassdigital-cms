'use client'

import React, { useState, useEffect } from 'react'
import { XCircle } from 'lucide-react'
import { FilterCard } from './FilterCard'
import { ActiveFilterChips } from './ActiveFilterChips'
import type { FilterSidebarProps, ActiveFilter } from './types'

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  onResetAll,
  sticky = true,
  stickyTop = 90,
  defaultOpen = [],
  className = '',
}) => {
  const [openSections, setOpenSections] = useState<string[]>([])

  // Initialize open sections from defaultOpen or filter.defaultOpen
  useEffect(() => {
    const initialOpen = filters
      .filter((f) => defaultOpen.includes(f.id) || f.defaultOpen)
      .map((f) => f.id)
    setOpenSections(initialOpen)
  }, [filters, defaultOpen])

  const toggleSection = (filterId: string) => {
    setOpenSections((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId],
    )
  }

  const handleFilterChange = (groupId: string, values: string[]) => {
    // Create new active filter or remove if empty
    const newFilters = activeFilters.filter((f) => f.groupId !== groupId)

    if (values.length > 0) {
      const filterGroup = filters.find((f) => f.id === groupId)
      if (filterGroup) {
        let label = ''

        // Generate label based on filter type
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

  return (
    <div className={className}>
      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <ActiveFilterChips
          filters={activeFilters}
          onRemove={handleRemoveFilter}
          onReset={onResetAll}
          className="mb-6"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`max-h-[calc(100vh-110px)] overflow-y-auto overflow-x-hidden ${
          sticky ? 'sticky' : ''
        } scrollbar-thin scrollbar-thumb-theme-border scrollbar-track-transparent hover:scrollbar-thumb-theme-grey-mid md:block`}
        style={sticky ? { top: `${stickyTop}px` } : undefined}
        role="complementary"
        aria-label="Product filters"
      >
        {/* Filter Cards */}
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

        {/* Reset All Filters */}
        {activeFilters.length > 0 && (
          <button
            type="button"
            onClick={onResetAll}
            className="flex items-center gap-2 justify-center w-full py-3.5 text-[13px] font-semibold text-theme-grey-mid hover:text-theme-coral transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-theme-coral/30 focus:ring-offset-2 rounded-lg"
            aria-label="Wis alle filters"
          >
            <XCircle className="w-3.5 h-3.5" />
            Alle filters wissen
          </button>
        )}
      </aside>
    </div>
  )
}
