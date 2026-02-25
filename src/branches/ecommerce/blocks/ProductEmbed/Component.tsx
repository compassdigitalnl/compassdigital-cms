'use client'
import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import type { ProductEmbedBlock, Product } from '@/payload-types'

/**
 * ProductEmbed Component - 100% Theme Variable Compliant
 *
 * Refactored from 100% inline styles to Tailwind utility classes.
 * All colors now use CSS variables from ThemeProvider:
 * - Navy (#0A1628) → bg-secondary, text-secondary-color
 * - Teal (#00897B) → bg-primary, text-primary
 * - Grey (#E8ECF1) → border-grey
 * - Grey mid (#94A3B8) → text-grey-mid
 * - Grey light (#F1F4F8) → bg-grey-light
 */
export const ProductEmbedComponent: React.FC<ProductEmbedBlock> = ({
  product,
  showPrice = true,
  showButton = true,
  customDescription,
}) => {
  if (!product || typeof product === 'string') {
    return null
  }

  const prod = product as Product

  // Get product image or emoji
  const productEmoji = '🧤' // Default fallback
  const productImage =
    typeof prod.featuredImage === 'object' && prod.featuredImage?.url
      ? prod.featuredImage.url
      : null

  // Description: use custom or fallback to product excerpt/description
  const description = customDescription || prod.excerpt || prod.description || ''

  // Price formatting
  const formatPrice = (price: number | null | undefined) => {
    if (!price) return '€0,00'
    return `€${price.toFixed(2).replace('.', ',')}`
  }

  return (
    <div
      className="
        bg-surface border-[1.5px] border-grey rounded-xl p-5 my-6
        flex gap-4 items-center
        transition-all duration-250
        hover:border-primary hover:shadow-lg
      "
    >
      {/* Product Image/Emoji */}
      <div
        className="
          w-20 h-20 rounded-xl flex items-center justify-center
          text-4xl flex-shrink-0
        "
        style={{
          background: productImage ? `url(${productImage}) center/cover` : undefined,
        }}
      >
        <div className={productImage ? 'hidden' : 'bg-grey-light w-full h-full rounded-xl flex items-center justify-center'}>
          {!productImage && productEmoji}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        {/* Brand */}
        {prod.brand && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {typeof prod.brand === 'object' ? prod.brand.name : prod.brand}
          </div>
        )}

        {/* Product Name */}
        <div className="font-extrabold text-[15px] text-secondary-color my-0.5">
          {prod.title}
        </div>

        {/* Description */}
        {description && (
          <div className="text-[13px] text-grey-mid leading-snug">
            {description}
          </div>
        )}
      </div>

      {/* Price & Button */}
      {(showPrice || showButton) && (
        <div className="text-right flex-shrink-0">
          {showPrice && (
            <>
              <div className="font-extrabold text-lg text-secondary-color">
                {formatPrice(prod.price)}
              </div>
              <div className="text-[11px] text-grey-mid">per stuk</div>
            </>
          )}

          {showButton && (
            <Link
              href={`/products/${prod.slug}`}
              className="
                inline-flex items-center gap-1.5 mt-2
                px-4 py-2
                bg-primary text-white
                rounded-lg
                text-xs font-bold
                no-underline
                transition-all duration-200
                hover:bg-secondary
              "
            >
              <Icon name="ShoppingCart" size={13} />
              Bestellen
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductEmbedComponent
