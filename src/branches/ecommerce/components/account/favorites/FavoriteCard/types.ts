import type { FavoriteProduct } from '@/branches/ecommerce/templates/account/FavoritesTemplate/types'

export interface FavoriteCardProps {
  favorite: FavoriteProduct
  onRemove: (id: string) => void
}
