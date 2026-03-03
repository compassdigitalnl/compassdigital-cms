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
          gap: ${size === 'sm' ? 'var(--sp-2)' : 'var(--sp-2)'};
          flex-wrap: wrap;
        }
        .payment-badges__badge {
          border-radius: 4px;
          background: var(--grey);
          font-weight: ${size === 'sm' ? '700' : '600'};
          color: var(--grey-dark);
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .payment-badges__badge--sm {
          padding: 3px var(--sp-2);
          font-size: var(--text-label);
        }
        .payment-badges__badge--md {
          padding: var(--sp-1) var(--sp-2);
          font-size: var(--text-small);
        }
      `}</style>
    </div>
  )
}
