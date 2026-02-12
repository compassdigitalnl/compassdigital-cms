import React, { useState } from 'react'
import type { ProductCategory } from '@payload-shop/types'

export interface FilterOption {
  label: string
  value: string
  count?: number
}

export interface ProductFiltersProps {
  categories?: ProductCategory[]
  brands?: FilterOption[]
  priceRange?: { min: number; max: number }
  attributes?: Array<{
    name: string
    label: string
    options: FilterOption[]
  }>
  selectedFilters?: Record<string, string[]>
  onFilterChange?: (filters: Record<string, string[]>) => void
  onPriceChange?: (min: number, max: number) => void
  onClearFilters?: () => void
}

/**
 * ProductFilters Component
 * Sidebar filter panel for product filtering
 */
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories = [],
  brands = [],
  priceRange,
  attributes = [],
  selectedFilters = {},
  onFilterChange,
  onPriceChange,
  onClearFilters,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    brands: true,
    price: true,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleFilterToggle = (filterType: string, value: string) => {
    const current = selectedFilters[filterType] || []
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]

    onFilterChange?.({
      ...selectedFilters,
      [filterType]: updated,
    })
  }

  const hasActiveFilters = Object.values(selectedFilters).some((values) => values.length > 0)

  return (
    <div className="product-filters bg-white border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Wis alles
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('categories')}
              className="flex items-center justify-between w-full font-medium mb-2"
            >
              <span>Categorieën</span>
              <svg
                className={`w-4 h-4 transition-transform ${openSections.categories ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openSections.categories && (
              <div className="space-y-2 pl-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.categories?.includes(category.id) || false}
                      onChange={() => handleFilterToggle('categories', category.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Brands */}
        {brands.length > 0 && (
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('brands')}
              className="flex items-center justify-between w-full font-medium mb-2"
            >
              <span>Merken</span>
              <svg
                className={`w-4 h-4 transition-transform ${openSections.brands ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openSections.brands && (
              <div className="space-y-2 pl-2">
                {brands.map((brand) => (
                  <label key={brand.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.brands?.includes(brand.value) || false}
                      onChange={() => handleFilterToggle('brands', brand.value)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      {brand.label}
                      {brand.count && (
                        <span className="text-gray-500 ml-1">({brand.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price Range */}
        {priceRange && (
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full font-medium mb-2"
            >
              <span>Prijs</span>
              <svg
                className={`w-4 h-4 transition-transform ${openSections.price ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openSections.price && (
              <div className="space-y-3 pl-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min={priceRange.min}
                    max={priceRange.max}
                    className="w-full px-3 py-2 border rounded text-sm"
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (!isNaN(value)) {
                        onPriceChange?.(value, priceRange.max)
                      }
                    }}
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    min={priceRange.min}
                    max={priceRange.max}
                    className="w-full px-3 py-2 border rounded text-sm"
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (!isNaN(value)) {
                        onPriceChange?.(priceRange.min, value)
                      }
                    }}
                  />
                </div>

                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  className="w-full"
                  onChange={(e) => {
                    const value = parseInt(e.target.value)
                    onPriceChange?.(priceRange.min, value)
                  }}
                />

                <div className="flex justify-between text-xs text-gray-600">
                  <span>€{priceRange.min}</span>
                  <span>€{priceRange.max}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Attributes */}
        {attributes.map((attribute) => (
          <div key={attribute.name} className="border-b pb-4">
            <button
              onClick={() => toggleSection(attribute.name)}
              className="flex items-center justify-between w-full font-medium mb-2"
            >
              <span>{attribute.label}</span>
              <svg
                className={`w-4 h-4 transition-transform ${openSections[attribute.name] ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {openSections[attribute.name] && (
              <div className="space-y-2 pl-2">
                {attribute.options.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={
                        selectedFilters[attribute.name]?.includes(option.value) || false
                      }
                      onChange={() => handleFilterToggle(attribute.name, option.value)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      {option.label}
                      {option.count && (
                        <span className="text-gray-500 ml-1">({option.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium mb-2">Actieve filters:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([filterType, values]) =>
              values.map((value) => (
                <button
                  key={`${filterType}-${value}`}
                  onClick={() => handleFilterToggle(filterType, value)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs hover:bg-blue-200 transition-colors"
                >
                  <span>{value}</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )),
            )}
          </div>
        </div>
      )}
    </div>
  )
}
