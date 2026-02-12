'use client'

import React, { useState } from 'react'
import { Icon } from '@/components/Icon'
import type { ProductFiltersBlock as ProductFiltersType } from '@/payload-types'

export const ProductFiltersComponent: React.FC<ProductFiltersType> = ({
  position = 'left',
  style = 'sidebar',
  showSearch = true,
  enabledFilters,
  priceRangeConfig = { min: 0, max: 500, step: 10 },
  showActiveFilters = true,
  clearAllText = 'Wis alle filters',
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([priceRangeConfig.min, priceRangeConfig.max])
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [onlyFeatured, setOnlyFeatured] = useState(false)

  // Mock data - TODO: fetch from API
  const mockCategories = [
    { id: '1', name: 'Diagnostiek', count: 320 },
    { id: '2', name: 'EHBO', count: 280 },
    { id: '3', name: 'Injectiemateriaal', count: 450 },
  ]
  const mockBrands = [
    { id: '1', name: 'Littmann', count: 45 },
    { id: '2', name: 'Hartmann', count: 120 },
    { id: '3', name: 'BD', count: 89 },
  ]
  const mockBadges = [
    { value: 'new', label: 'Nieuw', count: 23 },
    { value: 'sale', label: 'Sale', count: 45 },
    { value: 'popular', label: 'Populair', count: 67 },
  ]

  const handleClearAll = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedBadges([])
    setPriceRange([priceRangeConfig.min, priceRangeConfig.max])
    setOnlyInStock(false)
    setOnlyFeatured(false)
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedBrands.length +
    selectedBadges.length +
    (onlyInStock ? 1 : 0) +
    (onlyFeatured ? 1 : 0) +
    (priceRange[0] !== priceRangeConfig.min || priceRange[1] !== priceRangeConfig.max ? 1 : 0)

  return (
    <aside className={`product-filters ${style === 'sidebar' ? 'sticky top-4' : ''}`}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Icon name="SlidersHorizontal" size={20} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="bg-teal-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm text-gray-600 hover:text-teal-600 transition-colors"
              >
                {clearAllText}
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Search */}
          {showSearch && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zoeken</label>
              <div className="relative">
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek producten..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
          )}

          {/* Active Filters Tags */}
          {showActiveFilters && activeFiltersCount > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Actief</label>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm"
                  >
                    {mockCategories.find((c) => c.id === cat)?.name}
                    <button
                      onClick={() =>
                        setSelectedCategories(selectedCategories.filter((c) => c !== cat))
                      }
                      className="hover:text-teal-900"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </span>
                ))}
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm"
                  >
                    {mockBrands.find((b) => b.id === brand)?.name}
                    <button
                      onClick={() => setSelectedBrands(selectedBrands.filter((b) => b !== brand))}
                      className="hover:text-teal-900"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {enabledFilters?.categories && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Categorieën</label>
              <div className="space-y-2">
                {mockCategories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id])
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category.id),
                          )
                        }
                      }}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-teal-600 flex-1">
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-400">({category.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Brands */}
          {enabledFilters?.brands && (
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Merken</label>
              <div className="space-y-2">
                {mockBrands.map((brand) => (
                  <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, brand.id])
                        } else {
                          setSelectedBrands(selectedBrands.filter((b) => b !== brand.id))
                        }
                      }}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-teal-600 flex-1">
                      {brand.name}
                    </span>
                    <span className="text-xs text-gray-400">({brand.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          {enabledFilters?.priceRange && (
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Prijs: €{priceRange[0]} - €{priceRange[1]}
              </label>
              <input
                type="range"
                min={priceRangeConfig.min}
                max={priceRangeConfig.max}
                step={priceRangeConfig.step}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value, 10)])}
                className="w-full accent-teal-600"
              />
            </div>
          )}

          {/* Badges */}
          {enabledFilters?.badges && (
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Eigenschappen</label>
              <div className="space-y-2">
                {mockBadges.map((badge) => (
                  <label key={badge.value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedBadges.includes(badge.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBadges([...selectedBadges, badge.value])
                        } else {
                          setSelectedBadges(selectedBadges.filter((b) => b !== badge.value))
                        }
                      }}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-teal-600 flex-1">
                      {badge.label}
                    </span>
                    <span className="text-xs text-gray-400">({badge.count})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          {enabledFilters?.stock && (
            <div className="border-t border-gray-200 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">Alleen op voorraad</span>
              </label>
            </div>
          )}

          {/* Featured */}
          {enabledFilters?.featured && (
            <div className="border-t border-gray-200 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyFeatured}
                  onChange={(e) => setOnlyFeatured(e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-gray-700">Uitgelichte producten</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
