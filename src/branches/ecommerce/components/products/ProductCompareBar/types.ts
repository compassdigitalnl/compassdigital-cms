export interface CompareProduct {
  id: string
  name: string
  image?: string
}

export interface ProductCompareBarProps {
  products: CompareProduct[]
  maxProducts?: number
  onCompare: (productIds: string[]) => void
  onRemove: (productId: string) => void
  onClose: () => void
  isVisible?: boolean
  persistKey?: string
  className?: string
}
