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
  // Special product type data
  bookingData?: {
    date?: string
    time?: string
    duration?: string
    participants?: Array<{ category: string; count: number; price: number }>
    addOns?: Array<{ label: string; price: number }>
    summary?: string
  }
  personalizationData?: {
    summary?: string
    values?: Record<string, { fieldName: string; value: string | null }>
    rushEnabled?: boolean
  }
  configurationData?: {
    summary?: string
    selections?: Record<string, { name: string; price: number }>
  }
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
