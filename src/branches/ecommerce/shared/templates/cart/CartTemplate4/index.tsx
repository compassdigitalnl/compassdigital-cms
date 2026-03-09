'use client'

/**
 * CartTemplate4 — Premium visual layout
 *
 * Design: plastimed-cart-variant-b.html
 * Concept: Large product cards, checkout progress steps, recently viewed
 *
 * All visual values use CSS custom properties from the theme system.
 *
 * NOTE: styled-jsx scoped CSS only applies to native HTML elements rendered
 * directly in this component. For React components like <Link> and Lucide icons,
 * we use :global() selectors (scoped within a native parent) or Tailwind classes.
 */

import { useState } from 'react'
import { useCart } from '@/branches/ecommerce/shared/contexts/CartContext'
import Link from 'next/link'
import {
  ShoppingCart,
  ArrowLeft,
  ClipboardList,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from 'lucide-react'

import { useEcommerceSettings } from '@/branches/ecommerce/shared/hooks/useEcommerceSettings'
import { CartLineItem } from '@/branches/ecommerce/shared/components/ui/CartLineItem'
import { OrderSummary } from '@/branches/ecommerce/shared/components/ui/OrderSummary'
import { CouponInput } from '@/branches/ecommerce/shared/components/ui/CouponInput'
import { FreeShippingProgress } from '@/branches/ecommerce/shared/components/ui/FreeShippingProgress'
import { TrustSignals } from '@/branches/shared/components/ui/TrustSignals'
import { CheckoutProgressStepper } from '@/branches/ecommerce/shared/components/checkout/CheckoutProgressStepper'
import { UNIFIED_STEPS } from '@/branches/ecommerce/shared/lib/checkoutFlows'
import { RecentlyViewed } from '@/branches/ecommerce/shared/components/shop/RecentlyViewed/RecentlyViewed'
import { PaymentMethodBadges } from '@/branches/ecommerce/shared/components/cart/PaymentMethodBadges'

interface CartTemplate4Props {
  onCheckout?: () => void
}

export default function CartTemplate4({ onCheckout }: CartTemplate4Props) {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()
  const { settings: ecomSettings } = useEcommerceSettings()

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | undefined>()
  const [couponError, setCouponError] = useState('')

  const subtotal = total
  const freeShippingThreshold = ecomSettings.freeShippingThreshold
  const shipping = subtotal >= freeShippingThreshold ? 0 : ecomSettings.shippingCost
  const discount = appliedCoupon?.discountAmount || 0
  const tax = (subtotal + shipping - discount) * (ecomSettings.vatPercentage / 100)
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
      <div className="t4-page">
        {/* Step bar even when empty */}
        <div className="t4-step-bar">
          <CheckoutProgressStepper
            currentStep={1}
            steps={UNIFIED_STEPS}
          />
        </div>

        <div className="t4-container t4-empty">
          <div className="t4-empty__inner">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-40" style={{ color: 'var(--grey-mid)' }} />
            <h1 className="t4-empty__title">Uw winkelwagen is leeg</h1>
            <p className="t4-empty__text">
              Ontdek onze producten en vul je winkelwagen.
            </p>
            <Link href="/shop/" className="t4-empty__cta">
              <ArrowLeft className="w-[18px] h-[18px] shrink-0" />
              Ontdek producten
            </Link>
            <div className="t4-empty__trust">
              <TrustSignals variant="compact" />
            </div>
          </div>
        </div>

        <style jsx>{`
          .t4-page { min-height: 100vh; background: var(--bg); }
          .t4-step-bar {
            background: var(--white);
            border-bottom: 1px solid var(--grey);
            padding: var(--sp-6) 0;
          }
          .t4-container { max-width: var(--container-width, 1536px); margin: 0 auto; padding: 0 var(--sp-6); }
          .t4-empty { padding: var(--sp-20) 0; }
          .t4-empty__inner { max-width: 420px; margin: 0 auto; text-align: center; }
          .t4-empty__title {
            font-family: var(--font-display);
            font-size: var(--text-hero); color: var(--navy); margin-bottom: var(--sp-2);
          }
          .t4-empty__text { color: var(--grey-mid); margin-bottom: var(--sp-6); }
          .t4-empty__inner :global(.t4-empty__cta) {
            display: inline-flex; align-items: center; gap: var(--sp-2);
            padding: var(--sp-3) var(--sp-8); background: var(--teal);
            color: white; border-radius: var(--r-sm);
            font-weight: 700; text-decoration: none;
            transition: all var(--transition, 0.25s);
            box-shadow: var(--sh-md);
          }
          .t4-empty__inner :global(.t4-empty__cta:hover) {
            background: var(--teal-dark);
            transform: translateY(-1px);
            box-shadow: var(--sh-lg);
          }
          .t4-empty__trust { margin-top: var(--sp-12); }
        `}</style>
      </div>
    )
  }

  // Cart with items
  return (
    <div className="t4-page">
      {/* Checkout progress stepper */}
      <div className="t4-step-bar">
        <CheckoutProgressStepper
          currentStep={1}
          steps={UNIFIED_STEPS}
        />
      </div>

      <div className="t4-container t4-section">
        {/* Page header */}
        <div className="t4-header">
          <div>
            <h1 className="t4-header__title">Uw winkelwagen</h1>
            <p className="t4-header__sub">
              {itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'} &mdash; Laatst bijgewerkt zojuist
            </p>
          </div>
          <div className="t4-header__links">
            <Link href="/shop/quick-order" className="t4-header__link t4-header__link--ghost">
              <ClipboardList className="w-3.5 h-3.5 shrink-0" />
              Quick-order
            </Link>
            <Link href="/shop/" className="t4-header__link t4-header__link--ghost">
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
              Verder winkelen
            </Link>
          </div>
        </div>

        {/* Cart layout */}
        <div className="t4-layout">
          {/* Left: product cards */}
          <div>
            <div className="t4-cards">
              {items.map((item) => (
                <div key={item.id} className="t4-card-wrap">
                  <CartLineItem
                    product={{
                      id: String(item.id),
                      title: item.title,
                      price: item.price,
                      image: item.image,
                      sku: item.sku,
                      brand: item.parentProductTitle,
                      stockStatus: item.stock > 10 ? 'in-stock' : item.stock > 0 ? 'low-stock' : item.backordersAllowed ? 'on-backorder' : 'out-of-stock',
                      stockQuantity: item.stock,
                    }}
                    quantity={item.quantity}
                    onQuantityChange={(newQty: number) => updateQuantity(item.id, newQty)}
                    onRemove={() => removeItem(item.id)}
                  />
                </div>
              ))}
            </div>

            {/* Coupon bar (separate from sidebar) */}
            <div className="t4-coupon-bar">
              <CouponInput
                onApply={handleApplyCoupon}
                onRemove={handleRemoveCoupon}
                appliedCoupon={appliedCoupon}
                errorMessage={couponError}
              />
            </div>
          </div>

          {/* Right: sidebar */}
          <div className="t4-sidebar">
            {/* Shipping progress */}
            <div className="t4-sidebar__shipping">
              <FreeShippingProgress currentTotal={subtotal} threshold={freeShippingThreshold} />
            </div>

            {/* Summary card with navy header */}
            <div className="t4-summary-card">
              <div className="t4-summary-card__head">
                <h3 className="t4-summary-card__title">Besteloverzicht</h3>
              </div>
              <div className="t4-summary-card__body">
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
                <div className="t4-summary-card__badges">
                  <PaymentMethodBadges
                    methods={['iDEAL', 'Visa', 'Mastercard', 'Op rekening', 'PayPal']}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Trust card — 2x2 grid */}
            <div className="t4-trust-card">
              <div className="t4-trust-grid">
                <div className="t4-trust-item">
                  <div className="t4-trust-icon">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>SSL beveiligd</span>
                </div>
                <div className="t4-trust-item">
                  <div className="t4-trust-icon">
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <span>Morgen in huis</span>
                </div>
                <div className="t4-trust-item">
                  <div className="t4-trust-icon">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <span>30 dagen retour</span>
                </div>
                <div className="t4-trust-item">
                  <div className="t4-trust-icon">
                    <Headphones className="w-3.5 h-3.5" />
                  </div>
                  <span>Persoonlijk advies</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently viewed */}
        <div className="t4-recently">
          <RecentlyViewed />
        </div>
      </div>

      <style jsx>{`
        .t4-page {
          min-height: 100vh;
          background: var(--bg);
        }
        .t4-step-bar {
          background: var(--white);
          border-bottom: 1px solid var(--grey);
          padding: var(--sp-6) 0;
        }
        .t4-container {
          max-width: var(--container-width, 1536px);
          margin: 0 auto;
          padding: 0 var(--sp-6);
        }
        .t4-section {
          padding-top: var(--sp-8);
          padding-bottom: var(--sp-16);
        }

        /* Header */
        .t4-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--sp-8);
        }
        .t4-header__title {
          font-family: var(--font-display);
          font-size: var(--text-hero);
          color: var(--navy);
          line-height: 1.1;
        }
        .t4-header__sub {
          font-size: var(--text-body);
          color: var(--grey-mid);
          margin-top: var(--sp-2);
        }
        .t4-header__links {
          display: flex;
          gap: var(--sp-4);
        }
        .t4-header__links :global(.t4-header__link) {
          font-size: var(--text-body);
          font-weight: 600;
          text-decoration: none;
          padding: var(--sp-2) var(--sp-4);
          border-radius: var(--r-sm);
          transition: all var(--transition, 0.2s);
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
        }
        .t4-header__links :global(.t4-header__link--ghost) {
          border: 1.5px solid var(--grey);
          color: var(--grey-dark);
        }
        .t4-header__links :global(.t4-header__link--ghost:hover) {
          border-color: var(--navy);
          color: var(--navy);
        }

        /* Layout */
        .t4-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--sp-8);
          align-items: start;
        }

        /* Cards */
        .t4-cards {
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }
        .t4-card-wrap {
          transition: all var(--transition, 0.2s);
        }

        /* Coupon bar */
        .t4-coupon-bar {
          margin-top: var(--sp-3);
          background: var(--white);
          border-radius: var(--r-lg);
          border: 1px solid var(--grey);
          padding: var(--sp-4) var(--sp-6);
          box-shadow: var(--sh-sm);
        }

        /* Sidebar */
        .t4-sidebar {
          position: sticky;
          top: 90px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: var(--sp-4);
        }

        /* Summary card */
        .t4-summary-card {
          background: var(--white);
          border-radius: var(--r-lg);
          border: 1px solid var(--grey);
          box-shadow: var(--sh-md);
          overflow: hidden;
        }
        .t4-summary-card__head {
          background: var(--navy);
          padding: var(--sp-4) var(--sp-6);
        }
        .t4-summary-card__title {
          font-family: var(--font-display);
          font-size: var(--text-card-title);
          color: white;
        }
        .t4-summary-card__body {
          padding: 0;
        }
        .t4-summary-card__badges {
          padding: var(--sp-4) var(--sp-6) var(--sp-6);
          border-top: 1px solid var(--grey);
        }

        /* Trust card — 2x2 grid */
        .t4-trust-card {
          background: var(--white);
          border-radius: var(--r-lg);
          border: 1px solid var(--grey);
          padding: var(--sp-4) var(--sp-6);
        }
        .t4-trust-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--sp-3);
        }
        .t4-trust-item {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          font-size: var(--text-small);
          color: var(--grey-dark);
          font-weight: 600;
        }
        .t4-trust-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--r-sm);
          background: var(--color-primary-glow);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--teal);
          flex-shrink: 0;
        }

        /* Recently viewed */
        .t4-recently {
          margin-top: var(--sp-12);
          padding-top: var(--sp-8);
          border-top: 1px solid var(--grey);
        }

        @media (max-width: 900px) {
          .t4-layout {
            grid-template-columns: 1fr;
          }
          .t4-sidebar {
            position: static;
          }
          .t4-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--sp-4);
          }
          .t4-header__title {
            font-size: var(--text-section);
          }
          .t4-header__links {
            gap: var(--sp-2);
          }
          .t4-trust-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
