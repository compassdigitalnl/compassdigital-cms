/**
 * ProductCard Component
 *
 * Product card with two layout variants (Grid and List). Displays product
 * information including image, brand, title, SKU, pricing (regular + sale +
 * volume discounts), star rating, stock status, and add-to-cart button.
 * Supports product badges (Sale/Nieuw/Pro/Popular) and hover effects.
 *
 * Features:
 * - Two variants: Grid (vertical) and List (horizontal)
 * - Product badges: 4 types with color coding
 * - Pricing: current + old + unit + volume discount hints
 * - Star rating: 5-star visual + review count
 * - Stock indicators: 3 states (in-stock/low/out) with colored dots
 * - Hover effect: elevation animation
 * - Add-to-cart CTA: circular button
 * - Full accessibility: semantic HTML, ARIA labels, keyboard navigation
 *
 * @category E-commerce
 * @component EC01
 */

'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star, TrendingDown } from 'lucide-react'
import type { ProductCardProps } from './types'

export function ProductCard({
  id,
  name,
  slug,
  sku,
  brand,
  image,
  price,
  compareAtPrice,
  unit,
  volumePricing,
  rating,
  reviewCount = 0,
  stock,
  stockStatus,
  stockText,
  badges,
  variant = 'grid',
  onAddToCart,
  href,
  currencySymbol = '€',
  locale = 'nl-NL',
  className = '',
}: ProductCardProps) {
  // Format price with euros and cents split
  const formatPrice = (priceValue: number) => {
    const euros = Math.floor(priceValue)
    const cents = ((priceValue % 1) * 100).toFixed(0).padStart(2, '0')
    return { euros, cents }
  }

  // Format old price for strikethrough
  const formatOldPrice = (priceValue: number) => {
    return priceValue.toFixed(2).replace('.', ',')
  }

  // Get best volume pricing tier (lowest tier)
  const bestVolumeTier = volumePricing?.[0]

  // Get stock class based on status
  const getStockClass = () => {
    switch (stockStatus) {
      case 'in-stock':
        return 'product-card__stock--in-stock'
      case 'low':
        return 'product-card__stock--low'
      case 'out':
        return 'product-card__stock--out'
      default:
        return ''
    }
  }

  // Get stock text
  const getStockText = () => {
    if (stockText) return stockText

    switch (stockStatus) {
      case 'in-stock':
        return `Op voorraad (${stock.toLocaleString(locale)} stuks)`
      case 'low':
        return `Laag op voorraad (${stock} stuks)`
      case 'out':
        return 'Tijdelijk uitverkocht'
      default:
        return ''
    }
  }

  // Handle add-to-cart click
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(id)
  }

  // Product URL
  const productHref = href || `/products/${slug}`

  // Price formatting
  const currentPriceFormatted = formatPrice(price)

  // Badge component
  const renderBadge = () => {
    if (!badges || badges.length === 0) return null

    const badge = badges[0] // Show first badge only
    const badgeLabel = badge.label || badge.type.charAt(0).toUpperCase() + badge.type.slice(1)

    return (
      <span
        className={`product-card__badge product-card__badge--${badge.type}`}
        aria-label={`${badgeLabel} product`}
      >
        {badgeLabel}
      </span>
    )
  }

  // Star rating component
  const renderRating = () => {
    if (!rating || rating === 0) return null

    return (
      <div
        className="product-card__rating"
        role="img"
        aria-label={`${rating} van 5 sterren, ${reviewCount} reviews`}
      >
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={13}
            fill={i < Math.floor(rating) ? '#F59E0B' : '#E8ECF1'}
            color={i < Math.floor(rating) ? '#F59E0B' : '#E8ECF1'}
          />
        ))}
        {reviewCount > 0 && (
          <span className="product-card__rating-count">({reviewCount})</span>
        )}
      </div>
    )
  }

  // Image component
  const renderImage = () => (
    <div className="product-card__image">
      {image ? (
        <Image src={image.url} alt={image.alt || name} fill style={{ objectFit: 'contain' }} />
      ) : (
        <span style={{ fontSize: '52px' }}>🧤</span>
      )}
    </div>
  )

  // Price component
  const renderPrice = () => (
    <div className="product-card__price-wrapper">
      <div className="product-card__price">
        {currencySymbol} {currentPriceFormatted.euros}
        <small>,{currentPriceFormatted.cents}</small>
        {compareAtPrice && (
          <span className="product-card__price--old">
            {currencySymbol} {formatOldPrice(compareAtPrice)}
          </span>
        )}
      </div>
      {unit && <div className="product-card__unit">{unit}</div>}
      {bestVolumeTier && (
        <div className="product-card__staffel-hint">
          <TrendingDown size={12} />
          Vanaf {bestVolumeTier.minQty} stuks: {currencySymbol}{' '}
          {bestVolumeTier.price.toFixed(2).replace('.', ',')} (−
          {bestVolumeTier.discountPercent}%)
        </div>
      )}
    </div>
  )

  // Stock indicator component
  const renderStockIndicator = () => (
    <div
      className={`product-card__stock ${getStockClass()}`}
      role="status"
      aria-live="polite"
    >
      <div className="product-card__stock-dot"></div>
      {getStockText()}
    </div>
  )

  // Add-to-cart button
  const renderAddToCart = () => {
    if (!onAddToCart) return null

    return (
      <button
        className="product-card__add-to-cart"
        onClick={handleAddToCart}
        aria-label={`Voeg ${name} toe aan winkelwagen`}
        disabled={stockStatus === 'out'}
      >
        <ShoppingCart size={18} />
      </button>
    )
  }

  return (
    <Link
      href={productHref}
      className={`product-card ${variant === 'list' ? 'product-card--list' : ''} ${className}`}
      aria-label={`${name} door ${brand.name}, ${currencySymbol}${price.toFixed(2)}`}
    >
      {/* Badge */}
      {renderBadge()}

      {/* Image */}
      {renderImage()}

      {/* Body */}
      <div className="product-card__body">
        {variant === 'list' ? (
          <>
            {/* List Variant Layout */}
            <div className="product-card__info">
              <div className="product-card__brand">{brand.name}</div>
              <div className="product-card__title">{name}</div>
              <div className="product-card__sku">SKU: {sku}</div>
              {renderRating()}
            </div>

            <div className="product-card__footer">
              {renderPrice()}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                {renderAddToCart()}
                {renderStockIndicator()}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Grid Variant Layout */}
            <div className="product-card__brand">{brand.name}</div>
            <div className="product-card__title">{name}</div>
            <div className="product-card__sku">SKU: {sku}</div>
            {renderRating()}

            <div className="product-card__footer">
              {renderPrice()}
              {renderAddToCart()}
            </div>

            {renderStockIndicator()}
          </>
        )}
      </div>

      <style jsx>{`
        /* ═══ PRODUCT CARD — GRID VARIANT (Vertical) ═══ */
        .product-card {
          background: var(--white);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--grey);
          position: relative;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: all var(--transition);
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(10, 22, 40, 0.08);
          border-color: transparent;
        }

        .product-card:focus {
          outline: 3px solid var(--teal);
          outline-offset: 2px;
          border-color: transparent;
        }

        /* Badge */
        .product-card__badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          z-index: 2;
          text-transform: capitalize;
        }

        .product-card__badge--sale {
          background: var(--coral);
          color: white;
        }

        .product-card__badge--new {
          background: var(--teal);
          color: white;
        }

        .product-card__badge--pro {
          background: var(--amber);
          color: white;
        }

        .product-card__badge--popular {
          background: var(--green);
          color: white;
        }

        /* Image */
        .product-card__image {
          width: 100%;
          height: 200px;
          background: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* Body */
        .product-card__body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .product-card__brand {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--teal);
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }

        .product-card__title {
          font-weight: 600;
          font-size: 14px;
          color: var(--navy);
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .product-card__sku {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--grey-mid);
          margin-bottom: 8px;
        }

        /* Rating */
        .product-card__rating {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 10px;
        }

        .product-card__rating :global(svg) {
          flex-shrink: 0;
        }

        .product-card__rating-count {
          font-size: 11px;
          color: var(--grey-mid);
          margin-left: 2px;
        }

        /* Footer */
        .product-card__footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
        }

        .product-card__price-wrapper {
          flex: 1;
        }

        .product-card__price {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          color: var(--navy);
        }

        .product-card__price small {
          font-size: 14px;
        }

        .product-card__price--old {
          font-size: 13px;
          color: var(--grey-mid);
          text-decoration: line-through;
          font-weight: 400;
          margin-left: 6px;
        }

        .product-card__unit {
          font-size: 11px;
          color: var(--grey-mid);
          margin-top: 1px;
        }

        .product-card__staffel-hint {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--teal);
          font-weight: 600;
          margin-top: 3px;
        }

        .product-card__staffel-hint :global(svg) {
          flex-shrink: 0;
        }

        /* Add to Cart Button */
        .product-card__add-to-cart {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: var(--teal);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          box-shadow: 0 2px 8px rgba(0, 137, 123, 0.3);
        }

        .product-card__add-to-cart:hover:not(:disabled) {
          background: var(--teal-dark);
          transform: scale(1.05);
        }

        .product-card__add-to-cart:focus {
          outline: 3px solid var(--teal);
          outline-offset: 2px;
          box-shadow: 0 0 0 3px var(--teal-glow);
        }

        .product-card__add-to-cart:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .product-card__add-to-cart :global(svg) {
          flex-shrink: 0;
        }

        /* Stock Indicator */
        .product-card__stock {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--grey);
        }

        .product-card__stock-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .product-card__stock--in-stock {
          color: var(--green);
        }

        .product-card__stock--in-stock .product-card__stock-dot {
          background: var(--green);
        }

        .product-card__stock--low {
          color: var(--amber);
        }

        .product-card__stock--low .product-card__stock-dot {
          background: var(--amber);
        }

        .product-card__stock--out {
          color: var(--coral);
        }

        .product-card__stock--out .product-card__stock-dot {
          background: var(--coral);
        }

        /* ═══ PRODUCT CARD — LIST VARIANT (Horizontal) ═══ */
        .product-card--list {
          flex-direction: row;
          align-items: stretch;
        }

        .product-card--list .product-card__image {
          width: 180px;
          height: auto;
          flex-shrink: 0;
        }

        .product-card--list .product-card__body {
          flex-direction: row;
          gap: 24px;
          padding: 24px;
        }

        .product-card--list .product-card__info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-card--list .product-card__rating {
          margin-bottom: auto;
        }

        .product-card--list .product-card__footer {
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
          min-width: 180px;
        }

        .product-card--list .product-card__stock {
          margin-top: 0;
          padding-top: 0;
          border-top: none;
          justify-content: flex-end;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .product-card--list {
            flex-direction: column;
          }

          .product-card--list .product-card__image {
            width: 100%;
            height: 200px;
          }

          .product-card--list .product-card__body {
            flex-direction: column;
            gap: 12px;
            padding: 18px;
          }

          .product-card--list .product-card__footer {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
            min-width: auto;
          }

          .product-card--list .product-card__stock {
            border-top: 1px solid var(--grey);
            padding-top: 12px;
            margin-top: 12px;
          }
        }
      `}</style>
    </Link>
  )
}
