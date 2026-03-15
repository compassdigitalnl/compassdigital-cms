'use client'

import React from 'react'
import { TrustSignalItem } from './TrustSignalItem'
import type { TrustSignalsProps, TrustSignal } from './types'

/**
 * Default trust signals (if none provided)
 */
const defaultSignals: TrustSignal[] = [
  { icon: 'ShieldCheck', text: 'Veilig betalen met SSL' },
  { icon: 'RotateCcw', text: '30 dagen retourrecht' },
  { icon: 'Truck', text: 'Morgen in huis' },
]

/**
 * TrustSignals Component
 * EC09: Trust signals bar with conversion-boosting trust badges
 *
 * @example
 * // Default usage (vertical, in OrderSummary)
 * <TrustSignals
 *   signals={[
 *     { icon: 'ShieldCheck', text: 'Veilig betalen met SSL' },
 *     { icon: 'RotateCcw', text: '30 dagen retourrecht' },
 *     { icon: 'Truck', text: 'Morgen in huis' }
 *   ]}
 * />
 *
 * @example
 * // Compact variant (mini cart)
 * <TrustSignals variant="compact" signals={defaultSignals} />
 *
 * @example
 * // Horizontal variant (product page)
 * <TrustSignals variant="horizontal" signals={defaultSignals} />
 *
 * @example
 * // Card variant (standalone)
 * <TrustSignals variant="card" signals={defaultSignals} />
 */
export function TrustSignals({
  signals = defaultSignals,
  variant = 'default',
  className = '',
}: TrustSignalsProps) {
  // Base styles
  const baseStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '20px 0',
    borderTop: '1px solid var(--grey)',
  }

  // Variant-specific styles
  const variantStyles: Record<string, React.CSSProperties> = {
    compact: {
      padding: '0',
      borderTop: 'none',
      gap: '6px',
    },
    horizontal: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '12px',
    },
    card: {
      background: 'var(--white)',
      border: '1px solid var(--grey)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
    },
  }

  // Merge styles
  const styles =
    variant === 'default'
      ? baseStyles
      : { ...baseStyles, ...variantStyles[variant] }

  return (
    <ul
      className={className}
      style={styles}
      aria-label="Trust signals"
    >
      {signals.map((signal, index) => (
        <TrustSignalItem
          key={index}
          icon={signal.icon}
          text={signal.text}
          variant={variant}
        />
      ))}
    </ul>
  )
}
