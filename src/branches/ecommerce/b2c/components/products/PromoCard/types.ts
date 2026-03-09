export interface PromoCardProduct {
  id: string
  name: string
  image?: string
  price: number
  oldPrice?: number
  badge?: {
    label: string
    icon?: React.ReactNode
  }
}

export type PromoCardVariant = 'default' | 'compact'

export interface PromoCardProps {
  product: PromoCardProduct
  onClick?: () => void
  href?: string
  variant?: PromoCardVariant
  className?: string
  currencySymbol?: string
  locale?: string
}
