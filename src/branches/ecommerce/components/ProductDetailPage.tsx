'use client'

import Link from 'next/link'
import type { Product } from '@/payload-types'
import { AddToCartButton } from './AddToCartButton'

export default function ProductDetailPage({ product }: { product: Product }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0

  // Get description text
  let descriptionText = ''
  if (product.description && typeof product.description === 'object' && 'root' in product.description) {
    descriptionText = product.description.root.children
      ?.map((node: any) => {
        return node.children?.map((child: any) => child.text || '').join(' ') || ''
      })
      .join('\n\n') || ''
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/shop/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Shop
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/" className="text-gray-600 hover:text-gray-700">
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center relative">
              <svg
                className="w-48 h-48 text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                  -{discountPercentage}%
                </div>
              )}
              {product.featured && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                  ⭐ Featured Product
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            {product.sku && (
              <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
            )}

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  €{product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      €{product.compareAtPrice!.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      Save €{(product.compareAtPrice! - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Prices exclude VAT</p>
            </div>

            {/* Stock Status */}
            <div className="mb-8">
              {product.stock !== null && product.stock !== undefined && (
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  {product.stock > 0 ? (
                    <>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-semibold text-green-700">In Stock</p>
                        <p className="text-sm text-gray-600">{product.stock} units available</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div>
                        <p className="font-semibold text-red-700">Out of Stock</p>
                        <p className="text-sm text-gray-600">Currently unavailable</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <div className="mb-8">
              <AddToCartButton product={product} />
            </div>

            {/* Description */}
            {descriptionText && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-line">
                  {descriptionText}
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
              <dl className="space-y-3">
                {product.sku && (
                  <div className="flex">
                    <dt className="font-semibold text-gray-700 w-32">SKU:</dt>
                    <dd className="text-gray-600">{product.sku}</dd>
                  </div>
                )}
                <div className="flex">
                  <dt className="font-semibold text-gray-700 w-32">Status:</dt>
                  <dd>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {product.status}
                    </span>
                  </dd>
                </div>
                {product.stock !== null && product.stock !== undefined && (
                  <div className="flex">
                    <dt className="font-semibold text-gray-700 w-32">Stock:</dt>
                    <dd className="text-gray-600">{product.stock} units</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* B2B Notice */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">💼 Business Customers</h3>
              <p className="text-sm text-blue-800">
                Special pricing available for hospitals and clinics. Contact us for volume discounts
                and B2B pricing.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
