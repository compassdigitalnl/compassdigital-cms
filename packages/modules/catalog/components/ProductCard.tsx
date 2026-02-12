import React from 'react'
import type { Product } from '@payload-shop/types'
import Link from 'next/link'
import Image from 'next/image'

export interface ProductCardProps {
  product: Partial<Product>
  layout?: 'grid' | 'list'
  showQuickView?: boolean
  showCompare?: boolean
  showWishlist?: boolean
  onAddToCart?: (product: Partial<Product>) => void
  onQuickView?: (product: Partial<Product>) => void
}

/**
 * ProductCard Component
 * Displays a product in grid or list layout
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
  showQuickView = true,
  showCompare = false,
  showWishlist = true,
  onAddToCart,
  onQuickView,
}) => {
  const {
    id,
    slug,
    name,
    shortDescription,
    featuredImage,
    basePrice,
    salePrice,
    currency = 'EUR',
    status,
    featured,
    stockStatus,
    rating,
  } = product

  const isOutOfStock = stockStatus === 'out-of-stock'
  const isOnSale = salePrice && salePrice < basePrice!
  const displayPrice = isOnSale ? salePrice : basePrice

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  if (layout === 'list') {
    return (
      <div className="product-card product-card--list flex gap-6 p-4 border rounded-lg hover:shadow-lg transition-shadow bg-white">
        {/* Image */}
        <Link href={`/products/${slug}`} className="flex-shrink-0 w-48 h-48 relative">
          {featuredImage && (
            <Image
              src={typeof featuredImage === 'string' ? featuredImage : featuredImage.url}
              alt={name || ''}
              fill
              className="object-cover rounded"
            />
          )}
          {featured && (
            <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
              Uitgelicht
            </span>
          )}
          {isOnSale && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
              Sale
            </span>
          )}
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <Link href={`/products/${slug}`} className="group">
            <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
          </Link>

          {shortDescription && (
            <p className="text-gray-600 mt-2 line-clamp-2">{shortDescription}</p>
          )}

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'fill-current' : 'fill-gray-300'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">({rating}/5)</span>
            </div>
          )}

          {/* Price & Actions */}
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div>
              {isOnSale && (
                <span className="text-sm text-gray-500 line-through mr-2">
                  {formatPrice(basePrice!)}
                </span>
              )}
              <span className="text-2xl font-bold text-blue-600">{formatPrice(displayPrice!)}</span>
            </div>

            <div className="flex gap-2">
              {showWishlist && (
                <button
                  className="p-2 border rounded hover:bg-gray-100"
                  title="Toevoegen aan verlanglijst"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              )}

              {!isOutOfStock && onAddToCart && (
                <button
                  onClick={() => onAddToCart(product)}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  disabled={isOutOfStock}
                >
                  Toevoegen
                </button>
              )}

              {isOutOfStock && (
                <span className="px-6 py-2 bg-gray-300 text-gray-600 rounded">Uitverkocht</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div className="product-card product-card--grid border rounded-lg overflow-hidden hover:shadow-xl transition-shadow bg-white group">
      {/* Image */}
      <Link href={`/products/${slug}`} className="relative block aspect-square overflow-hidden">
        {featuredImage && (
          <Image
            src={typeof featuredImage === 'string' ? featuredImage : featuredImage.url}
            alt={name || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {featured && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded z-10">
            Uitgelicht
          </span>
        )}
        {isOnSale && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">
            Sale
          </span>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          {showQuickView && onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onQuickView(product)
              }}
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Quick View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          )}

          {showWishlist && (
            <button
              className="p-2 bg-white rounded-full hover:bg-gray-100"
              title="Toevoegen aan verlanglijst"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}

          {showCompare && (
            <button className="p-2 bg-white rounded-full hover:bg-gray-100" title="Vergelijken">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </button>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${slug}`} className="group/title">
          <h3 className="font-semibold text-lg group-hover/title:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
            {name}
          </h3>
        </Link>

        {shortDescription && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{shortDescription}</p>
        )}

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < rating ? 'fill-current' : 'fill-gray-300'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600">({rating})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-4">
          {isOnSale && (
            <span className="text-sm text-gray-500 line-through mr-2">
              {formatPrice(basePrice!)}
            </span>
          )}
          <span className="text-xl font-bold text-blue-600">{formatPrice(displayPrice!)}</span>
        </div>

        {/* Add to Cart */}
        <div className="mt-4">
          {!isOutOfStock && onAddToCart ? (
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Toevoegen aan winkelwagen
            </button>
          ) : (
            <button disabled className="w-full py-2 bg-gray-300 text-gray-600 rounded">
              Uitverkocht
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
