export type OrderItemsSummaryVariant = 'default' | 'compact'

export interface OrderItemMetadata {
  icon?: string // Lucide icon name (e.g., "ruler", "palette", "hash")
  label: string // e.g., "Maat: L", "Kleur: Wit", "Aantal: 3"
}

export interface OrderItem {
  id: string
  name: string
  imageUrl?: string // Product image URL
  imagePlaceholder?: string // Emoji or fallback (e.g., "🧤")
  metadata: OrderItemMetadata[] // Size, color, quantity, etc.
  price: number // Line total in cents (price × quantity)
}

export interface OrderItemsSummaryProps {
  items: OrderItem[]
  title?: string // Default: "Bestelde producten"
  collapsible?: boolean // Enable collapse/expand
  defaultCollapsed?: boolean // Start collapsed (requires collapsible=true)
  variant?: OrderItemsSummaryVariant
  className?: string
  onToggle?: (collapsed: boolean) => void
}
