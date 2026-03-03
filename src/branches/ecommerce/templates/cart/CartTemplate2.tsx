'use client'

/**
 * CartTemplate2 — Compact table layout (B2B-focused)
 *
 * Design: plastimed-cart-variant-a.html
 * Concept: Compact table rows, serif title, quick-order, payment badges
 *
 * Features:
 * - Compact header with DM Serif Display title + item count + "Quick-order" link
 * - FreeShippingProgress (compact, green)
 * - Table layout with CartLineItemCompact rows + column headers
 * - Coupon + "Verder winkelen" below table
 * - 1/3 sidebar: OrderSummary (serif title), PaymentMethodBadges
 * - Compact upsell list in sidebar
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
            <ShoppingCart className="t2-empty__icon" />
            <h1 className="t2-empty__title">Winkelwagen is leeg</h1>
            <p className="t2-empty__text">Begin met winkelen</p>
            <Link href="/shop/" className="t2-empty__cta">
              <ArrowLeft className="t2-empty__cta-icon" />
              Naar shop
            </Link>
          </div>
        </div>

        <style jsx>{`
          .t2-page { min-height: 100vh; background: var(--bg, #f8f9fb); }
          .t2-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
          .t2-empty { padding: 100px 0; }
          .t2-empty__inner { max-width: 400px; margin: 0 auto; text-align: center; }
          .t2-empty__icon { width: 48px; height: 48px; color: var(--grey-mid, #94A3B8); opacity: 0.4; margin: 0 auto 16px; display: block; }
          .t2-empty__title {
            font-family: var(--font-serif, 'DM Serif Display', Georgia, serif);
            font-size: 32px; color: var(--navy); margin-bottom: 8px;
          }
          .t2-empty__text { color: var(--grey-mid, #94A3B8); margin-bottom: 24px; }
          .t2-empty__cta {
            display: inline-flex; align-items: center; gap: 6px;
            color: var(--teal); font-weight: 600; font-size: 14px; text-decoration: none;
          }
          .t2-empty__cta:hover { text-decoration: underline; }
          .t2-empty__cta-icon { width: 16px; height: 16px; }
        `}</style>
      </div>
    )
  }

  // Cart with items
  return (
    <div className="t2-page">
      <div className="t2-container">
        {/* Page header */}
        <div className="t2-header">
          <h1 className="t2-header__title">
            Winkelwagen
            <span className="t2-header__count">
              ({itemCount} {itemCount === 1 ? 'artikel' : 'artikelen'})
            </span>
          </h1>
          <Link href="/shop/quick-order" className="t2-header__quick">
            <ClipboardList className="t2-header__quick-icon" />
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
                  <ArrowLeft className="t2-table__continue-icon" />
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
          background: var(--bg, #f8f9fb);
        }
        .t2-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px 60px;
        }
        .t2-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 32px 0 24px;
        }
        .t2-header__title {
          font-family: var(--font-serif, 'DM Serif Display', Georgia, serif);
          font-size: 32px;
          color: var(--navy);
        }
        .t2-header__count {
          font-family: var(--font-primary, 'Plus Jakarta Sans', sans-serif);
          font-size: 16px;
          color: var(--grey-mid, #94A3B8);
          font-weight: 500;
          margin-left: 8px;
        }
        .t2-header__quick {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--teal);
          font-weight: 600;
          text-decoration: none;
          padding: 8px 16px;
          border: 1.5px solid var(--teal);
          border-radius: 8px;
          transition: all 0.2s;
        }
        .t2-header__quick:hover {
          background: var(--teal);
          color: white;
        }
        .t2-header__quick-icon {
          width: 14px;
          height: 14px;
        }
        .t2-shipping {
          margin-bottom: 24px;
        }
        .t2-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
          align-items: start;
        }
        .t2-table {
          background: var(--white, #fff);
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(10,38,71,0.06);
          border: 1px solid var(--grey, #e2e8f0);
          overflow: hidden;
        }
        .t2-table__header {
          display: grid;
          grid-template-columns: 50px 1fr 120px 120px 100px 40px;
          gap: 12px;
          padding: 14px 20px;
          background: var(--bg, #f8fafc);
          border-bottom: 1px solid var(--grey, #e2e8f0);
          font-size: 11px;
          font-weight: 700;
          color: var(--grey-mid, #94A3B8);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .t2-table__actions {
          padding: 16px 20px;
          border-top: 1px solid var(--grey, #f1f5f9);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg, #f8fafc);
        }
        .t2-table__coupon {
          flex: 0 1 auto;
        }
        .t2-table__continue {
          font-size: 13px;
          color: var(--teal);
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .t2-table__continue:hover {
          text-decoration: underline;
        }
        .t2-table__continue-icon {
          width: 14px;
          height: 14px;
        }

        /* Sidebar */
        .t2-summary {
          background: var(--white, #fff);
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(10,38,71,0.06);
          border: 1px solid var(--grey, #e2e8f0);
          position: sticky;
          top: 90px;
          overflow: hidden;
        }
        .t2-summary__head {
          padding: 20px 24px;
          border-bottom: 1px solid var(--grey, #f1f5f9);
        }
        .t2-summary__title {
          font-family: var(--font-serif, 'DM Serif Display', Georgia, serif);
          font-size: 20px;
          color: var(--navy);
        }
        .t2-summary__body {
          padding: 0;
        }
        .t2-summary__payment {
          padding: 16px 24px 20px;
          border-top: 1px solid var(--grey, #f1f5f9);
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
            gap: 12px;
          }
          .t2-header__title {
            font-size: 26px;
          }
          .t2-table__actions {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}
