import Link from 'next/link'
import type { Product } from '@/payload-types'
import { ArrowUpRight, ShoppingBag, Wrench } from 'lucide-react'

interface RelatedProductsSectionProps {
  upSells?: (string | Product)[]
  crossSells?: (string | Product)[]
  accessories?: (string | Product)[]
  className?: string
}

function ProductCard({ product, badge }: { product: Product; badge?: string }) {
  const image = typeof product.images?.[0] === 'object' ? product.images[0] : null
  const imageUrl = image && 'url' in image ? image.url : null

  const displayPrice = product.salePrice || product.price || 0
  const hasDiscount = product.salePrice && product.compareAtPrice && product.salePrice < product.compareAtPrice

  return (
    <Link
      href={`/${product.slug}`}
      className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}
        {badge && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
            {badge}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        {product.shortDescription && (
          <p className="text-xs text-gray-600 line-clamp-1 mb-2">
            {product.shortDescription}
          </p>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            €{displayPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              €{product.compareAtPrice?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function RelatedProductsSection({
  upSells,
  crossSells,
  accessories,
  className = ''
}: RelatedProductsSectionProps) {
  const upSellProducts = upSells?.filter((p): p is Product => typeof p === 'object') || []
  const crossSellProducts = crossSells?.filter((p): p is Product => typeof p === 'object') || []
  const accessoryProducts = accessories?.filter((p): p is Product => typeof p === 'object') || []

  const hasAnyProducts = upSellProducts.length > 0 || crossSellProducts.length > 0 || accessoryProducts.length > 0

  if (!hasAnyProducts) {
    return null
  }

  return (
    <div className={`space-y-12 ${className}`}>
      {/* Up-Sells - Show ABOVE add to cart button in template integration */}
      {upSellProducts.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Upgrade naar een betere optie
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Deze alternatieven bieden meer mogelijkheden en betere prestaties
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {upSellProducts.map((product) => (
              <ProductCard key={product.id} product={product} badge="UPGRADE" />
            ))}
          </div>
        </div>
      )}

      {/* Cross-Sells - Show BELOW product info */}
      {crossSellProducts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">
              Vaak samen gekocht
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Klanten die dit product kochten, kochten ook:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {crossSellProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Accessories - Show with related products */}
      {accessoryProducts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">
              Bijpassende accessoires
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Vergroot de functionaliteit met deze accessoires
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {accessoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
