'use client'

import React from 'react'
import { Users } from 'lucide-react'
import { RoleBadge } from '../../team/RoleBadge'
import type { CompanyRole } from '../../team/types'
import type { BudgetPerUserTableProps } from './types'

const fmt = (n: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)

export function BudgetPerUserTable({ users }: BudgetPerUserTableProps) {
  if (users.length === 0) return null

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 p-4 lg:p-5 border-b border-gray-100">
        <Users className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-bold text-gray-900">Budget per medewerker</h3>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-400 border-b border-gray-50">
              <th className="text-left px-5 py-3 font-medium">Medewerker</th>
              <th className="text-left px-5 py-3 font-medium">Rol</th>
              <th className="text-right px-5 py-3 font-medium">Limiet/maand</th>
              <th className="text-right px-5 py-3 font-medium">Besteed</th>
              <th className="text-right px-5 py-3 font-medium">Resterend</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const remaining = u.monthlyBudgetLimit ? u.monthlyBudgetLimit - u.monthlyUsed : undefined
              return (
                <tr key={u.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <div className="text-sm font-semibold text-gray-900">{u.name}</div>
                    <div className="text-xs text-gray-400">{u.email}</div>
                  </td>
                  <td className="px-5 py-3">
                    <RoleBadge role={u.companyRole as CompanyRole} />
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-600 text-right">
                    {u.monthlyBudgetLimit ? fmt(u.monthlyBudgetLimit) : '—'}
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right">
                    {fmt(u.monthlyUsed)}
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-right" style={{
                    color: remaining !== undefined ? (remaining < 0 ? 'var(--color-error)' : 'var(--color-success)') : 'var(--color-grey-mid)',
                  }}>
                    {remaining !== undefined ? fmt(remaining) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-gray-50">
        {users.map((u) => (
          <div key={u.id} className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-gray-900">{u.name}</span>
              <RoleBadge role={u.companyRole as CompanyRole} />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Besteed: {fmt(u.monthlyUsed)}</span>
              <span>Limiet: {u.monthlyBudgetLimit ? fmt(u.monthlyBudgetLimit) : '—'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
