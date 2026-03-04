'use client'

import React from 'react'
import { MapPin } from 'lucide-react'
import type { OrderAddressesProps, OrderAddress } from './types'

/**
 * OrderAddresses Component
 *
 * Dual-column read-only address display for shipping and billing addresses.
 * Used on order confirmation pages.
 *
 * @example
 * ```tsx
 * <OrderAddresses
 *   shippingAddress={{ company: 'Acme BV', street: 'Keizersgracht 1', postalCode: '1015 AA', city: 'Amsterdam' }}
 *   billingAddress={{ company: 'Acme BV', street: 'Keizersgracht 1', postalCode: '1015 AA', city: 'Amsterdam', kvk: '12345678' }}
 * />
 * ```
 */

function AddressBlock({ address, label }: { address: OrderAddress; label: string }) {
  return (
    <div className="addr-card">
      <div className="addr-label">{label}</div>
      <div className="addr-text">
        {address.company && <div className="addr-company">{address.company}</div>}
        {address.name && <div>{address.name}</div>}
        {address.attention && <div>T.a.v. {address.attention}</div>}
        <div>{address.street}</div>
        <div>{address.postalCode} {address.city}</div>
        {address.country && <div>{address.country}</div>}
        {address.kvk && <div>KVK {address.kvk}</div>}
        {address.vatNumber && <div>BTW-nr. {address.vatNumber}</div>}
      </div>

      <style jsx>{`
        .addr-card {
          background: var(--grey-light);
          border-radius: var(--radius);
          padding: 16px;
        }

        .addr-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--teal);
          margin-bottom: 6px;
        }

        .addr-text {
          font-size: 14px;
          color: var(--navy);
          line-height: 1.6;
        }

        .addr-company {
          font-weight: 700;
        }
      `}</style>
    </div>
  )
}

export function OrderAddresses({
  shippingAddress,
  billingAddress,
  className = '',
}: OrderAddressesProps) {
  return (
    <div className={`order-addresses ${className}`}>
      <div className="addresses-header">
        <MapPin size={18} aria-hidden="true" />
        Adresgegevens
      </div>

      <div className="addr-grid">
        <AddressBlock address={shippingAddress} label="Afleveradres" />
        <AddressBlock address={billingAddress} label="Factuuradres" />
      </div>

      <style jsx>{`
        .order-addresses {
          background: var(--white);
          border: 1px solid var(--grey);
          border-radius: 16px;
          padding: 24px;
        }

        .addresses-header {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .addresses-header :global(svg) {
          color: var(--teal);
        }

        .addr-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .order-addresses {
            padding: 20px;
          }

          .addr-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Print */
        @media print {
          .order-addresses {
            border: 1px solid #ddd;
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  )
}
