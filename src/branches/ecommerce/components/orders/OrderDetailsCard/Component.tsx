'use client'

import React from 'react'
import {
  Truck,
  Package,
  Plane,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Euro,
  Check,
  AlertCircle,
  X,
} from 'lucide-react'
import type { OrderDetailsCardProps, DeliveryIcon, PaymentStatus } from './types'

/**
 * OrderDetailsCard Component
 *
 * 3-column grid displaying order delivery info, payment status, and total amount.
 * Each card features color-coded icons and prominent values for quick scanning.
 *
 * @example
 * ```tsx
 * <OrderDetailsCard
 *   delivery={{ value: "Morgen", subtitle: "Voor 23:59 uur" }}
 *   payment={{ value: "Betaald", subtitle: "Via iDEAL", status: "paid" }}
 *   total={{ value: 7519, currency: "€" }}
 * />
 * ```
 */
export function OrderDetailsCard({
  delivery,
  payment,
  total,
  className = '',
}: OrderDetailsCardProps) {
  // Icon mappings
  const deliveryIcons: Record<DeliveryIcon, typeof Truck> = {
    truck: Truck,
    package: Package,
    plane: Plane,
  }

  const paymentIcons: Record<PaymentStatus, typeof CheckCircle> = {
    paid: CheckCircle,
    pending: Clock,
    failed: XCircle,
    invoice: FileText,
  }

  const badgeIcons = {
    paid: Check,
    pending: AlertCircle,
    failed: X,
  }

  const DeliveryIcon = deliveryIcons[delivery.icon || 'truck']
  const PaymentIcon = paymentIcons[payment.status]

  // Format currency (cents to euros)
  const formatCurrency = (cents: number, currency = '€') => {
    const amount = (cents / 100).toFixed(2).replace('.', ',')
    return `${currency} ${amount}`
  }

  return (
    <section aria-label="Order details" className={`order-details-grid ${className}`}>
      {/* Delivery Card */}
      <article className="order-details-card delivery">
        <div className="order-details-icon" aria-hidden="true">
          <DeliveryIcon size={28} />
        </div>
        <div className="order-details-label" id="delivery-label">
          {delivery.label || 'Verwachte levering'}
        </div>
        <div className="order-details-value" aria-labelledby="delivery-label">
          {delivery.value}
        </div>
        <div className="order-details-subtitle">{delivery.subtitle}</div>
      </article>

      {/* Payment Card */}
      <article className={`order-details-card payment ${payment.status}`}>
        <div className="order-details-icon" aria-hidden="true">
          <PaymentIcon size={28} />
        </div>
        <div className="order-details-label" id="payment-label">
          {payment.label || 'Betaalstatus'}
        </div>
        <div className="order-details-value" aria-labelledby="payment-label" aria-live="polite">
          {payment.value}
        </div>
        <div className="order-details-subtitle">{payment.subtitle}</div>
        {payment.badge && (
          <div className={`status-badge ${payment.badge.variant}`}>
            {React.createElement(badgeIcons[payment.badge.variant], { size: 12 })}
            {payment.badge.text}
          </div>
        )}
      </article>

      {/* Total Card */}
      <article className="order-details-card total">
        <div className="order-details-icon" aria-hidden="true">
          <Euro size={28} />
        </div>
        <div className="order-details-label" id="total-label">
          {total.label || 'Totaalbedrag'}
        </div>
        <div className="order-details-value" aria-labelledby="total-label">
          {formatCurrency(total.value, total.currency)}
        </div>
        <div className="order-details-subtitle">{total.subtitle || 'Incl. BTW'}</div>
      </article>

      <style jsx>{`
        /* Grid container */
        .order-details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-20);
          margin-bottom: var(--space-32);
        }

        /* Card */
        .order-details-card {
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: var(--radius-lg);
          padding: var(--space-24);
          text-align: center;
          transition: all var(--transition);
        }

        .order-details-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        /* Icon container */
        .order-details-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-16);
        }

        /* Delivery icon (teal) */
        .order-details-card.delivery .order-details-icon {
          background: var(--teal-glow);
        }

        .order-details-card.delivery .order-details-icon :global(svg) {
          color: var(--teal);
        }

        /* Payment icon (green for paid) */
        .order-details-card.payment.paid .order-details-icon {
          background: rgba(0, 200, 83, 0.12);
        }

        .order-details-card.payment.paid .order-details-icon :global(svg) {
          color: var(--green);
        }

        /* Payment icon (amber for pending) */
        .order-details-card.payment.pending .order-details-icon {
          background: rgba(245, 158, 11, 0.12);
        }

        .order-details-card.payment.pending .order-details-icon :global(svg) {
          color: var(--amber);
        }

        /* Payment icon (coral for failed) */
        .order-details-card.payment.failed .order-details-icon {
          background: rgba(255, 107, 107, 0.12);
        }

        .order-details-card.payment.failed .order-details-icon :global(svg) {
          color: var(--coral);
        }

        /* Payment icon (teal for invoice) */
        .order-details-card.payment.invoice .order-details-icon {
          background: var(--teal-glow);
        }

        .order-details-card.payment.invoice .order-details-icon :global(svg) {
          color: var(--teal);
        }

        /* Total icon (navy) */
        .order-details-card.total .order-details-icon {
          background: rgba(10, 22, 40, 0.08);
        }

        .order-details-card.total .order-details-icon :global(svg) {
          color: var(--navy);
        }

        /* Label */
        .order-details-label {
          font-weight: 700;
          font-size: 14px;
          color: var(--navy);
          margin-bottom: var(--space-4);
        }

        /* Value */
        .order-details-value {
          font-family: var(--font-body);
          font-size: 20px;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: var(--space-4);
        }

        /* Delivery value (teal) */
        .order-details-card.delivery .order-details-value {
          color: var(--teal);
        }

        /* Payment value colors */
        .order-details-card.payment.paid .order-details-value {
          color: var(--green);
        }

        .order-details-card.payment.pending .order-details-value {
          color: var(--amber);
        }

        .order-details-card.payment.failed .order-details-value {
          color: var(--coral);
        }

        .order-details-card.payment.invoice .order-details-value {
          color: var(--teal);
        }

        /* Total value (navy) */
        .order-details-card.total .order-details-value {
          color: var(--navy);
        }

        /* Subtitle */
        .order-details-subtitle {
          font-size: 12px;
          color: var(--grey-mid);
        }

        /* Status badge */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          margin-top: var(--space-8);
        }

        .status-badge.paid {
          background: #e8f5e9;
          color: #166534;
        }

        .status-badge.pending {
          background: #fff8e1;
          color: #92400e;
        }

        .status-badge.failed {
          background: #fff0f0;
          color: #dc2626;
        }

        /* Payment card border colors for non-paid statuses */
        .order-details-card.payment.pending {
          border-color: var(--amber);
        }

        .order-details-card.payment.failed {
          border-color: var(--coral);
        }

        .order-details-card.payment.invoice {
          border-color: var(--teal);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .order-details-grid {
            grid-template-columns: 1fr;
            gap: var(--space-16);
          }

          .order-details-card {
            padding: var(--space-20);
          }

          .order-details-icon {
            width: 48px;
            height: 48px;
          }

          .order-details-icon :global(svg) {
            width: 24px;
            height: 24px;
          }

          .order-details-value {
            font-size: 18px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .order-details-card {
            transition: none;
          }

          .order-details-card:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
