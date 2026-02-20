'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import type { Product } from '@/payload-types'
import {
  Heart,
  Share2,
  ZoomIn,
  Award,
  Hash,
  Barcode,
  Package,
  Star,
  Layers,
  Truck,
  ShoppingCart,
  ClipboardList,
  Repeat,
  Undo2,
  CreditCard,
  ShieldCheck,
  FileText,
  List,
  Download,
  Ruler,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Minus,
} from 'lucide-react'

interface ProductTemplate1Props {
  product: Product
}

export default function ProductTemplate1({ product }: ProductTemplate1Props) {
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'downloads'>(
    'description',
  )
  const [showStickyATC, setShowStickyATC] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  // For grouped products - size quantities
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({})
  const [totalQty, setTotalQty] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [activeTier, setActiveTier] = useState(0)

  // Simple product quantity
  const [quantity, setQuantity] = useState(1)

  // Mobile accordion states
  const [accordionOpen, setAccordionOpen] = useState<string | null>('description')

  const isGrouped = product.productType === 'grouped'
  const childProducts =
    isGrouped && product.childProducts
      ? product.childProducts
          .map((child) => (typeof child.product === 'object' ? child.product : null))
          .filter((p) => p !== null)
      : []

  // Calculate volume pricing tier
  const volumeTiers = product.volumePricing || []
  const getTierPrice = (qty: number) => {
    if (volumeTiers.length === 0) return product.price

    for (let i = volumeTiers.length - 1; i >= 0; i--) {
      if (qty >= volumeTiers[i].minQuantity) {
        if (volumeTiers[i].discountPrice) return volumeTiers[i].discountPrice
        if (volumeTiers[i].discountPercentage) {
          return product.price * (1 - volumeTiers[i].discountPercentage / 100)
        }
      }
    }
    return product.price
  }

  // Update total when size quantities change
  useEffect(() => {
    const total = Object.values(sizeQuantities).reduce((sum, qty) => sum + qty, 0)
    setTotalQty(total)

    const price = getTierPrice(total)
    setTotalPrice(total * price)

    // Find active tier
    if (volumeTiers.length > 0) {
      for (let i = volumeTiers.length - 1; i >= 0; i--) {
        if (total >= volumeTiers[i].minQuantity) {
          setActiveTier(i)
          break
        }
      }
    }
  }, [sizeQuantities, volumeTiers])

  // Show sticky ATC after scrolling past main ATC button
  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 600
      setShowStickyATC(shouldShow)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const stepQty = (productId: string, delta: number) => {
    setSizeQuantities((prev) => {
      const current = prev[productId] || 0
      const newQty = Math.max(0, current + delta)
      return { ...prev, [productId]: newQty }
    })
  }

  const handleAddToCart = () => {
    if (isGrouped) {
      // Add all selected sizes to cart
      Object.entries(sizeQuantities).forEach(([productId, qty]) => {
        if (qty > 0) {
          const childProd = childProducts.find((p) => p.id === productId)
          if (childProd) {
            const unitPrice = getTierPrice(totalQty)
            addItem({
              id: childProd.id,
              title: childProd.title,
              slug: childProd.slug || '',
              price: childProd.price,
              quantity: qty,
              unitPrice: unitPrice,
              image:
                typeof childProd.images?.[0] === 'object' && childProd.images[0] !== null
                  ? childProd.images[0].url || undefined
                  : undefined,
              sku: childProd.sku || undefined,
              ean: childProd.ean || undefined,
              stock: childProd.stock || 0,
              minOrderQuantity: childProd.minOrderQuantity || undefined,
              orderMultiple: childProd.orderMultiple || undefined,
              maxOrderQuantity: childProd.maxOrderQuantity || undefined,
              parentProductId: product.id,
              parentProductTitle: product.title,
            })
          }
        }
      })
    } else {
      // Add simple product
      const unitPrice = product.salePrice || product.price
      addItem({
        id: product.id,
        title: product.title,
        slug: product.slug || '',
        price: product.price,
        quantity: quantity,
        unitPrice: unitPrice,
        image:
          typeof product.images?.[0] === 'object' && product.images[0] !== null
            ? product.images[0].url || undefined
            : undefined,
        sku: product.sku || undefined,
        ean: product.ean || undefined,
        stock: product.stock || 0,
      })
    }
  }

  const imageUrl =
    typeof product.images?.[0] === 'object' && product.images[0] !== null
      ? product.images[0].url
      : null

  // Calculate ratings
  const avgRating = 4.8 // TODO: Calculate from reviews
  const reviewCount = 47 // TODO: Get from reviews collection

  // Calculate savings
  const currentPrice = product.salePrice || product.price
  const oldPrice = product.compareAtPrice || (product.salePrice ? product.price : null)
  const savings = oldPrice ? oldPrice - currentPrice : 0
  const savingsPercent = oldPrice ? Math.round((savings / oldPrice) * 100) : 0

  const allImages = product.images || []
  const currentImage =
    allImages[imageIndex] && typeof allImages[imageIndex] === 'object' && allImages[imageIndex] !== null
      ? allImages[imageIndex].url
      : imageUrl

  return (
    <>
      <div className="product-template-1 max-w-[100vw] overflow-x-hidden pb-20">
        {/* MOBILE-FIRST: Product Header */}
        <div className="p-4 bg-[var(--color-surface,white)]">
          {/* Brand */}
          {product.brand && (
            <div className="text-[11px] font-bold uppercase text-[var(--color-primary)] tracking-wider mb-1.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {product.brand}
            </div>
          )}

          {/* Title */}
          <h1 className="font-heading text-[22px] md:text-3xl font-extrabold text-[var(--color-text-primary)] leading-tight tracking-tight mb-2">
            {product.title}
          </h1>

          {/* SKU / EAN / Packaging */}
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {product.sku && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Hash className="w-3 h-3" />
                Art. {product.sku}
              </span>
            )}
            {product.ean && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Barcode className="w-3 h-3" />
                EAN {product.ean}
              </span>
            )}
            {product.packaging && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Package className="w-3 h-3" />
                {product.packaging}
              </span>
            )}
          </div>

          {/* Rating - Mobile */}
          {reviewCount > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5"
                    fill={i <= Math.floor(avgRating) ? '#F59E0B' : 'none'}
                    style={{ color: '#F59E0B' }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>{avgRating.toFixed(1)}</strong> ({reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* MOBILE: Image Gallery - Swipeable */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '280px',
            background: 'var(--color-background, #F5F7FA)',
          }}
          className="md:h-96 lg:hidden"
        >
          {/* Badges */}
          {(product.badge || product.salePrice) && (
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                display: 'flex',
                gap: '6px',
                zIndex: 10,
              }}
            >
              {savingsPercent > 0 && (
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#FF6B6B',
                    color: 'white',
                  }}
                >
                  -{savingsPercent}%
                </span>
              )}
              {product.badge === 'popular' && (
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: 'var(--color-primary)',
                    color: 'white',
                  }}
                >
                  Bestseller
                </span>
              )}
              {product.badge === 'new' && (
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: 'var(--color-primary)',
                    color: 'white',
                  }}
                >
                  NIEUW
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              display: 'flex',
              gap: '6px',
              zIndex: 10,
            }}
          >
            <button
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Add to favorites"
            >
              <Heart className="w-4 h-4" style={{ color: 'var(--color-text-primary)' }} />
            </button>
            <button
              style={{
                width: '36px',
                height: '36px',
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4" style={{ color: 'var(--color-text-primary)' }} />
            </button>
          </div>

          {/* Image */}
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.06))',
                }}
              />
            ) : (
              <div style={{ fontSize: '80px' }}>📦</div>
            )}
          </div>

          {/* Image Dots */}
          {allImages.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '100px',
              }}
            >
              {allImages.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  style={{
                    width: imageIndex === idx ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '100px',
                    background: imageIndex === idx ? 'white' : 'rgba(255,255,255,0.5)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP: 2-Column Layout */}
        <div
          style={{
            display: 'none',
          }}
          className="lg:grid lg:grid-cols-[480px_1fr] lg:gap-12 lg:items-start lg:mb-12 lg:px-6"
        >
          {/* LEFT: Gallery */}
          <div className="gallery">
            {/* Main Image */}
            <div
              style={{
                width: '100%',
                height: '480px',
                background: 'var(--color-surface, white)',
                borderRadius: 'var(--border-radius, 20px)',
                border: '1px solid var(--color-border, #E8ECF1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Badges */}
              {(product.badge || product.salePrice) && (
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 10,
                  }}
                >
                  {savingsPercent > 0 && (
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: '#FF6B6B',
                        color: 'white',
                      }}
                    >
                      -{savingsPercent}%
                    </span>
                  )}
                  {product.badge === 'popular' && (
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: 'var(--color-primary)',
                        color: 'white',
                      }}
                    >
                      Bestseller
                    </span>
                  )}
                  {product.badge === 'new' && (
                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: 'var(--color-primary)',
                        color: 'white',
                      }}
                    >
                      NIEUW
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  display: 'flex',
                  gap: '8px',
                  zIndex: 10,
                }}
              >
                <button
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--color-surface, white)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Add to favorites"
                >
                  <Heart className="w-[18px] h-[18px]" style={{ color: 'var(--color-text-primary)' }} />
                </button>
                <button
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--color-surface, white)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Share product"
                >
                  <Share2 className="w-[18px] h-[18px]" style={{ color: 'var(--color-text-primary)' }} />
                </button>
              </div>

              {/* Image */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.06))',
                  }}
                />
              ) : (
                <div style={{ fontSize: '120px' }}>📦</div>
              )}

              {/* Zoom */}
              <div style={{ position: 'absolute', bottom: '16px', right: '16px' }}>
                <button
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--color-surface, white)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Zoom image"
                >
                  <ZoomIn className="w-[18px] h-[18px]" style={{ color: 'var(--color-text-muted)' }} />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                {product.images.slice(0, 5).map((img, idx) => {
                  const imgUrl = typeof img === 'object' && img !== null ? img.url : null
                  return (
                    <div
                      key={idx}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '12px',
                        background: 'var(--color-surface, white)',
                        border: idx === 0 ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: idx === 0 ? '0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent)' : 'none',
                      }}
                    >
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt={`${product.title} thumbnail ${idx + 1}`}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info - Desktop Only Content */}
          <div className="product-info">
            {/* Brand */}
            {product.brand && (
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                  letterSpacing: '0.05em',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Award className="w-[14px] h-[14px]" />
                {product.brand}
              </div>
            )}

            {/* Title */}
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '28px',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                marginBottom: '8px',
              }}
            >
              {product.title}
            </h1>

            {/* SKU / EAN / Packaging */}
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '12px',
                color: 'var(--color-text-muted)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {product.sku && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Hash className="w-[13px] h-[13px]" />
                  Art. {product.sku}
                </span>
              )}
              {product.ean && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Barcode className="w-[13px] h-[13px]" />
                  EAN {product.ean}
                </span>
              )}
              {product.packaging && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Package className="w-[13px] h-[13px]" />
                  {product.packaging}
                </span>
              )}
            </div>

            {/* Rating */}
            {reviewCount > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i <= Math.floor(avgRating) ? '#F59E0B' : 'none'}
                      style={{ color: '#F59E0B' }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>{avgRating.toFixed(1)}</strong> / 5 —{' '}
                  {reviewCount} beoordelingen
                </span>
              </div>
            )}

            {/* PRICE BLOCK - Will be duplicated for mobile */}
            <div
              style={{
                background: 'var(--color-surface, white)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius, 16px)',
                padding: '24px',
                marginBottom: '20px',
              }}
            >
              {/* Current Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '32px',
                    fontWeight: 800,
                    color: oldPrice ? '#FF6B6B' : 'var(--color-text-primary)',
                  }}
                >
                  €{currentPrice.toFixed(2)}
                </span>
                {oldPrice && (
                  <>
                    <span
                      style={{
                        fontSize: '18px',
                        color: 'var(--color-text-muted)',
                        textDecoration: 'line-through',
                        fontWeight: 400,
                      }}
                    >
                      €{oldPrice.toFixed(2)}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#FF6B6B',
                        background: '#FFF0F0',
                        padding: '3px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      Bespaar {savingsPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Price Meta */}
              {product.packaging && (
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  {product.packaging} · {product.taxClass === 'high' ? 'incl.' : 'excl.'} BTW
                </div>
              )}

              {/* Volume Pricing */}
              {volumeTiers.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Layers className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                    Staffelprijzen
                  </div>

                  {/* Volume Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${Math.min(4, volumeTiers.length)}, 1fr)`,
                      gap: '8px',
                    }}
                  >
                    {volumeTiers.map((tier, idx) => {
                      const tierPrice = tier.discountPrice || product.price * (1 - (tier.discountPercentage || 0) / 100)
                      const discount = tier.discountPercentage
                        ? `-${tier.discountPercentage}%`
                        : tier.discountPrice
                          ? `-${Math.round(((product.price - tier.discountPrice) / product.price) * 100)}%`
                          : 'standaard'

                      return (
                        <div
                          key={idx}
                          style={{
                            background: activeTier === idx ? 'color-mix(in srgb, var(--color-primary) 10%, white)' : 'var(--color-background, #F5F7FA)',
                            border: `1.5px solid ${activeTier === idx ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            borderRadius: '10px',
                            padding: '12px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                          }}
                        >
                          {idx === volumeTiers.length - 1 && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'var(--color-primary)',
                                color: 'white',
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Beste prijs
                            </div>
                          )}
                          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '4px' }}>
                            {tier.minQuantity}+
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-heading)',
                              fontSize: '16px',
                              fontWeight: 800,
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            €{tierPrice.toFixed(2)}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600, marginTop: '2px' }}>
                            {discount}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* STOCK */}
            {product.trackStock && product.stock !== undefined && product.stock > 0 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: '#E8F5E9',
                  borderRadius: '10px',
                  marginBottom: '20px',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#00C853',
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#2E7D32' }}>
                    Op voorraad — {product.stock} stuks beschikbaar
                  </div>
                  {product.leadTime && (
                    <div style={{ fontSize: '12px', color: '#558B2F', fontWeight: 400 }}>
                      Levertijd: {product.leadTime}
                    </div>
                  )}
                </div>
                <Truck className="w-4 h-4" style={{ marginLeft: 'auto', color: '#2E7D32' }} />
              </div>
            )}

            {/* SIZE SELECTOR (Grouped Products) */}
            {isGrouped && childProducts.length > 0 && (
              <div className="mb-6">
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Ruler className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  Selecteer maten en aantallen
                </div>

                {/* Size Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${childProducts.length}, 1fr)`,
                    gap: 0,
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'var(--color-surface, white)',
                  }}
                >
                  {childProducts.map((child, idx) => {
                    const qty = sizeQuantities[child.id] || 0
                    return (
                      <div
                        key={child.id}
                        style={{
                          borderRight: idx < childProducts.length - 1 ? '1.5px solid var(--color-border)' : 'none',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {/* Header */}
                        <div
                          style={{
                            padding: '10px',
                            textAlign: 'center',
                            background: 'var(--color-background, #F5F7FA)',
                            borderBottom: '1.5px solid var(--color-border)',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {child.title}
                        </div>

                        {/* Body */}
                        <div
                          style={{
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          {/* Quantity Input */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: `1.5px solid ${qty > 0 ? 'var(--color-primary)' : 'var(--color-border)'}`,
                              borderRadius: '8px',
                              overflow: 'hidden',
                              background: 'white',
                            }}
                          >
                            <button
                              onClick={() => stepQty(child.id, -1)}
                              style={{
                                width: '32px',
                                height: '36px',
                                border: 'none',
                                background: 'var(--color-background, #F5F7FA)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                color: 'var(--color-text-primary)',
                              }}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={qty}
                              onChange={(e) => {
                                const val = Math.max(0, parseInt(e.target.value) || 0)
                                setSizeQuantities((prev) => ({ ...prev, [child.id]: val }))
                              }}
                              style={{
                                width: '40px',
                                height: '36px',
                                border: 'none',
                                textAlign: 'center',
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                fontWeight: qty > 0 ? 700 : 500,
                                color: qty > 0 ? 'var(--color-primary)' : 'var(--color-text-primary)',
                                outline: 'none',
                              }}
                            />
                            <button
                              onClick={() => stepQty(child.id, 1)}
                              style={{
                                width: '32px',
                                height: '36px',
                                border: 'none',
                                background: 'var(--color-background, #F5F7FA)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                color: 'var(--color-text-primary)',
                              }}
                            >
                              +
                            </button>
                          </div>

                          {/* Stock */}
                          {child.stock && child.stock > 0 && (
                            <div
                              style={{
                                fontSize: '11px',
                                color: '#00C853',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              <CheckCircle className="w-[11px] h-[11px]" />
                              {child.stock} op voorraad
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Total */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'var(--color-background, #F5F7FA)',
                    borderRadius: '10px',
                    marginTop: '12px',
                    border: '1.5px solid var(--color-border)',
                  }}
                >
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>{totalQty}</strong> dozen totaal
                    {volumeTiers.length > 0 && totalQty > 0 && ' · staffelprijs van toepassing'}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    €{totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Simple Product Quantity */}
            {!isGrouped && (
              <div className="mb-5">
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  Aantal
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: 'white',
                  }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '44px',
                      height: '44px',
                      border: 'none',
                      background: 'var(--color-background, #F5F7FA)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      width: '60px',
                      height: '44px',
                      border: 'none',
                      textAlign: 'center',
                      fontFamily: 'monospace',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      width: '44px',
                      height: '44px',
                      border: 'none',
                      background: 'var(--color-background, #F5F7FA)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isGrouped && totalQty === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '16px',
                  background: isGrouped && totalQty === 0 ? '#CBD5E1' : 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, white))',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: isGrouped && totalQty === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: isGrouped && totalQty === 0 ? 'none' : '0 4px 20px color-mix(in srgb, var(--color-primary) 40%, transparent)',
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                Toevoegen aan winkelwagen
              </button>

              {/* Secondary Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '13px',
                    background: 'var(--color-surface, white)',
                    color: 'var(--color-text-primary)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '12px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <ClipboardList className="w-[18px] h-[18px]" />
                  Op bestellijst
                </button>
                <button
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '13px',
                    background: 'var(--color-surface, white)',
                    color: 'var(--color-text-primary)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '12px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Repeat className="w-[18px] h-[18px]" />
                  Herhaalbestelling
                </button>
              </div>
            </div>

            {/* TRUST SIGNALS */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                paddingTop: '20px',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <Truck className="w-4 h-4" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                Gratis verzending vanaf €150
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <Undo2 className="w-4 h-4" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                30 dagen retourrecht
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <CreditCard className="w-4 h-4" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                Op rekening bestellen
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                CE & ISO gecertificeerd
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE: Price + Stock + Actions */}
        <div className="p-4" className="lg:hidden">
          {/* PRICE BLOCK */}
          <div
            style={{
              background: 'var(--color-surface, white)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '26px',
                  fontWeight: 800,
                  color: oldPrice ? '#FF6B6B' : 'var(--color-text-primary)',
                }}
              >
                €{currentPrice.toFixed(2)}
              </span>
              {oldPrice && (
                <>
                  <span
                    style={{
                      fontSize: '16px',
                      color: 'var(--color-text-muted)',
                      textDecoration: 'line-through',
                      fontWeight: 400,
                    }}
                  >
                    €{oldPrice.toFixed(2)}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#FF6B6B',
                      background: '#FFF0F0',
                      padding: '3px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    -{savingsPercent}%
                  </span>
                </>
              )}
            </div>

            {product.packaging && (
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                {product.packaging} · {product.taxClass === 'high' ? 'incl.' : 'excl.'} BTW
              </div>
            )}

            {/* Volume Pricing - Mobile */}
            {volumeTiers.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Layers className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                  Staffelprijzen
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(3, volumeTiers.length)}, 1fr)`,
                    gap: '6px',
                  }}
                >
                  {volumeTiers.slice(0, 3).map((tier, idx) => {
                    const tierPrice = tier.discountPrice || product.price * (1 - (tier.discountPercentage || 0) / 100)
                    const discount = tier.discountPercentage
                      ? `-${tier.discountPercentage}%`
                      : tier.discountPrice
                        ? `-${Math.round(((product.price - tier.discountPrice) / product.price) * 100)}%`
                        : 'standaard'

                    return (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--color-background, #F5F7FA)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          padding: '8px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '2px' }}>
                          {tier.minQuantity}+
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '14px',
                            fontWeight: 800,
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          €{tierPrice.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--color-primary)', fontWeight: 600, marginTop: '1px' }}>
                          {discount}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* STOCK - Mobile */}
          {product.trackStock && product.stock !== undefined && product.stock > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px',
                background: '#E8F5E9',
                borderRadius: '10px',
                marginBottom: '16px',
                fontSize: '13px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  background: '#00C853',
                  borderRadius: '50%',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#2E7D32' }}>
                  Op voorraad — {product.stock} stuks
                </div>
              </div>
              <Truck className="w-4 h-4" style={{ color: '#2E7D32' }} />
            </div>
          )}

          {/* SIZE SELECTOR - Mobile (Grouped Products) */}
          {isGrouped && childProducts.length > 0 && (
            <div className="mb-5">
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Ruler className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                Selecteer maten
              </div>

              <div className="space-y-2">
                {childProducts.map((child) => {
                  const qty = sizeQuantities[child.id] || 0
                  return (
                    <div
                      key={child.id}
                      style={{
                        border: `1.5px solid ${qty > 0 ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: '10px',
                        padding: '12px',
                        background: qty > 0 ? 'color-mix(in srgb, var(--color-primary) 5%, white)' : 'var(--color-surface, white)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            {child.title}
                          </div>
                          {child.stock && child.stock > 0 && (
                            <div style={{ fontSize: '11px', color: '#00C853', fontWeight: 500, marginTop: '2px' }}>
                              {child.stock} op voorraad
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: `1.5px solid ${qty > 0 ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            borderRadius: '8px',
                            overflow: 'hidden',
                            background: 'white',
                          }}
                        >
                          <button
                            onClick={() => stepQty(child.id, -1)}
                            style={{
                              width: '36px',
                              height: '36px',
                              border: 'none',
                              background: 'var(--color-background, #F5F7FA)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            −
                          </button>
                          <div
                            style={{
                              width: '40px',
                              textAlign: 'center',
                              fontFamily: 'monospace',
                              fontSize: '14px',
                              fontWeight: qty > 0 ? 700 : 500,
                              color: qty > 0 ? 'var(--color-primary)' : 'var(--color-text-primary)',
                            }}
                          >
                            {qty}
                          </div>
                          <button
                            onClick={() => stepQty(child.id, 1)}
                            style={{
                              width: '36px',
                              height: '36px',
                              border: 'none',
                              background: 'var(--color-background, #F5F7FA)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Total - Mobile */}
              {totalQty > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'var(--color-background, #F5F7FA)',
                    borderRadius: '10px',
                    marginTop: '12px',
                    border: '1.5px solid var(--color-border)',
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>{totalQty}</strong> dozen totaal
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    €{totalPrice.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Simple Product Quantity - Mobile */}
          {!isGrouped && (
            <div className="mb-4">
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: '8px',
                }}
              >
                Aantal
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: 'white',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '44px',
                    height: '44px',
                    border: 'none',
                    background: 'var(--color-background, #F5F7FA)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '60px',
                    height: '44px',
                    border: 'none',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '44px',
                    height: '44px',
                    border: 'none',
                    background: 'var(--color-background, #F5F7FA)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Main CTA - Mobile */}
          <button
            onClick={handleAddToCart}
            disabled={isGrouped && totalQty === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '16px',
              background: isGrouped && totalQty === 0 ? '#CBD5E1' : 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, white))',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              fontWeight: 700,
              cursor: isGrouped && totalQty === 0 ? 'not-allowed' : 'pointer',
              boxShadow: isGrouped && totalQty === 0 ? 'none' : '0 4px 20px color-mix(in srgb, var(--color-primary) 40%, transparent)',
              marginBottom: '12px',
            }}
          >
            <ShoppingCart className="w-5 h-5" />
            Toevoegen aan winkelwagen
          </button>

          {/* Secondary Buttons - Mobile */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '12px',
                background: 'var(--color-surface, white)',
                color: 'var(--color-text-primary)',
                border: '1.5px solid var(--color-border)',
                borderRadius: '10px',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <ClipboardList className="w-4 h-4" />
              Bestellijst
            </button>
            <button
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '12px',
                background: 'var(--color-surface, white)',
                color: 'var(--color-text-primary)',
                border: '1.5px solid var(--color-border)',
                borderRadius: '10px',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Repeat className="w-4 h-4" />
              Herhalen
            </button>
          </div>

          {/* Trust Signals - Mobile */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              <Truck className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span>Gratis vanaf €150</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              <Undo2 className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span>30 dagen retour</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              <CreditCard className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span>Op rekening</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <span>CE & ISO</span>
            </div>
          </div>
        </div>

        {/* MOBILE: Accordion Tabs */}
        <div style={{ padding: '0 16px 16px' }} className="lg:hidden">
          {/* Description Accordion */}
          <div
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              marginBottom: '12px',
              overflow: 'hidden',
              background: 'var(--color-surface, white)',
            }}
          >
            <button
              onClick={() => setAccordionOpen(accordionOpen === 'description' ? null : 'description')}
              style={{
                width: '100%',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                Beschrijving
              </div>
              {accordionOpen === 'description' ? (
                <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
              ) : (
                <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
              )}
            </button>
            {accordionOpen === 'description' && (
              <div
                style={{
                  padding: '0 16px 16px',
                  borderTop: '1px solid var(--color-border)',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                }}
              >
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>Geen beschrijving beschikbaar.</p>
                )}
                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <ul style={{ listStyle: 'none', marginTop: '16px', paddingLeft: 0 }}>
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 0',
                          fontSize: '13px',
                        }}
                      >
                        <Check className="w-4 h-4" style={{ color: '#00C853', flexShrink: 0 }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Specifications Accordion */}
          {product.specifications && (
            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                marginBottom: '12px',
                overflow: 'hidden',
                background: 'var(--color-surface, white)',
              }}
            >
              <button
                onClick={() => setAccordionOpen(accordionOpen === 'specs' ? null : 'specs')}
                style={{
                  width: '100%',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <List className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  Specificaties
                </div>
                {accordionOpen === 'specs' ? (
                  <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                ) : (
                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                )}
              </button>
              {accordionOpen === 'specs' && (
                <div style={{ borderTop: '1px solid var(--color-border)' }}>
                  {Array.isArray(product.specifications) && product.specifications.map((specGroup: any, groupIdx: number) => (
                    <div key={groupIdx}>
                      {specGroup.group && (
                        <h4 style={{
                          padding: '12px 16px',
                          fontWeight: 700,
                          fontSize: '13px',
                          background: 'var(--color-background)',
                          borderBottom: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                        }}>
                          {specGroup.group}
                        </h4>
                      )}
                      {specGroup.attributes?.map((attr: any, attrIdx: number) => (
                        <div
                          key={attrIdx}
                          style={{
                            display: 'flex',
                            padding: '10px 16px',
                            borderBottom: attrIdx < specGroup.attributes.length - 1 ? '1px solid var(--color-border)' : 'none',
                            fontSize: '13px',
                            gap: '12px',
                          }}
                        >
                          <span style={{ flex: 1, color: 'var(--color-text-muted)', fontWeight: 500 }}>
                            {attr.name}
                          </span>
                          <span style={{ flex: 1, color: 'var(--color-text-primary)', fontWeight: 600, textAlign: 'right' }}>
                            {attr.value}{attr.unit ? ` ${attr.unit}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reviews Accordion */}
          {reviewCount > 0 && (
            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                marginBottom: '12px',
                overflow: 'hidden',
                background: 'var(--color-surface, white)',
              }}
            >
              <button
                onClick={() => setAccordionOpen(accordionOpen === 'reviews' ? null : 'reviews')}
                style={{
                  width: '100%',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  Reviews ({reviewCount})
                </div>
                {accordionOpen === 'reviews' ? (
                  <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                ) : (
                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                )}
              </button>
              {accordionOpen === 'reviews' && (
                <div
                  style={{
                    padding: '16px',
                    borderTop: '1px solid var(--color-border)',
                    fontSize: '14px',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Reviews worden hier getoond (TODO: Reviews collection)
                </div>
              )}
            </div>
          )}

          {/* Downloads Accordion */}
          {product.downloads && product.downloads.length > 0 && (
            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'var(--color-surface, white)',
              }}
            >
              <button
                onClick={() => setAccordionOpen(accordionOpen === 'downloads' ? null : 'downloads')}
                style={{
                  width: '100%',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  Downloads
                </div>
                {accordionOpen === 'downloads' ? (
                  <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                ) : (
                  <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                )}
              </button>
              {accordionOpen === 'downloads' && (
                <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {product.downloads.map((download, idx) => {
                      const file = typeof download === 'object' && download !== null ? download : null
                      if (!file || !file.url) return null

                      return (
                        <a
                          key={idx}
                          href={file.url}
                          download
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            background: 'var(--color-background, #F5F7FA)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          <Download className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{file.filename || 'Download'}</div>
                            {file.filesize && (
                              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                {(file.filesize / 1024 / 1024).toFixed(2)} MB
                              </div>
                            )}
                          </div>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* DESKTOP: TABS SECTION */}
        <div style={{ paddingTop: '48px', display: 'none' }} className="lg:block lg:px-6">
          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: 0,
              borderBottom: '2px solid var(--color-border)',
              marginBottom: '32px',
            }}
          >
            <button
              onClick={() => setActiveTab('description')}
              style={{
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: 600,
                color: activeTab === 'description' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                border: 'none',
                background: 'none',
                fontFamily: 'var(--font-body)',
                borderBottom: `2px solid ${activeTab === 'description' ? 'var(--color-primary)' : 'transparent'}`,
                marginBottom: '-2px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FileText className="w-4 h-4" />
              Beschrijving
            </button>
            {product.specifications && (
              <button
                onClick={() => setActiveTab('specs')}
                style={{
                  padding: '14px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: activeTab === 'specs' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  fontFamily: 'var(--font-body)',
                  borderBottom: `2px solid ${activeTab === 'specs' ? 'var(--color-primary)' : 'transparent'}`,
                  marginBottom: '-2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <List className="w-4 h-4" />
                Specificaties
              </button>
            )}
            {reviewCount > 0 && (
              <button
                onClick={() => setActiveTab('reviews')}
                style={{
                  padding: '14px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: activeTab === 'reviews' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  fontFamily: 'var(--font-body)',
                  borderBottom: `2px solid ${activeTab === 'reviews' ? 'var(--color-primary)' : 'transparent'}`,
                  marginBottom: '-2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Star className="w-4 h-4" />
                Reviews
                <span
                  style={{
                    background: activeTab === 'reviews' ? 'color-mix(in srgb, var(--color-primary) 10%, white)' : 'var(--color-background)',
                    padding: '2px 7px',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: activeTab === 'reviews' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }}
                >
                  {reviewCount}
                </span>
              </button>
            )}
            {product.downloads && product.downloads.length > 0 && (
              <button
                onClick={() => setActiveTab('downloads')}
                style={{
                  padding: '14px 24px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: activeTab === 'downloads' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  border: 'none',
                  background: 'none',
                  fontFamily: 'var(--font-body)',
                  borderBottom: `2px solid ${activeTab === 'downloads' ? 'var(--color-primary)' : 'transparent'}`,
                  marginBottom: '-2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Download className="w-4 h-4" />
                Downloads
              </button>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <div>
              {/* Description Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: product.specifications ? '2fr 1fr' : '1fr',
                  gap: '40px',
                }}
              >
                {/* Description Text */}
                <div>
                  {product.description && (
                    <>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '18px',
                          fontWeight: 700,
                          color: 'var(--color-text-primary)',
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Info className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        Over dit product
                      </h3>
                      <div
                        style={{
                          fontSize: '15px',
                          color: 'var(--color-text-secondary)',
                          lineHeight: 1.7,
                          marginBottom: '16px',
                        }}
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    </>
                  )}

                  {/* Features List */}
                  {product.features && product.features.length > 0 && (
                    <>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '18px',
                          fontWeight: 700,
                          color: 'var(--color-text-primary)',
                          marginBottom: '12px',
                          marginTop: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        Kenmerken
                      </h3>
                      <ul style={{ listStyle: 'none', marginBottom: '20px' }}>
                        {product.features.map((feature, idx) => (
                          <li
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 0',
                              fontSize: '14px',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            <Check className="w-[18px] h-[18px]" style={{ color: '#00C853', flexShrink: 0 }} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                {/* Specifications Card (sidebar) */}
                {product.specifications && (
                  <div>
                    <div
                      style={{
                        background: 'var(--color-surface, white)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--border-radius, 16px)',
                        overflow: 'hidden',
                      }}
                    >
                      <h3
                        style={{
                          padding: '16px 20px',
                          fontFamily: 'var(--font-heading)',
                          fontSize: '16px',
                          fontWeight: 700,
                          background: 'var(--color-background)',
                          borderBottom: '1px solid var(--color-border)',
                        }}
                      >
                        Productspecificaties
                      </h3>
                      {Array.isArray(product.specifications) && product.specifications.map((specGroup: any, groupIdx: number) => (
                        <div key={groupIdx}>
                          {specGroup.group && (
                            <h4 style={{
                              padding: '12px 20px',
                              fontWeight: 700,
                              fontSize: '14px',
                              background: 'var(--color-background)',
                              borderBottom: '1px solid var(--color-border)',
                            }}>
                              {specGroup.group}
                            </h4>
                          )}
                          {specGroup.attributes?.map((attr: any, attrIdx: number) => (
                            <div
                              key={attrIdx}
                              style={{
                                display: 'flex',
                                padding: '12px 20px',
                                borderBottom: '1px solid var(--color-border)',
                                fontSize: '14px',
                              }}
                            >
                              <span style={{ width: '160px', color: 'var(--color-text-muted)', fontWeight: 500, flexShrink: 0 }}>
                                {attr.name}
                              </span>
                              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                                {attr.value}{attr.unit ? ` ${attr.unit}` : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'specs' && product.specifications && (
            <div>
              <div
                style={{
                  background: 'var(--color-surface, white)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius, 16px)',
                  overflow: 'hidden',
                  maxWidth: '600px',
                }}
              >
                <h3
                  style={{
                    padding: '16px 20px',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '16px',
                    fontWeight: 700,
                    background: 'var(--color-background)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  Technische specificaties
                </h3>
                {Array.isArray(product.specifications) && product.specifications.map((specGroup: any, groupIdx: number) => (
                  <div key={groupIdx}>
                    {specGroup.group && (
                      <h4 style={{
                        padding: '12px 20px',
                        fontWeight: 700,
                        fontSize: '14px',
                        background: 'var(--color-background)',
                        borderBottom: '1px solid var(--color-border)',
                      }}>
                        {specGroup.group}
                      </h4>
                    )}
                    {specGroup.attributes?.map((attr: any, attrIdx: number) => (
                      <div
                        key={attrIdx}
                        style={{
                          display: 'flex',
                          padding: '12px 20px',
                          borderBottom: '1px solid var(--color-border)',
                          fontSize: '14px',
                        }}
                      >
                        <span style={{ width: '200px', color: 'var(--color-text-muted)', fontWeight: 500, flexShrink: 0 }}>
                          {attr.name}
                        </span>
                        <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                          {attr.value}{attr.unit ? ` ${attr.unit}` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ color: 'var(--color-text-muted)' }}>Reviews worden hier getoond (TODO: Reviews collection)</div>
          )}

          {activeTab === 'downloads' && product.downloads && product.downloads.length > 0 && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
                {product.downloads.map((download, idx) => {
                  const file = typeof download === 'object' && download !== null ? download : null
                  if (!file || !file.url) return null

                  return (
                    <a
                      key={idx}
                      href={file.url}
                      download
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        background: 'var(--color-surface, white)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--border-radius, 12px)',
                        textDecoration: 'none',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      <Download className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{file.filename || 'Download'}</div>
                        {file.filesize && (
                          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            {(file.filesize / 1024 / 1024).toFixed(2)} MB
                          </div>
                        )}
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div style={{ paddingTop: '64px', borderTop: '1px solid var(--color-border)', marginTop: '64px' }} className="px-4 lg:px-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
                className="md:text-2xl"
              >
                <Sparkles className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'var(--color-primary)' }} />
                Klanten bekeken ook
              </h2>
              <Link
                href="/shop"
                style={{
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                className="md:text-sm"
              >
                Bekijk alle producten
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </div>

            {/* Mobile: Horizontal Scroll */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                paddingBottom: '16px',
                scrollSnapType: 'x mandatory',
              }}
              className="lg:hidden -mx-4 px-4"
            >
              {product.relatedProducts.slice(0, 4).map((relProd, idx) => {
                const rp = typeof relProd === 'object' ? relProd : null
                if (!rp) return null

                const rpImg = typeof rp.images?.[0] === 'object' && rp.images[0] !== null ? rp.images[0].url : null

                return (
                  <Link
                    key={idx}
                    href={`/shop/${rp.slug}`}
                    style={{
                      minWidth: '200px',
                      background: 'var(--color-surface, white)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)',
                      textDecoration: 'none',
                      color: 'inherit',
                      scrollSnapAlign: 'start',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '160px',
                        background: 'var(--color-background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {rpImg ? (
                        <img src={rpImg} alt={rp.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ fontSize: '48px' }}>📦</div>
                      )}
                    </div>

                    <div style={{ padding: '14px' }}>
                      {rp.brand && (
                        <div
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: 'var(--color-primary)',
                            letterSpacing: '0.05em',
                            marginBottom: '4px',
                          }}
                        >
                          {rp.brand}
                        </div>
                      )}
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '13px',
                          color: 'var(--color-text-primary)',
                          marginBottom: '4px',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {rp.title}
                      </div>
                      {rp.sku && (
                        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                          Art. {rp.sku}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '16px',
                            fontWeight: 800,
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          €{rp.price.toFixed(2)}
                        </div>
                        <button
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent)',
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {rp.trackStock && rp.stock && rp.stock > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            color: '#00C853',
                            fontWeight: 500,
                            marginTop: '10px',
                            paddingTop: '10px',
                            borderTop: '1px solid var(--color-border)',
                          }}
                        >
                          <CheckCircle className="w-3 h-3" />
                          Op voorraad
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Desktop: Grid */}
            <div
              style={{
                display: 'none',
              }}
              className="lg:grid lg:grid-cols-4 lg:gap-5"
            >
              {product.relatedProducts.slice(0, 4).map((relProd, idx) => {
                const rp = typeof relProd === 'object' ? relProd : null
                if (!rp) return null

                const rpImg = typeof rp.images?.[0] === 'object' && rp.images[0] !== null ? rp.images[0].url : null

                return (
                  <Link
                    key={idx}
                    href={`/shop/${rp.slug}`}
                    style={{
                      background: 'var(--color-surface, white)',
                      borderRadius: 'var(--border-radius, 16px)',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)',
                      transition: 'all 0.35s',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '160px',
                        background: 'var(--color-background)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {rpImg ? (
                        <img src={rpImg} alt={rp.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      ) : (
                        <div style={{ fontSize: '48px' }}>📦</div>
                      )}
                    </div>

                    <div className="p-4">
                      {rp.brand && (
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: 'var(--color-primary)',
                            letterSpacing: '0.05em',
                            marginBottom: '4px',
                          }}
                        >
                          {rp.brand}
                        </div>
                      )}
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '14px',
                          color: 'var(--color-text-primary)',
                          marginBottom: '4px',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {rp.title}
                      </div>
                      {rp.sku && (
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                          Art. {rp.sku}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '18px',
                            fontWeight: 800,
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          €{rp.price.toFixed(2)}
                        </div>
                        <button
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent)',
                          }}
                        >
                          <Plus className="w-[18px] h-[18px]" />
                        </button>
                      </div>

                      {rp.trackStock && rp.stock && rp.stock > 0 && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: '#00C853',
                            fontWeight: 500,
                            marginTop: '10px',
                            paddingTop: '10px',
                            borderTop: '1px solid var(--color-border)',
                          }}
                        >
                          <CheckCircle className="w-3 h-3" />
                          Op voorraad
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* STICKY ADD TO CART BAR - Mobile & Tablet */}
      {showStickyATC && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderTop: '1px solid var(--color-border)',
            padding: '12px 16px',
            zIndex: 1000,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
          className="lg:hidden"
        >
          {/* Product Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {product.title}
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              €{currentPrice.toFixed(2)}
            </div>
          </div>

          {/* Quantity - Simple Product */}
          {!isGrouped && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid var(--color-border)',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'white',
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  background: 'var(--color-background, #F5F7FA)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div
                style={{
                  width: '32px',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                }}
              >
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  background: 'var(--color-background, #F5F7FA)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isGrouped && totalQty === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 20px',
              background: isGrouped && totalQty === 0 ? '#CBD5E1' : 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, white))',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontWeight: 700,
              cursor: isGrouped && totalQty === 0 ? 'not-allowed' : 'pointer',
              boxShadow: isGrouped && totalQty === 0 ? 'none' : '0 4px 16px color-mix(in srgb, var(--color-primary) 40%, transparent)',
              whiteSpace: 'nowrap',
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            {isGrouped ? `${totalQty} toevoegen` : 'Toevoegen'}
          </button>
        </div>
      )}
    </>
  )
}
