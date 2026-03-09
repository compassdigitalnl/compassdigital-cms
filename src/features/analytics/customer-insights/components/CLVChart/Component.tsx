'use client'

import type { CLVChartProps } from './types'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value)

export function CLVChart({ customers }: CLVChartProps) {
  const maxValue = Math.max(...customers.map((c) => Math.max(c.clvHistorical, c.clvPredicted)), 1)

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Top 10 klantwaarde (CLV)</h3>
      <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-blue-500" /> Historisch
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-purple-400" /> Voorspeld
        </span>
      </div>
      <div className="space-y-3">
        {customers.length === 0 ? (
          <p className="py-8 text-center text-gray-400">Geen klantgegevens beschikbaar</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.userId} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {customer.name || customer.email || `Klant #${customer.userId}`}
                </span>
                <span className="text-xs text-gray-500">
                  {formatCurrency(customer.clvPredicted)}
                </span>
              </div>
              {/* Historical bar */}
              <div className="h-4 w-full rounded bg-gray-100">
                <div
                  className="h-4 rounded bg-blue-500 transition-all duration-500"
                  style={{ width: `${(customer.clvHistorical / maxValue) * 100}%` }}
                />
              </div>
              {/* Predicted bar */}
              <div className="h-4 w-full rounded bg-gray-100">
                <div
                  className="h-4 rounded bg-purple-400 transition-all duration-500"
                  style={{ width: `${(customer.clvPredicted / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
