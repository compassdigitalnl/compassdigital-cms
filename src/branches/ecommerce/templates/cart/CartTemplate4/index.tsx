'use client'

/**
 * CartTemplate4 — Premium visual layout
 *
 * Design: plastimed-cart-variant-b.html
 * Concept: Large product cards, checkout progress steps, recently viewed
 *
 * Features:
 * - CheckoutProgressStepper (step 1 = active)
 * - Serif title + "Laatst bijgewerkt" + Quick-order / Verder winkelen links
 * - Premium CartLineItem cards (large images, hover effects)
 * - Separate coupon bar between items and sidebar
 * - Sidebar: FreeShippingProgress, OrderSummary (navy header), PaymentMethodBadges, TrustSignals (2-col grid)
 * - RecentlyViewed section at bottom
 */

import { useState } from 'react'
import { useCart } from '@/branches/ecommerce/contexts/CartContext'
import Link from 'next/link'
import { ShoppingCart, ArrowLeft, ClipboardList } from 'lucide-react'

import { CartLineItem } from '@/branches/ecommerce/components/ui/CartLineItem'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary'
import { CouponInput } from '@/branches/ecommerce/components/ui/CouponInput'
import { FreeShippingProgress } from '@/branches/ecommerce/components/ui/FreeShippingProgress'
import { TrustSignals } from '@/branches/shared/components/ui/TrustSignals'
import { CheckoutProgressStepper } from '@/branches/ecommerce/components/checkout/CheckoutProgressStepper'
import { RecentlyViewed } from '@/branches/ecommerce/components/shop/RecentlyViewed/RecentlyViewed'
import { PaymentMethodBadges } from '@/branches/ecommerce/components/cart/PaymentMethodBadges'

interface CartTemplate4Props {
  onCheckout?: () => void
}

