'use client'

import React from 'react'
import { CreditCard } from 'lucide-react'
import type { CreditLimitCardProps } from './types'

const fmt = (n: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

const TERMS_LABELS: Record<string, string> = {
  '14': '14 dagen',
  '30': '30 dagen',
  '60': '60 dagen',
}

export function CreditLimitCard({ creditLimit, creditUsed, paymentTerms }: CreditLimitCardProps) {
  if (!creditLimit) return null

  const available = creditLimit - creditUsed
  const usedPercent = Math.min(100, (creditUsed / creditLimit) * 100)
  const isDanger = usedPercent >= 90

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-bold text-gray-900">Kredietlimiet</h3>
      </div>

      <div className="h-3 rounded-full bg-gray-100 overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${usedPercent}%`, background: isDanger ? 'var(--color-error)' : 'var(--color-info)' }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <div>
          <div className="text-lg font-extrabold text-gray-900">{fmt(creditLimit)}</div>
          <div className="text-[10px] text-gray-400">Limiet</div>
        </div>
        <div>
          <div className="text-lg font-extrabold" style={{ color: isDanger ? 'var(--color-error)' : 'var(--color-info)' }}>
            {fmt(creditUsed)}
          </div>
          <div className="text-[10px] text-gray-400">Openstaand</div>
        </div>
        <div>
          <div className="text-lg font-extrabold" style={{ color: available < 0 ? 'var(--color-error)' : 'var(--color-success)' }}>
            {fmt(available)}
          </div>
          <div className="text-[10px] text-gray-400">Beschikbaar</div>
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center border-t border-gray-100 pt-2">
        Betaaltermijn: {TERMS_LABELS[paymentTerms] || `${paymentTerms} dagen`}
      </div>
    </div>
  )
}
