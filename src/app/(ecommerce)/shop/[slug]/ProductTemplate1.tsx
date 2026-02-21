'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/components/ui/Toast'
import { StaffelCalculator } from '@/components/ui/StaffelCalculator'
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
  const { showAddToCartToast } = useToast()
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
      let addedCount = 0
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
            addedCount += qty
          }
        }
      })

      // Show toast for grouped products
      if (addedCount > 0) {
        showAddToCartToast({
          emoji: typeof product.images?.[0] === 'object' && product.images[0] !== null ? undefined : '📦',
          image: typeof product.images?.[0] === 'object' && product.images[0] !== null ? product.images[0].url : undefined,
          brand: typeof product.brand === 'object' && product.brand ? product.brand.name : undefined,
          title: product.title,
          quantity: addedCount,
          price: totalPrice,
        })
      }
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

      // Show toast for simple product
      showAddToCartToast({
        emoji: typeof product.images?.[0] === 'object' && product.images[0] !== null ? undefined : '📦',
        image: typeof product.images?.[0] === 'object' && product.images[0] !== null ? product.images[0].url : undefined,
        brand: typeof product.brand === 'object' && product.brand ? product.brand.name : undefined,
        title: product.title,
        quantity: quantity,
        price: unitPrice * quantity,
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
      <div className="product-template-1 overflow-x-hidden pb-20" style={{ maxWidth: 'var(--container-width, 1792px)', margin: '0 auto' }}>
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
            <div className="flex items-center gap-1.5 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 text-[var(--color-warning)]"
                    fill={i <= Math.floor(avgRating) ? 'var(--color-warning)' : 'none'}
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
        <div className="relative w-full h-[280px] md:h-96 lg:hidden bg-[var(--color-background,var(--color-surface))]">
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
              className="w-9 h-9 bg-white/95 border border-[var(--color-border)] rounded-lg flex items-center justify-center cursor-pointer"
              aria-label="Add to favorites"
            >
              <Heart className="w-4 h-4 text-[var(--color-text-primary)]" />
            </button>
            <button
              className="w-9 h-9 bg-white/95 border border-[var(--color-border)] rounded-lg flex items-center justify-center cursor-pointer"
              aria-label="Share product"
            >
              <Share2 className="w-4 h-4 text-[var(--color-text-primary)]" />
            </button>
          </div>

          {/* Image */}
          <div className="w-full h-full flex items-center justify-center p-5">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.title}
                className="max-w-full max-h-full object-contain drop-shadow-md"
              />
            ) : (
              <div className="text-[80px]">📦</div>
            )}
          </div>

          {/* Image Dots */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-2 bg-black/50 rounded-full">
              {allImages.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className="h-2 rounded-full border-0 cursor-pointer transition-all duration-300"
                  style={{
                    width: imageIndex === idx ? '20px' : '8px',
                    background: imageIndex === idx ? 'white' : 'rgba(255,255,255,0.5)',
                  }}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP: 2-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-[480px_1fr] lg:gap-12 lg:items-start lg:mb-12 lg:px-6">
          {/* LEFT: Gallery */}
          <div className="gallery">
            {/* Main Image */}
            <div className="w-full h-[480px] bg-[var(--color-surface,white)] rounded-[var(--border-radius,20px)] border border-[var(--color-border,var(--color-border))] flex items-center justify-center relative overflow-hidden">
              {/* Badges */}
              {(product.badge || product.salePrice) && (
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  {savingsPercent > 0 && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FF6B6B] text-white">
                      -{savingsPercent}%
                    </span>
                  )}
                  {product.badge === 'popular' && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--color-primary)] text-white">
                      Bestseller
                    </span>
                  )}
                  {product.badge === 'new' && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[var(--color-primary)] text-white">
                      NIEUW
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  className="w-10 h-10 bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[10px] flex items-center justify-center cursor-pointer"
                  aria-label="Add to favorites"
                >
                  <Heart className="w-[18px] h-[18px] text-[var(--color-text-primary)]" />
                </button>
                <button
                  className="w-10 h-10 bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[10px] flex items-center justify-center cursor-pointer"
                  aria-label="Share product"
                >
                  <Share2 className="w-[18px] h-[18px] text-[var(--color-text-primary)]" />
                </button>
              </div>

              {/* Image */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                />
              ) : (
                <div className="text-[120px]">📦</div>
              )}

              {/* Zoom */}
              <div className="absolute bottom-4 right-4">
                <button
                  className="w-10 h-10 bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[10px] flex items-center justify-center cursor-pointer"
                  aria-label="Zoom image"
                >
                  <ZoomIn className="w-[18px] h-[18px] text-[var(--color-text-muted)]" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2.5 mt-3">
                {product.images.slice(0, 5).map((img, idx) => {
                  const imgUrl = typeof img === 'object' && img !== null ? img.url : null
                  return (
                    <div
                      key={idx}
                      className="w-20 h-20 rounded-xl bg-[var(--color-surface,white)] cursor-pointer flex items-center justify-center"
                      style={{
                        border: idx === 0 ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                        boxShadow: idx === 0 ? '0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent)' : 'none',
                      }}
                    >
                      {imgUrl && (
                        <img
                          src={imgUrl}
                          alt={`${product.title} thumbnail ${idx + 1}`}
                          className="max-w-full max-h-full object-contain"
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
              <div className="text-xs font-bold uppercase text-[var(--color-primary)] tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-[14px] h-[14px]" />
                {product.brand}
              </div>
            )}

            {/* Title */}
            <h1 className="font-heading text-[28px] font-extrabold text-[var(--color-text-primary)] leading-tight tracking-tight mb-2">
              {product.title}
            </h1>

            {/* SKU / EAN / Packaging */}
            <div className="font-mono text-xs text-[var(--color-text-muted)] mb-4 flex items-center gap-3 flex-wrap">
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
              <div className="flex items-center gap-2 mb-5 pb-5 border-b border-b-[var(--color-border)]">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[var(--color-warning)]"
                      fill={i <= Math.floor(avgRating) ? 'var(--color-warning)' : 'none'}
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
            <div className="bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[var(--border-radius,16px)] p-6 mb-5">
              {/* Current Price */}
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className="font-heading text-[32px] font-extrabold"
                  style={{ color: oldPrice ? '#FF6B6B' : 'var(--color-text-primary)' }}
                >
                  €{currentPrice.toFixed(2)}
                </span>
                {oldPrice && (
                  <>
                    <span className="text-lg text-[var(--color-text-muted)] line-through font-normal">
                      €{oldPrice.toFixed(2)}
                    </span>
                    <span className="text-[13px] font-bold text-[#FF6B6B] bg-[#FFF0F0] px-2.5 py-[3px] rounded-md">
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

              {/* Volume Pricing - StaffelCalculator Component */}
              {volumeTiers.length > 0 && !isGrouped && (
                <div className="mt-4">
                  <StaffelCalculator
                    productName={product.title}
                    tiers={volumeTiers.map((tier) => ({
                      minQty: tier.minQuantity,
                      maxQty: tier.maxQuantity || undefined,
                      price: tier.discountPrice || product.price * (1 - (tier.discountPercentage || 0) / 100),
                      savePercentage: tier.discountPercentage || undefined,
                    }))}
                    initialQuantity={quantity}
                    unit="stuks"
                    onQuantityChange={(newQty, price, total) => {
                      setQuantity(newQty)
                    }}
                  />
                </div>
              )}
            </div>

            {/* STOCK */}
            {product.trackStock && product.stock !== undefined && product.stock > 0 && (
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-success-bg)] rounded-[10px] mb-5">
                <span className="w-2 h-2 bg-[var(--color-success)] rounded-full shrink-0" />
                <div>
                  <div className="text-[13px] font-semibold text-[#2E7D32]">
                    Op voorraad — {product.stock} stuks beschikbaar
                  </div>
                  {product.leadTime && (
                    <div className="text-xs text-[#558B2F] font-normal">
                      Levertijd: {product.leadTime}
                    </div>
                  )}
                </div>
                <Truck className="w-4 h-4 ml-auto text-[#2E7D32]" />
              </div>
            )}

            {/* SIZE SELECTOR (Grouped Products) */}
            {isGrouped && childProducts.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-bold text-[var(--color-text-primary)] mb-2.5 flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-[var(--color-primary)]" />
                  Selecteer maten en aantallen
                </div>

                {/* Size Grid */}
                <div className="overflow-x-auto">
                  <div
                    className="grid gap-0 border-[1.5px] border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface,white)] min-w-min"
                    style={{ gridTemplateColumns: `repeat(${childProducts.length}, 1fr)` }}
                  >
                  {childProducts.map((child, idx) => {
                    const qty = sizeQuantities[child.id] || 0
                    return (
                      <div
                        key={child.id}
                        className="flex flex-col"
                        style={{ borderRight: idx < childProducts.length - 1 ? '1.5px solid var(--color-border)' : 'none' }}
                      >
                        {/* Header */}
                        <div className="p-2.5 text-center bg-[var(--color-background,var(--color-surface))] border-b-[1.5px] border-b-[var(--color-border)] text-[13px] font-bold text-[var(--color-text-primary)]">
                          {child.title}
                        </div>

                        {/* Body */}
                        <div className="p-3 flex flex-col gap-2 items-center">
                          {/* Quantity Input */}
                          <div
                            className="flex items-center rounded-lg overflow-hidden bg-white"
                            style={{ border: `1.5px solid ${qty > 0 ? 'var(--color-primary)' : 'var(--color-border)'}` }}
                          >
                            <button
                              onClick={() => stepQty(child.id, -1)}
                              className="w-8 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
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
                              className="w-10 h-9 border-0 text-center font-mono text-sm outline-none"
                              style={{
                                fontWeight: qty > 0 ? 700 : 500,
                                color: qty > 0 ? 'var(--color-primary)' : 'var(--color-text-primary)',
                              }}
                            />
                            <button
                              onClick={() => stepQty(child.id, 1)}
                              className="w-8 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
                            >
                              +
                            </button>
                          </div>

                          {/* Stock */}
                          {child.stock && child.stock > 0 && (
                            <div className="text-[11px] text-[var(--color-success)] font-medium flex items-center gap-[3px]">
                              <CheckCircle className="w-[11px] h-[11px]" />
                              {child.stock} op voorraad
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-background,var(--color-surface))] rounded-[10px] mt-3 border-[1.5px] border-[var(--color-border)]">
                  <div className="text-[13px] text-[var(--color-text-muted)]">
                    <strong className="text-[var(--color-text-primary)]">{totalQty}</strong> dozen totaal
                    {volumeTiers.length > 0 && totalQty > 0 && ' · staffelprijs van toepassing'}
                  </div>
                  <div className="font-heading text-lg font-extrabold text-[var(--color-text-primary)]">
                    €{totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Simple Product Quantity */}
            {!isGrouped && (
              <div className="mb-5">
                <div className="text-sm font-bold text-[var(--color-text-primary)] mb-2">
                  Aantal
                </div>
                <div className="inline-flex items-center border-[1.5px] border-[var(--color-border)] rounded-[10px] overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-lg text-[var(--color-text-primary)]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-[60px] h-11 border-0 text-center font-mono text-base font-bold text-[var(--color-text-primary)] outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-lg text-[var(--color-text-primary)]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-2.5 mb-5">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isGrouped && totalQty === 0}
                className="flex items-center justify-center gap-2.5 w-full p-4 text-white border-0 rounded-xl font-body text-base font-bold"
                style={{
                  background: isGrouped && totalQty === 0 ? '#CBD5E1' : 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, white))',
                  cursor: isGrouped && totalQty === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: isGrouped && totalQty === 0 ? 'none' : '0 4px 20px color-mix(in srgb, var(--color-primary) 40%, transparent)',
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                Toevoegen aan winkelwagen
              </button>

              {/* Secondary Buttons */}
              <div className="flex gap-2.5">
                <button className="flex-1 flex items-center justify-center gap-2 p-[13px] bg-[var(--color-surface,white)] text-[var(--color-text-primary)] border-[1.5px] border-[var(--color-border)] rounded-xl font-body text-sm font-semibold cursor-pointer">
                  <ClipboardList className="w-[18px] h-[18px]" />
                  Op bestellijst
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 p-[13px] bg-[var(--color-surface,white)] text-[var(--color-text-primary)] border-[1.5px] border-[var(--color-border)] rounded-xl font-body text-sm font-semibold cursor-pointer">
                  <Repeat className="w-[18px] h-[18px]" />
                  Herhaalbestelling
                </button>
              </div>
            </div>

            {/* TRUST SIGNALS */}
            <div className="grid grid-cols-2 gap-2.5 pt-5 border-t border-t-[var(--color-border)]">
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <Truck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                Gratis verzending vanaf €150
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <Undo2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                30 dagen retourrecht
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <CreditCard className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                Op rekening bestellen
              </div>
              <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
                <ShieldCheck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                CE & ISO gecertificeerd
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE: Price + Stock + Actions */}
        <div className="p-4 lg:hidden">
          {/* PRICE BLOCK */}
          <div className="bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-xl p-4 mb-4">
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span
                className="font-heading text-[26px] font-extrabold"
                style={{ color: oldPrice ? '#FF6B6B' : 'var(--color-text-primary)' }}
              >
                €{currentPrice.toFixed(2)}
              </span>
              {oldPrice && (
                <>
                  <span className="text-base text-[var(--color-text-muted)] line-through font-normal">
                    €{oldPrice.toFixed(2)}
                  </span>
                  <span className="text-[11px] font-bold text-[#FF6B6B] bg-[#FFF0F0] px-2 py-[3px] rounded">
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

            {/* Volume Pricing - Mobile - StaffelCalculator */}
            {volumeTiers.length > 0 && !isGrouped && (
              <div className="mt-3">
                <StaffelCalculator
                  productName={product.title}
                  tiers={volumeTiers.map((tier) => ({
                    minQty: tier.minQuantity,
                    maxQty: tier.maxQuantity || undefined,
                    price: tier.discountPrice || product.price * (1 - (tier.discountPercentage || 0) / 100),
                    savePercentage: tier.discountPercentage || undefined,
                  }))}
                  initialQuantity={quantity}
                  unit="stuks"
                  onQuantityChange={(newQty, price, total) => {
                    setQuantity(newQty)
                  }}
                />
              </div>
            )}
          </div>

          {/* STOCK - Mobile */}
          {product.trackStock && product.stock !== undefined && product.stock > 0 && (
            <div className="flex items-center gap-2 p-3 bg-[var(--color-success-bg)] rounded-[10px] mb-4 text-[13px]">
              <span className="w-1.5 h-1.5 bg-[var(--color-success)] rounded-full shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-[#2E7D32]">
                  Op voorraad — {product.stock} stuks
                </div>
              </div>
              <Truck className="w-4 h-4 text-[#2E7D32]" />
            </div>
          )}

          {/* SIZE SELECTOR - Mobile (Grouped Products) */}
          {isGrouped && childProducts.length > 0 && (
            <div className="mb-5">
              <div className="text-[13px] font-bold text-[var(--color-text-primary)] mb-2.5 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-[var(--color-primary)]" />
                Selecteer maten
              </div>

              <div className="space-y-2">
                {childProducts.map((child) => {
                  const qty = sizeQuantities[child.id] || 0
                  return (
                    <div
                      key={child.id}
                      className="rounded-[10px] p-3"
                      style={{
                        border: `1.5px solid ${qty > 0 ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        background: qty > 0 ? 'color-mix(in srgb, var(--color-primary) 5%, white)' : 'var(--color-surface, white)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-[13px] font-bold text-[var(--color-text-primary)]">
                            {child.title}
                          </div>
                          {child.stock && child.stock > 0 && (
                            <div className="text-[11px] text-[var(--color-success)] font-medium mt-0.5">
                              {child.stock} op voorraad
                            </div>
                          )}
                        </div>
                        <div
                          className="flex items-center rounded-lg overflow-hidden bg-white"
                          style={{ border: `1.5px solid ${qty > 0 ? 'var(--color-primary)' : 'var(--color-border)'}` }}
                        >
                          <button
                            onClick={() => stepQty(child.id, -1)}
                            className="w-9 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
                          >
                            −
                          </button>
                          <div
                            className="w-10 text-center font-mono text-sm"
                            style={{
                              fontWeight: qty > 0 ? 700 : 500,
                              color: qty > 0 ? 'var(--color-primary)' : 'var(--color-text-primary)',
                            }}
                          >
                            {qty}
                          </div>
                          <button
                            onClick={() => stepQty(child.id, 1)}
                            className="w-9 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-sm text-[var(--color-text-primary)]"
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
                <div className="flex items-center justify-between p-3 bg-[var(--color-background,var(--color-surface))] rounded-[10px] mt-3 border-[1.5px] border-[var(--color-border)]">
                  <div className="text-xs text-[var(--color-text-muted)]">
                    <strong className="text-[var(--color-text-primary)]">{totalQty}</strong> dozen totaal
                  </div>
                  <div className="font-heading text-lg font-extrabold text-[var(--color-text-primary)]">
                    €{totalPrice.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Simple Product Quantity - Mobile */}
          {!isGrouped && (
            <div className="mb-4">
              <div className="text-[13px] font-bold text-[var(--color-text-primary)] mb-2">
                Aantal
              </div>
              <div className="inline-flex items-center border-[1.5px] border-[var(--color-border)] rounded-[10px] overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-base text-[var(--color-text-primary)]"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-[60px] h-11 border-0 text-center font-mono text-base font-bold text-[var(--color-text-primary)] outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center text-base text-[var(--color-text-primary)]"
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
            className="flex items-center justify-center gap-2.5 w-full p-4 text-white border-0 rounded-xl font-body text-base font-bold mb-3"
            style={{
              background: isGrouped && totalQty === 0 ? '#CBD5E1' : 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, white))',
              cursor: isGrouped && totalQty === 0 ? 'not-allowed' : 'pointer',
              boxShadow: isGrouped && totalQty === 0 ? 'none' : '0 4px 20px color-mix(in srgb, var(--color-primary) 40%, transparent)',
            }}
          >
            <ShoppingCart className="w-5 h-5" />
            Toevoegen aan winkelwagen
          </button>

          {/* Secondary Buttons - Mobile */}
          <div className="flex gap-2 mb-4">
            <button className="flex-1 flex items-center justify-center gap-1.5 p-3 bg-[var(--color-surface,white)] text-[var(--color-text-primary)] border-[1.5px] border-[var(--color-border)] rounded-[10px] font-body text-[13px] font-semibold cursor-pointer">
              <ClipboardList className="w-4 h-4" />
              Bestellijst
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 p-3 bg-[var(--color-surface,white)] text-[var(--color-text-primary)] border-[1.5px] border-[var(--color-border)] rounded-[10px] font-body text-[13px] font-semibold cursor-pointer">
              <Repeat className="w-4 h-4" />
              Herhalen
            </button>
          </div>

          {/* Trust Signals - Mobile */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-t-[var(--color-border)]">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
              <Truck className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <span>Gratis vanaf €150</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
              <Undo2 className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <span>30 dagen retour</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
              <CreditCard className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <span>Op rekening</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-secondary)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
              <span>CE & ISO</span>
            </div>
          </div>
        </div>

        {/* MOBILE: Accordion Tabs */}
        <div className="px-4 pb-4 lg:hidden">
          {/* Description Accordion */}
          <div className="border border-[var(--color-border)] rounded-xl mb-3 overflow-hidden bg-[var(--color-surface,white)]">
            <button
              onClick={() => setAccordionOpen(accordionOpen === 'description' ? null : 'description')}
              className="w-full p-4 flex items-center justify-between bg-transparent border-0 cursor-pointer text-sm font-bold text-[var(--color-text-primary)]"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                Beschrijving
              </div>
              {accordionOpen === 'description' ? (
                <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
              )}
            </button>
            {accordionOpen === 'description' && (
              <div className="px-4 pb-4 border-t border-t-[var(--color-border)] text-sm leading-[1.7] text-[var(--color-text-secondary)]">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>Geen beschrijving beschikbaar.</p>
                )}
                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <ul className="list-none mt-4 pl-0">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 py-1.5 text-[13px]">
                        <Check className="w-4 h-4 text-[var(--color-success)] shrink-0" />
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
            <div className="border border-[var(--color-border)] rounded-xl mb-3 overflow-hidden bg-[var(--color-surface,white)]">
              <button
                onClick={() => setAccordionOpen(accordionOpen === 'specs' ? null : 'specs')}
                className="w-full p-4 flex items-center justify-between bg-transparent border-0 cursor-pointer text-sm font-bold text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-[var(--color-primary)]" />
                  Specificaties
                </div>
                {accordionOpen === 'specs' ? (
                  <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                )}
              </button>
              {accordionOpen === 'specs' && (
                <div className="border-t border-t-[var(--color-border)]">
                  {Array.isArray(product.specifications) && product.specifications.map((specGroup: any, groupIdx: number) => (
                    <div key={groupIdx}>
                      {specGroup.group && (
                        <h4 className="py-3 px-4 font-bold text-[13px] bg-[var(--color-background)] border-b border-b-[var(--color-border)] text-[var(--color-text-primary)]">
                          {specGroup.group}
                        </h4>
                      )}
                      {specGroup.attributes?.map((attr: any, attrIdx: number) => (
                        <div
                          key={attrIdx}
                          className="flex py-2.5 px-4 text-[13px] gap-3"
                          style={{
                            borderBottom: attrIdx < specGroup.attributes.length - 1 ? '1px solid var(--color-border)' : 'none',
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
            <div className="border border-[var(--color-border)] rounded-xl mb-3 overflow-hidden bg-[var(--color-surface,white)]">
              <button
                onClick={() => setAccordionOpen(accordionOpen === 'reviews' ? null : 'reviews')}
                className="w-full p-4 flex items-center justify-between bg-transparent border-0 cursor-pointer text-sm font-bold text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[var(--color-primary)]" />
                  Reviews ({reviewCount})
                </div>
                {accordionOpen === 'reviews' ? (
                  <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                )}
              </button>
              {accordionOpen === 'reviews' && (
                <div className="p-4 border-t border-t-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
                  Reviews worden hier getoond (TODO: Reviews collection)
                </div>
              )}
            </div>
          )}

          {/* Downloads Accordion */}
          {product.downloads && product.downloads.length > 0 && (
            <div className="border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface,white)]">
              <button
                onClick={() => setAccordionOpen(accordionOpen === 'downloads' ? null : 'downloads')}
                className="w-full p-4 flex items-center justify-between bg-transparent border-0 cursor-pointer text-sm font-bold text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[var(--color-primary)]" />
                  Downloads
                </div>
                {accordionOpen === 'downloads' ? (
                  <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                )}
              </button>
              {accordionOpen === 'downloads' && (
                <div className="p-4 border-t border-t-[var(--color-border)]">
                  <div className="flex flex-col gap-3">
                    {product.downloads.map((download, idx) => {
                      const file = typeof download === 'object' && download !== null ? download : null
                      if (!file || !file.url) return null

                      return (
                        <a
                          key={idx}
                          href={file.url}
                          download
                          className="flex items-center gap-3 p-3 bg-[var(--color-background,var(--color-surface))] border border-[var(--color-border)] rounded-[10px] no-underline text-[var(--color-text-primary)]"
                        >
                          <Download className="w-4 h-4 text-[var(--color-primary)]" />
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
        <div className="hidden pt-12 lg:block lg:px-6">
          {/* Tab Navigation */}
          <div className="flex gap-0 border-b-2 border-b-[var(--color-border)] mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className="py-3.5 px-6 text-sm font-semibold cursor-pointer border-0 bg-transparent font-body flex items-center gap-1.5 -mb-[2px]"
              style={{
                color: activeTab === 'description' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottom: `2px solid ${activeTab === 'description' ? 'var(--color-primary)' : 'transparent'}`,
              }}
            >
              <FileText className="w-4 h-4" />
              Beschrijving
            </button>
            {product.specifications && (
              <button
                onClick={() => setActiveTab('specs')}
                className="py-3.5 px-6 text-sm font-semibold cursor-pointer border-0 bg-transparent font-body flex items-center gap-1.5 -mb-[2px]"
                style={{
                  color: activeTab === 'specs' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  borderBottom: `2px solid ${activeTab === 'specs' ? 'var(--color-primary)' : 'transparent'}`,
                }}
              >
                <List className="w-4 h-4" />
                Specificaties
              </button>
            )}
            {reviewCount > 0 && (
              <button
                onClick={() => setActiveTab('reviews')}
                className="py-3.5 px-6 text-sm font-semibold cursor-pointer border-0 bg-transparent font-body flex items-center gap-1.5 -mb-[2px]"
                style={{
                  color: activeTab === 'reviews' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  borderBottom: `2px solid ${activeTab === 'reviews' ? 'var(--color-primary)' : 'transparent'}`,
                }}
              >
                <Star className="w-4 h-4" />
                Reviews
                <span
                  className="py-0.5 px-[7px] rounded-full text-[11px] font-bold"
                  style={{
                    background: activeTab === 'reviews' ? 'color-mix(in srgb, var(--color-primary) 10%, white)' : 'var(--color-background)',
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
                className="py-3.5 px-6 text-sm font-semibold cursor-pointer border-0 bg-transparent font-body flex items-center gap-1.5 -mb-[2px]"
                style={{
                  color: activeTab === 'downloads' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  borderBottom: `2px solid ${activeTab === 'downloads' ? 'var(--color-primary)' : 'transparent'}`,
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
                className="grid gap-10"
                style={{ gridTemplateColumns: product.specifications ? '2fr 1fr' : '1fr' }}
              >
                {/* Description Text */}
                <div>
                  {product.description && (
                    <>
                      <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5 text-[var(--color-primary)]" />
                        Over dit product
                      </h3>
                      <div
                        className="text-[15px] text-[var(--color-text-secondary)] leading-[1.7] mb-4"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    </>
                  )}

                  {/* Features List */}
                  {product.features && product.features.length > 0 && (
                    <>
                      <h3 className="font-heading text-lg font-bold text-[var(--color-text-primary)] mb-3 mt-6 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[var(--color-primary)]" />
                        Kenmerken
                      </h3>
                      <ul className="list-none mb-5">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2.5 py-2 text-sm text-[var(--color-text-primary)]">
                            <Check className="w-[18px] h-[18px] text-[var(--color-success)] shrink-0" />
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
                    <div className="bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[var(--border-radius,16px)] overflow-hidden">
                      <h3 className="py-4 px-5 font-heading text-base font-bold bg-[var(--color-background)] border-b border-b-[var(--color-border)]">
                        Productspecificaties
                      </h3>
                      {Array.isArray(product.specifications) && product.specifications.map((specGroup: any, groupIdx: number) => (
                        <div key={groupIdx}>
                          {specGroup.group && (
                            <h4 className="py-3 px-5 font-bold text-sm bg-[var(--color-background)] border-b border-b-[var(--color-border)]">
                              {specGroup.group}
                            </h4>
                          )}
                          {specGroup.attributes?.map((attr: any, attrIdx: number) => (
                            <div key={attrIdx} className="flex py-3 px-5 border-b border-b-[var(--color-border)] text-sm">
                              <span className="w-40 text-[var(--color-text-muted)] font-medium shrink-0">
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
              <div className="bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[var(--border-radius,16px)] overflow-hidden max-w-[600px]">
                <h3 className="py-4 px-5 font-heading text-base font-bold bg-[var(--color-background)] border-b border-b-[var(--color-border)]">
                  Technische specificaties
                </h3>
                {Array.isArray(product.specifications) && product.specifications.map((specGroup: any, groupIdx: number) => (
                  <div key={groupIdx}>
                    {specGroup.group && (
                      <h4 className="py-3 px-5 font-bold text-sm bg-[var(--color-background)] border-b border-b-[var(--color-border)]">
                        {specGroup.group}
                      </h4>
                    )}
                    {specGroup.attributes?.map((attr: any, attrIdx: number) => (
                      <div key={attrIdx} className="flex py-3 px-5 border-b border-b-[var(--color-border)] text-sm">
                        <span className="w-[200px] text-[var(--color-text-muted)] font-medium shrink-0">
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
              <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                {product.downloads.map((download, idx) => {
                  const file = typeof download === 'object' && download !== null ? download : null
                  if (!file || !file.url) return null

                  return (
                    <a
                      key={idx}
                      href={file.url}
                      download
                      className="flex items-center gap-3 p-4 bg-[var(--color-surface,white)] border border-[var(--color-border)] rounded-[var(--border-radius,12px)] no-underline text-[var(--color-text-primary)]"
                    >
                      <Download className="w-5 h-5 text-[var(--color-primary)]" />
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
          <div className="pt-16 border-t border-t-[var(--color-border)] mt-16 px-4 lg:px-6">
            <div className="flex justify-between items-center mb-7 flex-wrap gap-4">
              <h2 className="font-heading text-xl md:text-2xl font-extrabold text-[var(--color-text-primary)] flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[var(--color-primary)]" />
                Klanten bekeken ook
              </h2>
              <Link
                href="/shop"
                className="text-[var(--color-primary)] font-semibold text-[13px] md:text-sm no-underline flex items-center gap-1.5"
              >
                Bekijk alle producten
                <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </div>

            {/* Mobile: Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:hidden -mx-4 px-4">
              {product.relatedProducts.slice(0, 4).map((relProd, idx) => {
                const rp = typeof relProd === 'object' ? relProd : null
                if (!rp) return null

                const rpImg = typeof rp.images?.[0] === 'object' && rp.images[0] !== null ? rp.images[0].url : null

                return (
                  <Link
                    key={idx}
                    href={`/shop/${rp.slug}`}
                    className="min-w-[200px] bg-[var(--color-surface,white)] rounded-2xl overflow-hidden border border-[var(--color-border)] no-underline text-inherit snap-start shrink-0"
                  >
                    <div className="w-full h-40 bg-[var(--color-background)] flex items-center justify-center">
                      {rpImg ? (
                        <img src={rpImg} alt={rp.title} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-5xl">📦</div>
                      )}
                    </div>

                    <div className="p-3.5">
                      {rp.brand && (
                        <div className="text-[10px] font-bold uppercase text-[var(--color-primary)] tracking-wider mb-1">
                          {rp.brand}
                        </div>
                      )}
                      <div className="font-semibold text-[13px] text-[var(--color-text-primary)] mb-1 leading-[1.4] line-clamp-2">
                        {rp.title}
                      </div>
                      {rp.sku && (
                        <div className="font-mono text-[10px] text-[var(--color-text-muted)] mb-2.5">
                          Art. {rp.sku}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="font-heading text-base font-extrabold text-[var(--color-text-primary)]">
                          €{rp.price.toFixed(2)}
                        </div>
                        <button
                          className="w-9 h-9 rounded-[10px] bg-[var(--color-primary)] text-white border-0 cursor-pointer flex items-center justify-center"
                          style={{ boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent)' }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {rp.trackStock && rp.stock && rp.stock > 0 && (
                        <div className="flex items-center gap-1 text-[11px] text-[var(--color-success)] font-medium mt-2.5 pt-2.5 border-t border-t-[var(--color-border)]">
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
            <div className="hidden lg:grid lg:grid-cols-4 lg:gap-5">
              {product.relatedProducts.slice(0, 4).map((relProd, idx) => {
                const rp = typeof relProd === 'object' ? relProd : null
                if (!rp) return null

                const rpImg = typeof rp.images?.[0] === 'object' && rp.images[0] !== null ? rp.images[0].url : null

                return (
                  <Link
                    key={idx}
                    href={`/shop/${rp.slug}`}
                    className="bg-[var(--color-surface,white)] rounded-[var(--border-radius,16px)] overflow-hidden border border-[var(--color-border)] transition-all duration-[350ms] no-underline text-inherit block"
                  >
                    <div className="w-full h-40 bg-[var(--color-background)] flex items-center justify-center">
                      {rpImg ? (
                        <img src={rpImg} alt={rp.title} className="max-w-full max-h-full object-contain" />
                      ) : (
                        <div className="text-5xl">📦</div>
                      )}
                    </div>

                    <div className="p-4">
                      {rp.brand && (
                        <div className="text-[11px] font-bold uppercase text-[var(--color-primary)] tracking-wider mb-1">
                          {rp.brand}
                        </div>
                      )}
                      <div className="font-semibold text-sm text-[var(--color-text-primary)] mb-1 leading-[1.4] line-clamp-2">
                        {rp.title}
                      </div>
                      {rp.sku && (
                        <div className="font-mono text-[11px] text-[var(--color-text-muted)] mb-2.5">
                          Art. {rp.sku}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="font-heading text-lg font-extrabold text-[var(--color-text-primary)]">
                          €{rp.price.toFixed(2)}
                        </div>
                        <button
                          className="w-[38px] h-[38px] rounded-[10px] bg-[var(--color-primary)] text-white border-0 cursor-pointer flex items-center justify-center"
                          style={{ boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent)' }}
                        >
                          <Plus className="w-[18px] h-[18px]" />
                        </button>
                      </div>

                      {rp.trackStock && rp.stock && rp.stock > 0 && (
                        <div className="flex items-center gap-1 text-xs text-[var(--color-success)] font-medium mt-2.5 pt-2.5 border-t border-t-[var(--color-border)]">
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-t-[var(--color-border)] p-3 px-4 z-[1000] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center gap-3 lg:hidden">
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-[var(--color-text-primary)] mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
              {product.title}
            </div>
            <div className="text-base font-extrabold text-[var(--color-primary)] font-heading">
              €{currentPrice.toFixed(2)}
            </div>
          </div>

          {/* Quantity - Simple Product */}
          {!isGrouped && (
            <div className="flex items-center border-[1.5px] border-[var(--color-border)] rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="w-8 text-center font-mono text-sm font-bold text-[var(--color-text-primary)]">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 border-0 bg-[var(--color-background,var(--color-surface))] cursor-pointer flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isGrouped && totalQty === 0}
            className="flex items-center justify-center gap-2 py-3 px-5 text-white border-0 rounded-[10px] font-body text-sm font-bold whitespace-nowrap"
            style={{
              background: isGrouped && totalQty === 0 ? '#CBD5E1' : 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, white))',
              cursor: isGrouped && totalQty === 0 ? 'not-allowed' : 'pointer',
              boxShadow: isGrouped && totalQty === 0 ? 'none' : '0 4px 16px color-mix(in srgb, var(--color-primary) 40%, transparent)',
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
