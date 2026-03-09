'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'

export interface FilterSection {
  title: string
  filters: Array<{
    id: string
    label: string
    count?: number
    checked: boolean
  }>
}

export interface SubscriptionFilterSidebarProps {
  title?: string
  titleIcon?: keyof typeof LucideIcons
  sections: FilterSection[]
  onChange: (sectionIndex: number, filterId: string, checked: boolean) => void
  className?: string
}

export const SubscriptionFilterSidebar: React.FC<SubscriptionFilterSidebarProps> = ({
  title = 'Filters',
  titleIcon = 'SlidersHorizontal',
  sections,
  onChange,
  className = '',
}) => {
  const TitleIcon = titleIcon ? LucideIcons[titleIcon] as React.ComponentType<{ className?: string }> : null

  return (
    <div
      className={`filter-sidebar bg-white border border-gray-200 rounded-xl p-5 max-w-[280px] ${className}`}
    >
      {/* Header */}
      <h3 className="text-base font-extrabold mb-4 text-gray-900 flex items-center gap-2">
        {TitleIcon && <TitleIcon className="w-4 h-4 text-[var(--color-primary)]" />}
        {title}
      </h3>

      {/* Filter Sections */}
      {sections.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className={`filter-section ${sectionIndex < sections.length - 1 ? 'mb-5' : ''}`}
        >
          {/* Section Title */}
          <div className="filter-section-title text-xs font-bold uppercase tracking-wide text-gray-500 mb-2.5">
            {section.title}
          </div>

          {/* Checkboxes */}
          {section.filters.map((filter) => (
            <label
              key={filter.id}
              className="filter-checkbox flex items-center gap-2 py-1.5 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filter.checked}
                onChange={(e) => onChange(sectionIndex, filter.id, e.target.checked)}
                className="w-4 h-4 border-[1.5px] border-gray-200 rounded cursor-pointer accent-[var(--color-primary)]"
              />
              <span className="text-[13px] text-gray-900 flex-1 flex justify-between items-center">
                {filter.label}
                {filter.count !== undefined && (
                  <span className="text-[11px] text-gray-500 font-semibold">
                    {filter.count}
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      ))}
    </div>
  )
}

export default SubscriptionFilterSidebar
