export interface Extra {
  id: string
  name: string
  icon: string
  description: string
  price: number
  priceLabel: string
  popular?: boolean
}

export interface ExtrasSelectorProps {
  extras: Extra[]
  selectedIds: string[]
  onToggle: (id: string) => void
  className?: string
}
