'use client'

import type { CLVChartProps } from './types'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value)

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  border: '1px solid #e5e7eb',
}

export function CLVChart({ customers }: CLVChartProps) {
  if (!Array.isArray(customers) || customers.length === 0) {
    return (
      <div style={cardStyle}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Top 10 klantwaarde (CLV)</h3>
        <p style={{ padding: '2rem 0', textAlign: 'center', color: '#9ca3af' }}>Geen klantgegevens beschikbaar</p>
      </div>
    )
  }

  const maxValue = Math.max(...customers.map((c) => Math.max(c.clvHistorical, c.clvPredicted)), 1)

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Top 10 klantwaarde (CLV)</h3>
      <div>
        {customers.map((customer) => (
          <div key={customer.userId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ width: '7rem', flexShrink: 0, fontSize: '0.75rem', fontWeight: 500, color: '#4b5563', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {customer.name || customer.email || `Klant #${customer.userId}`}
            </div>
            <div style={{ flex: 1, display: 'flex', gap: '0.125rem' }}>
              <div
                style={{
                  height: '1.25rem',
                  borderRadius: '0.25rem',
                  minWidth: '2px',
                  background: '#3b82f6',
                  width: `${(customer.clvHistorical / maxValue) * 100}%`,
                  transition: 'width 0.5s',
                }}
              />
              <div
                style={{
                  height: '1.25rem',
                  borderRadius: '0.25rem',
                  minWidth: '2px',
                  background: '#93c5fd',
                  width: `${(customer.clvPredicted / maxValue) * 100 - (customer.clvHistorical / maxValue) * 100}%`,
                  transition: 'width 0.5s',
                }}
              />
            </div>
            <div style={{ width: '4.5rem', flexShrink: 0, fontSize: '0.6875rem', fontWeight: 600, color: '#374151', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              {formatCurrency(customer.clvPredicted)}
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.6875rem', color: '#6b7280' }}>
            <span style={{ display: 'inline-block', width: '0.625rem', height: '0.625rem', borderRadius: '0.125rem', background: '#3b82f6' }} /> Historisch
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.6875rem', color: '#6b7280' }}>
            <span style={{ display: 'inline-block', width: '0.625rem', height: '0.625rem', borderRadius: '0.125rem', background: '#93c5fd' }} /> Voorspeld
          </div>
        </div>
      </div>
    </div>
  )
}
