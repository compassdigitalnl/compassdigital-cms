/**
 * PromoCard Component (C14)
 *
 * Navy gradient card for promotional products. Perfect for highlighting
 * featured products, deals, or special offers in sidebars, banners, or grids.
 *
 * Features:
 * - Navy gradient background with teal glow effect
 * - Product image (64x64) with fallback emoji
 * - Optional badge (e.g., "Actie", "Nieuw")
 * - Product name (bold, white)
 * - Price with optional old price strikethrough
 * - Hover effect (lift + shadow)
 * - Compact variant for sidebars
 * - Clickable card (button or link)
 *
 * @category E-commerce / Marketing
 * @component C14
 */

'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePriceMode } from '@/branches/ecommerce/hooks/usePriceMode'
import type { PromoCardProps } from './types'

export const PromoCard: React.FC<PromoCardProps> = ({
  product,
  onClick,
  href,
  variant = 'default',
  className = '',
  currencySymbol = '€',
  locale = 'nl-NL',
}) => {
  const { formatPriceFull } = usePriceMode()

  const isCompact = variant === 'compact'

  const cardClasses = `
    promo-card p-4.5 bg-gradient-to-br from-navy-600 to-navy-500
    rounded-[14px] flex items-center gap-4 relative overflow-hidden cursor-pointer
    transition-all duration-200 no-underline
    hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(10,22,40,0.2)]
    ${isCompact ? 'p-3.5 gap-3' : ''}
    ${className}
  `

  const content = (
    <>
      {/* Decorative Glow */}
      <div
        className="absolute top-[-20px] right-[-20px] w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(0,137,123,0.12),transparent_70%)] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Product Image */}
      <div
        className={`
        promo-card-img bg-white/[0.06] rounded-xl flex items-center justify-center
        flex-shrink-0 relative overflow-hidden
        ${isCompact ? 'w-12 h-12' : 'w-16 h-16'}
      `}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={isCompact ? 48 : 64}
            height={isCompact ? 48 : 64}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className={isCompact ? 'text-2xl' : 'text-[32px]'} aria-hidden="true">
            🎁
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className="promo-card-info flex-1 relative">
        {/* Badge */}
        {product.badge && (
          <div className="promo-card-badge inline-flex items-center gap-1 bg-teal-600/20 border border-teal-600/30 px-2 py-0.5 rounded-full text-[10px] font-bold text-teal-400 mb-1">
            {product.badge.icon && (
              <span className="w-[11px] h-[11px]" aria-hidden="true">
                {product.badge.icon}
              </span>
            )}
            {product.badge.label}
          </div>
        )}

        {/* Product Name */}
        <h3
          className={`
          promo-card-name font-['Plus_Jakarta_Sans'] font-extrabold text-white leading-tight
          ${isCompact ? 'text-[13px]' : 'text-sm'}
        `}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div
          className={`
          promo-card-price font-['Plus_Jakarta_Sans'] font-extrabold text-teal-400 mt-0.5
          ${isCompact ? 'text-sm' : 'text-base'}
        `}
        >
          {formatPriceFull(product.price, (product as any).taxClass)}
          {product.oldPrice && (
            <span className="text-xs text-white/30 line-through font-normal ml-1">
              {formatPriceFull(product.oldPrice, (product as any).taxClass)}
            </span>
          )}
        </div>
      </div>
    </>
  )

  // Render as link or button
  if (href) {
    return (
      <Link href={href} className={cardClasses} aria-label={`Bekijk ${product.name}`}>
        {content}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cardClasses}
      aria-label={`Bekijk ${product.name}`}
      type="button"
    >
      {content}
    </button>
  )
}

export default PromoCard