export default function CartTemplate4({ onCheckout }: CartTemplate4Props) {
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
      <div className="t4-page">
        {/* Step bar even when empty */}
        <div className="t4-step-bar">
          <CheckoutProgressStepper
            currentStep={1}
            steps={[
              { id: 1, label: 'Winkelwagen' },
              { id: 2, label: 'Gegevens' },
              { id: 3, label: 'Betaling' },
              { id: 4, label: 'Bevestiging' },
            ]}
          />
        </div>

        <div className="t4-container t4-empty">
          <div className="t4-empty__inner">
            <ShoppingCart className="t4-empty__icon" />
            <h1 className="t4-empty__title">Uw winkelwagen is leeg</h1>
            <p className="t4-empty__text">
              Ontdek onze producten en vul je winkelwagen.
            </p>
            <Link href="/shop/" className="t4-empty__cta">
              <ArrowLeft className="t4-empty__cta-icon" />
              Ontdek producten
            </Link>
            <div className="t4-empty__trust">
              <TrustSignals variant="compact" />
            </div>
          </div>
        </div>

        <style jsx>{`
          .t4-page { min-height: 100vh; background: var(--bg, #f8f9fb); }
          .t4-step-bar {
            background: var(--white, #fff);
            border-bottom: 1px solid var(--grey, #e2e8f0);
            padding: 20px 0;
          }
          .t4-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
          .t4-empty { padding: 80px 0; }
          .t4-empty__inner { max-width: 420px; margin: 0 auto; text-align: center; }
          .t4-empty__icon {
            width: 48px; height: 48px; color: var(--grey-mid, #94A3B8); opacity: 0.4;
            margin: 0 auto 16px; display: block;
          }
          .t4-empty__title {
            font-family: var(--font-serif, 'DM Serif Display', Georgia, serif);
            font-size: 36px; color: var(--navy); margin-bottom: 8px;
          }
          .t4-empty__text { color: var(--grey-mid, #94A3B8); margin-bottom: 24px; }
          .t4-empty__cta {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 14px 28px; background: var(--teal);
            color: white; border-radius: 10px;
            font-weight: 700; text-decoration: none;
            transition: all 0.25s;
            box-shadow: 0 4px 16px rgba(0,137,123,0.3);
          }
          .t4-empty__cta:hover {
            background: var(--teal-dark, #00695C);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0,137,123,0.4);
          }
          .t4-empty__cta-icon { width: 18px; height: 18px; }
          .t4-empty__trust { margin-top: 48px; }
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
          steps={[
            { id: 1, label: 'Winkelwagen' },
            { id: 2, label: 'Gegevens' },
            { id: 3, label: 'Betaling' },
            { id: 4, label: 'Bevestiging' },
          ]}
        />
      </div>

      <div className="t4-container t4-section">
        {/* Page header */}
        <div className="t4-header">
          <div>
            <h1 className="t4-header__title">Uw winkelwagen</h1>
            <p className="t4-header__sub">
              {itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'}
            </p>
          </div>
          <div className="t4-header__links">
            <Link href="/shop/quick-order" className="t4-header__link t4-header__link--ghost">
              <ClipboardList className="t4-header__link-icon" />
              Quick-order
            </Link>
            <Link href="/shop/" className="t4-header__link t4-header__link--ghost">
              <ArrowLeft className="t4-header__link-icon" />
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
                      stockStatus: item.stock > 10 ? 'in-stock' : item.stock > 0 ? 'low-stock' : 'out-of-stock',
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

            {/* Trust card — 2-column grid */}
            <div className="t4-trust-card">
              <TrustSignals
                variant="compact"
                signals={[
                  { icon: 'ShieldCheck', text: 'SSL beveiligd' },
                  { icon: 'Truck', text: 'Morgen in huis' },
                  { icon: 'RotateCcw', text: '30 dagen retour' },
                  { icon: 'Headphones', text: 'Persoonlijk advies' },
                ]}
              />
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
          background: var(--bg, #f8f9fb);
        }
        .t4-step-bar {
          background: var(--white, #fff);
          border-bottom: 1px solid var(--grey, #e2e8f0);
          padding: 20px 0;
        }
        .t4-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .t4-section {
          padding-top: 32px;
          padding-bottom: 60px;
        }

        /* Header */
        .t4-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 28px;
        }
        .t4-header__title {
          font-family: var(--font-serif, 'DM Serif Display', Georgia, serif);
          font-size: 36px;
          color: var(--navy);
          line-height: 1.1;
        }
        .t4-header__sub {
          font-size: 14px;
          color: var(--grey-mid, #64748b);
          margin-top: 6px;
        }
        .t4-header__links {
          display: flex;
          gap: 16px;
        }
        .t4-header__link {
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 10px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .t4-header__link--ghost {
          border: 1.5px solid var(--grey, #cbd5e1);
          color: var(--grey-dark, #475569);
        }
        .t4-header__link--ghost:hover {
          border-color: var(--navy);
          color: var(--navy);
        }
        .t4-header__link-icon {
          width: 14px;
          height: 14px;
        }

        /* Layout */
        .t4-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
        }

        /* Cards */
        .t4-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .t4-card-wrap {
          transition: all 0.2s;
        }

        /* Coupon bar */
        .t4-coupon-bar {
          margin-top: 12px;
          background: var(--white, #fff);
          border-radius: 14px;
          border: 1px solid var(--grey, #e2e8f0);
          padding: 16px 24px;
          box-shadow: 0 1px 3px rgba(10,38,71,0.06);
        }

        /* Sidebar */
        .t4-sidebar {
          position: sticky;
          top: 90px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .t4-sidebar__shipping {
          /* FreeShippingProgress renders its own card */
        }

        /* Summary card */
        .t4-summary-card {
          background: var(--white, #fff);
          border-radius: 14px;
          border: 1px solid var(--grey, #e2e8f0);
          box-shadow: 0 4px 20px rgba(10,38,71,0.08);
          overflow: hidden;
        }
        .t4-summary-card__head {
          background: var(--navy);
          padding: 18px 24px;
        }
        .t4-summary-card__title {
          font-family: var(--font-serif, 'DM Serif Display', Georgia, serif);
          font-size: 20px;
          color: white;
        }
        .t4-summary-card__body {
          padding: 0;
        }
        .t4-summary-card__badges {
          padding: 16px 24px 20px;
          border-top: 1px solid var(--grey, #e2e8f0);
        }

        /* Trust card */
        .t4-trust-card {
          background: var(--white, #fff);
          border-radius: 14px;
          border: 1px solid var(--grey, #e2e8f0);
          padding: 18px 20px;
        }

        /* Recently viewed */
        .t4-recently {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid var(--grey, #e2e8f0);
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
            gap: 16px;
          }
          .t4-header__title {
            font-size: 28px;
          }
          .t4-header__links {
            gap: 8px;
          }
        }
      `}</style>
    </div>
  )
}
