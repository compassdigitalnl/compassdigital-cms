import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/utilities/getCurrentUser'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2, Eye } from 'lucide-react'
import type { Product, Media } from '@/payload-types'

export const metadata = {
  title: 'Mijn Favorieten | Account',
  description: 'Beheer je favoriete producten',
}

export default async function FavoritesPage() {
  const payload = await getPayload({ config })
  const { user } = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/account/favorites')
  }

  // Fetch user's favorite products
  const favoriteProducts: Array<{
    product: Product
    addedAt: string
  }> = []

  if (user.favorites && Array.isArray(user.favorites) && user.favorites.length > 0) {
    for (const fav of user.favorites) {
      if (typeof fav.product === 'string') {
        try {
          const product = await payload.findByID({
            collection: 'products',
            id: fav.product,
            depth: 2,
          })
          if (product && (product as Product).status === 'published') {
            favoriteProducts.push({
              product: product as Product,
              addedAt: fav.addedAt,
            })
          }
        } catch (error) {
          // Product not found or deleted, skip
        }
      } else if (fav.product && typeof fav.product === 'object') {
        const product = fav.product as Product
        if (product.status === 'published') {
          favoriteProducts.push({
            product,
            addedAt: fav.addedAt,
          })
        }
      }
    }
  }

  // Sort by most recently added
  favoriteProducts.sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mijn Favorieten</h1>
            <p className="text-gray-600 mt-1">
              Je hebt {favoriteProducts.length} favoriete product
              {favoriteProducts.length !== 1 ? 'en' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Grid */}
      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Nog geen favorieten</h2>
          <p className="text-gray-600 mb-6">
            Begin met het toevoegen van producten aan je favorieten
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Ontdek producten
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map(({ product, addedAt }) => {
            const imageUrl =
              product.images && product.images.length > 0
                ? typeof product.images[0].image === 'object' &&
                  (product.images[0].image as Media)?.url
                  ? (product.images[0].image as Media).url
                  : null
                : null

            const brand =
              typeof product.brand === 'object' && product.brand?.name
                ? product.brand.name
                : null

            return (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Product Image */}
                <Link href={`/shop/${product.slug}`} className="block relative">
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Stock Badge */}
                  {product.stock !== undefined && product.stock < 10 && (
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0
                            ? 'bg-red-100 text-red-800'
                            : product.stock < 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {product.stock === 0
                          ? 'Uitverkocht'
                          : product.stock < 5
                            ? `${product.stock} op voorraad`
                            : 'Beperkte voorraad'}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  {/* Brand */}
                  {brand && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{brand}</p>
                  )}

                  {/* Title */}
                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors min-h-[2.5rem]">
                      {product.title}
                    </h3>
                  </Link>

                  {/* SKU */}
                  {product.sku && (
                    <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                  )}

                  {/* Price */}
                  <div className="mt-3 flex items-baseline gap-2">
                    {product.price && (
                      <p className="text-lg font-bold text-gray-900">€{product.price.toFixed(2)}</p>
                    )}
                    {product.compareAtPrice && product.compareAtPrice > (product.price || 0) && (
                      <p className="text-sm text-gray-500 line-through">
                        €{product.compareAtPrice.toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-500 mt-2">
                    Toegevoegd op{' '}
                    {new Date(addedAt).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>

                  {/* Actions */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/shop/${product.slug}`}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Bekijk
                    </Link>
                    <form>
                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Verwijder
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info Card */}
      {favoriteProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Over Favorieten</p>
              <p className="text-xs text-blue-700 mt-1">
                Je favorieten worden opgeslagen in je account. Klik op het hartje op een
                productpagina om producten toe te voegen aan je favorieten. Zo kun je snel
                terugkeren naar producten die je interessant vindt.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
