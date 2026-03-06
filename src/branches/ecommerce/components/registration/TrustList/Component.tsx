'use client'

import React from 'react'
import { ShieldCheck, Check } from 'lucide-react'
import type { TrustListProps } from './types'

export const TrustList: React.FC<TrustListProps> = ({
  title = 'Betrouwbaar & veilig',
  titleIcon: TitleIcon = ShieldCheck,
  items,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border bg-white p-6 ${className}`}
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="mb-3.5 flex items-center gap-2 font-heading text-sm font-extrabold text-theme-navy">
        <TitleIcon className="h-4 w-4 text-theme-teal" />
        {title}
      </div>

      <div className="flex flex-col gap-2.5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-[13px] text-theme-navy">
            <Check className="h-4 w-4 flex-shrink-0 text-[var(--color-success)]" />
            {item.text}
          </div>
        ))}
      </div>
    </div>
  )
}
