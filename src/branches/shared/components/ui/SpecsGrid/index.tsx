import React from 'react'
import type { SpecsGridProps } from './types'

/**
 * SpecsGrid - Key-value specifications grid
 *
 * Displays property specifications in a clean grid layout.
 * Used by: construction (project specs), real estate (property details),
 * experiences (event specs), hospitality (room specs).
 */

const columnClasses: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
}

const defaultIcons: Record<string, string> = {
  location: '📍',
  area: '📐',
  duration: '⏱️',
  budget: '💰',
  year: '📅',
  rooms: '🚪',
  capacity: '👥',
}

export const SpecsGrid: React.FC<SpecsGridProps> = ({
  specs,
  columns = 4,
  className = '',
}) => {
  if (!specs || specs.length === 0) return null

  return (
    <div className={`grid ${columnClasses[columns] || columnClasses[4]} gap-4 ${className}`}>
      {specs.map((spec, index) => (
        <div
          key={index}
          className="flex flex-col items-center rounded-xl border border-grey bg-white p-4 text-center transition-shadow hover:shadow-sm"
        >
          {spec.icon && (
            <span className="mb-2 text-2xl" role="img" aria-hidden>
              {defaultIcons[spec.icon] || spec.icon}
            </span>
          )}
          <span className="text-xs font-medium uppercase tracking-wider text-grey-mid">
            {spec.label}
          </span>
          <span className="mt-1 text-lg font-bold text-navy">
            {spec.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default SpecsGrid
