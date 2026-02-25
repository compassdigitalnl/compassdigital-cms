'use client'

/**
 * CartTemplate1 - Table Layout (Enterprise)
 *
 * Features:
 * - Empty cart state with CTA
 * - Cart items using CartLineItem component
 * - Order summary using OrderSummary component
 * - Coupon input using CouponInput component
 * - Free shipping progress using FreeShippingProgress component
 * - Trust signals using TrustSignals component
 * - Responsive: Table on desktop, cards on mobile
 *
 * Built with Phase 1 components - 100% component reuse
 */

import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'

// Phase 1 Components
import { CartLineItem } from '@/branches/ecommerce/components/ui/CartLineItem'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary'
import { CouponInput } from '@/branches/ecommerce/components/ui/CouponInput'
import { FreeShippingProgress } from '@/branches/ecommerce/components/ui/FreeShippingProgress'
import { TrustSignals } from '@/branches/shared/components/ui/TrustSignals'

interface CartTemplate1Props {
  onCheckout?: () => void
}

export default function CartTemplate1({ onCheckout }: CartTemplate1Props) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()

  // Pricing calculations
  const subtotal = total
  const freeShippingThreshold = 150
  const shipping = subtotal >= freeShippingThreshold ? 0 : 6.95
  const tax = (subtotal + shipping) * 0.21
  const grandTotal = subtotal + shipping + tax
  const discount = 0 // TODO: Implement discount logic

  const handleCheckout = () => {
    if (onCheckout) onCheckout()
    window.location.href = '/checkout'
  }

  const handleApplyCoupon = async (code: string) => {
    // TODO: Implement coupon validation
    console.log('Applying coupon:', code)
    return { valid: false, message: 'Kortingscode niet gevonden' }
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
        <div className="container mx-auto px-4 py-12 lg:py-20">
          <div className="max-w-md mx-auto text-center">
            {/* Empty cart icon */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'var(--color-border)' }}
            >
              <ShoppingCart className="w-10 h-10" style={{ color: 'var(--color-text-muted)' }} />
            </div>

            {/* Empty cart message */}
            <h1
              className="text-2xl lg:text-3xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              Je winkelwagen is leeg
            </h1>
            <p className="mb-8 text-base" style={{ color: 'var(--color-text-muted)' }}>
              Voeg producten toe aan je winkelwagen om te beginnen met winkelen.
            </p>

            {/* CTA to shop */}
            <Link
              href="/shop/"
              className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-xl font-bold transition-all hover:opacity-90"
              style={{
                background: 'var(--color-primary)',
                boxShadow: 'var(--shadow)',
              }}
            >
              <ArrowLeft className="w-5 h-5" />
              Ga naar shop
            </Link>

            {/* Trust signals */}
            <div className="mt-12">
              <TrustSignals variant="compact" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Cart with items
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-2xl lg:text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
          >
            Winkelwagen
          </h1>
          <p className="text-sm lg:text-base" style={{ color: 'var(--color-text-muted)' }}>
            {itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'} in je winkelwagen
          </p>
        </div>

        {/* Free shipping progress */}
        <div className="mb-6">
          <FreeShippingProgress currentAmount={subtotal} threshold={freeShippingThreshold} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left column - Cart items (2/3 width) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Continue shopping link */}
            <Link
              href="/shop/"
              className="inline-flex items-center gap-2 text-sm font-semibold mb-2 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-primary)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Verder winkelen
            </Link>

            {/* Cart items */}
            <div className="space-y-4">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  onQuantityChange={(newQty) => updateQuantity(item.id, newQty)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>

            {/* Trust signals (desktop) */}
            <div className="hidden lg:block mt-8">
              <TrustSignals
                variant="horizontal"
                signals={[
                  {
                    icon: 'ShieldCheck',
                    label: 'Veilig betalen',
                    description: 'SSL beveiligd',
                  },
                  {
                    icon: 'Truck',
                    label: 'Gratis verzending',
                    description: 'Vanaf €150',
                  },
                  {
                    icon: 'RotateCcw',
                    label: '30 dagen retour',
                    description: 'Geen vragen',
                  },
                  {
                    icon: 'Headphones',
                    label: 'Klantenservice',
                    description: 'Ma-vr 9-17u',
                  },
                ]}
              />
            </div>
          </div>

          {/* Right column - Order summary (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Order summary */}
              <OrderSummary
                variant="default"
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={grandTotal}
                discount={discount}
                itemCount={itemCount}
                freeShippingThreshold={freeShippingThreshold}
                currency="€"
              >
                {/* Coupon input slot */}
                <div className="mb-4">
                  <CouponInput onApply={handleApplyCoupon} />
                </div>

                {/* Checkout button */}
                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white rounded-xl font-bold transition-all hover:opacity-90"
                  style={{
                    background: 'var(--color-primary)',
                    boxShadow: 'var(--shadow)',
                  }}
                >
                  Naar checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Secure checkout badge */}
                <div
                  className="mt-4 flex items-center justify-center gap-2 text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  <ShieldCheck className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                  <span>Veilig afrekenen met SSL-beveiliging</span>
                </div>
              </OrderSummary>

              {/* Trust signals (mobile) */}
              <div className="lg:hidden mt-6">
                <TrustSignals variant="compact" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
