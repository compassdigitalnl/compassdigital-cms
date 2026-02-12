import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { AddToCartButton } from './AddToCartButton'
import type { Product } from '@/payload-types'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    limit: 1,
  })

  const product = products[0]

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Medical Equipment Shop`,
    description: product.description || `Buy ${product.name} - Professional medical equipment`,
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config })

  // Fetch product
  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: params.slug,
      },
    },
    limit: 1,
  })

  const product = products[0]

  if (!product) {
    notFound()
  }

  const imageUrl =
    typeof product.images?.[0]?.image === 'object' && product.images[0].image !== null
      ? product.images[0].image.url
      : null

  const isInStock = !product.trackStock || (product.stock && product.stock > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="aspect-square bg-white rounded-lg shadow-sm border overflow-hidden sticky top-8">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg
                    className="w-24 h-24 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Breadcrumb */}
            <div className="mb-4">
              {typeof product.categories?.[0] === 'object' && product.categories[0] !== null && (
                <span className="inline-block px-3 py-1 text-sm font-medium bg-teal-50 text-teal-700 rounded">
                  {product.categories[0].name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* SKU */}
            {product.sku && <p className="text-gray-500 mb-6">SKU: {product.sku}</p>}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                €{product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    €{product.compareAtPrice.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded">
                    Save €{(product.compareAtPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-8">
              {isInStock ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    {product.trackStock && product.stock
                      ? `${product.stock} in stock`
                      : 'In Stock'}
                  </span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-gray max-w-none mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Add to Cart Section */}
            {isInStock && (
              <AddToCartButton
                product={{
                  id: product.id,
                  slug: product.slug!,
                  name: product.name,
                  price: product.price,
                  stock: product.stock || 0,
                  sku: product.sku || undefined,
                }}
              />
            )}

            {/* Specifications */}
            {(product.brand || product.weight || product.dimensions) && (
              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
                <dl className="space-y-3">
                  {product.brand && typeof product.brand === 'object' && (
                    <div className="flex">
                      <dt className="text-gray-600 w-32">Brand:</dt>
                      <dd className="text-gray-900 font-medium">{product.brand.name}</dd>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex">
                      <dt className="text-gray-600 w-32">Weight:</dt>
                      <dd className="text-gray-900">{product.weight}kg</dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex">
                      <dt className="text-gray-600 w-32">Dimensions:</dt>
                      <dd className="text-gray-900">{product.dimensions}</dd>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex">
                      <dt className="text-gray-600 w-32">SKU:</dt>
                      <dd className="text-gray-900 font-mono text-sm">{product.sku}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
