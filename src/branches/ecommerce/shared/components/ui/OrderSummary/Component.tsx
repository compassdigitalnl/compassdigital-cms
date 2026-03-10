/**
 * OrderSummary Component
 *
 * Sidebar component displaying order totals breakdown (subtotal, discount, shipping, tax)
 * with grand total and checkout CTA buttons. Used in cart pages, checkout reviews,
 * and order confirmations.
 *
 * Features:
 * - Line-by-line breakdown of costs
 * - Discount display (green, negative value)
 * - Free shipping indicator
 * - Tax calculation (21% BTW by default)
 * - Grand total (large, bold, Jakarta Sans 28px 800)
 * - Tax-inclusive note
 * - Primary CTA: "Naar betalen" (gradient teal button)
 * - Secondary CTA: "Offerte aanvragen" (outline button, optional)
 * - Sticky positioning option (for cart sidebar)
 * - Read-only mode (no action buttons)
 *
 * @category E-commerce
 * @component EC07
 */

'use client'

import React from 'react'
import { Receipt, Lock, FileText } from 'lucide-react'
import type { OrderSummaryProps } from './types'
import { usePriceMode } from '@/branches/ecommerce/shared/hooks/usePriceMode'

export function OrderSummary({
  subtotal,
  discount,
  discountCode,
  shipping,
  tax,
  total,
  showQuoteButton = true,
  sticky = false,
  readonly = false,
  taxRate = 21,
  taxLabel,
  currencySymbol = '€',
  locale = 'nl-NL',
  onCheckout,
  onRequestQuote,
  className = '',
}: OrderSummaryProps) {
  const { taxNote } = usePriceMode()

  // Format price with euro/cent separation
  const formatPrice = (price: number | 'free') => {
    if (price === 'free') return 'Gratis'

    const formatted = price.toFixed(2).replace('.', ',')
    return `${currencySymbol} ${formatted}`
  }

  // Format total with large euro/small cents
  const formatTotal = (price: number) => {
    const formatted = price.toFixed(2)
    const [euros, cents] = formatted.split('.')
    return { euros, cents }
  }

  const totalFormatted = formatTotal(total)
  const computedTaxLabel = taxLabel || `BTW (${taxRate}%)`

  return (
    <div className={`order-summary ${sticky ? 'order-summary--sticky' : ''} ${className}`}>
      {/* Header */}
      <div className="order-summary__header">
        <Receipt size={20} />
        Overzicht
      </div>

      {/* Subtotal */}
      <div className="order-summary__row">
        <span className="order-summary__label">Subtotaal</span>
        <span className="order-summary__value">{formatPrice(subtotal)}</span>
      </div>

      {/* Discount (if applied) */}
      {discount && discount > 0 && (
        <div className="order-summary__row">
          <span className="order-summary__label">
            Korting {discountCode && `(${discountCode})`}
          </span>
          <span className="order-summary__value order-summary__value--discount">
            −{formatPrice(discount)}
          </span>
        </div>
      )}

      {/* Shipping */}
      <div className="order-summary__row">
        <span className="order-summary__label">Verzendkosten</span>
        <span
          className={`order-summary__value ${shipping === 'free' || shipping === 0 ? 'order-summary__value--discount' : ''}`}
        >
          {formatPrice(shipping === 'free' ? 'free' : shipping)}
        </span>
      </div>

      {/* Tax */}
      <div className="order-summary__row">
        <span className="order-summary__label">{computedTaxLabel}</span>
        <span className="order-summary__value">{formatPrice(tax)}</span>
      </div>

      {/* Divider */}
      <hr className="order-summary__divider" />

      {/* Total */}
      <div className="order-summary__total">
        <span className="order-summary__total-label">Totaal</span>
        <span className="order-summary__total-value">
          {currencySymbol} {totalFormatted.euros}
          <small>,{totalFormatted.cents}</small>
        </span>
      </div>

      {/* Tax Note */}
      <div className="order-summary__tax-note">{taxNote}</div>

      {/* Action Buttons */}
      {!readonly && (
        <div className="order-summary__actions">
          {/* Primary: Checkout */}
          <button className="order-summary__btn order-summary__btn--primary" onClick={onCheckout}>
            <Lock size={20} />
            Naar betalen
          </button>

          {/* Secondary: Request Quote (optional) */}
          {showQuoteButton && (
            <button
              className="order-summary__btn order-summary__btn--secondary"
              onClick={onRequestQuote}
            >
              <FileText size={18} />
              Offerte aanvragen
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .order-summary {
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: var(--radius-lg);
          padding: 28px;
        }

        .order-summary--sticky {
          position: sticky;
          top: 90px;
        }

        .order-summary__header {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .order-summary__header :global(svg) {
          color: var(--color-primary);
        }

        .order-summary__row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          font-size: 14px;
        }

        .order-summary__label {
          color: var(--grey-dark);
        }

        .order-summary__value {
          font-weight: 600;
          color: var(--navy);
        }

        .order-summary__value--discount {
          color: var(--green);
        }

        .order-summary__divider {
          border: none;
          border-top: 1px solid var(--grey);
          margin: 8px 0;
        }

        .order-summary__total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 14px 0 4px;
        }

        .order-summary__total-label {
          font-size: 16px;
          font-weight: 700;
          color: var(--navy);
        }

        .order-summary__total-value {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 800;
          color: var(--navy);
        }

        .order-summary__total-value small {
          font-size: 22px;
        }

        .order-summary__tax-note {
          text-align: right;
          font-size: 12px;
          color: var(--grey-mid);
          margin-bottom: 20px;
        }

        .order-summary__actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .order-summary__btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px;
          border: none;
          border-radius: var(--radius);
          font-family: var(--font-primary);
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition);
        }

        .order-summary__btn--primary {
          background: var(--color-primary);
          color: white;
          box-shadow: 0 4px 20px var(--color-primary-glow, rgba(10,22,40,0.25));
        }

        .order-summary__btn--primary:hover {
          background: var(--color-primary-dark);
          box-shadow: 0 6px 28px var(--color-primary-glow, rgba(10,22,40,0.35));
          transform: translateY(-1px);
        }

        .order-summary__btn--secondary {
          background: var(--white);
          color: var(--color-primary);
          border: 1.5px solid var(--grey);
          padding: 14px;
          font-size: 14px;
        }

        .order-summary__btn--secondary:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .order-summary__btn--secondary :global(svg) {
          width: 18px;
          height: 18px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .order-summary {
            padding: 20px;
          }

          .order-summary--sticky {
            position: static;
          }

          .order-summary__total-value {
            font-size: 24px;
          }

          .order-summary__total-value small {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  )
}
