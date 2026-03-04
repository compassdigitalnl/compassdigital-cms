'use client'

import React from 'react'
import { Truck, ShieldCheck, Award, Package, RotateCcw, Leaf, Bell } from 'lucide-react'
import type { ProductMetaProps, StockStatus } from './types'
import { usePriceMode } from '../../../hooks/usePriceMode'

// Icon mapping for trust badges
const ICON_MAP = {
  truck: Truck,
  'shield-check': ShieldCheck,
  award: Award,
  package: Package,
  'rotate-ccw': RotateCcw,
  leaf: Leaf,
  bell: Bell,
}

export const ProductMeta: React.FC<ProductMetaProps> = ({
  product,
  className = '',
  showTrustBadges = true,
  variant = 'default',
}) => {
  const { displayPriceCents } = usePriceMode()

  // Format price from cents to EUR
  const formatPrice = (cents: number): string => {
    return `€ ${(cents / 100).toFixed(2).replace('.', ',')}`
  }

  // Calculate discount percentage — always based on original excl. prices
  const calculateDiscount = (): string | null => {
    if (!product.priceOriginal || product.priceOriginal <= product.price) return null
    const percentage = Math.round(
      ((product.priceOriginal - product.price) / product.priceOriginal) * 100,
    )
    return `-${percentage}%`
  }

  // Get stock message and class
  const getStockInfo = (): { className: string; message: string } => {
    if (!product.stock) return { className: 'ok', message: 'Op voorraad' }

    const { status, quantity, message } = product.stock

    // Use custom message if provided
    if (message) return { className: status, message }

    // Generate default messages
    if (status === 'ok') return { className: 'ok', message: 'Op voorraad' }
    if (status === 'low' && quantity)
      return { className: 'low', message: `Nog ${quantity} stuks op voorraad` }
    if (status === 'out') return { className: 'out', message: 'Tijdelijk uitverkocht' }

    return { className: status, message: '' }
  }

  // Render star rating (always 5 stars, filled)
  const renderStars = (): string => {
    return '★★★★★'
  }

  // Get icon component for trust badge
  const getIconComponent = (iconName: string) => {
    return ICON_MAP[iconName as keyof typeof ICON_MAP]
  }

  const stockInfo = getStockInfo()
  const discount = calculateDiscount()
  const isCompact = variant === 'compact'

  return (
    <div className={`product-meta ${className}`}>
      {/* Category breadcrumb */}
      <div className="prod-cat" aria-label="Product category">
        {product.category}
      </div>

      {/* Product title */}
      <h1
        className="prod-title"
        style={
          isCompact
            ? {
                fontSize: '24px',
              }
            : undefined
        }
      >
        {product.title}
      </h1>

      {/* Rating */}
      {product.rating && (
        <div className="prod-rating" role="group" aria-label="Product rating">
          <span className="prod-stars" aria-hidden="true">
            {renderStars()}
          </span>
          <span className="prod-rating-value">{product.rating.value.toFixed(1)}</span>
          <span className="prod-count">
            (
            <a
              href={product.rating.reviewsUrl || '#reviews'}
              aria-label={`${product.rating.count} klantbeoordelingen`}
            >
              {product.rating.count} reviews
            </a>
            )
          </span>
        </div>
      )}

      {/* Short description */}
      {product.shortDescription && (
        <p
          className="prod-short"
          style={
            isCompact
              ? {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }
              : undefined
          }
        >
          {product.shortDescription}
        </p>
      )}

      {/* Stock indicator */}
      <div className={`stock-indicator ${stockInfo.className}`} role="status" aria-live="polite">
        <span className="stock-dot" aria-hidden="true"></span>
        {stockInfo.message}
      </div>

      {/* Price display */}
      <div className="price-display" role="region" aria-label="Prijs informatie">
        <div className="price-row">
          <span
            className="price-current"
            aria-label="Huidige prijs"
            style={
              isCompact
                ? {
                    fontSize: '28px',
                  }
                : undefined
            }
          >
            {formatPrice(displayPriceCents(product.price) ?? product.price)}
          </span>
          {product.priceOriginal && product.priceOriginal > product.price && (
            <>
              <span className="price-original" aria-label="Oorspronkelijke prijs">
                {formatPrice(displayPriceCents(product.priceOriginal) ?? product.priceOriginal)}
              </span>
              {discount && (
                <span className="price-save" aria-label={`${discount.replace('-', '')} korting`}>
                  {discount}
                </span>
              )}
            </>
          )}
        </div>
        {product.priceNote && <div className="price-note">{product.priceNote}</div>}
      </div>

      {/* Trust badges */}
      {showTrustBadges &&
        !isCompact &&
        product.trustBadges &&
        product.trustBadges.length > 0 && (
          <div className="trust-badges">
            {product.trustBadges.map((badge, index) => {
              const IconComponent = getIconComponent(badge.icon)

              return (
                <div key={index} className="trust-badge">
                  {IconComponent && <IconComponent className="h-4 w-4 text-theme-teal" />}
                  {badge.label}
                </div>
              )
            })}
          </div>
        )}
    </div>
  )
}
