export interface StickyAddToCartBarProduct {
  id: string
  name: string
  meta?: string
  image?: string
  price: number
  variants?: {
    id: string
    label: string
    available?: boolean
  }[]
}

export interface StickyAddToCartBarProps {
  product: StickyAddToCartBarProduct
  selectedVariantId?: string
  onVariantSelect?: (variantId: string) => void
  onAddToCart: (productId: string, variantId?: string) => void
  isVisible?: boolean
  triggerElementRef?: React.RefObject<HTMLElement>
  className?: string
  currencySymbol?: string
  locale?: string
}
