'use client'

import type { PaymentMethodBadgesProps } from './types'

const DEFAULT_METHODS = ['iDEAL', 'Visa', 'Mastercard', 'Op rekening']

export default function PaymentMethodBadges({
  methods = DEFAULT_METHODS,
  size = 'sm',
  className = '',
}: PaymentMethodBadgesProps) {
  return (
    <div className={`payment-badges ${className}`}>
      {methods.map((method) => (
        <span
          key={method}
          className={`payment-badges__badge payment-badges__badge--${size}`}
        >
          {method}
        </span>
      ))}

      <style jsx>{`
        .payment-badges {
          display: flex;
          justify-content: center;
          gap: ${size === 'sm' ? '6px' : '8px'};
          flex-wrap: wrap;
        }
        .payment-badges__badge {
          border-radius: 4px;
          background: var(--grey, #E8ECF1);
          font-weight: ${size === 'sm' ? '700' : '600'};
          color: var(--grey-dark, #64748B);
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .payment-badges__badge--sm {
          padding: 3px 8px;
          font-size: 10px;
        }
        .payment-badges__badge--md {
          padding: 4px 10px;
          font-size: 11px;
        }
      `}</style>
    </div>
  )
}
