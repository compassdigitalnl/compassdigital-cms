'use client'

import React from 'react'
import { ShieldCheck } from 'lucide-react'
import type { TrustBannerProps } from './types'

export const TrustBanner: React.FC<TrustBannerProps> = ({
  title,
  description,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-3 rounded-[var(--border-radius,12px)] border border-[rgba(0,200,83,0.15)] bg-[var(--color-success-light,#E8F5E9)] p-4 ${className}`}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-surface,white)]">
        <ShieldCheck className="h-5 w-5 text-[var(--color-success,#00C853)]" />
      </div>
      <div className="text-[13px] leading-snug">
        <strong className="text-[var(--color-success,#00C853)]">{title}</strong>
        <br />
        {description}
      </div>
    </div>
  )
}
