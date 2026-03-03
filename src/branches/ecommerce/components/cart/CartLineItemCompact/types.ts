import type { CartProduct } from '@/branches/ecommerce/components/ui/CartLineItem/types'

export interface CartLineItemCompactProps {
  product: CartProduct
  quantity: number
  onQuantityChange: (newQuantity: number) => void
  onRemove: () => void
  className?: string
}

export type { CartProduct }
