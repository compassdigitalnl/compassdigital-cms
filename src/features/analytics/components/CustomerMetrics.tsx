'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface CustomerDataPoint {
  period: string
  newCustomers: number
  returningCustomers: number
}

interface CustomerMetricsProps {
  data: CustomerDataPoint[]
  loading?: boolean
}

const TEAL = '#00897B'
const NAVY = '#1A237E'

function formatCount(value: number): string {
  return new Intl.NumberFormat('nl-NL').format(value)
}

interface TooltipPayloadItem {
  value: number
  dataKey: string
  name: string
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{formatCount(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function CustomerMetrics({ data, loading }: CustomerMetricsProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="h-5 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Klanten: nieuw vs terugkerend</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatCount(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value: string) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
            <Bar
              dataKey="newCustomers"
              name="Nieuw"
              stackId="customers"
              fill={TEAL}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="returningCustomers"
              name="Terugkerend"
              stackId="customers"
              fill={NAVY}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
