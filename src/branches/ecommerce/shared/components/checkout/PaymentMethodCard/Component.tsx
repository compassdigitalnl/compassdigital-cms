'use client'

import React from 'react'
import type { PaymentMethodCardProps } from './types'

/**
 * PaymentMethodCard Component
 *
 * Payment method selection card for checkout flow.
 * Radio button card with logo, name, and description.
 * Supports 4 methods: iDEAL, Credit Card, PayPal, and Invoice (B2B).
 *
 * @example
 * ```tsx
 * <PaymentMethodCard
 *   method={{
 *     id: '1',
 *     name: 'iDEAL',
 *     slug: 'ideal',
 *     description: 'Direct betalen via je bank',
 *     logo: '🏦',
 *   }}
 *   selected={selectedId === '1'}
 *   onSelect={(id) => setSelectedId(id)}
 * />
 * ```
 */
export function PaymentMethodCard({
  method,
  selected,
  onSelect,
  disabled = false,
  className = '',
}: PaymentMethodCardProps) {
  return (
    <label
      className={`payment-method-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${className}`}
    >
      {/* Radio input (left side) */}
      <input
        type="radio"
        name="payment-method"
        value={method.id}
        checked={selected}
        onChange={() => onSelect(method.id)}
        disabled={disabled}
        className="payment-method-card__radio"
        aria-label={`${method.name}, ${method.description}`}
      />

      {/* Payment info (center, grows to fill space) */}
      <div className="payment-info">
        <div className="payment-name">
          {method.name}
          {method.isB2B && <span className="b2b-badge">B2B</span>}
          {method.badge && <span className="custom-badge">{method.badge}</span>}
        </div>
        <div className="payment-description">{method.description}</div>
        {method.fee && <div className="payment-fee">{method.fee}</div>}
      </div>

      {/* Payment logo (right side) */}
      <div className="payment-logo" aria-hidden="true">
        {method.logo}
      </div>

      <style jsx>{`
        .payment-method-card {
          background: white;
          border: 2px solid var(--grey);
          border-radius: 14px;
          padding: 20px;
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .payment-method-card:hover:not(.disabled) {
          border-color: var(--teal-light);
          box-shadow: 0 1px 3px rgba(10, 22, 40, 0.06);
        }

        .payment-method-card.selected {
          border-color: var(--teal);
          background: white;
        }

        .payment-method-card.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .payment-method-card__radio {
          width: 20px;
          height: 20px;
          accent-color: var(--teal);
          cursor: pointer;
          flex-shrink: 0;
        }

        .payment-method-card.disabled .payment-method-card__radio {
          cursor: not-allowed;
        }

        .payment-method-card:focus-within {
          outline: 2px solid var(--teal);
          outline-offset: 2px;
        }

        .payment-info {
          flex: 1;
        }

        .payment-name {
          font-weight: 700;
          font-size: 15px;
          color: var(--navy);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
          line-height: 1.4;
        }

        .payment-description {
          font-size: 13px;
          color: var(--grey-dark);
          line-height: 1.4;
        }

        .payment-fee {
          font-size: 12px;
          color: var(--grey-mid);
          margin-top: 2px;
        }

        .b2b-badge {
          font-size: 10px;
          font-weight: 700;
          color: var(--teal);
          background: var(--teal-glow);
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .custom-badge {
          font-size: 10px;
          font-weight: 700;
          color: var(--navy);
          background: var(--grey-light);
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .payment-logo {
          width: 48px;
          height: 32px;
          background: var(--grey-light);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        /* PayPal specific logo styling (blue "P" text) */
        .payment-logo :global(.paypal-logo) {
          font-weight: 700;
          color: #0070ba;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .payment-method-card {
            padding: 16px;
          }

          .payment-name {
            font-size: 14px;
          }

          .payment-description {
            font-size: 12px;
          }

          .payment-logo {
            width: 40px;
            height: 24px;
            font-size: 16px;
          }
        }
      `}</style>
    </label>
  )
}
