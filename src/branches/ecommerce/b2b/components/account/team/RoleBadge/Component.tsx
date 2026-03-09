'use client'

import React from 'react'
import { ROLE_LABELS, ROLE_COLORS } from '../types'
import type { RoleBadgeProps } from './types'

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const colors = ROLE_COLORS[role]
  const label = ROLE_LABELS[role]

  return (
    <span
      className="inline-flex items-center font-semibold rounded-full"
      style={{
        background: colors.bg,
        color: colors.text,
        fontSize: size === 'sm' ? '11px' : '12px',
        padding: size === 'sm' ? '2px 10px' : '4px 12px',
      }}
    >
      {label}
    </span>
  )
}
