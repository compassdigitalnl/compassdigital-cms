'use client'

import React from 'react'
import { ChevronDown, Star } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { PriceRangeSlider } from './PriceRangeSlider'
import type { FilterCardProps } from './types'

export const FilterCard: React.FC<FilterCardProps> = ({
  filter,
  isOpen,
  isActive,
  onToggle,
  onFilterChange,
  selectedValues,
}) => {
  // Dynamic icon loading (kebab-case → PascalCase)
  const IconComponent = React.useMemo(() => {
    if (!filter.icon) return null
    const iconName = filter.icon
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
    return (LucideIcons as any)[iconName] || null
  }, [filter.icon])

  const handleCheckboxChange = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]
    onFilterChange(filter.id, newValues)
  }

  const handlePriceChange = (value: [number, number]) => {
    // Update local state only (don't trigger filter until "Apply" is clicked)
  }

  const handlePriceApply = () => {
    // Price values are managed in parent component
    onFilterChange(filter.id, selectedValues)
  }

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < count ? 'fill-theme-amber text-theme-amber' : 'text-theme-border'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`bg-white border border-theme-border rounded-xl mb-3 overflow-hidden transition-all duration-200 ${
        isActive ? 'ring-2 ring-theme-teal/20' : ''
      }`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-theme-bg transition-colors duration-200 focus:outline-none focus:bg-theme-bg"
        aria-expanded={isOpen}
        aria-controls={`filter-${filter.id}`}
      >
        <h3 className="flex items-center gap-2 text-[14px] font-bold text-theme-navy">
          {IconComponent && <IconComponent className="w-4 h-4 text-theme-teal" />}
          {filter.label}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-theme-grey-mid transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Body */}
      <div
        id={`filter-${filter.id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px]' : 'max-h-0'
        }`}
      >
        <div className="px-4 pb-4">
          {/* Checkbox Filters */}
          {filter.type === 'checkbox' && filter.options && (
            <div className="space-y-2.5">
              {filter.options.map((option) => {
                const isChecked = selectedValues.includes(option.value)
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2.5 py-2.5 cursor-pointer group hover:text-theme-teal transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(option.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-[18px] h-[18px] border-[1.5px] rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isChecked
                          ? 'bg-theme-teal border-theme-teal'
                          : 'border-theme-border group-hover:border-theme-teal'
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-[13px] text-theme-navy flex-1">{option.label}</span>
                    <span className="text-[12px] text-theme-grey-mid ml-auto">
                      {option.count}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {/* Price Range Slider */}
          {filter.type === 'range' && filter.range && (
            <PriceRangeSlider
              min={filter.range.min}
              max={filter.range.max}
              step={filter.range.step}
              value={
                selectedValues.length === 2
                  ? [parseFloat(selectedValues[0]), parseFloat(selectedValues[1])]
                  : [filter.range.min, filter.range.max]
              }
              onChange={handlePriceChange}
              onApply={handlePriceApply}
              currency="€"
            />
          )}

          {/* Rating Filter */}
          {filter.type === 'rating' && filter.options && (
            <div className="space-y-2.5">
              {filter.options.map((option) => {
                const isChecked = selectedValues.includes(option.value)
                const starCount = parseInt(option.value.replace('+', ''))
                const isMinimum = option.value.includes('+')

                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 py-2.5 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(option.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-[18px] h-[18px] border-[1.5px] rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isChecked
                          ? 'bg-theme-teal border-theme-teal'
                          : 'border-theme-border group-hover:border-theme-teal'
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M10 3L4.5 8.5L2 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(starCount)}
                      {isMinimum && (
                        <span className="text-[12px] text-theme-grey-mid">& hoger</span>
                      )}
                    </div>
                    <span className="text-[12px] text-theme-grey-mid ml-auto">
                      {option.count}
                    </span>
                  </label>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
