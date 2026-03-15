'use client'

import React from 'react'
import { TrendingUp } from 'lucide-react'
import type { BudgetOverviewCardProps } from './types'

const fmt = (n: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

export function BudgetOverviewCard({ label, budget, used, period }: BudgetOverviewCardProps) {
  const remaining = budget ? budget - used : undefined
  const usedPercent = budget ? Math.min(100, (used / budget) * 100) : 0
  const isWarning = budget ? usedPercent >= 80 : false
  const isDanger = budget ? usedPercent >= 95 : false

  const barColor = isDanger
    ? 'var(--color-error)'
    : isWarning
      ? 'var(--color-warning)'
      : 'var(--color-primary)'

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-grey-mid" />
        <h3 className="text-sm font-bold text-navy">{label}</h3>
      </div>

      {budget ? (
        <>
          <div className="h-3 rounded-full bg-grey-light overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${usedPercent}%`, background: barColor }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-lg font-extrabold text-navy">{fmt(budget)}</div>
              <div className="text-[10px] text-grey-mid">Budget</div>
            </div>
            <div>
              <div className="text-lg font-extrabold" style={{ color: barColor }}>{fmt(used)}</div>
              <div className="text-[10px] text-grey-mid">Besteed</div>
            </div>
            <div>
              <div className="text-lg font-extrabold" style={{ color: remaining! < 0 ? 'var(--color-error)' : 'var(--color-success)' }}>
                {fmt(remaining!)}
              </div>
              <div className="text-[10px] text-grey-mid">Resterend</div>
            </div>
          </div>

          <div className="mt-2 text-[10px] text-grey-mid text-center">{period}</div>
        </>
      ) : (
        <div className="text-center py-4">
          <div className="text-lg font-extrabold text-navy">{fmt(used)}</div>
          <div className="text-xs text-grey-mid">Besteed ({period}) — geen limiet ingesteld</div>
        </div>
      )}
    </div>
  )
}
