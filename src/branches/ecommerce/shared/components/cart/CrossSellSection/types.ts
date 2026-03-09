export interface CrossSellProduct {
  id: string
  title: string
  brand?: string
  price: number
  image?: string
  slug: string
}

export interface CrossSellSectionProps {
  products: CrossSellProduct[]
  title?: string
  onAddToCart?: (productId: string) => void
  className?: string
}
