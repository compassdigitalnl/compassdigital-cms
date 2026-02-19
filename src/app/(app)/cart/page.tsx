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
} from 'lucide-react'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()
  const [couponCode, setCouponCode] = useState('')

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: '#F5F7FA' }}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto p-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: '#E8ECF1' }}
            >
              <ShoppingCart className="w-10 h-10" style={{ color: '#94A3B8' }} />
            </div>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0A1628' }}
            >
              Je winkelwagen is leeg
            </h2>
            <p className="mb-6" style={{ fontSize: '15px', color: '#94A3B8' }}>
              Voeg producten toe aan je winkelwagen om te beginnen met winkelen.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white rounded-xl font-bold transition-all"
              style={{
                background: 'linear-gradient(135deg, #00897B, #26A69A)',
                boxShadow: '0 4px 20px rgba(0,137,123,0.3)',
                fontSize: '15px',
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
    <div className="min-h-screen" style={{ background: '#F5F7FA' }}>
      {/* Breadcrumb */}
      <div style={{ padding: '16px 0' }}>
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex items-center gap-2" style={{ fontSize: '13px' }}>
            <Link href="/" className="transition-colors" style={{ color: '#94A3B8' }}>
              Home
            </Link>
            <ArrowRight className="w-3.5 h-3.5" style={{ color: '#E8ECF1' }} />
            <span style={{ color: '#0A1628', fontWeight: 600 }}>Winkelwagen</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-7">
          <h1
            className="flex items-center gap-3 text-3xl font-extrabold"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#0A1628' }}
          >
            <ShoppingCart className="w-7 h-7" style={{ color: '#00897B' }} />
            Winkelwagen
            <span
              className="text-base font-medium"
              style={{ color: '#94A3B8', fontFamily: 'DM Sans, sans-serif' }}
            >
              ({itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'})
            </span>
          </h1>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 font-semibold transition-all hover:gap-2.5"
            style={{ color: '#00897B', fontSize: '14px' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Verder winkelen
          </Link>
        </div>

        {/* Free Shipping Progress Bar */}
        {shipping > 0 && (
          <div
            className="rounded-2xl p-5 mb-6 flex items-center gap-4"
            style={{ background: 'white', border: '1px solid #E8ECF1' }}
          >
            <Truck className="w-6 h-6 flex-shrink-0" style={{ color: '#00897B' }} />
            <div className="flex-1">
              <div className="font-semibold mb-2" style={{ fontSize: '14px', color: '#0A1628' }}>
                Nog <span style={{ color: '#00897B' }}>€{amountToFreeShipping.toFixed(2)}</span> tot
                gratis verzending!
              </div>
              <div
                className="h-2 rounded overflow-hidden"
                style={{ background: '#E8ECF1' }}
              >
                <div
                  className="h-full rounded transition-all duration-500"
                  style={{
                    background: 'linear-gradient(90deg, #00897B, #26A69A)',
                    width: `${progressPercent}%`,
                  }}
                />
              </div>
              <div className="mt-1" style={{ fontSize: '12px', color: '#94A3B8' }}>
                Gratis verzending vanaf €{freeShippingThreshold.toFixed(2)} · Je zit nu op €
                {total.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Cart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start pb-20">
          {/* Left: Cart Items */}
          <div className="space-y-3">
            {groupedItems.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Parent Product Header */}
                {group.parentProduct && (
                  <div
                    className="rounded-xl p-4 mb-2 flex items-center gap-2"
                    style={{
                      background: 'rgba(0,137,123,0.08)',
                      border: '1px solid rgba(0,137,123,0.2)',
                    }}
                  >
                    <Package className="w-5 h-5" style={{ color: '#00897B' }} />
                    <h3 className="font-semibold" style={{ color: '#00897B' }}>
                      {group.parentProduct.title}
                    </h3>
                    <span className="text-sm" style={{ color: '#00897B' }}>
                      ({group.items.length} {group.items.length === 1 ? 'product' : 'producten'})
                    </span>
                  </div>
                )}

                {/* Cart Card */}
                <div
                  className="rounded-2xl overflow-hidden transition-all hover:shadow-sm"
                  style={{ background: 'white', border: '1px solid #E8ECF1' }}
                >
                  {group.items.map((item, itemIndex) => {
                    const unitPrice = item.unitPrice ?? item.price
                    const hasDiscount = item.unitPrice && item.unitPrice < item.price
                    const minQty = item.minOrderQuantity || 1
                    const multiple = item.orderMultiple || 1

                    // Calculate volume pricing hint (mock - in real app, fetch from product data)
                    const showVolumeHint = hasDiscount && item.quantity < 10

                    return (
                      <div
                        key={item.id}
                        style={{
                          borderBottom:
                            itemIndex < group.items.length - 1 ? '1px solid #E8ECF1' : 'none',
                        }}
                      >
                        <div className="p-5 flex gap-5 items-center">
                          {/* Product Image */}
                          <div
                            className="w-[100px] h-[100px] rounded-xl flex items-center justify-center text-4xl flex-shrink-0"
                            style={{ background: '#F5F7FA' }}
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
                                color: '#00897B',
                                letterSpacing: '0.05em',
                              }}
                            >
                              {item.sku?.split('-')[0] || 'PRODUCT'}
                            </div>

                            {/* Product Name */}
                            <Link
                              href={`/shop/${item.slug}`}
                              className="font-semibold transition-colors hover:text-teal-600 block"
                              style={{ fontSize: '15px', color: '#0A1628' }}
                            >
                              {item.title}
                            </Link>

                            {/* Meta */}
                            <div
                              className="flex gap-3 flex-wrap mt-2 mb-2"
                              style={{ fontSize: '12px', color: '#94A3B8' }}
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
                              style={{ fontSize: '12px', color: '#00C853' }}
                            >
                              <CheckCircle className="w-3 h-3" />
                              Op voorraad — morgen geleverd
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col items-center gap-1 flex-shrink-0">
                            <div
                              className="flex rounded-xl overflow-hidden"
                              style={{ border: '1.5px solid #E8ECF1' }}
                            >
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - multiple)}
                                disabled={item.quantity <= minQty}
                                className="w-9 h-10 flex items-center justify-center transition-all disabled:opacity-40"
                                style={{
                                  background: '#F5F7FA',
                                  color: '#0A1628',
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
                                  color: '#0A1628',
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
                                  background: '#F5F7FA',
                                  color: '#0A1628',
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
                                fontFamily: 'Plus Jakarta Sans, sans-serif',
                                fontSize: '20px',
                                color: '#0A1628',
                              }}
                            >
                              €{(unitPrice * item.quantity).toFixed(2)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                              €{unitPrice.toFixed(2)}/{item.quantity > 1 ? 'stuk' : 'stuk'}
                              {hasDiscount && ' · staffelprijs'}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-1 justify-end">
                              <button
                                className="text-xs flex items-center gap-1 px-2 py-1 transition-colors"
                                style={{ color: '#94A3B8' }}
                              >
                                <ClipboardList className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-xs flex items-center gap-1 px-2 py-1 transition-colors hover:text-red-600"
                                style={{ color: '#94A3B8' }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Volume Pricing Hint */}
                        {showVolumeHint && (
                          <div
                            className="px-5 py-3 flex items-center gap-2.5"
                            style={{
                              background: '#FFF8E1',
                              borderTop: '1px solid #F0E68C',
                              fontSize: '13px',
                              color: '#7B6B00',
                            }}
                          >
                            <TrendingUp className="w-4 h-4 flex-shrink-0" style={{ color: '#F59E0B' }} />
                            <span>
                              Bestel er nog <strong>5 bij</strong> en betaal slechts{' '}
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
            <div className="mt-8">
              <h3
                className="flex items-center gap-2 font-extrabold mb-4"
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '20px',
                  color: '#0A1628',
                }}
              >
                <Sparkles className="w-5 h-5" style={{ color: '#00897B' }} />
                Vaak samen besteld
              </h3>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {crossSellProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[200px] rounded-2xl overflow-hidden transition-all hover:-translate-y-1 cursor-pointer"
                    style={{
                      background: 'white',
                      border: '1px solid #E8ECF1',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div
                      className="h-[120px] flex items-center justify-center text-4xl"
                      style={{ background: '#F5F7FA' }}
                    >
                      {product.image}
                    </div>
                    <div className="p-3.5">
                      <div
                        className="font-bold uppercase mb-1"
                        style={{
                          fontSize: '10px',
                          color: '#00897B',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {product.brand}
                      </div>
                      <div
                        className="font-semibold mb-2 line-clamp-2"
                        style={{ fontSize: '13px', color: '#0A1628', lineHeight: '1.3' }}
                      >
                        {product.name}
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="font-extrabold"
                          style={{
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            fontSize: '16px',
                            color: '#0A1628',
                          }}
                        >
                          €{product.price.toFixed(2)}
                        </span>
                        <button
                          className="w-[34px] h-[34px] rounded-lg flex items-center justify-center transition-colors"
                          style={{ background: '#00897B', color: 'white' }}
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

          {/* Right: Order Summary */}
          <aside
            className="rounded-2xl p-7 sticky top-[90px]"
            style={{ background: 'white', border: '1px solid #E8ECF1' }}
          >
            <h2
              className="flex items-center gap-2 font-extrabold mb-5"
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '18px',
                color: '#0A1628',
              }}
            >
              <Receipt className="w-5 h-5" style={{ color: '#00897B' }} />
              Overzicht bestelling
            </h2>

            {/* Rows */}
            <div className="space-y-2.5 mb-5">
              <div className="flex justify-between items-center py-2.5" style={{ fontSize: '14px' }}>
                <span style={{ color: '#64748B' }}>
                  Subtotaal ({itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'})
                </span>
                <span className="font-semibold" style={{ color: '#0A1628' }}>
                  €{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5" style={{ fontSize: '14px' }}>
                <span style={{ color: '#64748B' }}>Verzending</span>
                <span
                  className="font-semibold"
                  style={{ color: shipping === 0 ? '#00C853' : '#0A1628' }}
                >
                  {shipping === 0 ? 'Gratis' : `€${shipping.toFixed(2)}`}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #E8ECF1', margin: '8px 0' }} />

              <div className="flex justify-between items-center py-2.5" style={{ fontSize: '14px' }}>
                <span style={{ color: '#64748B' }}>Subtotaal excl. BTW</span>
                <span className="font-semibold" style={{ color: '#0A1628' }}>
                  €{subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5" style={{ fontSize: '14px' }}>
                <span style={{ color: '#64748B' }}>BTW (21%)</span>
                <span className="font-semibold" style={{ color: '#0A1628' }}>
                  €{tax.toFixed(2)}
                </span>
              </div>

              <div style={{ borderTop: '1px solid #E8ECF1', margin: '8px 0' }} />

              <div className="flex justify-between items-baseline py-3.5">
                <span className="font-bold" style={{ fontSize: '16px', color: '#0A1628' }}>
                  Totaal
                </span>
                <span
                  className="font-extrabold"
                  style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '28px',
                    color: '#0A1628',
                  }}
                >
                  €{grandTotal.toFixed(2)}
                </span>
              </div>
              <div className="text-right" style={{ fontSize: '12px', color: '#94A3B8' }}>
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
                  border: '1.5px solid #E8ECF1',
                  fontSize: '14px',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              />
              <button
                className="px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap"
                style={{
                  background: '#F5F7FA',
                  border: '1.5px solid #E8ECF1',
                  fontSize: '14px',
                  color: '#0A1628',
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
                background: 'linear-gradient(135deg, #00897B, #26A69A)',
                color: 'white',
                fontSize: '16px',
                boxShadow: '0 4px 20px rgba(0,137,123,0.4)',
              }}
            >
              <Lock className="w-5 h-5" />
              Afrekenen
            </Link>

            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold transition-all"
              style={{
                background: 'white',
                border: '1.5px solid #E8ECF1',
                fontSize: '14px',
                color: '#0A1628',
              }}
            >
              <FileText className="w-4 h-4" />
              Offerte aanvragen
            </button>

            {/* Trust Badges */}
            <div
              className="space-y-2 mt-5 pt-5"
              style={{ borderTop: '1px solid #E8ECF1', fontSize: '13px', color: '#64748B' }}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#00897B' }} />
                <span>Veilig betalen via iDEAL, op rekening of creditcard</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 flex-shrink-0" style={{ color: '#00897B' }} />
                <span>Gratis verzending vanaf €150</span>
              </div>
              <div className="flex items-center gap-2">
                <Undo2 className="w-4 h-4 flex-shrink-0" style={{ color: '#00897B' }} />
                <span>30 dagen retourrecht</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 flex-shrink-0" style={{ color: '#00897B' }} />
                <span>Vragen? Bel ons direct</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
