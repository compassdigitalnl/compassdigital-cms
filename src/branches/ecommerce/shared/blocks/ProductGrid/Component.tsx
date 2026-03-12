/**
 * B-13 ProductGrid Component
 *
 * Server component that fetches products based on source and renders
 * them using the shared ProductCard component (same as shop catalog).
 */
import React from 'react'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import { ProductGridCards } from './ProductGridCards'
import type { ProductGridBlock as ProductGridType } from '@/payload-types'
import type { Product } from '@/payload-types'
import type { ProductCardProps } from '@/branches/ecommerce/shared/components/products/ProductCard/types'
import type { StockStatus, ProductBadge } from '@/branches/ecommerce/shared/components/products/ProductCard/types'

/** Map product badge string to ProductBadge array */
function mapBadge(badge: string | null | undefined): ProductBadge[] | undefined {
  if (!badge || badge === 'none') return undefined
  const badgeLabels: Record<string, string> = {
    new: 'Nieuw',
    sale: 'Actie',
    popular: 'Populair',
    pro: 'Pro',
  }
  const type = badge as ProductBadge['type']
  return [{ type, label: badgeLabels[badge] || badge }]
}

/** Map stock fields to StockStatus */
function mapStockStatus(product: Product): StockStatus {
  const status = product.stockStatus as string | undefined
  if (status === 'on-backorder') return 'on-backorder'
  if (status === 'out' || (product.stock != null && product.stock <= 0)) return 'out'
  if (product.stock != null && product.stock > 0 && product.stock <= 5) return 'low'
  if (product.stock != null && product.stock > 0) return 'in-stock'
  return 'in-stock'
}

/** Map a Payload Product to ProductCardProps */
function mapProductToCard(product: Product, showBadge: boolean): ProductCardProps {
  const firstImage =
    Array.isArray(product.images) &&
    product.images[0] &&
    typeof product.images[0] === 'object'
      ? product.images[0]
      : null

  const brandObj =
    product.brand && typeof product.brand === 'object' ? (product.brand as any) : null

  const effectivePrice = (product as any).salePrice || product.price
  const hasDiscount =
    product.compareAtPrice != null &&
    effectivePrice != null &&
    product.compareAtPrice > effectivePrice

  const isGrouped = (product as any).productType === 'grouped'

  return {
    id: String(product.id),
    name: product.title,
    slug: product.slug || '',
    sku: (product as any).sku || '',
    brand: { name: brandObj?.name || '', slug: brandObj?.slug || '' },
    image: firstImage?.url ? { url: firstImage.url, alt: firstImage.alt || product.title } : undefined,
    price: effectivePrice ?? null,
    priceLabel: isGrouped && effectivePrice != null ? 'Vanaf' : undefined,
    compareAtPrice: hasDiscount ? product.compareAtPrice! : undefined,
    stock: product.stock ?? 0,
    stockStatus: mapStockStatus(product),
    stockText: mapStockStatus(product) === 'on-backorder' ? 'Op bestelling' : undefined,
    badges: showBadge ? mapBadge(product.badge) : undefined,
    taxClass: (product as any).taxClass || undefined,
  }
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
        const optimizedUrl = `${apiUrl}${separator}depth=1&select[title]=true&select[slug]=true&select[price]=true&select[salePrice]=true&select[compareAtPrice]=true&select[sku]=true&select[stock]=true&select[stockStatus]=true&select[badge]=true&select[images]=true&select[brand]=true&select[shortDescription]=true&select[productType]=true&select[taxClass]=true`

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

  const mappedProducts = products
    .slice(0, limit ?? undefined)
    .filter((p) => typeof p === 'object')
    .map((product) => mapProductToCard(product, showBadge ?? true))

  const gridLayout = (layout || 'grid-4') as 'grid-3' | 'grid-4' | 'list'

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
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-10">{title}</h2>
        )}

        <ProductGridCards products={mappedProducts} layout={gridLayout} />
      </div>
    </AnimationWrapper>
  )
}

export default ProductGridComponent
