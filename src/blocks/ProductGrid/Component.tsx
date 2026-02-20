import React from 'react'
import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { SectionLabel } from '@/components/SectionLabel'
import type { ProductGridBlock as ProductGridType } from '@/payload-types'
import type { Product } from '@/payload-types'

export const ProductGrid: React.FC<ProductGridType> = async ({
  sectionLabel,
  heading,
  intro,
  source = 'manual',
  products: manualProducts,
  category,
  brand,
  displayMode = 'grid',
  layout = 'grid-4',
  limit = 8,
  showAddToCart = true,
  showStockStatus = true,
  showBrand = true,
  showComparePrice = true,
  showViewAllButton = true,
  viewAllButtonText = 'Bekijk alle producten',
  viewAllButtonLink = '/producten',
}) => {
  // Fetch products based on source
  let products: Product[] = []

  if (source === 'manual' && manualProducts) {
    products = manualProducts as Product[]
  } else {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3020'
      let apiUrl = ''

      switch (source) {
        case 'featured':
          // Fetch featured products
          apiUrl = `${baseUrl}/api/products?where[featured][equals]=true&limit=${limit}`
          break

        case 'category':
          // Fetch products by category
          if (category) {
            const categoryId = typeof category === 'object' ? category.id : category
            apiUrl = `${baseUrl}/api/products?where[categories][in]=${categoryId}&limit=${limit}`
          }
          break

        case 'brand':
          // Fetch products by brand
          if (brand) {
            const brandId = typeof brand === 'object' ? brand.id : brand
            apiUrl = `${baseUrl}/api/products?where[brand][equals]=${brandId}&limit=${limit}`
          }
          break

        case 'latest':
        case 'recent':
          // Fetch recently added products (sorted by creation date)
          apiUrl = `${baseUrl}/api/products?sort=-createdAt&limit=${limit}`
          break

        case 'sale':
          // Fetch products on sale (with compare price)
          apiUrl = `${baseUrl}/api/products?where[compareAtPrice][greater_than]=0&limit=${limit}`
          break

        default:
          // Fallback to manual products
          products = (manualProducts as Product[]) || []
          break
      }

      if (apiUrl) {
        // Voeg depth en select params toe aan de URL
        const separator = apiUrl.includes('?') ? '&' : '?'
        const optimizedUrl = `${apiUrl}${separator}depth=1&select[title]=true&select[slug]=true&select[price]=true&select[salePrice]=true&select[compareAtPrice]=true&select[sku]=true&select[stock]=true&select[stockStatus]=true&select[status]=true&select[badge]=true&select[productType]=true&select[images]=true&select[brand]=true&select[shortDescription]=true`

        const response = await fetch(optimizedUrl, {
          next: { revalidate: 60 }, // Cache voor 60 seconden, dan revalideren
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          products = data.docs || []
        } else {
          console.error(`Failed to fetch products: ${response.status} ${response.statusText}`)
          products = (manualProducts as Product[]) || []
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to manual products on error
      products = (manualProducts as Product[]) || []
    }
  }

  if (!products || products.length === 0) return null

  const gridClass = {
    'grid-2': 'grid grid-cols-1 md:grid-cols-2 gap-6',
    'grid-3': 'grid grid-cols-2 md:grid-cols-3 gap-6',
    'grid-4': 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6',
    'grid-5': 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4',
  }[layout]

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'new':
        return 'bg-teal-500 text-white'
      case 'sale':
        return 'bg-red-500 text-white'
      case 'popular':
        return 'bg-amber-500 text-white'
      case 'sold-out':
        return 'bg-gray-500 text-white'
      default:
        return ''
    }
  }

  const getBadgeLabel = (badge: string) => {
    switch (badge) {
      case 'new':
        return 'Nieuw'
      case 'sale':
        return 'Actie'
      case 'popular':
        return 'Populair'
      case 'sold-out':
        return 'Uitverkocht'
      default:
        return ''
    }
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            {sectionLabel && <SectionLabel label={sectionLabel} />}
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {heading}
              </h2>
            )}
            {intro && (
              <p className="text-lg text-gray-600">
                {intro}
              </p>
            )}
          </div>
          {showViewAllButton && (
            <Link
              href={viewAllButtonLink}
              className="flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              {viewAllButtonText} <Icon name="ArrowRight" size={18} />
            </Link>
          )}
        </div>

        <div className={gridClass}>
          {products.slice(0, limit).map((product) => {
            if (typeof product !== 'object') return null

            const title = product.title
            const slug = product.slug
            const price = product.price
            const compareAtPrice = showComparePrice ? product.compareAtPrice : null
            const images = product.images
            const badge = product.badge && product.badge !== 'none' ? product.badge : null
            const stock = product.stock || 0
            const brandObj = showBrand && product.brand && typeof product.brand === 'object' ? product.brand : null
            const inStock = stock > 0

            const firstImage = Array.isArray(images) && images[0] && typeof images[0] === 'object' ? images[0] : null

            return (
              <div key={product.id} className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-teal-500/30 transition-all duration-300">
                {badge && (
                  <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-lg text-xs font-bold ${getBadgeStyle(badge)}`}>
                    {getBadgeLabel(badge)}
                  </div>
                )}

                <Link href={`/shop/${slug}`} className="block">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {firstImage && firstImage.url ? (
                      <img
                        src={firstImage.url}
                        alt={firstImage.alt || title}
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
                    <div className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
                      {brandObj.name}
                    </div>
                  )}

                  <Link href={`/shop/${slug}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-teal-600 transition-colors">
                      {title}
                    </h3>
                  </Link>

                  {product.sku && (
                    <p className="text-xs text-gray-500 font-mono mb-3">
                      Art. {product.sku}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        €{price.toFixed(2)}
                      </div>
                      {compareAtPrice && compareAtPrice > price && (
                        <div className="text-sm text-gray-400 line-through">
                          €{compareAtPrice.toFixed(2)}
                        </div>
                      )}
                    </div>

                    {showAddToCart && inStock && (
                      <button
                        className="w-11 h-11 bg-teal-500 hover:bg-teal-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
                        aria-label="Toevoegen aan winkelwagen"
                      >
                        <Icon name="Plus" size={20} />
                      </button>
                    )}
                  </div>

                  {showStockStatus && (
                    <div className="flex items-center gap-2 text-sm pt-3 border-t border-gray-100">
                      {inStock ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-600 font-medium">Op voorraad</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-red-600 font-medium">Uitverkocht</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
