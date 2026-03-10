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

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  border: '1px solid #e5e7eb',
}

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
    <div style={{ borderRadius: '0.5rem', border: '1px solid #e5e7eb', background: '#fff', padding: '0.75rem 1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.5rem' }}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
          <span style={{ display: 'inline-block', width: '0.625rem', height: '0.625rem', borderRadius: '0.125rem', backgroundColor: entry.color }} />
          <span style={{ color: '#6b7280' }}>{entry.name}:</span>
          <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{formatCount(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function CustomerMetrics({ data, loading }: CustomerMetricsProps) {
  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ height: '1.25rem', width: '10rem', background: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '1rem' }} />
        <div style={{ height: '220px', background: '#f3f4f6', borderRadius: '0.5rem' }} />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div style={cardStyle}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Klanten per periode</h3>
        <div style={{ display: 'flex', height: '220px', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          Geen klantdata beschikbaar voor deze periode
        </div>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Klanten per periode</h3>
      <div style={{ height: '260px' }}>
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
                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{value}</span>
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
