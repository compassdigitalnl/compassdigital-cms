'use client'

import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import type { CartItem } from '@/branches/ecommerce/contexts/CartContext'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, ArrowRight, Package, Sparkles, Plus } from 'lucide-react'
import { useState } from 'react'

// Modern Components
import { Breadcrumbs, type BreadcrumbItem } from '@/branches/shared/components/layout/breadcrumbs/Breadcrumbs'
import { CartLineItem } from '@/branches/ecommerce/components/ui/CartLineItem/Component'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary/Component'
import { CouponInput } from '@/branches/ecommerce/components/ui/CouponInput/Component'
import { FreeShippingProgress } from '@/branches/ecommerce/components/ui/FreeShippingProgress/Component'

interface CartTemplate1Props {
  onCheckout?: () => void
}

export default function CartTemplate1({ onCheckout }: CartTemplate1Props) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | undefined>()
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | undefined>()

  const handleCheckout = () => {
    if (onCheckout) onCheckout()
    // Navigate to checkout
    window.location.href = '/checkout'
  }

  // Calculate totals
  const shipping = total >= 150 ? 0 : 7.5
  const discount = appliedCoupon ? appliedCoupon.discount : 0
  const subtotal = total
  const tax = (total - discount + shipping) * 0.21
  const grandTotal = total - discount + shipping + tax

  // Free shipping threshold
  const freeShippingThreshold = 150

  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
  ]

  // Coupon handlers
  const handleApplyCoupon = async (code: string) => {
    setCouponLoading(true)
    setCouponError(undefined)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation (in production, call API)
    if (code.toUpperCase() === 'SAVE10') {
      setAppliedCoupon({ code: code.toUpperCase(), discount: total * 0.1 })
      setCouponCode('')
    } else {
      setCouponError('Ongeldige kortingscode')
    }

    setCouponLoading(false)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(undefined)
  }

  // Mock cross-sell products (in real app, fetch from API)
  const crossSellProducts = [
    {
      id: 'cs-1',
      name: 'Handschoenendispenser RVS — Enkel',
      brand: 'Clinhand',
      price: 34.5,
      image: '🗑️',
    },
    {
      id: 'cs-2',
      name: 'Skinman Soft Protect Handdesinfectie 500ml',
      brand: 'Ecolab',
      price: 6.75,
      image: '🧴',
    },
    {
      id: 'cs-3',
      name: 'Leukoplast Professional Wondpleister 5m',
      brand: 'BSN Medical',
      price: 6.5,
      image: '🩹',
    },
    {
      id: 'cs-4',
      name: 'Peha-soft Nitrile Guard — XL',
      brand: 'Hartmann',
      price: 9.75,
      image: '🧤',
    },
  ]

  // ========================================
  // EMPTY CART STATE
  // ========================================

  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
        <div className="flex items-center justify-center py-12 px-4 lg:py-20">
          <div className="text-center max-w-md mx-auto p-6 lg:p-8">
            <div
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 lg:mb-6"
              style={{ background: 'var(--color-border)' }}
            >
              <ShoppingCart className="w-8 h-8 lg:w-10 lg:h-10" style={{ color: 'var(--color-text-muted)' }} />
            </div>
            <h2
              className="text-xl lg:text-2xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              Je winkelwagen is leeg
            </h2>
            <p className="mb-6 text-sm lg:text-base" style={{ color: 'var(--color-text-muted)' }}>
              Voeg producten toe aan je winkelwagen om te beginnen met winkelen.
            </p>
            <Link
              href="/shop/"
              className="inline-flex items-center gap-2 px-6 lg:px-7 py-3 lg:py-3.5 text-white rounded-xl font-bold transition-all"
              style={{
                background: 'var(--color-primary)',
                boxShadow: 'var(--shadow)',
                fontSize: '14px',
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Ga naar shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Group items by parentProductId
  const groupedItems: {
    parentProduct: { id: number | string; title: string } | null
    items: CartItem[]
  }[] = []

  const itemsWithParent = items.filter((i) => i.parentProductId)
  const itemsWithoutParent = items.filter((i) => !i.parentProductId)

  const parentGroups = new Map<number | string, CartItem[]>()
  itemsWithParent.forEach((item) => {
    const parentId = item.parentProductId!
    if (!parentGroups.has(parentId)) {
      parentGroups.set(parentId, [])
    }
    parentGroups.get(parentId)!.push(item)
  })

  parentGroups.forEach((groupItems, parentId) => {
    groupedItems.push({
      parentProduct: {
        id: parentId,
        title: groupItems[0].parentProductTitle || `Grouped Product ${parentId}`,
      },
      items: groupItems,
    })
  })

  if (itemsWithoutParent.length > 0) {
    groupedItems.push({
      parentProduct: null,
      items: itemsWithoutParent,
    })
  }

  // ========================================
  // MAIN CART LAYOUT
  // ========================================

  return (
    <div className="min-h-screen pb-32 lg:pb-20" style={{ background: 'var(--color-surface)' }}>
      {/* ========================================
          BREADCRUMBS (Desktop only)
          ======================================== */}
      <div className="hidden lg:block" style={{ padding: '16px 0' }}>
        <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
          <Breadcrumbs items={breadcrumbs} currentPage="Winkelwagen" />
        </div>
      </div>

      <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        {/* ========================================
            PAGE TITLE
            ======================================== */}
        <div className="flex items-center justify-between mb-5 lg:mb-7 pt-4 lg:pt-0">
          <h1
            className="flex items-center gap-2 lg:gap-3 text-2xl lg:text-3xl font-extrabold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
          >
            <ShoppingCart className="w-6 h-6 lg:w-7 lg:h-7" style={{ color: 'var(--color-primary)' }} />
            <span className="hidden sm:inline">Winkelwagen</span>
            <span
              className="text-sm lg:text-base font-medium"
              style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
            >
              ({itemCount})
            </span>
          </h1>
          <Link
            href="/shop/"
            className="flex items-center gap-1 lg:gap-1.5 font-semibold transition-all hover:gap-2.5 text-xs lg:text-sm"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Verder winkelen</span>
            <span className="sm:hidden">Shop</span>
          </Link>
        </div>

        {/* ========================================
            FREE SHIPPING PROGRESS BAR
            ======================================== */}
        {shipping > 0 && (
          <div className="mb-4 lg:mb-6">
            <FreeShippingProgress
              currentTotal={total}
              threshold={freeShippingThreshold}
              currencySymbol="€"
              locale="nl-NL"
            />
          </div>
        )}

        {/* ========================================
            CART LAYOUT (Items + Sidebar)
            ======================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 lg:gap-7 items-start">
          {/* ========================================
              LEFT: CART ITEMS
              ======================================== */}
          <div className="space-y-3">
            {groupedItems.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Parent Product Header */}
                {group.parentProduct && (
                  <div
                    className="rounded-xl p-3 lg:p-4 mb-2 flex items-center gap-2"
                    style={{
                      background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
                    }}
                  >
                    <Package className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: 'var(--color-primary)' }} />
                    <h3 className="font-semibold text-sm lg:text-base" style={{ color: 'var(--color-primary)' }}>
                      {group.parentProduct.title}
                    </h3>
                    <span className="text-xs lg:text-sm" style={{ color: 'var(--color-primary)' }}>
                      ({group.items.length})
                    </span>
                  </div>
                )}

                {/* Cart Items Container */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: 'white', border: '1px solid var(--color-border)' }}
                >
                  {group.items.map((item, itemIndex) => {
                    // Transform CartItem to CartLineItem props
                    const product = {
                      id: item.id,
                      name: item.title,
                      slug: item.slug || '',
                      sku: item.sku || '',
                      brand: item.sku?.split('-')[0] || 'PRODUCT',
                      image: item.image
                        ? { url: item.image, alt: item.title }
                        : undefined,
                      price: item.unitPrice ?? item.price,
                      oldPrice: item.unitPrice && item.unitPrice < item.price ? item.price : undefined,
                      unit: 'stuk',
                      stockStatus: 'in-stock' as const,
                      stockText: 'Op voorraad — morgen geleverd',
                      variants: item.variantId
                        ? [
                            {
                              type: 'Size',
                              value: item.variantId,
                            },
                          ]
                        : undefined,
                      minQuantity: item.minOrderQuantity || 1,
                      maxQuantity: item.maxOrderQuantity || item.stock,
                      orderMultiple: item.orderMultiple || 1,
                    }

                    return (
                      <div
                        key={item.id}
                        style={{
                          borderBottom:
                            itemIndex < group.items.length - 1 ? '1px solid var(--color-border)' : 'none',
                        }}
                      >
                        <CartLineItem
                          product={product}
                          quantity={item.quantity}
                          onQuantityChange={(newQty) => updateQuantity(item.id, newQty)}
                          onRemove={() => removeItem(item.id)}
                          currencySymbol="€"
                          locale="nl-NL"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* ========================================
                CROSS-SELL SECTION
                ======================================== */}
            <div className="mt-6 lg:mt-8">
              <h3
                className="flex items-center gap-2 font-extrabold mb-4 text-lg lg:text-xl"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <Sparkles className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                Vaak samen besteld
              </h3>

              <div className="flex gap-3 lg:gap-4 overflow-x-auto pb-2">
                {crossSellProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[160px] lg:w-[200px] rounded-2xl overflow-hidden transition-all hover:-translate-y-1 cursor-pointer"
                    style={{
                      background: 'white',
                      border: '1px solid var(--color-border)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div
                      className="h-[100px] lg:h-[120px] flex items-center justify-center text-3xl lg:text-4xl"
                      style={{ background: 'var(--color-surface)' }}
                    >
                      {product.image}
                    </div>
                    <div className="p-3 lg:p-3.5">
                      <div
                        className="font-bold uppercase mb-1"
                        style={{
                          fontSize: '9px',
                          color: 'var(--color-primary)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {product.brand}
                      </div>
                      <div
                        className="font-semibold mb-2 line-clamp-2"
                        style={{ fontSize: '12px', color: 'var(--color-text-primary)', lineHeight: '1.3' }}
                      >
                        {product.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="font-extrabold"
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '15px',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          €{product.price.toFixed(2)}
                        </span>
                        <button
                          className="w-[32px] h-[32px] rounded-lg flex items-center justify-center transition-colors"
                          style={{ background: 'var(--color-primary)', color: 'white' }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================
              RIGHT: ORDER SUMMARY (Desktop Only)
              ======================================== */}
          <div className="hidden lg:block">
            <div className="mb-4">
              <CouponInput
                appliedCoupon={appliedCoupon}
                isLoading={couponLoading}
                errorMessage={couponError}
                currencySymbol="€"
                onApply={handleApplyCoupon}
                onRemove={handleRemoveCoupon}
                placeholder="Kortingscode"
                buttonText="Toepassen"
              />
            </div>

            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              discountCode={appliedCoupon?.code}
              shipping={shipping === 0 ? 'free' : shipping}
              tax={tax}
              total={grandTotal}
              showQuoteButton={true}
              sticky={true}
              readonly={false}
              taxRate={21}
              currencySymbol="€"
              locale="nl-NL"
              onCheckout={handleCheckout}
              onRequestQuote={() => {
                window.location.href = '/quote'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
