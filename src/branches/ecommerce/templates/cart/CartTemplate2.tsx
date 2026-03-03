'use client'

/**
 * CartTemplate2 — Compact table layout (B2B-focused)
 *
 * Design: plastimed-cart-variant-a.html
 * Concept: Compact table rows, serif title, quick-order, payment badges
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
import { ShoppingCart, ArrowLeft, ClipboardList } from 'lucide-react'

import { CartLineItemCompact } from '@/branches/ecommerce/components/cart/CartLineItemCompact'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary'
import { CouponInput } from '@/branches/ecommerce/components/ui/CouponInput'
import { FreeShippingProgress } from '@/branches/ecommerce/components/ui/FreeShippingProgress'
import { PaymentMethodBadges } from '@/branches/ecommerce/components/cart/PaymentMethodBadges'

interface CartTemplate2Props {
  onCheckout?: () => void
}

export default function CartTemplate2({ onCheckout }: CartTemplate2Props) {
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
      <div className="t2-page">
        <div className="t2-container t2-empty">
          <div className="t2-empty__inner">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-40" style={{ color: 'var(--grey-mid)' }} />
            <h1 className="t2-empty__title">Winkelwagen is leeg</h1>
            <p className="t2-empty__text">Begin met winkelen</p>
            <Link href="/shop/" className="t2-empty__cta">
              <ArrowLeft className="w-4 h-4 shrink-0" />
              Naar shop
            </Link>
          </div>
        </div>

        <style jsx>{`
          .t2-page { min-height: 100vh; background: var(--bg); }
          .t2-container { max-width: var(--container-width, 1536px); margin: 0 auto; padding: 0 var(--sp-6); }
          .t2-empty { padding: 100px 0; }
          .t2-empty__inner { max-width: 400px; margin: 0 auto; text-align: center; }
          .t2-empty__title {
            font-family: var(--font-display);
            font-size: var(--text-hero); color: var(--navy); margin-bottom: var(--sp-2);
          }
          .t2-empty__text { color: var(--grey-mid); margin-bottom: var(--sp-6); }
          .t2-empty__inner :global(.t2-empty__cta) {
            display: inline-flex; align-items: center; gap: var(--sp-2);
            color: var(--teal); font-weight: 600; font-size: var(--text-body); text-decoration: none;
          }
          .t2-empty__inner :global(.t2-empty__cta:hover) { text-decoration: underline; }
        `}</style>
      </div>
    )
  }

  // Cart with items
  return (
    <div className="t2-page">
      <div className="t2-container">
        {/* Breadcrumb */}
        <nav className="t2-breadcrumb" aria-label="Breadcrumb">
          <Link href="/" className="t2-breadcrumb__link">Home</Link>
          <span className="t2-breadcrumb__sep">&rsaquo;</span>
          <span className="t2-breadcrumb__current">Winkelwagen</span>
        </nav>

        {/* Page header */}
        <div className="t2-header">
          <h1 className="t2-header__title">
            Winkelwagen
            <span className="t2-header__count">
              ({itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'})
            </span>
          </h1>
          <Link href="/shop/quick-order" className="t2-header__quick">
            <ClipboardList className="w-3.5 h-3.5 shrink-0" />
            Quick-order
          </Link>
        </div>

        {/* Free shipping bar — compact green */}
        <div className="t2-shipping">
          <FreeShippingProgress currentTotal={subtotal} threshold={freeShippingThreshold} />
        </div>

        {/* Cart layout */}
        <div className="t2-layout">
          {/* Left: table */}
          <div>
            <div className="t2-table">
              {/* Table header */}
              <div className="t2-table__header">
                <div />
                <div>Product</div>
                <div style={{ textAlign: 'right' }}>Prijs</div>
                <div style={{ textAlign: 'center' }}>Aantal</div>
                <div style={{ textAlign: 'right' }}>Subtotaal</div>
                <div />
              </div>

              {/* Table rows */}
              {items.map((item) => (
                <CartLineItemCompact
                  key={item.id}
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
              ))}

              {/* Actions row: coupon + continue */}
              <div className="t2-table__actions">
                <div className="t2-table__coupon">
                  <CouponInput
                    onApply={handleApplyCoupon}
                    onRemove={handleRemoveCoupon}
                    appliedCoupon={appliedCoupon}
                    errorMessage={couponError}
                    variant="compact"
                  />
                </div>
                <Link href="/shop/" className="t2-table__continue">
                  <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                  Verder winkelen
                </Link>
              </div>
            </div>
          </div>

          {/* Right: sidebar */}
          <div>
            <div className="t2-summary">
              <div className="t2-summary__head">
                <h3 className="t2-summary__title">Overzicht</h3>
              </div>
              <div className="t2-summary__body">
                <OrderSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={grandTotal}
                  discount={discount}
                  discountCode={appliedCoupon?.code}
                  onCheckout={handleCheckout}
                  showQuoteButton={false}
                  sticky={false}
                />
              </div>
              <div className="t2-summary__payment">
                <PaymentMethodBadges size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .t2-page {
          min-height: 100vh;
          background: var(--bg);
        }
        .t2-container {
          max-width: var(--container-width, 1536px);
          margin: 0 auto;
          padding: 0 var(--sp-6) var(--sp-16);
        }

        /* Breadcrumb */
        .t2-breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--sp-2);
          padding: var(--sp-4) 0;
          font-size: var(--text-small);
          color: var(--grey-mid);
        }
        .t2-breadcrumb :global(.t2-breadcrumb__link) {
          color: var(--grey-mid);
          text-decoration: none;
        }
        .t2-breadcrumb :global(.t2-breadcrumb__link:hover) {
          color: var(--teal);
        }
        .t2-breadcrumb__sep {
          margin: 0 var(--sp-2);
        }
        .t2-breadcrumb__current {
          color: var(--navy);
          font-weight: 600;
        }

        /* Header */
        .t2-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--sp-6);
        }
        .t2-header__title {
          font-family: var(--font-display);
          font-size: var(--text-hero);
          color: var(--navy);
        }
        .t2-header__count {
          font-family: var(--font);
          font-size: var(--text-body-lg);
          color: var(--grey-mid);
          font-weight: 500;
          margin-left: var(--sp-2);
        }
        .t2-header :global(.t2-header__quick) {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          font-size: var(--text-body);
          color: var(--teal);
          font-weight: 600;
          text-decoration: none;
          padding: var(--sp-2) var(--sp-4);
          border: 1.5px solid var(--teal);
          border-radius: var(--r-sm);
          transition: all var(--transition, 0.2s);
        }
        .t2-header :global(.t2-header__quick:hover) {
          background: var(--teal);
          color: white;
        }

        .t2-shipping {
          margin-bottom: var(--sp-6);
        }

        /* Layout */
        .t2-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: var(--sp-8);
          align-items: start;
        }

        /* Table */
        .t2-table {
          background: var(--white);
          border-radius: var(--r-md);
          box-shadow: var(--sh-sm);
          border: 1px solid var(--grey);
          overflow: hidden;
        }
        .t2-table__header {
          display: grid;
          grid-template-columns: 50px 1fr 120px 120px 100px 40px;
          gap: var(--sp-3);
          padding: var(--sp-3) var(--sp-6);
          background: var(--bg);
          border-bottom: 1px solid var(--grey);
          font-size: var(--text-label);
          font-weight: 700;
          color: var(--grey-mid);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .t2-table__actions {
          padding: var(--sp-4) var(--sp-6);
          border-top: 1px solid var(--grey);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg);
        }
        .t2-table__coupon {
          flex: 0 1 auto;
        }
        .t2-table__actions :global(.t2-table__continue) {
          font-size: var(--text-body);
          color: var(--teal);
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: var(--sp-1);
          flex-shrink: 0;
        }
        .t2-table__actions :global(.t2-table__continue:hover) {
          text-decoration: underline;
        }

        /* Sidebar */
        .t2-summary {
          background: var(--white);
          border-radius: var(--r-md);
          box-shadow: var(--sh-sm);
          border: 1px solid var(--grey);
          position: sticky;
          top: 90px;
          z-index: var(--z-sticky, 200);
          overflow: hidden;
        }
        .t2-summary__head {
          padding: var(--sp-6) var(--sp-6);
          border-bottom: 1px solid var(--grey);
        }
        .t2-summary__title {
          font-family: var(--font-display);
          font-size: var(--text-card-title);
          color: var(--navy);
        }
        .t2-summary__body {
          padding: 0;
        }
        .t2-summary__payment {
          padding: var(--sp-4) var(--sp-6) var(--sp-6);
          border-top: 1px solid var(--grey);
        }

        @media (max-width: 900px) {
          .t2-layout {
            grid-template-columns: 1fr;
          }
          .t2-table__header {
            display: none;
          }
          .t2-summary {
            position: static;
          }
          .t2-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--sp-3);
          }
          .t2-header__title {
            font-size: var(--text-section);
          }
          .t2-table__actions {
            flex-direction: column;
            gap: var(--sp-3);
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}
