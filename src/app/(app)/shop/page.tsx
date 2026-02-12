import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ShoppingCart, Search, Filter } from 'lucide-react'
import type { Product } from '@/payload-types'

export const metadata = {
  title: 'Shop - Medical Equipment',
  description: 'Browse our complete medical equipment catalog',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const payload = await getPayload({ config })

  // Build query
  const where: any = {}
  if (searchParams.category) {
    where.categories = { equals: searchParams.category }
  }
  if (searchParams.search) {
    where.name = { contains: searchParams.search }
  }

  // Fetch products
  const { docs: products } = await payload.find({
    collection: 'products',
    where,
    limit: 50,
    sort: '-createdAt',
  })

  // Fetch categories for filter
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
              <p className="text-gray-600 mt-1">
                {products.length} product{products.length !== 1 ? 's' : ''} available
              </p>
            </div>
            <Link
              href="/cart"
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
            </Link>
          </div>

          {/* Search Bar */}
          <form className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                defaultValue={searchParams.search}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2">
                    <Link
                      href="/shop"
                      className={`block px-3 py-2 rounded-md transition-colors ${
                        !searchParams.category
                          ? 'bg-teal-50 text-teal-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      All Products
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/shop?category=${category.id}`}
                        className={`block px-3 py-2 rounded-md transition-colors ${
                          searchParams.category === category.id
                            ? 'bg-teal-50 text-teal-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Filters */}
              {(searchParams.category || searchParams.search) && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-gray-900 mb-2">Active Filters</h3>
                  <Link
                    href="/shop"
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Clear all filters
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search query
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  View all products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const imageUrl =
    typeof product.images?.[0]?.image === 'object' && product.images[0].image !== null
      ? product.images[0].image.url
      : null

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-16 h-16 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        {typeof product.categories?.[0] === 'object' && product.categories[0] !== null && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-teal-50 text-teal-700 rounded">
              {product.categories[0].name}
            </span>
          </div>
        )}

        <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors mb-1">
          {product.name}
        </h3>

        {product.sku && (
          <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            €{product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              €{product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.trackStock && (
          <div className="flex items-center gap-2">
            {product.stock && product.stock > 0 ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {product.stock} in stock
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Out of stock</span>
              </>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 pt-4 border-t">
          <span className="text-teal-600 font-medium group-hover:text-teal-700 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  )
}
