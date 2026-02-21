'use client'
import React from 'react'
import Link from 'next/link'
import { Icon } from '@/branches/shared/components/common/Icon'
import type { ProductEmbedBlock, Product } from '@/payload-types'

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
      style={{
        background: 'white',
        border: '1.5px solid #E8ECF1',
        borderRadius: '14px',
        padding: '20px',
        margin: '24px 0',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        transition: 'all 0.25s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#00897B'
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.04)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E8ECF1'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Product Image/Emoji */}
      <div
        style={{
          width: '80px',
          height: '80px',
          background: productImage ? `url(${productImage}) center/cover` : '#F1F4F8',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          flexShrink: 0,
        }}
      >
        {!productImage && productEmoji}
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Brand */}
        {prod.brand && (
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#00897B',
            }}
          >
            {typeof prod.brand === 'object' ? prod.brand.name : prod.brand}
          </div>
        )}

        {/* Product Name */}
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '15px',
            fontWeight: 800,
            color: '#0A1628',
            margin: '2px 0',
          }}
        >
          {prod.title}
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: '13px',
              color: '#94A3B8',
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        )}
      </div>

      {/* Price & Button */}
      {(showPrice || showButton) && (
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {showPrice && (
            <>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#0A1628',
                }}
              >
                {formatPrice(prod.price)}
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>per stuk</div>
            </>
          )}

          {showButton && (
            <Link
              href={`/products/${prod.slug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                marginTop: '8px',
                padding: '8px 16px',
                background: '#00897B',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0A1628'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#00897B'
              }}
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
