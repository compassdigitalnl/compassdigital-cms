import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import type { Product } from '@/payload-types'

interface CategoryPageProps {
  category: {
    id: string | number
    name: string
    slug: string
  }
}

export default async function CategoryPage({ category }: CategoryPageProps) {
  const payload = await getPayload({ config: configPromise })

  // Fetch products in this category
  const products = await payload.find({
    collection: 'products',
    where: {
      and: [
        {
          categories: {
            contains: category.id,
          },
        },
        {
          status: {
            equals: 'published',
          },
        },
      ],
    },
    limit: 50,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/shop/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Shop
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
          <p className="text-gray-600 mt-2">
            {products.totalDocs} {products.totalDocs === 1 ? 'product' : 'products'} available
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.docs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.docs.map((product) => (
              <ProductCard key={product.id} product={product as Product} categorySlug={category.slug} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
            <p className="text-gray-600 mb-8">
              There are currently no products in this category.
            </p>
            <Link
              href="/shop/"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product, categorySlug }: { product: Product; categorySlug: string }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0

  // Use category hierarchy URL
  const productUrl = `/${categorySlug}/${product.slug}`

  return (
    <Link href={productUrl} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
          <svg
            className="w-24 h-24 text-blue-300"
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
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discountPercentage}%
            </div>
          )}
          {product.featured && (
            <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
            {product.title}
          </h3>

          {product.sku && (
            <p className="text-sm text-gray-500 mb-3">SKU: {product.sku}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4 mt-auto">
            <span className="text-2xl font-bold text-gray-900">
              €{product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">
                €{product.compareAtPrice!.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock & CTA */}
          <div className="flex items-center justify-between">
            {product.stock !== null && product.stock !== undefined && (
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 font-medium">In Stock</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
            )}
            <span className="text-blue-600 group-hover:text-blue-700 font-medium text-sm">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
