'use client'

/**
 * CartTemplate2 - Card Layout (Minimal)
 *
 * Features:
 * - Modern card-based design
 * - Cleaner minimal aesthetic
 * - Same components as Template1 but different layout
 * - Mobile-first responsive design
 * - Compact order summary
 *
 * Built with Phase 1 components - 100% component reuse
 */

import { useState } from 'react'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react'

// Phase 1 Components
import { CartLineItem } from '@/branches/ecommerce/components/ui/CartLineItem'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary'
import { CouponInput } from '@/branches/ecommerce/components/ui/CouponInput'
import { FreeShippingProgress } from '@/branches/ecommerce/components/ui/FreeShippingProgress'
import { TrustSignals } from '@/branches/shared/components/ui/TrustSignals'

interface CartTemplate2Props {
  onCheckout?: () => void
}

export default function CartTemplate2({ onCheckout }: CartTemplate2Props) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | undefined>()
  const [couponError, setCouponError] = useState('')

  // Pricing calculations
  const subtotal = total
  const freeShippingThreshold = 150
  const shipping = subtotal >= freeShippingThreshold ? 0 : 6.95
  const discount = appliedCoupon?.discountAmount || 0
  const tax = (subtotal + shipping - discount) * 0.21
  const grandTotal = subtotal + shipping + tax - discount

  const handleCheckout = () => {
    if (onCheckout) onCheckout()
    window.location.href = '/checkout'
  }

  const handleApplyCoupon = async (code: string) => {
    setCouponError('')
    if (code.toUpperCase() === 'WELCOME10') {
      setAppliedCoupon({ code: code.toUpperCase(), discountAmount: subtotal * 0.1 })
    } else {
      setCouponError('Kortingscode niet gevonden')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(undefined)
    setCouponError('')
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="max-w-lg mx-auto px-4 text-center">
          {/* Minimal empty icon */}
          <div className="mb-6">
            <ShoppingCart className="w-16 h-16 mx-auto" style={{ color: 'var(--color-text-muted)', opacity: 0.3 }} />
          </div>

          {/* Minimal message */}
          <h1
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
          >
            Winkelwagen is leeg
          </h1>
          <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
            Begin met winkelen
          </p>

          {/* Minimal CTA */}
          <Link
            href="/shop/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{ color: 'var(--color-primary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Naar shop
          </Link>
        </div>
      </div>
    )
  }

  // Cart with items - Minimal card layout
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Minimal header */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}
            >
              Winkelwagen
            </h1>
            <Link
              href="/shop/"
              className="text-sm font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-primary)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Shop
            </Link>
          </div>

          {/* Compact free shipping progress */}
          <FreeShippingProgress currentTotal={subtotal} threshold={freeShippingThreshold} />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart items - full width cards */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  product={{
                    id: String(item.id),
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    sku: item.sku,
                    stockStatus: item.stock > 10 ? 'in-stock' : item.stock > 0 ? 'low-stock' : 'out-of-stock',
                    stockQuantity: item.stock,
                  }}
                  quantity={item.quantity}
                  onQuantityChange={(newQty: number) => updateQuantity(item.id, newQty)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>

            {/* Compact order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                {/* Coupon input */}
                <div className="mb-3">
                  <CouponInput
                    onApply={handleApplyCoupon}
                    onRemove={handleRemoveCoupon}
                    appliedCoupon={appliedCoupon}
                    errorMessage={couponError}
                    variant="compact"
                  />
                </div>

                {/* Order summary */}
                <OrderSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={grandTotal}
                  discount={discount}
                  discountCode={appliedCoupon?.code}
                  onCheckout={handleCheckout}
                />

                {/* Compact trust signals */}
                <div className="mt-4">
                  <TrustSignals
                    variant="compact"
                    signals={[
                      { icon: 'ShieldCheck', text: 'Veilig betalen' },
                      { icon: 'Truck', text: 'Gratis vanaf €150' },
                      { icon: 'RotateCcw', text: '30 dagen retour' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
