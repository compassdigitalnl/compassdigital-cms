/**
 * StockIndicator Component
 *
 * Small inline component displaying product stock status with color-coded dot and text.
 * Shows 3 states: in-stock (green), low stock (amber), or out-of-stock (coral).
 *
 * Features:
 * - 3 states: in-stock, low, out (color-coded)
 * - Colored dot: 6px circle matching text color
 * - Inline-flex layout: Works inline with other content
 * - 3 sizes: Small (11px), default (12px), large (14px)
 * - Accessibility: role="status" + aria-live="polite"
 * - Lightweight: No dependencies, pure CSS
 *
 * @category E-commerce
 * @component EC04
 */

'use client'

import React from 'react'
import type { StockIndicatorProps, StockStatus } from './types'

export function StockIndicator({
  status,
  quantity,
  size = 'default',
  customText,
  className = '',
}: StockIndicatorProps) {
  // Generate display text based on status and quantity
  const getText = (): string => {
    if (customText) return customText

    switch (status) {
      case 'in-stock':
        return quantity
          ? `Op voorraad (${quantity.toLocaleString('nl-NL')} stuks)`
          : 'Op voorraad'
      case 'low':
        return quantity
          ? `Laag op voorraad (${quantity.toLocaleString('nl-NL')} stuks)`
          : 'Laag op voorraad'
      case 'out':
        return 'Tijdelijk uitverkocht'
      default:
        return ''
    }
  }

  // Generate ARIA label for screen readers
  const getAriaLabel = (): string => {
    if (customText) return customText

    switch (status) {
      case 'in-stock':
        return quantity
          ? `Op voorraad, ${quantity} stuks beschikbaar`
          : 'Op voorraad'
      case 'low':
        return quantity
          ? `Laag op voorraad, nog ${quantity} stuks beschikbaar`
          : 'Laag op voorraad'
      case 'out':
        return 'Tijdelijk uitverkocht'
      default:
        return ''
    }
  }

  // CSS classes
  const indicatorClasses = [
    'stock-indicator',
    `stock-indicator--${status}`,
    size !== 'default' ? `stock-indicator--${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Color mapping for theme variables
  const getColor = (stockStatus: StockStatus): string => {
    switch (stockStatus) {
      case 'in-stock':
        return 'var(--green)'
      case 'low':
        return 'var(--amber)'
      case 'out':
        return 'var(--coral)'
      default:
        return 'var(--grey-mid)'
    }
  }

  const color = getColor(status)

  return (
    <div
      className={indicatorClasses}
      role="status"
      aria-live="polite"
      aria-label={getAriaLabel()}
    >
      <div className="stock-indicator__dot" aria-hidden="true" />
      {getText()}

      <style jsx>{`
        /* ═══ STOCK INDICATOR ═══ */
        .stock-indicator {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: ${color};
          font-family: var(--font-primary);
        }

        .stock-indicator__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          background: ${color};
        }

        /* Size Variants */
        .stock-indicator--small {
          font-size: 11px;
          gap: 5px;
        }

        .stock-indicator--small .stock-indicator__dot {
          width: 5px;
          height: 5px;
        }

        .stock-indicator--large {
          font-size: 14px;
          gap: 8px;
        }

        .stock-indicator--large .stock-indicator__dot {
          width: 8px;
          height: 8px;
        }
      `}</style>
    </div>
  )
}
