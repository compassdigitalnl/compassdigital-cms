export type PromotionType = 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_shipping' | 'bundle'

export interface Promotion {
  id: number
  title: string
  slug: string
  type: PromotionType
  value: number
  status: string
  priority: number
  startDate: string | null
  endDate: string | null
  isFlashSale: boolean
  flashSaleLabel?: string
  appliesTo: 'all' | 'specific_products' | 'specific_categories' | 'specific_brands'
  productIds?: number[]
  categoryIds?: number[]
  brandIds?: number[]
  minOrderValue?: number
  minQuantity?: number
  maxUses?: number
  usedCount: number
  stackable: boolean
  bannerText?: string
  bannerColor?: string
}

export interface PromotionMatch {
  promotion: Promotion
  discount: number
  discountLabel: string
}

export interface CartItem {
  productId: number
  title: string
  price: number
  quantity: number
  categoryIds?: number[]
  brandId?: number
}
