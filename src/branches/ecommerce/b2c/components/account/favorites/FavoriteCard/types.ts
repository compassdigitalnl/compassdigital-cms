import type { FavoriteProduct } from '@/branches/ecommerce/b2c/templates/account/AccountTemplate1/FavoritesTemplate/types'

export interface FavoriteCardProps {
  favorite: FavoriteProduct
  onRemove: (id: string) => void
}
