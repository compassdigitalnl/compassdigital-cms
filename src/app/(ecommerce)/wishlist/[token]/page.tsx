import React from 'react'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import type { Product, Media, User } from '@/payload-types'

interface Props {
  params: Promise<{ token: string }>
}

// Helper to extract media URL
function getMediaUrl(media: Product['meta'] extends { image?: infer I } ? I : unknown): string | null {
  if (!media) return null
  if (typeof media === 'object' && media !== null && 'url' in media) {
    return (media as Media).url ?? null
  }
  return null
}

// Helper to get product image
function getProductImage(product: Product): string | null {
  // Try meta image first
  const metaImage = getMediaUrl(product.meta?.image)
  if (metaImage) return metaImage

  // Try gallery first image
  if (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
    const first = product.gallery[0]
    if (typeof first === 'object' && first !== null) {
      const img = 'image' in first ? first.image : first
      return getMediaUrl(img)
    }
  }

  return null
}

// Format price
function formatPrice(price: number | null | undefined): string {
  if (!price && price !== 0) return ''
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params
  const payload = await getPayloadHMR({ config: configPromise })

  // Find a wishlist item with this token to get the user's name
  const { docs } = await payload.find({
    collection: 'wishlists',
    where: {
      shareToken: { equals: token },
      isPublic: { equals: true },
    },
    limit: 1,
    depth: 1,
  })

  if (docs.length === 0) {
    return { title: 'Wishlist niet gevonden' }
  }

  const user = docs[0].user as User
  const userName = user?.name || 'Iemand'

  return {
    title: `Wishlist van ${userName}`,
    description: `Bekijk de favoriete producten van ${userName}`,
  }
}

export default async function PublicWishlistPage({ params }: Props) {
  const { token } = await params
  const payload = await getPayloadHMR({ config: configPromise })

  // Find the wishlist item with this shareToken
  const { docs: firstItems } = await payload.find({
    collection: 'wishlists',
    where: {
      shareToken: { equals: token },
      isPublic: { equals: true },
    },
    limit: 1,
    depth: 1,
  })

  if (firstItems.length === 0) {
    notFound()
  }

  // Get the user from the first item
  const userId = typeof firstItems[0].user === 'object' ? firstItems[0].user.id : firstItems[0].user
  const user = firstItems[0].user as User

  // Get ALL public wishlist items from this user
  const { docs: wishlistItems } = await payload.find({
    collection: 'wishlists',
    where: {
      user: { equals: userId },
      isPublic: { equals: true },
    },
    depth: 2,
    sort: '-createdAt',
    limit: 100,
  })

  const userName = user?.name || 'Iemand'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar shop
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                Wishlist van {userName}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'product' : 'producten'}
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {wishlistItems.map((item) => {
              const product = item.product as Product
              if (!product || typeof product !== 'object') return null

              const imageUrl = getProductImage(product)
              const price = product.price

              return (
                <Link
                  key={item.id}
                  href={`/shop/${product.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.title || ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    {product.sku && (
                      <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
                    )}
                    {price != null && (
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        {formatPrice(price)}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-sm text-gray-500 mt-2 italic">
                        &ldquo;{item.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Geen producten gevonden</h2>
            <p className="text-gray-500 mt-2">
              Deze wishlist is leeg of niet meer beschikbaar.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
