'use client'

import type { ChurnRiskTableProps } from './types'

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr))
}

const churnLabelConfig: Record<string, { text: string; classes: string }> = {
  low: { text: 'Laag', classes: 'bg-green-100 text-green-800' },
  medium: { text: 'Gemiddeld', classes: 'bg-yellow-100 text-yellow-800' },
  high: { text: 'Hoog', classes: 'bg-orange-100 text-orange-800' },
  critical: { text: 'Kritiek', classes: 'bg-red-100 text-red-800' },
}

export function ChurnRiskTable({ customers }: ChurnRiskTableProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Top 20 churn risico</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
              <th className="px-3 py-2">Naam</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Laatste bestelling</th>
              <th className="px-3 py-2 text-right">Dagen inactief</th>
              <th className="px-3 py-2 text-right">Risico score</th>
              <th className="px-3 py-2 text-center">Label</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-gray-400">
                  Geen klantgegevens beschikbaar
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const labelConfig = churnLabelConfig[customer.churnLabel] || churnLabelConfig.low
                return (
                  <tr key={customer.userId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-900">
                      {customer.name || `Klant #${customer.userId}`}
                    </td>
                    <td className="px-3 py-2 text-gray-600">{customer.email || '-'}</td>
                    <td className="px-3 py-2 text-gray-600">{formatDate(customer.lastOrderAt)}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-700">
                      {customer.daysSinceLastOrder}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-gray-700">
                      {(customer.churnRisk * 100).toFixed(0)}%
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${labelConfig.classes}`}>
                        {labelConfig.text}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
