'use client'

import React from 'react'
import { BadgePercent } from 'lucide-react'
import type { BillingPeriodSelectorProps } from './types'

export const BillingPeriodSelector: React.FC<BillingPeriodSelectorProps> = ({
  options,
  selectedId,
  onSelect,
  savingsNote,
  className = '',
}) => {
  return (
    <div className={className}>
      <div className={`mb-3.5 grid gap-2 ${options.length <= 2 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
        {options.map((opt) => {
          const isSelected = opt.id === selectedId
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`relative cursor-pointer rounded-[var(--border-radius,12px)] border-2 bg-transparent p-3.5 text-center transition-all duration-150 ${
                isSelected
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-glow)]'
                  : 'border-[var(--color-border,#E8ECF1)] hover:border-[var(--color-primary)]'
              }`}
            >
              {opt.savingsLabel && (
                <span className="absolute -top-2 right-2 rounded bg-[var(--color-success,#00C853)] px-2 py-0.5 text-[10px] font-bold text-white">
                  {opt.savingsLabel}
                </span>
              )}
              <div className="text-sm font-bold">{opt.label}</div>
              <div
                className="mt-0.5 font-heading text-lg font-extrabold"
                style={{ color: isSelected ? 'var(--color-primary)' : 'inherit' }}
              >
                {opt.price}
              </div>
              {opt.subtitle && (
                <div className="text-[11px] text-[var(--color-text-muted)]">{opt.subtitle}</div>
              )}
            </button>
          )
        })}
      </div>

      {savingsNote && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-success,#00C853)]">
          <BadgePercent className="h-3.5 w-3.5" />
          {savingsNote}
        </div>
      )}
    </div>
  )
}
