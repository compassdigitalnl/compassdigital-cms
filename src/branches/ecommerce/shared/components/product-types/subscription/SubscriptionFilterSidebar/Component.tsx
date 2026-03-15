'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'
import type { SubscriptionFilterSidebarProps } from './types'
export type { FilterSection, SubscriptionFilterSidebarProps } from './types'

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
      className={`filter-sidebar bg-white border border-grey-light rounded-xl p-5 max-w-[280px] ${className}`}
    >
      {/* Header */}
      <h3 className="text-base font-extrabold mb-4 text-navy flex items-center gap-2">
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
          <div className="filter-section-title text-xs font-bold uppercase tracking-wide text-grey-mid mb-2.5">
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
                className="w-4 h-4 border-[1.5px] border-grey-light rounded cursor-pointer accent-[var(--color-primary)]"
              />
              <span className="text-[13px] text-navy flex-1 flex justify-between items-center">
                {filter.label}
                {filter.count !== undefined && (
                  <span className="text-[11px] text-grey-mid font-semibold">
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
