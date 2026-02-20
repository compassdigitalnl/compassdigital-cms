'use client'

import { useCart } from '@/contexts/CartContext'
import type { CartItem } from '@/contexts/CartContext'
import Link from 'next/link'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Package,
  Truck,
  Shield,
  Clock,
  Receipt,
  Lock,
  FileText,
  Headphones,
  Undo2,
  CheckCircle,
  Hash,
  Ruler,
  ClipboardList,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useState } from 'react'

export default function CartTemplate1() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [showOrderSummary, setShowOrderSummary] = useState(false)

  // Empty cart state
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
              href="/shop"
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

  // Calculate totals
  const shipping = total >= 150 ? 0 : 7.5
  const subtotal = total
  const tax = total * 0.21
  const grandTotal = total + shipping + tax

  // Free shipping progress
  const freeShippingThreshold = 150
  const progressPercent = Math.min((total / freeShippingThreshold) * 100, 100)
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - total)

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

  return (
    <div className="min-h-screen pb-32 lg:pb-20" style={{ background: 'var(--color-surface)' }}>
      {/* Breadcrumb - Desktop only */}
      <div className="hidden lg:block" style={{ padding: '16px 0' }}>
        <div className="mx-auto px-6" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
          <div className="flex items-center gap-2" style={{ fontSize: '13px' }}>
            <Link href="/" className="transition-colors" style={{ color: 'var(--color-text-muted)' }}>
              Home
            </Link>
            <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--color-border)' }} />
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Winkelwagen</span>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'var(--container-width, 1792px)' }}>
        {/* Page Title */}
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
            href="/shop"
            className="flex items-center gap-1 lg:gap-1.5 font-semibold transition-all hover:gap-2.5 text-xs lg:text-sm"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Verder winkelen</span>
            <span className="sm:hidden">Shop</span>
          </Link>
        </div>

        {/* Mobile Order Summary Accordion */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowOrderSummary(!showOrderSummary)}
            className="w-full rounded-2xl p-4 flex items-center justify-between"
            style={{ background: 'white', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center gap-2.5">
              <Receipt className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              <div className="text-left">
                <div className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  Overzicht bestelling
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Totaal: €{grandTotal.toFixed(2)}
                </div>
              </div>
            </div>
            {showOrderSummary ? (
              <ChevronUp className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
            ) : (
              <ChevronDown className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
            )}
          </button>

          {showOrderSummary && (
            <div
              className="rounded-2xl p-5 mt-2"
              style={{ background: 'white', border: '1px solid var(--color-border)' }}
            >
              {/* Rows */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center py-2" style={{ fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Subtotaal ({itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'})
                  </span>
                  <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    €{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2" style={{ fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Verzending</span>
                  <span
                    className="font-semibold"
                    style={{ color: shipping === 0 ? 'var(--color-success)' : 'var(--color-text-primary)' }}
                  >
                    {shipping === 0 ? 'Gratis' : `€${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', margin: '6px 0' }} />

                <div className="flex justify-between items-center py-2" style={{ fontSize: '13px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>BTW (21%)</span>
                  <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    €{tax.toFixed(2)}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', margin: '6px 0' }} />

                <div className="flex justify-between items-baseline py-2">
                  <span className="font-bold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    Totaal
                  </span>
                  <span
                    className="font-extrabold text-2xl"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    €{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div
                className="space-y-2 pt-4"
                style={{ borderTop: '1px solid var(--color-border)', fontSize: '12px', color: 'var(--color-text-secondary)' }}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <span>Veilig betalen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <span>Gratis vanaf €150</span>
                </div>
                <div className="flex items-center gap-2">
                  <Undo2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <span>30 dagen retour</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Free Shipping Progress Bar */}
        {shipping > 0 && (
          <div
            className="rounded-2xl p-4 lg:p-5 mb-4 lg:mb-6 flex items-center gap-3 lg:gap-4"
            style={{ background: 'white', border: '1px solid var(--color-border)' }}
          >
            <Truck className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold mb-2 text-xs lg:text-sm" style={{ color: 'var(--color-text-primary)' }}>
                Nog <span style={{ color: 'var(--color-primary)' }}>€{amountToFreeShipping.toFixed(2)}</span> tot
                gratis verzending!
              </div>
              <div
                className="h-2 rounded overflow-hidden"
                style={{ background: 'var(--color-border)' }}
              >
                <div
                  className="h-full rounded transition-all duration-500"
                  style={{
                    background: 'var(--color-primary)',
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
              <div className="mt-1 text-xs lg:text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Je zit nu op €{total.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 lg:gap-7 items-start">
          {/* Left: Cart Items */}
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

                {/* Cart Card */}
                <div
                  className="rounded-2xl overflow-hidden transition-all"
                  style={{ background: 'white', border: '1px solid var(--color-border)' }}
                >
                  {group.items.map((item, itemIndex) => {
                    const unitPrice = item.unitPrice ?? item.price
                    const hasDiscount = item.unitPrice && item.unitPrice < item.price
                    const minQty = item.minOrderQuantity || 1
                    const multiple = item.orderMultiple || 1
                    const showVolumeHint = hasDiscount && item.quantity < 10

                    return (
                      <div
                        key={item.id}
                        style={{
                          borderBottom:
                            itemIndex < group.items.length - 1 ? '1px solid var(--color-border)' : 'none',
                        }}
                      >
                        {/* MOBILE LAYOUT */}
                        <div className="lg:hidden p-4">
                          <div className="flex gap-3 mb-3">
                            {/* Product Image */}
                            <div
                              className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                              style={{ background: 'var(--color-surface)' }}
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              ) : (
                                '📦'
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              {/* Brand */}
                              <div
                                className="font-bold uppercase mb-1"
                                style={{
                                  fontSize: '10px',
                                  color: 'var(--color-primary)',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                {item.sku?.split('-')[0] || 'PRODUCT'}
                              </div>

                              {/* Product Name */}
                              <Link
                                href={`/shop/${item.slug}`}
                                className="font-semibold transition-colors block mb-1 line-clamp-2"
                                style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}
                              >
                                {item.title}
                              </Link>

                              {/* SKU */}
                              {item.sku && (
                                <div className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                                  Art. {item.sku}
                                </div>
                              )}

                              {/* Stock */}
                              <div
                                className="flex items-center gap-1 font-medium"
                                style={{ fontSize: '11px', color: 'var(--color-success)' }}
                              >
                                <CheckCircle className="w-3 h-3" />
                                Op voorraad
                              </div>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="self-start"
                              style={{ minWidth: '40px', minHeight: '40px', color: 'var(--color-text-muted)' }}
                              aria-label="Verwijder item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price & Quantity Row */}
                          <div className="flex items-center justify-between gap-3">
                            {/* Quantity Controls */}
                            <div
                              className="flex rounded-xl overflow-hidden"
                              style={{ border: '1.5px solid var(--color-border)' }}
                            >
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - multiple)}
                                disabled={item.quantity <= minQty}
                                className="w-10 h-10 flex items-center justify-center transition-all disabled:opacity-40"
                                style={{
                                  background: 'var(--color-surface)',
                                  color: 'var(--color-text-primary)',
                                  fontSize: '16px',
                                }}
                                aria-label="Verminder aantal"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                readOnly
                                className="w-12 h-10 text-center font-semibold outline-none"
                                style={{
                                  fontFamily: 'JetBrains Mono, monospace',
                                  fontSize: '14px',
                                  color: 'var(--color-text-primary)',
                                }}
                              />
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + multiple)}
                                disabled={
                                  item.maxOrderQuantity
                                    ? item.quantity >= item.maxOrderQuantity
                                    : item.quantity >= item.stock
                                }
                                className="w-10 h-10 flex items-center justify-center transition-all disabled:opacity-40"
                                style={{
                                  background: 'var(--color-surface)',
                                  color: 'var(--color-text-primary)',
                                  fontSize: '16px',
                                }}
                                aria-label="Verhoog aantal"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div
                                className="font-extrabold mb-0.5"
                                style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: '18px',
                                  color: 'var(--color-text-primary)',
                                }}
                              >
                                €{(unitPrice * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                €{unitPrice.toFixed(2)}/stuk
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* DESKTOP LAYOUT */}
                        <div className="hidden lg:block">
                          <div className="p-5 flex gap-5 items-center">
                            {/* Product Image */}
                            <div
                              className="w-[100px] h-[100px] rounded-xl flex items-center justify-center text-4xl flex-shrink-0"
                              style={{ background: 'var(--color-surface)' }}
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              ) : (
                                '📦'
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              {/* Brand */}
                              <div
                                className="font-bold uppercase mb-1"
                                style={{
                                  fontSize: '11px',
                                  color: 'var(--color-primary)',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                {item.sku?.split('-')[0] || 'PRODUCT'}
                              </div>

                              {/* Product Name */}
                              <Link
                                href={`/shop/${item.slug}`}
                                className="font-semibold transition-colors hover:text-teal-600 block"
                                style={{ fontSize: '15px', color: 'var(--color-text-primary)' }}
                              >
                                {item.title}
                              </Link>

                              {/* Meta */}
                              <div
                                className="flex gap-3 flex-wrap mt-2 mb-2"
                                style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}
                              >
                                {item.sku && (
                                  <span className="flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    Art. {item.sku}
                                  </span>
                                )}
                                {item.ean && (
                                  <span className="flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    EAN: {item.ean}
                                  </span>
                                )}
                              </div>

                              {/* Stock */}
                              <div
                                className="flex items-center gap-1 font-medium"
                                style={{ fontSize: '12px', color: 'var(--color-success)' }}
                              >
                                <CheckCircle className="w-3 h-3" />
                                Op voorraad — morgen geleverd
                              </div>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex flex-col items-center gap-1 flex-shrink-0">
                              <div
                                className="flex rounded-xl overflow-hidden"
                                style={{ border: '1.5px solid var(--color-border)' }}
                              >
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - multiple)}
                                  disabled={item.quantity <= minQty}
                                  className="w-9 h-10 flex items-center justify-center transition-all disabled:opacity-40"
                                  style={{
                                    background: 'var(--color-surface)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: '16px',
                                  }}
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  readOnly
                                  className="w-11 h-10 text-center font-semibold outline-none"
                                  style={{
                                    fontFamily: 'JetBrains Mono, monospace',
                                    fontSize: '15px',
                                    color: 'var(--color-text-primary)',
                                  }}
                                />
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + multiple)}
                                  disabled={
                                    item.maxOrderQuantity
                                      ? item.quantity >= item.maxOrderQuantity
                                      : item.quantity >= item.stock
                                  }
                                  className="w-9 h-10 flex items-center justify-center transition-all disabled:opacity-40"
                                  style={{
                                    background: 'var(--color-surface)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: '16px',
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Price Column */}
                            <div className="text-right flex-shrink-0 min-w-[100px]">
                              <div
                                className="font-extrabold mb-0.5"
                                style={{
                                  fontFamily: 'var(--font-heading)',
                                  fontSize: '20px',
                                  color: 'var(--color-text-primary)',
                                }}
                              >
                                €{(unitPrice * item.quantity).toFixed(2)}
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                €{unitPrice.toFixed(2)}/stuk
                                {hasDiscount && ' · staffelprijs'}
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2 mt-1 justify-end">
                                <button
                                  className="text-xs flex items-center gap-1 px-2 py-1 transition-colors"
                                  style={{ color: 'var(--color-text-muted)' }}
                                >
                                  <ClipboardList className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-xs flex items-center gap-1 px-2 py-1 transition-colors hover:text-red-600"
                                  style={{ color: 'var(--color-text-muted)' }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Volume Pricing Hint */}
                        {showVolumeHint && (
                          <div
                            className="px-4 lg:px-5 py-3 flex items-center gap-2.5"
                            style={{
                              background: 'var(--color-warning-bg)',
                              borderTop: '1px solid #F0E68C',
                              fontSize: '12px',
                              color: '#7B6B00',
                            }}
                          >
                            <TrendingUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-warning)' }} />
                            <span>
                              Bestel er nog <strong>5 bij</strong> en betaal{' '}
                              <strong>€{(unitPrice * 0.93).toFixed(2)}/stuk</strong> (bespaar 7%)
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Cross-Sell Section */}
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

          {/* Right: Order Summary - Desktop Only */}
          <aside
            className="hidden lg:block rounded-2xl p-7 sticky top-[90px]"
            style={{ background: 'white', border: '1px solid var(--color-border)' }}
          >
            <h2
              className="flex items-center gap-2 font-extrabold mb-5"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                color: 'var(--color-text-primary)',
              }}
            >
              <Receipt className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              Overzicht bestelling
            </h2>

            {/* Rows */}
            <div className="space-y-2.5 mb-5">
              <div className="flex justify-between items-center py-2.5" style={{ fontSize: '14px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Subtotaal ({itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'})
                </span>
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  €{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5" style={{ fontSize: '14px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Verzending</span>
                <span
                  className="font-semibold"
                  style={{ color: shipping === 0 ? 'var(--color-success)' : 'var(--color-text-primary)' }}
                >
                  {shipping === 0 ? 'Gratis' : `€${shipping.toFixed(2)}`}
                </span>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />

              <div className="flex justify-between items-center py-2.5" style={{ fontSize: '14px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Subtotaal excl. BTW</span>
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  €{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5" style={{ fontSize: '14px' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>BTW (21%)</span>
                <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  €{tax.toFixed(2)}
                </span>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />

              <div className="flex justify-between items-baseline py-3.5">
                <span className="font-bold" style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                  Totaal
                </span>
                <span
                  className="font-extrabold"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '28px',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  €{grandTotal.toFixed(2)}
                </span>
              </div>
              <div className="text-right" style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Incl. BTW · excl. BTW: €{subtotal.toFixed(2)}
              </div>
            </div>

            {/* Coupon Code */}
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Kortingscode"
                className="flex-1 px-3.5 py-3 rounded-xl outline-none transition-all"
                style={{
                  border: '1.5px solid var(--color-border)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <button
                className="px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap"
                style={{
                  background: 'var(--color-surface)',
                  border: '1.5px solid var(--color-border)',
                  fontSize: '14px',
                  color: 'var(--color-text-primary)',
                }}
              >
                Toepassen
              </button>
            </div>

            {/* CTA Buttons */}
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2.5 px-4 py-4 rounded-xl font-bold mb-3 transition-all hover:-translate-y-0.5"
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                fontSize: '16px',
                boxShadow: '0 4px 20px color-mix(in srgb, var(--color-primary) 40%, transparent)',
              }}
            >
              <Lock className="w-5 h-5" />
              Afrekenen
            </Link>

            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold transition-all"
              style={{
                background: 'white',
                border: '1.5px solid var(--color-border)',
                fontSize: '14px',
                color: 'var(--color-text-primary)',
              }}
            >
              <FileText className="w-4 h-4" />
              Offerte aanvragen
            </button>

            {/* Trust Badges */}
            <div
              className="space-y-2 mt-5 pt-5"
              style={{ borderTop: '1px solid var(--color-border)', fontSize: '13px', color: 'var(--color-text-secondary)' }}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                <span>Veilig betalen via iDEAL, op rekening of creditcard</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                <span>Gratis verzending vanaf €150</span>
              </div>
              <div className="flex items-center gap-2">
                <Undo2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                <span>30 dagen retourrecht</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                <span>Vragen? Bel ons direct</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ========================================
          MOBILE STICKY CHECKOUT BAR
          ======================================== */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50"
        style={{
          borderTop: '1px solid var(--color-border)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Totaal
            </div>
            <div
              className="font-extrabold text-xl"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-text-primary)',
              }}
            >
              €{grandTotal.toFixed(2)}
            </div>
          </div>
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all"
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              fontSize: '15px',
              boxShadow: '0 4px 20px color-mix(in srgb, var(--color-primary) 40%, transparent)',
              minHeight: '48px',
            }}
          >
            <Lock className="w-4 h-4" />
            Afrekenen
          </Link>
        </div>
      </div>
    </div>
  )
}
