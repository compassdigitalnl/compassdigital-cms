import type React from 'react'

export interface MixMatchHeaderProps {
  // Content
  badgeText?: string
  badgeIcon?: React.ReactNode
  title: string
  highlightedText?: string // Text to highlight in teal
  description: string

  // Stats (right side)
  stats?: Array<{
    value: string | number
    label: string
  }>

  // Display options
  showStats?: boolean
  variant?: 'default' | 'compact'

  // Styling
  className?: string
}
