'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Heart, ShoppingCart, Trash2, Share2, Eye } from 'lucide-react'

export default function FavoritesPage() {
  // TODO: Replace with real favorites data from API
  const [favorites] = useState([
    {
      id: 1,
      emoji: '🧤',
      name: 'Latex handschoenen Premium',
      sku: 'HAND-001',
      price: 24.95,
      compareAtPrice: 29.95,
      inStock: true,
      slug: 'latex-handschoenen-premium',
      image: '/products/handschoenen.jpg',
      addedAt: '2026-02-10',
    },
    {
      id: 2,
      emoji: '🧴',
      name: 'Handgel dispenser automatisch',
      sku: 'DISP-112',
      price: 89.50,
      compareAtPrice: null,
      inStock: true,
      slug: 'handgel-dispenser-automatisch',
      image: '/products/dispenser.jpg',
      addedAt: '2026-02-08',
    },
    {
      id: 3,
      emoji: '🗑️',
      name: 'Afvalbak pedaal 50L RVS',
      sku: 'BIN-023',
      price: 145.00,
      compareAtPrice: null,
      inStock: false,
      slug: 'afvalbak-pedaal-50l',
      image: '/products/afvalbak.jpg',
      addedAt: '2026-01-28',
    },
  ])

  const handleRemoveFromFavorites = (productId: number) => {
    // TODO: Implement remove from favorites API call
    if (confirm('Weet je zeker dat je dit product uit je favorieten wilt verwijderen?')) {
      console.log(`Removing product ${productId} from favorites`)
      alert('Product verwijderd uit favorieten')
    }
  }

  const handleAddToCart = (productId: number) => {
    // TODO: Implement add to cart API call
    console.log(`Adding product ${productId} to cart`)
    alert('Product toegevoegd aan winkelwagen')
  }

  const handleShare = (productId: number) => {
    // TODO: Implement share functionality
    console.log(`Sharing product ${productId}`)
    alert('Deel functionaliteit nog niet beschikbaar')
  }

  const handleShareAllFavorites = () => {
    // TODO: Implement share all favorites
    alert('Deel je favorieten met anderen (functionaliteit komt binnenkort)')
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link
            href="/my-account/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">Favorieten</h1>
        </div>
        <p className="text-sm text-gray-600">
          Je opgeslagen producten en wishlist
        </p>
      </div>

      {/* Actions Bar */}
      {favorites.length > 0 && (
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="text-sm text-gray-600">
            <strong>{favorites.length}</strong> {favorites.length === 1 ? 'product' : 'producten'} in je favorieten
          </div>
          <button
            onClick={handleShareAllFavorites}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" />
            Deel favorieten
          </button>
        </div>
      )}

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((product) => {
            const hasDiscount = product.compareAtPrice && product.price < product.compareAtPrice
            const discountPercentage = hasDiscount
              ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
              : 0

            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {product.emoji}
                  </div>
                  {hasDiscount && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                      -{discountPercentage}%
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="px-3 py-1 bg-white text-gray-900 font-bold text-sm rounded">
                        Niet op voorraad
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFromFavorites(product.id)}
                    className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors group"
                    title="Verwijder uit favorieten"
                  >
                    <Heart className="w-4 h-4 text-red-600 fill-red-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link
                    href={`/product/${product.slug}`}
                    className="hover:text-teal-600 transition-colors"
                  >
                    <h3 className="font-bold text-sm mb-1 line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="text-xs text-gray-500 font-mono mb-3">{product.sku}</div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">€{product.price.toFixed(2)}</span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-400 line-through">
                        €{product.compareAtPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {product.inStock ? (
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="w-full px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Toevoegen
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-gray-200 text-gray-500 font-semibold rounded-lg cursor-not-allowed text-sm"
                      >
                        Niet leverbaar
                      </button>
                    )}
                    <div className="flex gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Bekijk
                      </Link>
                      <button
                        onClick={() => handleShare(product.id)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        title="Deel product"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-3">
                    Toegevoegd op {new Date(product.addedAt).toLocaleDateString('nl-NL')}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-bold text-lg mb-2">Geen favorieten</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
            Je hebt nog geen producten opgeslagen in je favorieten.
            Klik op het hartje bij een product om het toe te voegen aan je wishlist.
          </p>
          <Link
            href="/shop/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Bekijk producten
          </Link>
        </div>
      )}
    </div>
  )
}
