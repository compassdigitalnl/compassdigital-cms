'use client'

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import type { BudgetWarningBannerProps } from './types'

export function BudgetWarningBanner({ pendingCount, pendingTotal }: BudgetWarningBannerProps) {
  if (pendingCount === 0) return null

  const formattedTotal = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(pendingTotal)

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl border"
      style={{
        background: 'var(--color-warning-light)',
        borderColor: 'var(--color-warning)',
      }}
    >
      <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-warning-dark)' }} />
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--color-warning-dark)' }}>
          {pendingCount} {pendingCount === 1 ? 'bestelling wacht' : 'bestellingen wachten'} op goedkeuring
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-warning-dark)', opacity: 0.8 }}>
          Totale waarde: {formattedTotal}
        </p>
      </div>
    </div>
  )
}
