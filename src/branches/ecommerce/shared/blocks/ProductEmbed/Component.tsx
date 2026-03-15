/**
 * B-14 ProductEmbed Component
 *
 * Single product highlight with three variants:
 * - card: image left, text right (inline embed)
 * - hero: full-width background with product overlay
 * - minimal: compact inline card
 *
 * Uses theme variables for all colors.
 */
'use client'

import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import { AnimationWrapper } from '@/branches/shared/blocks/_shared/AnimationWrapper'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'
import type { ProductEmbedBlock, Product } from '@/payload-types'

export const ProductEmbedComponent: React.FC<ProductEmbedBlock> = ({
  product,
  description,
  variant = 'card',
  showPrice = true,
  showDescription = true,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const { formatPriceFull } = usePriceMode()

  if (!product || typeof product !== 'object') return null

  const prod = product as Product
  const firstImage =
    Array.isArray(prod.images) && prod.images[0] && typeof prod.images[0] === 'object'
      ? prod.images[0]
      : null
  const productImage = firstImage?.url || null
  const productDescription = prod.shortDescription || ''
  const brandObj =
    prod.brand && typeof prod.brand === 'object' ? (prod.brand as any) : null

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return null
    return formatPriceFull(price, prod.taxClass as any)
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <AnimationWrapper
        enableAnimation={enableAnimation}
        animationType={animationType}
        animationDuration={animationDuration}
        animationDelay={animationDelay}
        className="inline-flex items-center gap-3 bg-surface border border-grey rounded-lg px-3 py-2 my-2 hover:border-primary transition-colors"
      >
        {productImage && (
          <img
            src={productImage}
            alt={prod.title}
            className="w-10 h-10 rounded object-cover flex-shrink-0"
          />
        )}
        <div className="min-w-0">
          <Link
            href={`/shop/${prod.slug}`}
            className="text-sm font-semibold text-navy hover:text-primary transition-colors truncate block"
          >
            {prod.title}
          </Link>
          {showPrice && prod.price != null && (
            <span className="text-xs font-bold text-primary">{formatPrice(prod.price)}</span>
          )}
        </div>
      </AnimationWrapper>
    )
  }

  // Hero variant
  if (variant === 'hero') {
    return (
      <AnimationWrapper
        enableAnimation={enableAnimation}
        animationType={animationType}
        animationDuration={animationDuration}
        animationDelay={animationDelay}
        as="section"
        className="relative rounded-2xl overflow-hidden my-8"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-secondary">
          {productImage && (
            <img
              src={productImage}
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-8 py-12 md:py-16">
          {productImage && (
            <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-xl overflow-hidden bg-white/10">
              <img
                src={productImage}
                alt={prod.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="text-center md:text-left">
            {brandObj && (
              <span className="text-xs font-bold uppercase tracking-wider text-primary-light mb-2 inline-block">
                {brandObj.name}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{prod.title}</h2>
            {showDescription && productDescription && (
              <p className="text-white/80 text-lg mb-4 max-w-xl">{productDescription}</p>
            )}
            <div className="flex items-center gap-4 justify-center md:justify-start">
              {showPrice && prod.price != null && (
                <span className="text-3xl font-bold text-white">
                  {formatPrice(prod.price)}
                </span>
              )}
              <Link
                href={`/shop/${prod.slug}`}
                className="btn btn-primary px-6 py-3 inline-flex items-center gap-2"
              >
                <Icon name="ShoppingCart" size={18} />
                Bekijk product
              </Link>
            </div>
          </div>
        </div>
      </AnimationWrapper>
    )
  }

  // Card variant (default)
  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      className="bg-surface border-[1.5px] border-grey rounded-xl p-5 my-6 flex gap-5 items-center transition-all duration-250 hover:border-primary hover:shadow-lg"
    >
      {/* Product Image */}
      <div className="w-24 h-24 rounded-xl flex-shrink-0 bg-grey-light overflow-hidden">
        {productImage ? (
          <img
            src={productImage}
            alt={prod.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Icon name="Package" size={32} className="text-grey-mid" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        {brandObj && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {brandObj.name}
          </div>
        )}
        <Link href={`/shop/${prod.slug}`}>
          <h3 className="font-extrabold text-[15px] text-secondary-color my-0.5 hover:text-primary transition-colors">
            {prod.title}
          </h3>
        </Link>
        {showDescription && productDescription && (
          <p className="text-[13px] text-grey-mid leading-snug line-clamp-2">
            {productDescription}
          </p>
        )}
      </div>

      {/* Price & Button */}
      <div className="text-right flex-shrink-0">
        {showPrice && prod.price != null && (
          <>
            <div className="font-extrabold text-lg text-secondary-color">
              {formatPrice(prod.price)}
            </div>
            <div className="text-[11px] text-grey-mid">per stuk</div>
          </>
        )}
        <Link
          href={`/shop/${prod.slug}`}
          className="inline-flex items-center gap-1.5 mt-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold no-underline transition-all duration-200 hover:bg-secondary"
        >
          <Icon name="ShoppingCart" size={13} />
          Bestellen
        </Link>
      </div>
    </AnimationWrapper>
  )
}

export default ProductEmbedComponent
