export interface BookingSidebarProps {
  price: number
  priceType?: 'per-person' | 'fixed' | 'from'
  priceNote?: string
  dates?: string[]
  personOptions?: string[]
  guarantees?: string[]
  onRequestQuote?: () => void
  onBookNow?: () => void
  className?: string
}
