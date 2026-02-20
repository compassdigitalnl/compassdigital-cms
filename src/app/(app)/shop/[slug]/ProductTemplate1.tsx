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
      <div className="product-template-1 pb-20 max-w-[100vw] overflow-x-hidden">
        {/* MOBILE-FIRST: Product Header */}
        <div className="px-4 md:px-6 py-4 bg-white">
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
          <div className="font-mono text-[11px] text-[var(--color-text-muted)] mb-3 flex items-center gap-2 flex-wrap">
            {product.sku && (
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                Art. {product.sku}
              </span>
            )}
            {product.ean && (
              <span className="flex items-center gap-1">
                <Barcode className="w-3 h-3" />
                EAN {product.ean}
              </span>
            )}
            {product.packaging && (
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                {product.packaging}
              </span>
            )}
          </div>

          {/* Rating - Mobile */}
          {reviewCount > 0 && (
            <div
              className="flex items-center gap-[6px] mb-4"
            >
              <div className="flex gap-[2px]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5"
                    fill={i <= Math.floor(avgRating) ? '#F59E0B' : 'none'}
                    style={{ color: '#F59E0B' }}
                  />
                ))}
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">
                <strong className="text-[var(--color-text-primary)]">{avgRating.toFixed(1)}</strong> ({reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* MOBILE: Image Gallery - Swipeable */}
        <div className="relative w-full h-[280px] md:h-96 lg:hidden bg-[var(--color-background,#F5F7FA)]">
          {/* Badges */}
          {(product.badge || product.salePrice) && (
            <div className="absolute top-3 left-3 flex gap-1.5 z-10">
              {savingsPercent > 0 && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FF6B6B] text-white">
                  -{savingsPercent}%
                </span>
              )}
              {product.badge === 'popular' && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--color-primary)] text-white">
                  Bestseller
                </span>
              )}
              {product.badge === 'new' && (
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--color-primary)] text-white">
                  NIEUW
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="absolute top-3 right-3 flex gap-1.5 z-10">
            <button
              className="w-9 h-9 bg-white/95 border border-[var(--color-border)] rounded-lg flex items-center justify-center cursor-pointer active:opacity-80"
              aria-label="Add to favorites"
            >
              <Heart className="w-4 h-4 text-[var(--color-text-primary)]" />
            </button>
            <button
              className="w-9 h-9 bg-white/95 border border-[var(--color-border)] rounded-lg flex items-center justify-center cursor-pointer active:opacity-80"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4 text-[var(--color-text-primary)]" />
            </button>
          </div>

          {/* Image */}
          <div
            className="w-full h-full flex items-center justify-center p-5"
          >
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.title}
                className="max-width-full max-height-full object-contain"
              />
            ) : (
              <div className="text-[80px]">📦</div>
            )}
          </div>

          {/* Image Dots */}
          {allImages.length > 1 && (
            <div
              className="absolute flex gap-[6px] py-2 px-3 rounded-[100px]"
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
          className="hidden"
          className="lg:grid lg:grid-cols-[480px_1fr] lg:gap-12 lg:items-start lg:mb-12 lg:px-6"
        >
          {/* LEFT: Gallery */}
          <div className="gallery">
            {/* Main Image */}
            <div
              className="w-full h-[480px] bg-[var(--color-surface] rounded-[var(--border-radiuspx] border-[1px] flex items-center justify-center relative overflow-hidden"
            >
              {/* Badges */}
              {(product.badge || product.salePrice) && (
                <div
                  className="absolute flex gap-2"
                >
                  {savingsPercent > 0 && (
                    <span
                      className="py-[6px] px-3 rounded-lg text-xs font-bold text-white"
                    >
                      -{savingsPercent}%
                    </span>
                  )}
                  {product.badge === 'popular' && (
                    <span
                      className="py-[6px] px-3 rounded-lg text-xs font-bold bg-[var(--color-primary)] text-white"
                    >
                      Bestseller
                    </span>
                  )}
                  {product.badge === 'new' && (
                    <span
                      className="py-[6px] px-3 rounded-lg text-xs font-bold bg-[var(--color-primary)] text-white"
                    >
                      NIEUW
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div
                className="absolute flex gap-2"
              >
                <button
                  className="w-[40px] h-[40px] bg-[var(--color-surface] border-[1px] rounded-xl flex items-center justify-center cursor-pointer"
                  aria-label="Add to favorites"
                >
                  <Heart className="w-[18px] h-[18px]" className="text-[var(--color-text-primary)]" />
                </button>
                <button
                  className="w-[40px] h-[40px] bg-[var(--color-surface] border-[1px] rounded-xl flex items-center justify-center cursor-pointer"
                  aria-label="Share product"
                >
                  <Share2 className="w-[18px] h-[18px]" className="text-[var(--color-text-primary)]" />
                </button>
              </div>

              {/* Image */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="max-width-full max-height-full object-contain"
                />
              ) : (
                <div className="text-[120px]">📦</div>
              )}

              {/* Zoom */}
              <div className="absolute">
                <button
                  className="w-[40px] h-[40px] bg-[var(--color-surface] border-[1px] rounded-xl flex items-center justify-center cursor-pointer"
                  aria-label="Zoom image"
                >
                  <ZoomIn className="w-[18px] h-[18px]" className="text-[var(--color-text-muted)]" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-[10px] mt-3">
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
                          className="max-width-full max-height-full object-contain"
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
                className="text-xs font-bold uppercase text-[var(--color-primary)] tracking-wider mb-2 flex items-center gap-[6px]"
              >
                <Award className="w-[14px] h-[14px]" />
                {product.brand}
              </div>
            )}

            {/* Title */}
            <h1
              className="font-heading text-[28px] font-extrabold text-[var(--color-text-primary)] leading-1.2 tracking-tight mb-2"
            >
              {product.title}
            </h1>

            {/* SKU / EAN / Packaging */}
            <div
              className="font-mono text-xs text-[var(--color-text-muted)] mb-4 flex items-center gap-3"
            >
              {product.sku && (
                <span className="flex items-center gap-1">
                  <Hash className="w-[13px] h-[13px]" />
                  Art. {product.sku}
                </span>
              )}
              {product.ean && (
                <span className="flex items-center gap-1">
                  <Barcode className="w-[13px] h-[13px]" />
                  EAN {product.ean}
                </span>
              )}
              {product.packaging && (
                <span className="flex items-center gap-1">
                  <Package className="w-[13px] h-[13px]" />
                  {product.packaging}
                </span>
              )}
            </div>

            {/* Rating */}
            {reviewCount > 0 && (
              <div
                className="flex items-center gap-2 mb-5 pb-5 border-bottom-[1px]"
              >
                <div className="flex gap-[2px]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i <= Math.floor(avgRating) ? '#F59E0B' : 'none'}
                      style={{ color: '#F59E0B' }}
                    />
                  ))}
                </div>
                <span className="text-[13px] text-[var(--color-text-muted)]">
                  <strong className="text-[var(--color-text-primary)]">{avgRating.toFixed(1)}</strong> / 5 —{' '}
                  {reviewCount} beoordelingen
                </span>
              </div>
            )}

            {/* PRICE BLOCK - Will be duplicated for mobile */}
            <div
              className="bg-[var(--color-surface] border-[1px] rounded-[var(--border-radiuspx] p-6 mb-5"
            >
              {/* Current Price */}
              <div className="flex items-baseline gap-3 mb-1">
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
                      className="text-lg text-[var(--color-text-muted)] line-through font-normal"
                    >
                      €{oldPrice.toFixed(2)}
                    </span>
                    <span
                      className="text-[13px] font-bold py-[3px] px-[10px] rounded-md"
                    >
                      Bespaar {savingsPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Price Meta */}
              {product.packaging && (
                <div className="text-xs text-[var(--color-text-muted)] mb-4">
                  {product.packaging} · {product.taxClass === 'high' ? 'incl.' : 'excl.'} BTW
                </div>
              )}

              {/* Volume Pricing */}
              {volumeTiers.length > 0 && (
                <div className="mt-4">
                  <div
                    className="text-[13px] font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-[6px]"
                  >
                    <Layers className="w-4 h-4" className="text-[var(--color-primary)]" />
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
                              className="absolute bg-[var(--color-primary)] text-white text-[10px] font-bold py-[2px] px-2 rounded-[4px] whitespace-nowrap"
                            >
                              Beste prijs
                            </div>
                          )}
                          <div className="text-xs text-[var(--color-text-muted)] font-medium mb-1">
                            {tier.minQuantity}+
                          </div>
                          <div
                            className="font-heading text-base font-extrabold text-[var(--color-text-primary)]"
                          >
                            €{tierPrice.toFixed(2)}
                          </div>
                          <div className="text-[11px] text-[var(--color-primary)] font-semibold mt-[2px]">
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
                className="flex items-center gap-2 py-3 px-4 rounded-xl mb-5"
              >
                <span
                  className="w-[8px] h-[8px] rounded-full flex-shrink-0"
                />
                <div>
                  <div className="text-[13px] font-semibold">
                    Op voorraad — {product.stock} stuks beschikbaar
                  </div>
                  {product.leadTime && (
                    <div className="text-xs font-normal">
                      Levertijd: {product.leadTime}
                    </div>
                  )}
                </div>
                <Truck className="w-4 h-4" className="ml-[autopx]" />
              </div>
            )}

            {/* SIZE SELECTOR (Grouped Products) */}
            {isGrouped && childProducts.length > 0 && (
              <div className="mb-6">
                <div
                  className="text-sm font-bold text-[var(--color-text-primary)] mb-[10px] flex items-center gap-[6px]"
                >
                  <Ruler className="w-4 h-4" className="text-[var(--color-primary)]" />
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
                          className="p-[10px] text-center bg-[var(--color-background] text-[13px] font-bold text-[var(--color-text-primary)]"
                        >
                          {child.title}
                        </div>

                        {/* Body */}
                        <div
                          className="p-3 flex flex-col gap-2 items-center"
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
                              className="w-[32px] h-[36px] border-none bg-[var(--color-background] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
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
                              className="w-[32px] h-[36px] border-none bg-[var(--color-background] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
                            >
                              +
                            </button>
                          </div>

                          {/* Stock */}
                          {child.stock && child.stock > 0 && (
                            <div
                              className="text-[11px] font-medium flex items-center gap-[3px]"
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
                  className="flex items-center justify-between py-3 px-4 bg-[var(--color-background] rounded-xl mt-3"
                >
                  <div className="text-[13px] text-[var(--color-text-muted)]">
                    <strong className="text-[var(--color-text-primary)]">{totalQty}</strong> dozen totaal
                    {volumeTiers.length > 0 && totalQty > 0 && ' · staffelprijs van toepassing'}
                  </div>
                  <div
                    className="font-heading text-lg font-extrabold text-[var(--color-text-primary)]"
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
                  className="text-sm font-bold text-[var(--color-text-primary)] mb-2"
                >
                  Aantal
                </div>
                <div
                  className="inline-flex items-center rounded-xl overflow-hidden bg-white"
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-[44px] h-[44px] border-none bg-[var(--color-background] cursor-pointer flex items-center justify-center text-lg text-[var(--color-text-primary)]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-[60px] h-[44px] border-none text-center font-mono text-base font-bold text-[var(--color-text-primary)]"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-[44px] h-[44px] border-none bg-[var(--color-background] cursor-pointer flex items-center justify-center text-lg text-[var(--color-text-primary)]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-[10px] mb-5">
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
              <div className="flex gap-[10px]">
                <button
                  className="flex-1 flex items-center justify-center gap-2 p-[13px] bg-[var(--color-surface] text-[var(--color-text-primary)] rounded-xl font-body text-sm font-semibold cursor-pointer"
                >
                  <ClipboardList className="w-[18px] h-[18px]" />
                  Op bestellijst
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 p-[13px] bg-[var(--color-surface] text-[var(--color-text-primary)] rounded-xl font-body text-sm font-semibold cursor-pointer"
                >
                  <Repeat className="w-[18px] h-[18px]" />
                  Herhaalbestelling
                </button>
              </div>
            </div>

            {/* TRUST SIGNALS */}
            <div
              className="grid gap-[10px] pt-5 border-top-[1px]"
            >
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <Truck className="w-4 h-4" className="text-[var(--color-primary)] flex-shrink-0" />
                Gratis verzending vanaf €150
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <Undo2 className="w-4 h-4" className="text-[var(--color-primary)] flex-shrink-0" />
                30 dagen retourrecht
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <CreditCard className="w-4 h-4" className="text-[var(--color-primary)] flex-shrink-0" />
                Op rekening bestellen
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <ShieldCheck className="w-4 h-4" className="text-[var(--color-primary)] flex-shrink-0" />
                CE & ISO gecertificeerd
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE: Price + Stock + Actions */}
        <div className="px-4 md:px-6 lg:hidden">
          {/* PRICE BLOCK */}
          <div className="bg-white border border-[var(--color-border)] rounded-xl p-4 mb-4">
            <div className="flex items-baseline gap-2 mb-1">
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
                    className="text-base text-[var(--color-text-muted)] line-through font-normal"
                  >
                    €{oldPrice.toFixed(2)}
                  </span>
                  <span
                    className="text-[11px] font-bold py-[3px] px-2 rounded-[4px]"
                  >
                    -{savingsPercent}%
                  </span>
                </>
              )}
            </div>

            {product.packaging && (
              <div className="text-[11px] text-[var(--color-text-muted)] mb-3">
                {product.packaging} · {product.taxClass === 'high' ? 'incl.' : 'excl.'} BTW
              </div>
            )}

            {/* Volume Pricing - Mobile */}
            {volumeTiers.length > 0 && (
              <div className="mt-3">
                <div
                  className="text-xs font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-1"
                >
                  <Layers className="w-3.5 h-3.5" className="text-[var(--color-primary)]" />
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
                        className="bg-[var(--color-background] border-[1px] rounded-lg p-2 text-center"
                      >
                        <div className="text-[10px] text-[var(--color-text-muted)] font-medium mb-[2px]">
                          {tier.minQuantity}+
                        </div>
                        <div
                          className="font-heading text-sm font-extrabold text-[var(--color-text-primary)]"
                        >
                          €{tierPrice.toFixed(2)}
                        </div>
                        <div className="text-[9px] text-[var(--color-primary)] font-semibold mt-[1px]">
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
              className="flex items-center gap-2 p-3 rounded-xl mb-4 text-[13px]"
            >
              <span
                className="w-[6px] h-[6px] rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <div className="font-semibold">
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
                className="text-[13px] font-bold text-[var(--color-text-primary)] mb-[10px] flex items-center gap-[6px]"
              >
                <Ruler className="w-4 h-4" className="text-[var(--color-primary)]" />
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
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-[13px] font-bold text-[var(--color-text-primary)]">
                            {child.title}
                          </div>
                          {child.stock && child.stock > 0 && (
                            <div className="text-[11px] font-medium mt-[2px]">
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
                            className="w-[36px] h-[36px] border-none bg-[var(--color-background] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
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
                            className="w-[36px] h-[36px] border-none bg-[var(--color-background] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
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
                  className="flex items-center justify-between p-3 bg-[var(--color-background] rounded-xl mt-3"
                >
                  <div className="text-xs text-[var(--color-text-muted)]">
                    <strong className="text-[var(--color-text-primary)]">{totalQty}</strong> dozen totaal
                  </div>
                  <div
                    className="font-heading text-lg font-extrabold text-[var(--color-text-primary)]"
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
                className="text-[13px] font-bold text-[var(--color-text-primary)] mb-2"
              >
                Aantal
              </div>
              <div
                className="inline-flex items-center rounded-xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-[44px] h-[44px] border-none bg-[var(--color-background] cursor-pointer flex items-center justify-center text-base text-[var(--color-text-primary)]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-[60px] h-[44px] border-none text-center font-mono text-base font-bold text-[var(--color-text-primary)]"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-[44px] h-[44px] border-none bg-[var(--color-background] cursor-pointer flex items-center justify-center text-base text-[var(--color-text-primary)]"
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
          <div className="flex gap-2 mb-4">
            <button
              className="flex-1 flex items-center justify-center gap-[6px] p-3 bg-[var(--color-surface] text-[var(--color-text-primary)] rounded-xl font-body text-[13px] font-semibold cursor-pointer"
            >
              <ClipboardList className="w-4 h-4" />
              Bestellijst
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-[6px] p-3 bg-[var(--color-surface] text-[var(--color-text-primary)] rounded-xl font-body text-[13px] font-semibold cursor-pointer"
            >
              <Repeat className="w-4 h-4" />
              Herhalen
            </button>
          </div>

          {/* Trust Signals - Mobile */}
          <div
            className="grid gap-2 pt-4 border-top-[1px]"
          >
            <div className="flex items-center gap-[6px] text-[11px] text-[var(--color-text-secondary)]">
              <Truck className="w-3.5 h-3.5" className="text-[var(--color-primary)] flex-shrink-0" />
              <span>Gratis vanaf €150</span>
            </div>
            <div className="flex items-center gap-[6px] text-[11px] text-[var(--color-text-secondary)]">
              <Undo2 className="w-3.5 h-3.5" className="text-[var(--color-primary)] flex-shrink-0" />
              <span>30 dagen retour</span>
            </div>
            <div className="flex items-center gap-[6px] text-[11px] text-[var(--color-text-secondary)]">
              <CreditCard className="w-3.5 h-3.5" className="text-[var(--color-primary)] flex-shrink-0" />
              <span>Op rekening</span>
            </div>
            <div className="flex items-center gap-[6px] text-[11px] text-[var(--color-text-secondary)]">
              <ShieldCheck className="w-3.5 h-3.5" className="text-[var(--color-primary)] flex-shrink-0" />
              <span>CE & ISO</span>
            </div>
          </div>
        </div>

        {/* MOBILE: Accordion Tabs */}
        <div className="px-4 md:px-6 pb-4 lg:hidden">
          {/* Description Accordion */}
          <div className="border border-[var(--color-border)] rounded-xl mb-3 overflow-hidden bg-white">
            <button
              onClick={() => setAccordionOpen(accordionOpen === 'description' ? null : 'description')}
              className="w-full p-4 flex items-center justify-between bg-none border-none cursor-pointer text-sm font-bold text-[var(--color-text-primary)]"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" className="text-[var(--color-primary)]" />
                Beschrijving
              </div>
              {accordionOpen === 'description' ? (
                <ChevronUp className="w-4 h-4" className="text-[var(--color-text-muted)]" />
              ) : (
                <ChevronDown className="w-4 h-4" className="text-[var(--color-text-muted)]" />
              )}
            </button>
            {accordionOpen === 'description' && (
              <div
                className="py-0 px-4 border-top-[1px] text-sm leading-1.7 text-[var(--color-text-secondary)]"
              >
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>Geen beschrijving beschikbaar.</p>
                )}
                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <ul className="mt-4 pl-0">
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 py-[6px] px-0 text-[13px]"
                      >
                        <Check className="w-4 h-4" className="flex-shrink-0" />
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
              className="border-[1px] rounded-xl mb-3 overflow-hidden bg-[var(--color-surface]"
            >
              <button
                onClick={() => setAccordionOpen(accordionOpen === 'specs' ? null : 'specs')}
                className="w-full p-4 flex items-center justify-between bg-none border-none cursor-pointer text-sm font-bold text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4" className="text-[var(--color-primary)]" />
                  Specificaties
                </div>
                {accordionOpen === 'specs' ? (
                  <ChevronUp className="w-4 h-4" className="text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronDown className="w-4 h-4" className="text-[var(--color-text-muted)]" />
                )}
              </button>
              {accordionOpen === 'specs' && (
                <div className="border-top-[1px]">
                  {Array.isArray(product.specifications) && product.specifications.map((specGroup: any, groupIdx: number) => (
                    <div key={groupIdx}>
                      {specGroup.group && (
                        <h4 className="py-3 px-4 font-bold text-[13px] bg-[var(--color-background)] border-bottom-[1px] text-[var(--color-text-primary)]">
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
                          <span className="flex-1 text-[var(--color-text-muted)] font-medium">
                            {attr.name}
                          </span>
                          <span className="flex-1 text-[var(--color-text-primary)] font-semibold text-right">
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
              className="border-[1px] rounded-xl mb-3 overflow-hidden bg-[var(--color-surface]"
            >
              <button
                onClick={() => setAccordionOpen(accordionOpen === 'reviews' ? null : 'reviews')}
                className="w-full p-4 flex items-center justify-between bg-none border-none cursor-pointer text-sm font-bold text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" className="text-[var(--color-primary)]" />
                  Reviews ({reviewCount})
                </div>
                {accordionOpen === 'reviews' ? (
                  <ChevronUp className="w-4 h-4" className="text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronDown className="w-4 h-4" className="text-[var(--color-text-muted)]" />
                )}
              </button>
              {accordionOpen === 'reviews' && (
                <div
                  className="p-4 border-top-[1px] text-sm text-[var(--color-text-muted)]"
                >
                  Reviews worden hier getoond (TODO: Reviews collection)
                </div>
              )}
            </div>
          )}

          {/* Downloads Accordion */}
          {product.downloads && product.downloads.length > 0 && (
            <div
              className="border-[1px] rounded-xl overflow-hidden bg-[var(--color-surface]"
            >
              <button
                onClick={() => setAccordionOpen(accordionOpen === 'downloads' ? null : 'downloads')}
                className="w-full p-4 flex items-center justify-between bg-none border-none cursor-pointer text-sm font-bold text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" className="text-[var(--color-primary)]" />
                  Downloads
                </div>
                {accordionOpen === 'downloads' ? (
                  <ChevronUp className="w-4 h-4" className="text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronDown className="w-4 h-4" className="text-[var(--color-text-muted)]" />
                )}
              </button>
              {accordionOpen === 'downloads' && (
                <div className="p-4 border-top-[1px]">
                  <div className="flex flex-col gap-3">
                    {product.downloads.map((download, idx) => {
                      const file = typeof download === 'object' && download !== null ? download : null
                      if (!file || !file.url) return null

                      return (
                        <a
                          key={idx}
                          href={file.url}
                          download
                          className="flex items-center gap-3 p-3 bg-[var(--color-background] border-[1px] rounded-xl no-underline text-[var(--color-text-primary)]"
                        >
                          <Download className="w-4 h-4" className="text-[var(--color-primary)]" />
                          <div className="flex-1">
                            <div className="font-semibold text-[13px]">{file.filename || 'Download'}</div>
                            {file.filesize && (
                              <div className="text-[11px] text-[var(--color-text-muted)]">
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
        <div className="pt-12 hidden" className="lg:block lg:px-6">
          {/* Tab Navigation */}
          <div
            className="flex gap-0 border-bottom-[2px] mb-8"
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
                        className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2"
                      >
                        <Info className="w-5 h-5" className="text-[var(--color-primary)]" />
                        Over dit product
                      </h3>
                      <div
                        className="text-[15px] text-[var(--color-text-secondary)] leading-1.7 mb-4"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    </>
                  )}

                  {/* Features List */}
                  {product.features && product.features.length > 0 && (
                    <>
                      <h3
                        className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-3 mt-6 flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" className="text-[var(--color-primary)]" />
                        Kenmerken
                      </h3>
                      <ul className="mb-5">
                        {product.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-[10px] py-2 px-0 text-sm text-[var(--color-text-primary)]"
                          >
                            <Check className="w-[18px] h-[18px]" className="flex-shrink-0" />
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
                      className="bg-[var(--color-surface] border-[1px] rounded-[var(--border-radiuspx] overflow-hidden"
                    >
                      <h3
                        className="py-4 px-5 font-heading text-base font-bold bg-[var(--color-background)] border-bottom-[1px]"
                      >
                        Productspecificaties
                      </h3>
                      {Array.isArray(product.specifications) && product.specifications.map((specGroup: any, groupIdx: number) => (
                        <div key={groupIdx}>
                          {specGroup.group && (
                            <h4 className="py-3 px-5 font-bold text-sm bg-[var(--color-background)] border-bottom-[1px]">
                              {specGroup.group}
                            </h4>
                          )}
                          {specGroup.attributes?.map((attr: any, attrIdx: number) => (
                            <div
                              key={attrIdx}
                              className="flex py-3 px-5 border-bottom-[1px] text-sm"
                            >
                              <span className="w-[160px] text-[var(--color-text-muted)] font-medium flex-shrink-0">
                                {attr.name}
                              </span>
                              <span className="text-[var(--color-text-primary)] font-semibold">
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
                className="bg-[var(--color-surface] border-[1px] rounded-[var(--border-radiuspx] overflow-hidden max-width-[600px]"
              >
                <h3
                  className="py-4 px-5 font-heading text-base font-bold bg-[var(--color-background)] border-bottom-[1px]"
                >
                  Technische specificaties
                </h3>
                {Array.isArray(product.specifications) && product.specifications.map((specGroup: any, groupIdx: number) => (
                  <div key={groupIdx}>
                    {specGroup.group && (
                      <h4 className="py-3 px-5 font-bold text-sm bg-[var(--color-background)] border-bottom-[1px]">
                        {specGroup.group}
                      </h4>
                    )}
                    {specGroup.attributes?.map((attr: any, attrIdx: number) => (
                      <div
                        key={attrIdx}
                        className="flex py-3 px-5 border-bottom-[1px] text-sm"
                      >
                        <span className="w-[200px] text-[var(--color-text-muted)] font-medium flex-shrink-0">
                          {attr.name}
                        </span>
                        <span className="text-[var(--color-text-primary)] font-semibold">
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
            <div className="text-[var(--color-text-muted)]">Reviews worden hier getoond (TODO: Reviews collection)</div>
          )}

          {activeTab === 'downloads' && product.downloads && product.downloads.length > 0 && (
            <div>
              <div className="grid gap-4">
                {product.downloads.map((download, idx) => {
                  const file = typeof download === 'object' && download !== null ? download : null
                  if (!file || !file.url) return null

                  return (
                    <a
                      key={idx}
                      href={file.url}
                      download
                      className="flex items-center gap-3 p-4 bg-[var(--color-surface] border-[1px] rounded-[var(--border-radiuspx] no-underline text-[var(--color-text-primary)]"
                    >
                      <Download className="w-5 h-5" className="text-[var(--color-primary)]" />
                      <div>
                        <div className="font-semibold text-sm">{file.filename || 'Download'}</div>
                        {file.filesize && (
                          <div className="text-xs text-[var(--color-text-muted)]">
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
          <div className="pt-16 border-top-[1px] mt-16" className="px-4 lg:px-6">
            <div className="flex justify-between items-center mb-7 gap-4">
              <h2
                className="font-heading text-xl font-extrabold text-[var(--color-text-primary)] flex items-center gap-[10px]"
                className="md:text-2xl"
              >
                <Sparkles className="w-5 h-5 md:w-6 md:h-6" className="text-[var(--color-primary)]" />
                Klanten bekeken ook
              </h2>
              <Link
                href="/shop"
                className="text-[var(--color-primary)] font-semibold text-[13px] no-underline flex items-center gap-[6px]"
                className="md:text-sm"
              >
                Bekijk alle producten
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </div>

            {/* Mobile: Horizontal Scroll */}
            <div
              className="flex gap-4 overflow-x-auto pb-4"
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
                    className="min-width-[200px] bg-[var(--color-surface] rounded-2xl overflow-hidden border-[1px] no-underline flex-shrink-0"
                  >
                    <div
                      className="w-full h-[160px] bg-[var(--color-background)] flex items-center justify-center"
                    >
                      {rpImg ? (
                        <img src={rpImg} alt={rp.title} className="max-width-full max-height-full object-contain" />
                      ) : (
                        <div className="text-[48px]">📦</div>
                      )}
                    </div>

                    <div className="p-[14px]">
                      {rp.brand && (
                        <div
                          className="text-[10px] font-bold uppercase text-[var(--color-primary)] tracking-wider mb-1"
                        >
                          {rp.brand}
                        </div>
                      )}
                      <div
                        className="font-semibold text-[13px] text-[var(--color-text-primary)] mb-1 leading-1.4 overflow-hidden"
                      >
                        {rp.title}
                      </div>
                      {rp.sku && (
                        <div className="font-mono text-[10px] text-[var(--color-text-muted)] mb-[10px]">
                          Art. {rp.sku}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div
                          className="font-heading text-base font-extrabold text-[var(--color-text-primary)]"
                        >
                          €{rp.price.toFixed(2)}
                        </div>
                        <button
                          className="w-[36px] h-[36px] rounded-xl bg-[var(--color-primary)] text-white border-none cursor-pointer flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {rp.trackStock && rp.stock && rp.stock > 0 && (
                        <div
                          className="flex items-center gap-1 text-[11px] font-medium mt-[10px] pt-[10px] border-top-[1px]"
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
              className="hidden"
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
                    className="bg-[var(--color-surface] rounded-[var(--border-radiuspx] overflow-hidden border-[1px] no-underline"
                  >
                    <div
                      className="w-full h-[160px] bg-[var(--color-background)] flex items-center justify-center"
                    >
                      {rpImg ? (
                        <img src={rpImg} alt={rp.title} className="max-width-full max-height-full object-contain" />
                      ) : (
                        <div className="text-[48px]">📦</div>
                      )}
                    </div>

                    <div className="p-4">
                      {rp.brand && (
                        <div
                          className="text-[11px] font-bold uppercase text-[var(--color-primary)] tracking-wider mb-1"
                        >
                          {rp.brand}
                        </div>
                      )}
                      <div
                        className="font-semibold text-sm text-[var(--color-text-primary)] mb-1 leading-1.4 overflow-hidden"
                      >
                        {rp.title}
                      </div>
                      {rp.sku && (
                        <div className="font-mono text-[11px] text-[var(--color-text-muted)] mb-[10px]">
                          Art. {rp.sku}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div
                          className="font-heading text-lg font-extrabold text-[var(--color-text-primary)]"
                        >
                          €{rp.price.toFixed(2)}
                        </div>
                        <button
                          className="w-[38px] h-[38px] rounded-xl bg-[var(--color-primary)] text-white border-none cursor-pointer flex items-center justify-center"
                        >
                          <Plus className="w-[18px] h-[18px]" />
                        </button>
                      </div>

                      {rp.trackStock && rp.stock && rp.stock > 0 && (
                        <div
                          className="flex items-center gap-1 text-xs font-medium mt-[10px] pt-[10px] border-top-[1px]"
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
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-border)] px-4 py-3 z-[1000] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3">
          {/* Product Info */}
          <div className="flex-1 min-width-[0]">
            <div
              className="text-[13px] font-bold text-[var(--color-text-primary)] mb-[2px] whitespace-nowrap overflow-hidden"
            >
              {product.title}
            </div>
            <div
              className="text-base font-extrabold text-[var(--color-primary)] font-heading"
            >
              €{currentPrice.toFixed(2)}
            </div>
          </div>

          {/* Quantity - Simple Product */}
          {!isGrouped && (
            <div
              className="flex items-center rounded-lg overflow-hidden bg-white"
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-[36px] h-[36px] border-none bg-[var(--color-background] cursor-pointer flex items-center justify-center"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div
                className="w-[32px] text-center font-mono text-sm font-bold text-[var(--color-text-primary)]"
              >
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-[36px] h-[36px] border-none bg-[var(--color-background] cursor-pointer flex items-center justify-center"
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
