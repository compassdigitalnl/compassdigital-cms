export interface MenuItemCardProps {
  item: {
    id: number
    title: string
    slug: string
    shortDescription?: string
    icon?: string
    price?: number
    category?: string
    allergens?: string
    _status?: string
  }
  showPrice?: boolean
  className?: string
}
