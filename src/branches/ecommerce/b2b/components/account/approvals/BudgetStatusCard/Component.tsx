'use client'

import React from 'react'
import { Wallet } from 'lucide-react'
import type { BudgetStatusCardProps } from './types'

const fmt = (n: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

export function BudgetStatusCard({ monthlyBudget, monthlyUsed, orderAmount }: BudgetStatusCardProps) {
  if (!monthlyBudget) return null

  const remaining = monthlyBudget - monthlyUsed
  const afterOrder = remaining - orderAmount
  const wouldExceed = afterOrder < 0
  const usedPercent = Math.min(100, (monthlyUsed / monthlyBudget) * 100)
  const orderPercent = Math.min(100 - usedPercent, (orderAmount / monthlyBudget) * 100)

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-bold text-gray-900">Budget impact</h3>
      </div>

      {/* Progress bar */}
      <div className="h-3 rounded-full bg-gray-100 overflow-hidden mb-3">
        <div className="h-full flex">
          <div
            className="h-full rounded-l-full"
            style={{ width: `${usedPercent}%`, background: 'var(--color-primary)' }}
          />
          <div
            className="h-full"
            style={{
              width: `${orderPercent}%`,
              background: wouldExceed ? 'var(--color-error)' : 'var(--color-warning)',
            }}
          />
        </div>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-500">Maandbudget</span>
          <span className="font-semibold text-gray-900">{fmt(monthlyBudget)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Besteed deze maand</span>
          <span className="font-semibold text-gray-900">{fmt(monthlyUsed)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Deze bestelling</span>
          <span className="font-semibold" style={{ color: wouldExceed ? 'var(--color-error)' : 'var(--color-warning-dark)' }}>
            {fmt(orderAmount)}
          </span>
        </div>
        <div className="flex justify-between pt-1.5 border-t border-gray-100">
          <span className="text-gray-500">Resterend na goedkeuring</span>
          <span className="font-bold" style={{ color: wouldExceed ? 'var(--color-error)' : 'var(--color-success)' }}>
            {fmt(Math.max(0, afterOrder))}
          </span>
        </div>
      </div>

      {wouldExceed && (
        <div
          className="mt-3 p-2.5 rounded-lg text-xs font-medium"
          style={{ background: 'var(--color-error-light)', color: 'var(--color-error-dark)' }}
        >
          Deze bestelling overschrijdt het maandbudget met {fmt(Math.abs(afterOrder))}
        </div>
      )}
    </div>
  )
}
