export interface TimeSlot {
  id: string
  time: string
  available: boolean
  price?: number
  spotsLeft?: number
  duration?: number // in minutes
}

export interface TimeSlotSelectorProps {
  slots: TimeSlot[]
  selectedSlotId?: string
  onSlotSelect: (slotId: string) => void
  showPrices?: boolean
  showDuration?: boolean
  layout?: 'grid' | 'list'
  className?: string
}
