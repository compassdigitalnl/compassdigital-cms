import type { SelectedItem } from '../MixMatchSelectionSummary/types'

export interface MixMatchPricingCardProps {
  // Box configuration
  title?: string
  totalSlots: number
  filledSlots: number

  // Selected items
  selectedItems: SelectedItem[]

  // Pricing
  boxPrice: number
  individualTotal?: number
  savings?: number

  // Callbacks
  onRemoveItem?: (itemId: string) => void
  onAddToCart?: () => void

  // State
  isAddingToCart?: boolean

  // Styling
  className?: string
}

export type { SelectedItem }
