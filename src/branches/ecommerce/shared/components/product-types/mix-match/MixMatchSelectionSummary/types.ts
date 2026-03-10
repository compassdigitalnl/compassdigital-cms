import type React from 'react'

export interface SelectedItem {
  id: string
  name: string
  emoji?: string
  icon?: React.ReactNode
  detail?: string
  quantity: number
  price: number
}

export interface MixMatchSelectionSummaryProps {
  items: SelectedItem[]
  onRemove?: (itemId: string) => void
  maxHeight?: string
  className?: string
}
