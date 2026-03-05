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

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star, Layers, Heart, Eye, Minus, Plus } from 'lucide-react'
import type { ProductCardProps } from './types'
import { usePriceMode } from '../../../hooks/usePriceMode'
import './ProductCard.css'

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
  priceLabel,
  taxClass,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { displayPrice: applyPriceMode, vatLabelForClass } = usePriceMode()

  // Format price with euros and cents split
  const formatPrice = (priceValue: number | null | undefined) => {
    if (priceValue == null) return { euros: 0, cents: '00' }
    const euros = Math.floor(priceValue)
    const cents = ((priceValue % 1) * 100).toFixed(0).padStart(2, '0')
    return { euros, cents }
  }

  // Format old price for strikethrough
  const formatOldPrice = (priceValue: number | null | undefined) => {
    if (priceValue == null) return '0,00'
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
      case 'on-backorder':
        return 'product-card__stock--backorder'
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
        return 'Op voorraad'
      case 'low':
        return `Nog ${stock} op voorraad — bestel snel`
      case 'on-backorder':
        return 'Op bestelling'
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
    onAddToCart?.(id, quantity)
  }

  // Quantity handlers
  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity((q) => Math.max(1, q - 1))
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity((q) => q + 1)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const val = parseInt(e.target.value)
    if (!isNaN(val) && val >= 1) setQuantity(val)
  }

  // Product URL
  const productHref = href || `/${slug}`

  // Price formatting — apply B2B/B2C mode
  const displayPriceValue = applyPriceMode(price, taxClass)
  const displayCompareAt = applyPriceMode(compareAtPrice, taxClass)
  const currentPriceFormatted = formatPrice(displayPriceValue)

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

  // Image component with hover actions
  // Check if image URL is external (not from own server)
  const isExternalImage = image?.url && (image.url.startsWith('http://') || image.url.startsWith('https://'))
    && !image.url.includes(typeof window !== 'undefined' ? window.location.hostname : '')

  const renderImage = () => (
    <div className="product-card__image">
      {image ? (
        isExternalImage ? (
          // External images (e.g. CDN/WooCommerce): use plain img to avoid Next.js remotePatterns requirement
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt={image.alt || name} style={{ objectFit: 'contain', width: '100%', height: '100%', position: 'absolute', inset: 0 }} loading="lazy" />
        ) : (
          <Image src={image.url} alt={image.alt || name} fill style={{ objectFit: 'contain' }} />
        )
      ) : (
        <span style={{ fontSize: '52px' }}>🧤</span>
      )}
      {/* Hover actions */}
      <div className="product-card__hover-actions">
        <button
          className="product-card__hover-btn"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishlistToggle?.() }}
          aria-label="Toevoegen aan verlanglijst"
        >
          <Heart size={16} />
        </button>
        <button
          className="product-card__hover-btn"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.() }}
          aria-label="Snel bekijken"
        >
          <Eye size={16} />
        </button>
      </div>
    </div>
  )

  // Price component
  const renderPrice = () => (
    <div className="product-card__price-wrapper">
      {price != null ? (
        <div className="product-card__price">
          {priceLabel && <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--color-text-muted)', marginRight: '4px' }}>{priceLabel}</span>}
          {currencySymbol} {currentPriceFormatted.euros}
          <small>,{currentPriceFormatted.cents}</small>
          {displayCompareAt != null && compareAtPrice != null && compareAtPrice > (price ?? 0) && (
            <span className="product-card__price--old">
              {currencySymbol} {formatOldPrice(displayCompareAt)}
            </span>
          )}
        </div>
      ) : (
        <div className="product-card__price" style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
          Prijs op aanvraag
        </div>
      )}
      {unit && <div className="product-card__unit">{vatLabelForClass(taxClass)} · {unit}</div>}
      {bestVolumeTier && (
        <div className="product-card__staffel-hint">
          <Layers size={12} />
          Staffelprijzen vanaf {bestVolumeTier.minQty} stuks
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
        disabled={stockStatus === 'out' && price != null}
      >
        <ShoppingCart size={18} />
      </button>
    )
  }

  return (
    <Link
      href={productHref}
      className={`product-card ${variant === 'list' ? 'product-card--list' : ''} ${className}`}
      aria-label={`${name}${brand?.name ? ` door ${brand.name}` : ''}${price != null ? `, ${currencySymbol}${price.toFixed(2)}` : ''}`}
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
              <div className="product-card__brand">{brand?.name}</div>
              <div className="product-card__title">{name}</div>
              <div className="product-card__sku">Art. {sku}</div>
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
            <div className="product-card__brand">{brand?.name}</div>
            <div className="product-card__title">{name}</div>
            <div className="product-card__sku">Art. {sku}</div>
            {renderRating()}

            <div className="product-card__footer">
              {renderPrice()}
              <div className="product-card__actions">
                {onAddToCart && (
                  <div className="product-card__qty">
                    <button className="product-card__qty-btn" onClick={handleDecrement} aria-label="Verminder aantal">
                      <Minus size={14} />
                    </button>
                    <input
                      className="product-card__qty-input"
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                      min={1}
                      aria-label="Aantal"
                    />
                    <button className="product-card__qty-btn" onClick={handleIncrement} aria-label="Verhoog aantal">
                      <Plus size={14} />
                    </button>
                  </div>
                )}
                {renderAddToCart()}
              </div>
            </div>

            {renderStockIndicator()}
          </>
        )}
      </div>

    </Link>
  )
}
