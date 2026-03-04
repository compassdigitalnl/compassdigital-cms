export interface FavoriteProduct {
  id: string
  product?: any
  createdAt?: string
}

export interface FavoritesTemplateProps {
  favorites: FavoriteProduct[]
  onRemove: (id: string) => void
  isLoading?: boolean
}
