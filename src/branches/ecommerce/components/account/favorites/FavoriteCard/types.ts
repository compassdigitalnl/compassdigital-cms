import type { FavoriteProduct } from '@/branches/ecommerce/templates/account/AccountTemplate1/FavoritesTemplate/types'

export interface FavoriteCardProps {
  favorite: FavoriteProduct
  onRemove: (id: string) => void
}
