'use client'

import React from 'react'
import { Heart } from 'lucide-react'
import { AccountEmptyState, AccountLoadingSkeleton } from '@/branches/ecommerce/components/account/ui'
import { FavoriteCard } from '@/branches/ecommerce/components/account/favorites'
import type { FavoritesTemplateProps } from './types'

export default function FavoritesTemplate({ favorites, onRemove, isLoading }: FavoritesTemplateProps) {
  if (isLoading) return <AccountLoadingSkeleton variant="page" />

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-1 lg:mb-2 text-gray-900">Favorieten</h1>
        <p className="text-sm lg:text-base text-gray-500">Je opgeslagen producten en wishlist</p>
      </div>

      {favorites.length > 0 && (
        <div className="text-sm text-gray-600">
          <strong>{favorites.length}</strong> {favorites.length === 1 ? 'product' : 'producten'} in je favorieten
        </div>
      )}

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <FavoriteCard key={fav.id} favorite={fav} onRemove={onRemove} />
          ))}
        </div>
      ) : (
        <AccountEmptyState
          icon={Heart}
          title="Geen favorieten"
          description="Je hebt nog geen producten opgeslagen in je favorieten. Klik op het hartje bij een product om het toe te voegen."
          actionLabel="Bekijk producten"
          actionHref="/shop"
        />
      )}
    </div>
  )
}
