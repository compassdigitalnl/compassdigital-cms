'use client'

import React from 'react'
import type { CheckoutCardProps } from './types'

export const CheckoutCard: React.FC<CheckoutCardProps> = ({
  title,
  icon: Icon,
  children,
  className = '',
}) => {
  return (
    <div
      className={`rounded-[18px] border border-[var(--color-border,#E8ECF1)] bg-[var(--color-surface,white)] p-6 ${className}`}
    >
      <div className="mb-3.5 flex items-center gap-2 font-heading text-[17px] font-extrabold text-[var(--color-text-primary)]">
        {Icon && <Icon className="h-[17px] w-[17px] text-[var(--color-primary)]" />}
        {title}
      </div>
      {children}
    </div>
  )
}
