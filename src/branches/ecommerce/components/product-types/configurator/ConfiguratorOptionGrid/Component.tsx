'use client'

import React from 'react'
import { ConfiguratorOptionCard } from '../ConfiguratorOptionCard'
import type { ConfiguratorOptionGridProps } from '@/branches/ecommerce/lib/product-types'

/**
 * PC04: ConfiguratorOptionGrid
 *
 * Grid layout for option cards with responsive columns
 * Features:
 * - Responsive grid (2, 3, or 4 columns)
 * - Automatic layout based on columns prop
 * - Renders ConfiguratorOptionCard components
 * - Empty state message
 */

export const ConfiguratorOptionGrid: React.FC<ConfiguratorOptionGridProps> = ({
  options,
  selectedOption,
  onSelect,
  columns = 3,
  className = '',
}) => {
  // Grid classes based on columns
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className={`configurator-option-grid ${className}`}>
      {options.length > 0 ? (
        <div className={`grid ${gridClasses[columns]} gap-4`}>
          {options.map((option) => (
            <ConfiguratorOptionCard
              key={option.name}
              option={option}
              isSelected={selectedOption?.name === option.name}
              onSelect={() => onSelect(option)}
              showPrice={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-[15px] text-gray-500">Geen opties beschikbaar</p>
        </div>
      )}
    </div>
  )
}
