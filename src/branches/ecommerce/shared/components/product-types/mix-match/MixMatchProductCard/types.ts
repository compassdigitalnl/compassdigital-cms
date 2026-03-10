import type React from 'react'

export interface MixMatchProductCardProps {
  // Product data
  id: string
  name: string
  image?: string
  emoji?: string
  price?: number
  priceIncluded?: boolean

  // Tags
  tag?: {
    label: string
    variant: 'popular' | 'new' | 'vegan' | 'spicy'
  }

  // Meta information
  calories?: number
  freshness?: string
  metadata?: Array<{
    icon: React.ReactNode
    label: string
  }>

  // Selection state
  quantity: number
  maxQuantity?: number
  isSelected?: boolean

  // Callbacks
  onQuantityChange?: (id: string, quantity: number) => void
  onAdd?: (id: string) => void
  onRemove?: (id: string) => void
  onClick?: (id: string) => void

  // Styling
  className?: string
}
