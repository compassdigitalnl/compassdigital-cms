/**
 * B-20 BundleBuilder Component
 *
 * Product bundle display showing included products with a bundled discount price.
 * Shows individual product prices, then the bundle total with discount applied.
 * Uses theme variables for all colors.
 */
import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import type { BundleBuilderBlock } from '@/payload-types'
import type { Product } from '@/payload-types'

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export const BundleBuilderComponent: React.FC<BundleBuilderBlock> = ({
  title,
  description,
  products: bundleProducts,
  discountPercentage,
  discountLabel,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  if (!bundleProducts || bundleProducts.length === 0) return null

  const products = bundleProducts.filter(
    (p): p is Product => typeof p === 'object' && p !== null,
  )

  if (products.length === 0) return null

  // Calculate prices
  const totalOriginal = products.reduce((sum, p) => sum + (p.price || 0), 0)
  const discount = discountPercentage || 0
  const totalDiscounted = totalOriginal * (1 - discount / 100)
  const savings = totalOriginal - totalDiscounted

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          {(title || description) && (
            <div className="mb-8">
              {title && (
                <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">{title}</h2>
              )}
              {description && <p className="text-grey-dark">{description}</p>}
            </div>
          )}

          {/* Bundle card */}
          <div className="bg-white border-2 border-grey rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300">
            {/* Discount banner */}
            {(discount > 0 || discountLabel) && (
              <div className="bg-gradient-to-r from-primary to-primary-light px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <Icon name="Tag" size={18} />
                  <span className="font-bold text-sm">
                    {discountLabel || `Bespaar ${discount}% als bundel`}
                  </span>
                </div>
                {savings > 0 && (
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold">
                    -{formatPrice(savings)}
                  </span>
                )}
              </div>
            )}

            {/* Products list */}
            <div className="divide-y divide-grey">
              {products.map((product, index) => {
                const firstImage =
                  Array.isArray(product.images) &&
                  product.images[0] &&
                  typeof product.images[0] === 'object'
                    ? product.images[0]
                    : null

                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-grey-light transition-colors"
                  >
                    {/* Product image */}
                    <div className="w-16 h-16 rounded-lg bg-grey-light overflow-hidden flex-shrink-0">
                      {firstImage && firstImage.url ? (
                        <img
                          src={firstImage.url}
                          alt={firstImage.alt || product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Icon name="Package" size={24} className="text-grey-mid" />
                        </div>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/shop/${product.slug}`}
                        className="font-semibold text-navy hover:text-primary transition-colors line-clamp-1"
                      >
                        {product.title}
                      </Link>
                      {product.sku && (
                        <p className="text-xs text-grey-mid font-mono">Art. {product.sku}</p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      {product.price != null && (
                        <span className="font-semibold text-navy">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Connector line between items */}
                    {index < products.length - 1 && (
                      <div className="absolute right-8 -bottom-3 z-10 w-6 h-6 rounded-full bg-grey-light flex items-center justify-center text-grey-mid text-xs font-bold">
                        +
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Total section */}
            <div className="bg-grey-light px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                {discount > 0 && (
                  <div className="text-sm text-grey-mid line-through mb-1">
                    Normaal: {formatPrice(totalOriginal)}
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(totalDiscounted)}
                  </span>
                  <span className="text-sm text-grey-mid">bundel prijs</span>
                </div>
              </div>

              <button className="btn btn-primary btn-lg flex items-center gap-2">
                <Icon name="ShoppingCart" size={20} />
                Bundel toevoegen
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  )
}

export default BundleBuilderComponent
