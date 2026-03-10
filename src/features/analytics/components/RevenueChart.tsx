'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface RevenueDataPoint {
  date: string
  revenue: number
}

interface RevenueChartProps {
  data: RevenueDataPoint[]
  loading?: boolean
}

const TEAL = '#00897B'

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  border: '1px solid #e5e7eb',
  marginBottom: '1.5rem',
}

function formatEUR(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

interface TooltipPayloadItem {
  value: number
  dataKey: string
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
      <p style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
        {label ? new Intl.DateTimeFormat('nl-NL', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        }).format(new Date(label)) : ''}
      </p>
      <p style={{ marginTop: '0.25rem', fontSize: '1.125rem', fontWeight: 600, color: '#1a1a2e' }}>
        {formatEUR(payload[0].value)}
      </p>
    </div>
  )
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ height: '1.25rem', width: '8rem', background: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '1rem' }} />
        <div style={{ height: '220px', background: '#f3f4f6', borderRadius: '0.5rem' }} />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div style={cardStyle}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Omzet per dag</h3>
        <div style={{ display: 'flex', height: '220px', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          Geen omzetdata beschikbaar voor deze periode
        </div>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Omzet per dag</h3>
      <div style={{ height: '260px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={TEAL} stopOpacity={0.2} />
                <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tickFormatter={(v: number) => formatEUR(v)}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={TEAL}
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
