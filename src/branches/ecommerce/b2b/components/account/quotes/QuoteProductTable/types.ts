export interface QuoteProduct {
  id: string
  name: string
  sku: string
  emoji?: string
  quantity: number
}

export interface QuoteProductTableProps {
  products: QuoteProduct[]
  onQuantityChange: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  onAddProduct?: (product: QuoteProduct) => void
}
