'use client'

import React from 'react'
import { Clock, Check, X } from 'lucide-react'
import { STATUS_CONFIG } from '../types'
import type { ApprovalStatusBadgeProps } from './types'

const ICONS = {
  clock: Clock,
  check: Check,
  x: X,
}

export function ApprovalStatusBadge({ status, size = 'sm' }: ApprovalStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const Icon = ICONS[config.icon as keyof typeof ICONS]

  return (
    <span
      className="inline-flex items-center gap-1 font-semibold rounded-full"
      style={{
        background: config.bg,
        color: config.text,
        fontSize: size === 'sm' ? '11px' : '12px',
        padding: size === 'sm' ? '2px 10px' : '4px 12px',
      }}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}
