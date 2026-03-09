import type { Product } from '@/payload-types'

export interface BulkActionBarProps {
  selectedProducts: Product[]
  onAddToCart?: (products: Product[]) => void
  onRequestQuote?: (products: Product[]) => void
  onCompare?: (products: Product[]) => void
  onClearSelection: () => void
  className?: string
}
