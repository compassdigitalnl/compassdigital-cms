'use client'

/**
 * CartTemplate1 — Card-based layout
 *
 * Design: plastimed-cart.html (main design)
 * Concept: Card-style cart items, staffel hints, cross-sell carousel
 *
 * Features:
 * - FreeShippingProgress (full-width top)
 * - Page title + item count + "Verder winkelen" link
 * - 2/3 column: CartLineItem cards with StaffelHintBanner
 * - 1/3 sidebar (sticky): OrderSummary + CouponInput + TrustSignals
 * - CrossSellSection bottom: "Vaak samen besteld" carousel
 */

import { useState } from 'react'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft } from 'lucide-react'

import { CartLineItem } from '@/branches/ecommerce/components/ui/CartLineItem'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary'
import { CouponInput } from '@/branches/ecommerce/components/ui/CouponInput'
import { FreeShippingProgress } from '@/branches/ecommerce/components/ui/FreeShippingProgress'
import { TrustSignals } from '@/branches/shared/components/ui/TrustSignals'
import { CrossSellSection } from '@/branches/ecommerce/components/cart/CrossSellSection'

interface CartTemplate1Props {
  onCheckout?: () => void
}

export default function CartTemplate1({ onCheckout }: CartTemplate1Props) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | undefined>()
  const [couponError, setCouponError] = useState('')

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

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="t1-page">
        <div className="t1-container t1-empty">
          <div className="t1-empty__inner">
            <div className="t1-empty__icon">
              <ShoppingCart className="t1-empty__icon-svg" />
            </div>
            <h1 className="t1-empty__title">Je winkelwagen is leeg</h1>
            <p className="t1-empty__text">
              Voeg producten toe aan je winkelwagen om te beginnen met winkelen.
            </p>
            <Link href="/shop/" className="t1-empty__cta">
              <ArrowLeft className="t1-empty__cta-icon" />
              Ga naar shop
            </Link>
            <div className="t1-empty__trust">
              <TrustSignals variant="compact" />
            </div>
          </div>
        </div>

        <style jsx>{`
          .t1-page { min-height: 100vh; background: var(--bg, #F5F7FA); }
          .t1-container { max-width: 1240px; margin: 0 auto; padding: 0 24px; }
          .t1-empty { padding: 80px 0; }
          .t1-empty__inner { max-width: 420px; margin: 0 auto; text-align: center; }
          .t1-empty__icon {
            width: 80px; height: 80px; background: var(--grey, #E8ECF1);
            border-radius: 20px; display: flex; align-items: center; justify-content: center;
            margin: 0 auto 20px;
          }
          .t1-empty__icon-svg { width: 36px; height: 36px; color: var(--grey-mid, #94A3B8); }
          .t1-empty__title {
            font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
            font-size: 24px; font-weight: 800; color: var(--navy); margin-bottom: 8px;
          }
          .t1-empty__text { font-size: 15px; color: var(--grey-mid, #94A3B8); margin-bottom: 24px; }
          .t1-empty__cta {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 14px 28px; background: linear-gradient(135deg, var(--teal), var(--teal-light));
            color: white; border: none; border-radius: 12px;
            font-size: 15px; font-weight: 700; text-decoration: none;
            box-shadow: 0 4px 20px rgba(0,137,123,0.4);
            transition: all 0.3s;
          }
          .t1-empty__cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0,137,123,0.5);
          }
          .t1-empty__cta-icon { width: 18px; height: 18px; }
          .t1-empty__trust { margin-top: 48px; }
        `}</style>
      </div>
    )
  }

  // Cart with items
  return (
    <div className="t1-page">
      <div className="t1-container">
        {/* Free shipping progress — full width */}
        <div className="t1-shipping">
          <FreeShippingProgress currentTotal={subtotal} threshold={freeShippingThreshold} />
        </div>

        {/* Page title row */}
        <div className="t1-title-row">
          <h1 className="t1-title">
            <ShoppingCart className="t1-title__icon" />
            Winkelwagen
            <span className="t1-title__count">
              ({itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'})
            </span>
          </h1>
          <Link href="/shop/" className="t1-continue">
            <ArrowLeft className="t1-continue__icon" />
            Verder winkelen
          </Link>
        </div>

        {/* Cart layout: 2/3 + 1/3 */}
        <div className="t1-layout">
          {/* Left: Cart items */}
          <div className="t1-items">
            {items.map((item) => (
              <div key={item.id} className="t1-card">
                <CartLineItem
                  product={{
                    id: String(item.id),
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    sku: item.sku,
                    brand: item.parentProductTitle,
                    stockStatus: item.stock > 10 ? 'in-stock' : item.stock > 0 ? 'low-stock' : 'out-of-stock',
                    stockQuantity: item.stock,
                  }}
                  quantity={item.quantity}
                  onQuantityChange={(newQty: number) => updateQuantity(item.id, newQty)}
                  onRemove={() => removeItem(item.id)}
                />
              </div>
            ))}

            {/* Cross-sell section */}
            <CrossSellSection
              className="t1-cross-sell"
              products={[]}
              title="Vaak samen besteld"
            />
          </div>

          {/* Right: Sidebar */}
          <aside className="t1-sidebar">
            {/* Coupon */}
            <div className="t1-sidebar__coupon">
              <CouponInput
                onApply={handleApplyCoupon}
                onRemove={handleRemoveCoupon}
                appliedCoupon={appliedCoupon}
                errorMessage={couponError}
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
              sticky={false}
            />

            {/* Trust signals */}
            <div className="t1-sidebar__trust">
              <TrustSignals
                variant="default"
                signals={[
                  { icon: 'ShieldCheck', text: 'Veilig betalen via iDEAL, op rekening of creditcard' },
                  { icon: 'Truck', text: 'Gratis verzending vanaf \u20AC150' },
                  { icon: 'RotateCcw', text: '30 dagen retourrecht' },
                  { icon: 'Headphones', text: 'Vragen? Bel 0251-247233' },
                ]}
              />
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .t1-page {
          min-height: 100vh;
          background: var(--bg, #F5F7FA);
        }
        .t1-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }
        .t1-shipping {
          padding-top: 24px;
          margin-bottom: 24px;
        }
        .t1-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .t1-title {
          font-family: var(--font-display, 'Plus Jakarta Sans', sans-serif);
          font-size: 28px;
          font-weight: 800;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .t1-title__icon {
          width: 28px;
          height: 28px;
          color: var(--teal);
        }
        .t1-title__count {
          font-size: 16px;
          color: var(--grey-mid, #94A3B8);
          font-weight: 500;
        }
        .t1-continue {
          color: var(--teal);
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: gap 0.2s;
        }
        .t1-continue:hover {
          gap: 10px;
        }
        .t1-continue__icon {
          width: 16px;
          height: 16px;
        }
        .t1-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 28px;
          align-items: start;
        }
        .t1-items {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .t1-card {
          margin-bottom: 12px;
        }
        .t1-cross-sell {
          margin-top: 32px;
        }
        .t1-sidebar {
          position: sticky;
          top: 90px;
        }
        .t1-sidebar__coupon {
          margin-bottom: 16px;
        }
        .t1-sidebar__trust {
          margin-top: 20px;
        }

        @media (max-width: 900px) {
          .t1-layout {
            grid-template-columns: 1fr;
          }
          .t1-sidebar {
            position: static;
          }
          .t1-title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .t1-title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  )
}
