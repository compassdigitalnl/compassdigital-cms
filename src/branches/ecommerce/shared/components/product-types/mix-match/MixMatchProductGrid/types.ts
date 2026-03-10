import type React from 'react'

export interface MixMatchProductGridProps {
  // Grid content
  children: React.ReactNode

  // Grid configuration
  columns?: 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'

  // Empty state
  emptyStateIcon?: React.ReactNode
  emptyStateText?: string
  showEmptyState?: boolean

  // Styling
  className?: string
}
