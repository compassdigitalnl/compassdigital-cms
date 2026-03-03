'use client'

/**
 * CartTemplate1 — Card-based layout
 *
 * Design: plastimed-cart.html (main design)
 * Concept: Card-style cart items, staffel hints, cross-sell carousel
 *
 * All visual values use CSS custom properties from the theme system.
 *
 * NOTE: styled-jsx scoped CSS only applies to native HTML elements rendered
 * directly in this component. For React components like <Link> and Lucide icons,
 * we use :global() selectors (scoped within a native parent) or Tailwind classes.
 */

import { useState } from 'react'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, ChevronRight } from 'lucide-react'

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
              <ShoppingCart className="w-9 h-9" />
            </div>
            <h1 className="t1-empty__title">Je winkelwagen is leeg</h1>
            <p className="t1-empty__text">
              Voeg producten toe aan je winkelwagen om te beginnen met winkelen.
            </p>
            <Link href="/shop/" className="t1-empty__cta">
              <ArrowLeft className="w-[18px] h-[18px] shrink-0" />
              Ga naar shop
            </Link>
            <div className="t1-empty__trust">
              <TrustSignals variant="compact" />
            </div>
          </div>
        </div>

        <style jsx>{`
          .t1-page { min-height: 100vh; background: var(--bg); }
          .t1-container { max-width: var(--container-width, 1536px); margin: 0 auto; padding: 0 var(--sp-6); }
          .t1-empty { padding: var(--sp-20) 0; }
          .t1-empty__inner { max-width: 420px; margin: 0 auto; text-align: center; }
          .t1-empty__icon {
            width: 80px; height: 80px; background: var(--grey);
            border-radius: var(--r-xl); display: flex; align-items: center; justify-content: center;
            margin: 0 auto var(--sp-6); color: var(--grey-mid);
          }
          .t1-empty__title {
            font-family: var(--font-display);
            font-size: var(--text-section); font-weight: 800; color: var(--navy); margin-bottom: var(--sp-2);
          }
          .t1-empty__text { font-size: var(--text-body-lg); color: var(--grey-mid); margin-bottom: var(--sp-6); }
          .t1-empty__inner :global(.t1-empty__cta) {
            display: inline-flex; align-items: center; gap: var(--sp-2);
            padding: var(--sp-3) var(--sp-8); background: var(--gradient-primary);
            color: white; border: none; border-radius: var(--r-md);
            font-size: var(--text-body-lg); font-weight: 700; text-decoration: none;
            box-shadow: var(--sh-md);
            transition: all var(--transition, 0.3s);
          }
          .t1-empty__inner :global(.t1-empty__cta:hover) {
            transform: translateY(-2px);
            box-shadow: var(--sh-lg);
          }
          .t1-empty__trust { margin-top: var(--sp-12); }
        `}</style>
      </div>
    )
  }

  // Cart with items
  return (
    <div className="t1-page">
      <div className="t1-container">
        {/* Breadcrumb */}
        <nav className="t1-breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="t1-breadcrumb__link">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link href="/shop/" className="t1-breadcrumb__link">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="t1-breadcrumb__current">Winkelwagen</span>
        </nav>

        {/* Free shipping progress — full width */}
        <div className="t1-shipping">
          <FreeShippingProgress currentTotal={subtotal} threshold={freeShippingThreshold} />
        </div>

        {/* Page title row */}
        <div className="t1-title-row">
          <h1 className="t1-title">
            <ShoppingCart className="w-7 h-7 shrink-0" style={{ color: 'var(--teal)' }} />
            Winkelwagen
            <span className="t1-title__count">
              ({itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'})
            </span>
          </h1>
          <Link href="/shop/" className="t1-continue">
            <ArrowLeft className="w-4 h-4 shrink-0" />
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
          background: var(--bg);
        }
        .t1-container {
          max-width: var(--container-width, 1536px);
          margin: 0 auto;
          padding: 0 var(--sp-6) var(--sp-20);
        }

        /* Breadcrumb */
        .t1-breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-4) 0;
          font-size: var(--text-small);
          color: var(--grey-mid);
        }
        .t1-breadcrumb :global(.t1-breadcrumb__link) {
          color: var(--grey-mid);
          text-decoration: none;
        }
        .t1-breadcrumb :global(.t1-breadcrumb__link:hover) {
          color: var(--teal);
        }
        .t1-breadcrumb__current {
          color: var(--navy);
          font-weight: 600;
        }

        .t1-shipping {
          margin-bottom: var(--sp-6);
        }

        /* Title row */
        .t1-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--sp-8);
        }
        .t1-title {
          font-family: var(--font-display);
          font-size: var(--text-section);
          font-weight: 800;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: var(--sp-3);
        }
        .t1-title__count {
          font-size: var(--text-body-lg);
          color: var(--grey-mid);
          font-weight: 500;
        }
        .t1-title-row :global(.t1-continue) {
          color: var(--teal);
          font-weight: 600;
          font-size: var(--text-body);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          transition: gap var(--transition, 0.2s);
        }
        .t1-title-row :global(.t1-continue:hover) {
          gap: 10px;
        }

        /* Layout */
        .t1-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--sp-8);
          align-items: start;
        }
        .t1-items {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .t1-card {
          margin-bottom: var(--sp-3);
        }

        /* Sidebar */
        .t1-sidebar {
          position: sticky;
          top: 90px;
          z-index: var(--z-sticky, 200);
        }
        .t1-sidebar__coupon {
          margin-bottom: var(--sp-4);
        }
        .t1-sidebar__trust {
          margin-top: var(--sp-6);
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
            gap: var(--sp-3);
          }
          .t1-title {
            font-size: var(--text-card-title);
          }
        }
      `}</style>
    </div>
  )
}
