import React from 'react'
import type { InsuranceBadgeProps } from './types'

const STATUS_CONFIG: Record<
  InsuranceBadgeProps['status'],
  { label: string; bgClass: string; textClass: string; icon: string }
> = {
  covered: {
    label: 'Vergoed',
    bgClass: 'bg-green-50 border-green/20',
    textClass: 'text-green-700',
    icon: '\u2713',
  },
  partial: {
    label: 'Gedeeltelijk vergoed',
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-700',
    icon: '\u00BD',
  },
  'not-covered': {
    label: 'Niet vergoed',
    bgClass: 'bg-[var(--color-base-50,#f9fafb)] border-[var(--color-base-200)]',
    textClass: 'text-[var(--color-base-500)]',
    icon: '\u2013',
  },
}

export const InsuranceBadge: React.FC<InsuranceBadgeProps> = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status]
  if (!config) return null

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bgClass} ${config.textClass} ${className}`}
    >
      <span className="text-sm leading-none">{config.icon}</span>
      {config.label}
    </span>
  )
}

export default InsuranceBadge
