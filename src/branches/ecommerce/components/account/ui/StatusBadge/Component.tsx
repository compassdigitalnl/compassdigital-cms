import React from 'react'
import { formatOrderStatus } from '@/utilities/formatOrderStatus'
import type { StatusBadgeProps } from './types'

export function StatusBadge({ status, label, statusInfo, className = '' }: StatusBadgeProps) {
  const info = statusInfo || formatOrderStatus(status)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${className}`}
      style={{
        background: info.bg,
        color: info.color,
        border: `1px solid ${info.border}`,
      }}
    >
      {label || info.label}
    </span>
  )
}
