'use client'

import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import type { CartItem } from '@/branches/ecommerce/contexts/CartContext'
import Link from 'next/link'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Lock,
  Heart,
  Package,
  Truck,
  RotateCcw,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'

interface CartTemplate2Props {
  onCheckout?: () => void
}

export default function CartTemplate2({ onCheckout }: CartTemplate2Props) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()
  const [couponCode, setCouponCode] = useState('')

  // Shipping threshold (should come from Settings global in production)
  const freeShippingThreshold = 150
  const shippingProgress = Math.min((total / freeShippingThreshold) * 100, 100)
  const remainingForFreeShipping = Math.max(freeShippingThreshold - total, 0)
  const hasReachedFreeShipping = total >= freeShippingThreshold

  const handleCheckout = () => {
    if (onCheckout) onCheckout()
    // Navigate to checkout
    window.location.href = '/checkout'
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--color-surface, #f8f9fb)' }}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto p-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'var(--color-border, #e2e8f0)' }}
            >
              <ShoppingCart className="w-10 h-10" style={{ color: 'var(--color-text-muted, #64748b)' }} />
            </div>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary, #1e293b)' }}
            >
              Je winkelwagen is leeg
            </h2>
            <p className="mb-6" style={{ color: 'var(--color-text-muted, #64748b)' }}>
              Voeg producten toe om te beginnen met winkelen.
            </p>
            <Link
              href="/shop/"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white rounded-xl font-bold transition-all hover:opacity-90"
              style={{
                background: 'var(--color-primary, #00897b)',
                boxShadow: 'var(--shadow, 0 4px 20px rgba(0,0,0,0.08))',
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

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface, #f8f9fb)' }}>
      {/* Step Indicator */}
      <div className="bg-white border-b" style={{ borderColor: 'var(--color-border, #e2e8f0)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-center gap-0">
            <StepItem number={1} label="Winkelwagen" active />
            <StepLine />
            <StepItem number={2} label="Gegevens" />
            <StepLine />
            <StepItem number={3} label="Betaling" />
            <StepLine />
            <StepItem number={4} label="Bevestiging" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-end mb-7">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary, #1e293b)' }}
            >
              Uw winkelwagen
            </h1>
            <p style={{ color: 'var(--color-text-muted, #64748b)', fontSize: '14px' }}>
              {itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'} — Laatst bijgewerkt zojuist
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/shop/"
              className="px-4 py-2 rounded-lg border font-semibold text-sm transition-colors hover:bg-gray-50"
              style={{
                borderColor: 'var(--color-border, #cbd5e1)',
                color: 'var(--color-text-muted, #64748b)',
              }}
            >
              ← Verder winkelen
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left: Product Cards */}
          <div>
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Coupon Bar */}
            <div
              className="mt-4 p-4 rounded-xl border"
              style={{
                background: 'white',
                borderColor: 'var(--color-border, #e2e8f0)',
                boxShadow: 'var(--shadow, 0 1px 3px rgba(0,0,0,0.06))',
              }}
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex gap-2 flex-1 min-w-[240px]">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Kortingscode invoeren..."
                    className="flex-1 px-4 py-2.5 rounded-lg border outline-none focus:border-current transition-colors"
                    style={{
                      borderColor: 'var(--color-border, #e2e8f0)',
                      fontSize: '13px',
                    }}
                  />
                  <button
                    className="px-5 py-2.5 text-white rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
                    style={{ background: 'var(--color-secondary, #0a2647)' }}
                  >
                    Toepassen
                  </button>
                </div>
                <Link
                  href="/shop/"
                  className="font-semibold text-sm transition-opacity hover:opacity-80"
                  style={{ color: 'var(--color-primary, #00897b)' }}
                >
                  ← Verder winkelen
                </Link>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">
            {/* Shipping Progress */}
            <ShippingProgress
              currentTotal={total}
              threshold={freeShippingThreshold}
              progress={shippingProgress}
              hasReached={hasReachedFreeShipping}
              remaining={remainingForFreeShipping}
            />

            {/* Summary Card */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                background: 'white',
                borderColor: 'var(--color-border, #e2e8f0)',
                boxShadow: 'var(--shadow-lg, 0 8px 32px rgba(0,0,0,0.1))',
              }}
            >
              {/* Header */}
              <div className="p-5" style={{ background: 'var(--color-secondary, #0a2647)' }}>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                  Besteloverzicht
                </h3>
              </div>

              {/* Body */}
              <div className="p-6">
                <SummaryRow label={`Subtotaal (${itemCount} items)`} value={`€${total.toFixed(2)}`} />
                <SummaryRow
                  label="Verzending"
                  value={hasReachedFreeShipping ? 'Gratis' : '€6,95'}
                  valueColor={hasReachedFreeShipping ? 'var(--color-success, #16a34a)' : undefined}
                  bold={hasReachedFreeShipping}
                />

                <div className="h-px my-2" style={{ background: 'var(--color-border, #e2e8f0)' }} />

                <div className="flex justify-between items-baseline py-4">
                  <span className="font-bold" style={{ color: 'var(--color-text-primary)', fontSize: '16px' }}>
                    Totaal
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '32px',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    €{(hasReachedFreeShipping ? total : total + 6.95).toFixed(2)}
                  </span>
                </div>

                <p className="text-right text-xs mb-5" style={{ color: 'var(--color-text-muted, #94a3b8)' }}>
                  Inclusief €{((hasReachedFreeShipping ? total : total + 6.95) * 0.21).toFixed(2)} BTW
                </p>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 relative overflow-hidden group"
                  style={{ background: 'var(--color-primary, #00897b)', fontSize: '16px' }}
                >
                  <Lock className="w-5 h-5" />
                  Doorgaan naar betaling
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                </button>

                <button
                  className="w-full mt-2 py-3 text-white rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ background: 'var(--color-secondary, #0a2647)' }}
                >
                  📋 Offerte aanvragen
                </button>

                <div className="flex justify-center gap-1.5 pt-4">
                  {['iDEAL', 'Visa', 'Mastercard', 'Op rekening', 'PayPal'].map((method) => (
                    <span
                      key={method}
                      className="px-2 py-1 rounded text-[10px] font-bold"
                      style={{
                        background: 'var(--color-surface, #f1f5f9)',
                        color: 'var(--color-text-muted, #64748b)',
                      }}
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Card */}
            <TrustCard />
          </div>
        </div>

        {/* Recently Viewed Section */}
        <RecentlyViewedSection />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function StepItem({ number, label, active = false }: { number: number; label: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 text-sm font-semibold" style={{ color: active ? 'var(--color-primary, #00897b)' : 'var(--color-text-muted, #94a3b8)' }}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-colors"
        style={{
          borderColor: active ? 'var(--color-primary, #00897b)' : 'var(--color-border, #cbd5e1)',
          background: active ? 'var(--color-primary, #00897b)' : 'transparent',
          color: active ? 'white' : 'var(--color-text-muted, #94a3b8)',
        }}
      >
        {number}
      </div>
      <span className="hidden sm:inline">{label}</span>
    </div>
  )
}

function StepLine() {
  return (
    <div className="w-12 sm:w-16 h-0.5 mx-3" style={{ background: 'var(--color-border, #e2e8f0)' }} />
  )
}

function ProductCard({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem
  onUpdateQuantity: (id: number | string, quantity: number) => void
  onRemove: (id: number | string) => void
}) {
  return (
    <div
      className="grid grid-cols-[120px_1fr] sm:grid-cols-[120px_1fr_auto] gap-0 rounded-xl border overflow-hidden transition-shadow hover:shadow-md"
      style={{
        background: 'white',
        borderColor: 'var(--color-border, #e2e8f0)',
        boxShadow: 'var(--shadow, 0 1px 3px rgba(0,0,0,0.06))',
      }}
    >
      {/* Image */}
      <div
        className="w-[120px] min-h-[140px] flex items-center justify-center text-5xl border-r"
        style={{
          background: 'linear-gradient(135deg, var(--color-surface, #f8fafc), var(--color-border, #f1f5f9))',
          borderColor: 'var(--color-border, #f1f5f9)',
        }}
      >
        📦
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col justify-center min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary, #00897b)' }}>
          {item.brand || 'Brand'}
        </div>
        <h3 className="font-bold text-base mb-1 truncate" style={{ color: 'var(--color-text-primary, #1e293b)' }}>
          {item.title}
        </h3>
        <div className="text-xs mb-2" style={{ color: 'var(--color-text-muted, #94a3b8)' }}>
          Art. {item.sku || 'N/A'}
        </div>
        <div className="flex items-center gap-4 flex-wrap text-xs">
          <span className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--color-success, #16a34a)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-success, #16a34a)' }} />
            Op voorraad
          </span>
          <span className="flex items-center gap-1" style={{ color: 'var(--color-text-muted, #64748b)' }}>
            <Package className="w-3.5 h-3.5" />
            Morgen geleverd
          </span>
          <button className="flex items-center gap-1 transition-colors hover:text-current" style={{ color: 'var(--color-text-muted, #94a3b8)' }}>
            <Heart className="w-3.5 h-3.5" />
            Bewaren
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="p-5 flex flex-col items-end justify-center gap-3 border-t sm:border-t-0 sm:border-l col-span-2 sm:col-span-1 min-w-[160px]" style={{ borderColor: 'var(--color-border, #f1f5f9)' }}>
        <div className="text-right">
          <div className="text-xl font-extrabold" style={{ color: 'var(--color-text-primary, #1e293b)' }}>
            €{item.price.toFixed(2)}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted, #94a3b8)' }}>
            per stuk
          </div>
        </div>

        <div className="flex items-center border-2 rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border, #e2e8f0)' }}>
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-gray-100"
            style={{ color: 'var(--color-text-muted, #64748b)' }}
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
            className="w-11 h-9 text-center border-x font-bold text-sm outline-none"
            style={{ borderColor: 'var(--color-border, #e2e8f0)' }}
          />
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-gray-100"
            style={{ color: 'var(--color-text-muted, #64748b)' }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="text-right text-xs" style={{ color: 'var(--color-text-muted, #64748b)' }}>
          Subtotaal: <strong className="text-sm" style={{ color: 'var(--color-text-primary, #1e293b)' }}>€{(item.price * item.quantity).toFixed(2)}</strong>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="text-xs font-semibold transition-colors"
          style={{ color: 'var(--color-text-muted, #94a3b8)' }}
        >
          ✕ Verwijderen
        </button>
      </div>
    </div>
  )
}

function ShippingProgress({
  currentTotal,
  threshold,
  progress,
  hasReached,
  remaining,
}: {
  currentTotal: number
  threshold: number
  progress: number
  hasReached: boolean
  remaining: number
}) {
  return (
    <div
      className="p-5 rounded-xl border"
      style={{
        background: hasReached ? 'var(--color-success-bg, #f0fdf4)' : 'var(--color-primary-bg, #e0f2f1)',
        borderColor: hasReached ? 'var(--color-success-border, #bbf7d0)' : 'var(--color-primary-border, #b2dfdb)',
      }}
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="text-xl">{hasReached ? '🎉' : '🚚'}</span>
        <span className="font-semibold text-sm" style={{ color: hasReached ? 'var(--color-success, #16a34a)' : 'var(--color-primary, #00897b)' }}>
          {hasReached ? 'Gratis verzending bereikt!' : `Nog €${remaining.toFixed(2)} tot gratis verzending!`}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.1)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: hasReached ? 'var(--color-success, #16a34a)' : 'var(--color-primary, #00897b)',
          }}
        />
      </div>
      <div className="text-center text-xs font-semibold mt-2" style={{ color: hasReached ? 'var(--color-success, #16a34a)' : 'var(--color-primary, #00897b)' }}>
        {hasReached ? '✓ Uw bestelling wordt gratis verzonden' : `€${currentTotal.toFixed(2)} / €${threshold.toFixed(2)}`}
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  valueColor,
  bold,
}: {
  label: string
  value: string
  valueColor?: string
  bold?: boolean
}) {
  return (
    <div className="flex justify-between items-center py-2 text-sm" style={{ color: 'var(--color-text-muted, #64748b)' }}>
      <span>{label}</span>
      <span
        className={bold ? 'font-bold' : 'font-semibold'}
        style={{
          color: valueColor || 'var(--color-text-primary, #1e293b)',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function TrustCard() {
  const items = [
    { icon: Lock, label: 'SSL beveiligd' },
    { icon: Truck, label: 'Morgen in huis' },
    { icon: RotateCcw, label: '30 dagen retour' },
    { icon: Phone, label: 'Persoonlijk advies' },
  ]

  return (
    <div
      className="p-5 rounded-xl border"
      style={{
        background: 'white',
        borderColor: 'var(--color-border, #e2e8f0)',
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--color-text-muted, #64748b)' }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-primary-bg, #e0f2f1)' }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: 'var(--color-primary, #00897b)' }} />
            </div>
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentlyViewedSection() {
  // Mock data - should come from user session/history
  const recentProducts = [
    { id: 1, name: 'ThermoScan 7 Oorthermometer', brand: 'Braun', price: 49.95, icon: '🌡️' },
    { id: 2, name: 'Mondkapjes Type IIR (50st)', brand: '3M', price: 7.95, icon: '😷' },
    { id: 3, name: 'Vacutainer Naaldhouder', brand: 'BD', price: 3.25, icon: '🧪' },
    { id: 4, name: 'Peha-soft Onderzoekshandschoen L', brand: 'Hartmann', price: 11.5, icon: '🩻' },
  ]

  return (
    <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--color-border, #e2e8f0)' }}>
      <h2 className="text-2xl font-bold mb-5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
        Recent bekeken
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {recentProducts.map((product) => (
          <div
            key={product.id}
            className="p-4 bg-white rounded-xl border text-center cursor-pointer transition-all hover:shadow-md"
            style={{ borderColor: 'var(--color-border, #e2e8f0)' }}
          >
            <div
              className="w-15 h-15 mx-auto mb-2.5 rounded-xl flex items-center justify-center text-3xl"
              style={{ background: 'var(--color-surface, #f1f5f9)' }}
            >
              {product.icon}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary, #00897b)' }}>
              {product.brand}
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              {product.name}
            </div>
            <div className="text-sm font-extrabold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              €{product.price.toFixed(2)}
            </div>
            <button
              className="w-full py-1.5 text-white rounded-md text-xs font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--color-primary, #00897b)' }}
            >
              + Toevoegen
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
