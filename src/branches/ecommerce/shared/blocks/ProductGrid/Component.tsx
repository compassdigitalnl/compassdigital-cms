/**
 * B-13 ProductGrid Component
 *
 * Server component that fetches products based on source and renders
 * them in a grid or list layout. Uses theme variables for all colors.
 */
import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import { ProductGridPrice } from './ProductGridPrice'
import type { ProductGridBlock as ProductGridType } from '@/payload-types'
import type { Product } from '@/payload-types'

const gridClasses: Record<string, string> = {
  'grid-3': 'grid grid-cols-2 md:grid-cols-3 gap-6',
  'grid-4': 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
  list: 'flex flex-col gap-4',
}

const badgeStyles: Record<string, string> = {
  new: 'bg-primary text-white',
  sale: 'bg-error text-white',
  popular: 'bg-warning text-white',
  'sold-out': 'bg-grey-mid text-white',
}

const badgeLabels: Record<string, string> = {
  new: 'Nieuw',
  sale: 'Actie',
  popular: 'Populair',
  'sold-out': 'Uitverkocht',
}

export const ProductGridComponent: React.FC<ProductGridType> = async ({
  title,
  source = 'latest',
  products: manualProducts,
  category,
  limit = 8,
  layout = 'grid-4',
  showPrice = true,
  showBadge = true,
  showAddToCart = true,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  let products: Product[] = []

  if (source === 'manual' && manualProducts) {
    products = manualProducts as Product[]
  } else {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'
      let apiUrl = ''

      switch (source) {
        case 'featured':
          apiUrl = `${baseUrl}/api/products?where[featured][equals]=true&limit=${limit}`
          break
        case 'category':
          if (category) {
            const categoryId = typeof category === 'object' ? category.id : category
            apiUrl = `${baseUrl}/api/products?where[categories][in]=${categoryId}&limit=${limit}`
          }
          break
        case 'latest':
        default:
          apiUrl = `${baseUrl}/api/products?sort=-createdAt&limit=${limit}`
          break
      }

      if (apiUrl) {
        const separator = apiUrl.includes('?') ? '&' : '?'
        const optimizedUrl = `${apiUrl}${separator}depth=1&select[title]=true&select[slug]=true&select[price]=true&select[salePrice]=true&select[compareAtPrice]=true&select[sku]=true&select[stock]=true&select[stockStatus]=true&select[badge]=true&select[images]=true&select[brand]=true&select[shortDescription]=true`

        const response = await fetch(optimizedUrl, {
          next: { revalidate: 60 },
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.ok) {
          const data = await response.json()
          products = data.docs || []
        }
      }
    } catch (error) {
      console.error('ProductGrid: Error fetching products:', error)
      products = (manualProducts as Product[]) || []
    }
  }

  if (!products || products.length === 0) return null

  const isList = layout === 'list'
  const gridClass = gridClasses[layout || 'grid-4'] || gridClasses['grid-4']

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className="py-12 md:py-16"
    >
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">{title}</h2>
        )}

        <div className={gridClass}>
          {products.slice(0, limit ?? undefined).map((product) => {
            if (typeof product !== 'object') return null

            const badge =
              showBadge && product.badge && product.badge !== 'none' ? product.badge : null
            const firstImage =
              Array.isArray(product.images) &&
              product.images[0] &&
              typeof product.images[0] === 'object'
                ? product.images[0]
                : null
            const brandObj =
              product.brand && typeof product.brand === 'object'
                ? (product.brand as any)
                : null
            const inStock = (product.stock || 0) > 0

            if (isList) {
              return (
                <div
                  key={product.id}
                  className="group flex gap-6 bg-white border border-grey rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <Link
                    href={`/shop/${product.slug}`}
                    className="w-32 md:w-48 flex-shrink-0 bg-gray-100"
                  >
                    {firstImage && firstImage.url ? (
                      <img
                        src={firstImage.url}
                        alt={firstImage.alt || product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full min-h-[8rem]">
                        <Icon name="Package" size={36} className="text-gray-300" />
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 py-4 pr-4">
                    {brandObj && (
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        {brandObj.name}
                      </span>
                    )}
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1 hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    {product.shortDescription && (
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {product.shortDescription}
                      </p>
                    )}
                    <div className="flex items-center gap-4">
                      {showPrice && (
                        <ProductGridPrice
                          price={product.price}
                          compareAtPrice={product.compareAtPrice}
                          taxClass={product.taxClass as any}
                        />
                      )}
                      {showAddToCart && inStock && (
                        <button
                          className="btn btn-primary px-4 py-2 text-sm"
                          aria-label="Toevoegen aan winkelwagen"
                        >
                          <Icon name="Plus" size={16} className="mr-1" />
                          Toevoegen
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            }

            // Grid card
            return (
              <div
                key={product.id}
                className="group relative bg-white border border-grey rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                {badge && (
                  <div
                    className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-lg text-xs font-bold ${badgeStyles[badge] || ''}`}
                  >
                    {badgeLabels[badge] || ''}
                  </div>
                )}

                <Link href={`/shop/${product.slug}`} className="block">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {firstImage && firstImage.url ? (
                      <img
                        src={firstImage.url}
                        alt={firstImage.alt || product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Icon name="Package" size={48} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  {brandObj && (
                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                      {brandObj.name}
                    </div>
                  )}

                  <Link href={`/shop/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between">
                    {showPrice && (
                      <ProductGridPrice
                        price={product.price}
                        compareAtPrice={product.compareAtPrice}
                        taxClass={product.taxClass as any}
                      />
                    )}

                    {showAddToCart && inStock && (
                      <button
                        className="btn btn-primary w-10 h-10 flex items-center justify-center"
                        aria-label="Toevoegen aan winkelwagen"
                      >
                        <Icon name="Plus" size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default ProductGridComponent
