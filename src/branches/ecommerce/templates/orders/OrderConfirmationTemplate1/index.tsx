'use client'

import React, { useState } from 'react'
import { Copy, Check, CreditCard } from 'lucide-react'

// Existing components
import { SuccessHero } from '@/branches/ecommerce/components/orders/SuccessHero'
import { OrderItemsSummary } from '@/branches/ecommerce/components/orders/OrderItemsSummary'
import { NextStepsCTA } from '@/branches/ecommerce/components/orders/NextStepsCTA'
import { EmailConfirmationBanner } from '@/branches/ecommerce/components/orders/EmailConfirmationBanner'
import { OrderSummary } from '@/branches/ecommerce/components/ui/OrderSummary'

// New components
import { OrderTimeline } from '@/branches/ecommerce/components/orders/OrderTimeline'
import { OrderAddresses } from '@/branches/ecommerce/components/orders/OrderAddresses'
import { AccountCreationCTA } from '@/branches/ecommerce/components/orders/AccountCreationCTA'
import { SupportCard } from '@/branches/ecommerce/components/orders/SupportCard'

// Types
import type { TimelineStep } from '@/branches/ecommerce/components/orders/OrderTimeline'
import type { OrderAddress } from '@/branches/ecommerce/components/orders/OrderAddresses'
import type { OrderItem } from '@/branches/ecommerce/components/orders/OrderItemsSummary'
import type { NextStepAction } from '@/branches/ecommerce/components/orders/NextStepsCTA'

export interface OrderConfirmationData {
  orderNumber: string
  email: string
  // Timeline
  timelineSteps: TimelineStep[]
  expectedDelivery?: string
  deliveryMethod?: string
  // Items
  items: OrderItem[]
  // Addresses
  shippingAddress: OrderAddress
  billingAddress: OrderAddress
  // Summary
  subtotal: number
  discount?: number
  discountCode?: string
  shipping: number | 'free'
  tax: number
  total: number
  paymentMethod?: string
  // Actions
  actions: NextStepAction[]
}

export interface SiteContactInfo {
  phone?: string
  email?: string
  registerUrl?: string
}

export interface OrderConfirmationTemplate1Props {
  order: OrderConfirmationData
  contact?: SiteContactInfo
  className?: string
}

/**
 * OrderConfirmationTemplate1
 *
 * Composes all order confirmation components into a full-page template.
 * Layout: SuccessHero → 2-column (main + sidebar) → EmailBanner
 *
 * Main: OrderTimeline → OrderItemsSummary → OrderAddresses → NextStepsCTA
 * Sidebar: OrderSummary(readonly) → AccountCreationCTA → SupportCard
 */
export function OrderConfirmationTemplate1({
  order,
  contact,
  className = '',
}: OrderConfirmationTemplate1Props) {
  const [copied, setCopied] = useState(false)

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`oct1 ${className}`}>
      {/* Success Hero */}
      <SuccessHero
        orderNumber={order.orderNumber}
        title="Bedankt voor uw bestelling!"
        description={`Uw bestelling is succesvol ontvangen en wordt zo snel mogelijk verwerkt. U ontvangt een bevestiging per e-mail op <strong>${order.email}</strong>`}
        variant="compact"
      />

      {/* Order number badge (with copy) */}
      <div className="order-number-row">
        <button
          onClick={copyOrderNumber}
          className="order-number-badge"
          title={copied ? 'Gekopieerd!' : 'Kopieer ordernummer'}
          aria-label={`Ordernummer ${order.orderNumber}. ${copied ? 'Gekopieerd' : 'Klik om te kopiëren'}`}
        >
          {order.orderNumber}
          {copied ? (
            <Check size={16} className="icon-copied" />
          ) : (
            <Copy size={16} className="icon-copy" />
          )}
        </button>
      </div>

      {/* 2-column layout */}
      <div className="oct1-layout">
        {/* Main column */}
        <div className="oct1-main">
          {/* Timeline */}
          <OrderTimeline
            steps={order.timelineSteps}
            expectedDelivery={order.expectedDelivery}
            deliveryMethod={order.deliveryMethod}
          />

          {/* Order Items */}
          <OrderItemsSummary items={order.items} />

          {/* Addresses */}
          <OrderAddresses
            shippingAddress={order.shippingAddress}
            billingAddress={order.billingAddress}
          />

          {/* Action Buttons */}
          <NextStepsCTA
            actions={order.actions}
            variant="icon-only"
          />
        </div>

        {/* Sidebar */}
        <aside className="oct1-sidebar">
          {/* Order Summary (read-only) */}
          <div className="sidebar-summary">
            <OrderSummary
              subtotal={order.subtotal}
              discount={order.discount}
              discountCode={order.discountCode}
              shipping={order.shipping}
              tax={order.tax}
              total={order.total}
              readonly={true}
              sticky={false}
            />
            {/* Payment method note */}
            {order.paymentMethod && (
              <div className="payment-method">
                <CreditCard size={16} aria-hidden="true" />
                Betaald via <strong>{order.paymentMethod}</strong>
              </div>
            )}
          </div>

          {/* Account Creation CTA */}
          <AccountCreationCTA
            buttonHref={contact?.registerUrl || '/auth/register/'}
          />

          {/* Support Card */}
          <SupportCard
            phone={contact?.phone}
            email={contact?.email}
          />
        </aside>
      </div>

      {/* Email confirmation banner */}
      <EmailConfirmationBanner
        message="Een kopie van deze bevestiging is verstuurd naar"
        email={order.email}
        variant="info"
        compact={true}
      />

      <style jsx>{`
        .oct1 {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px 64px;
        }

        /* Order number badge row */
        .order-number-row {
          text-align: center;
          margin-bottom: 32px;
        }

        .order-number-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--white);
          border: 1.5px solid var(--grey);
          border-radius: 10px;
          padding: 10px 20px;
          font-family: var(--font-mono);
          font-size: 16px;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
          transition: border-color var(--transition);
        }

        .order-number-badge:hover {
          border-color: var(--teal);
        }

        .order-number-badge:focus-visible {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
          box-shadow: 0 0 0 4px var(--teal-glow);
        }

        .order-number-badge :global(.icon-copy) {
          color: var(--teal);
        }

        .order-number-badge :global(.icon-copied) {
          color: var(--green);
        }

        /* 2-column layout */
        .oct1-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 28px;
          align-items: start;
        }

        /* Main column spacing */
        .oct1-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Sidebar */
        .oct1-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
          position: sticky;
          top: 90px;
        }

        /* Payment method note inside summary card */
        .sidebar-summary {
          display: flex;
          flex-direction: column;
        }

        .payment-method {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: -12px;
          padding: 10px 14px;
          margin-left: 28px;
          margin-right: 28px;
          margin-bottom: 28px;
          background: var(--grey-light);
          border-radius: var(--radius-sm);
          font-size: 13px;
          color: var(--grey-dark);
        }

        .payment-method :global(svg) {
          color: var(--teal);
          flex-shrink: 0;
        }

        .payment-method :global(strong) {
          margin-left: 4px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .oct1-layout {
            grid-template-columns: 1fr;
          }

          .oct1-sidebar {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .oct1 {
            padding: 0 16px 48px;
          }
        }

        /* Print */
        @media print {
          .order-number-badge {
            border: 1px solid #ddd;
            cursor: default;
          }

          .order-number-badge :global(svg) {
            display: none;
          }

          .oct1-layout {
            grid-template-columns: 1fr 300px;
          }

          .oct1-sidebar {
            position: static;
          }
        }
      `}</style>
    </div>
  )
}
