import type { Product } from '@/payload-types'

export interface FavoriteProduct {
  id: string
  product?: Product | number
  notes?: string
  isPublic?: boolean
  shareToken?: string
  createdAt?: string
}

export interface FavoritesTemplateProps {
  favorites: FavoriteProduct[]
  onRemove: (id: string) => void
  isLoading?: boolean
  shareEnabled?: boolean
  shareUrl?: string | null
  onToggleShare?: (enabled: boolean) => void
  isTogglingShare?: boolean
}
