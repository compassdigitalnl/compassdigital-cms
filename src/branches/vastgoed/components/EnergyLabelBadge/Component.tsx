import React from 'react'
import type { EnergyLabelBadgeProps } from './types'

const LABEL_COLORS: Record<string, string> = {
  'A+++': '#00C853',
  'A++': '#00C853',
  'A+': '#00C853',
  A: '#00C853',
  B: '#66BB6A',
  C: '#F59E0B',
  D: '#FF9800',
  E: '#FF6B6B',
  F: '#FF6B6B',
  G: '#FF6B6B',
}

export const EnergyLabelBadge: React.FC<EnergyLabelBadgeProps> = ({
  label,
  size = 'sm',
  showExpiry = false,
  expiry,
  className = '',
}) => {
  const bgColor = LABEL_COLORS[label] || '#94A3B8'

  const sizeClasses = size === 'md' ? 'px-3 py-1.5 text-xs' : 'px-2 py-0.5 text-[10px]'

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span
        className={`inline-flex items-center justify-center rounded-md font-bold text-white ${sizeClasses}`}
        style={{ backgroundColor: bgColor }}
      >
        {label}
      </span>
      {showExpiry && expiry && (
        <span className="text-[11px] text-[var(--color-base-500)]">
          geldig t/m {new Date(expiry).toLocaleDateString('nl-NL', { year: 'numeric', month: 'short' })}
        </span>
      )}
    </span>
  )
}
