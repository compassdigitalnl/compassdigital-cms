import type { RetourItem } from '../types'

export interface RetourItemSelectorProps {
  items: RetourItem[]
  onToggleItem: (id: string) => void
  onSetQuantity: (id: string, quantity: number) => void
  onNext: () => void
  selectedCount: number
}
