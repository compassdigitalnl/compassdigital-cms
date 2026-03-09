export interface QuoteProductItem {
  name: string
  sku: string | null
  quantity: number
  quotedUnitPrice: number | null
}

export interface QuoteProductsDetailProps {
  products: QuoteProductItem[]
  quotedPrice: number | null
  status: string
}
