export interface ParticipantCategory {
  id: string
  label: string
  description?: string
  price: number
  minCount?: number
  maxCount?: number
  count: number
}

export interface ParticipantSelectorProps {
  categories: ParticipantCategory[]
  onChange: (categoryId: string, count: number) => void
  totalCapacity?: number
  showPrices?: boolean
  className?: string
}
