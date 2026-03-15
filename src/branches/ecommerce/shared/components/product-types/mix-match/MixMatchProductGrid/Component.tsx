'use client'

import React from 'react'
import { PackageOpen } from 'lucide-react'
import type { MixMatchProductGridProps } from './types'

export type { MixMatchProductGridProps }

export const MixMatchProductGrid: React.FC<MixMatchProductGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  emptyStateIcon = <PackageOpen className="w-12 h-12" />,
  emptyStateText = 'Geen producten gevonden',
  showEmptyState = false,
  className = '',
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-2.5',
    lg: 'gap-4',
  }

  const columnClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  // Check if children is empty or falsy
  const hasChildren = React.Children.count(children) > 0

  if (!hasChildren && showEmptyState) {
    return (
      <div className={`products-grid-empty text-center py-16 px-6 text-grey-mid ${className}`}>
        <div className="products-grid-empty-icon mb-3 opacity-50 flex justify-center">
          {emptyStateIcon}
        </div>
        <div className="products-grid-empty-text text-sm font-semibold">
          {emptyStateText}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`products-grid grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  )
}

export default MixMatchProductGrid
