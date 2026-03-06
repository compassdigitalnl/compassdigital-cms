'use client'

import React from 'react'
import { Zap, RotateCcw, ShieldCheck, Lock, type LucideIcon } from 'lucide-react'
import type { TrustListProps } from './types'

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  RotateCcw,
  ShieldCheck,
  Lock,
}

export const TrustList: React.FC<TrustListProps> = ({
  items,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-0.5 border-t border-[var(--color-border,#E8ECF1)] pt-3 ${className}`}>
      {items.map((item, i) => {
        const Icon = item.icon ? ICON_MAP[item.icon] || ShieldCheck : ShieldCheck
        return (
          <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <Icon className="h-[13px] w-[13px] text-[var(--color-success,#00C853)]" />
            {item.text}
          </div>
        )
      })}
    </div>
  )
}
