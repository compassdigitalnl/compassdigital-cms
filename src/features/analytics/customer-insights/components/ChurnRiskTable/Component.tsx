'use client'

import type { ChurnRiskTableProps } from './types'

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr))
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  paddingBottom: '0.5rem',
  border: '1px solid #e5e7eb',
}

const thStyle: React.CSSProperties = {
  padding: '0.625rem 0.75rem',
  textAlign: 'left',
  fontSize: '0.6875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: '#9ca3af',
  fontWeight: 600,
  borderBottom: '1px solid #e5e7eb',
}

const tdStyle: React.CSSProperties = {
  padding: '0.625rem 0.75rem',
  borderBottom: '1px solid #f3f4f6',
}

const badgeColors: Record<string, { bg: string; color: string; text: string }> = {
  low: { bg: '#d1fae5', color: '#065f46', text: 'Laag' },
  medium: { bg: '#fef3c7', color: '#92400e', text: 'Gemiddeld' },
  high: { bg: '#fed7aa', color: '#9a3412', text: 'Hoog' },
  critical: { bg: '#fecaca', color: '#991b1b', text: 'Kritiek' },
}

export function ChurnRiskTable({ customers }: ChurnRiskTableProps) {
  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Top 20 churn risico</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
          <thead>
            <tr>
              <th style={thStyle}>Naam</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Laatste bestelling</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Dagen inactief</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Risico score</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Label</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ ...tdStyle, padding: '2rem 0.75rem', textAlign: 'center', color: '#9ca3af' }}>
                  Geen klantgegevens beschikbaar
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const badge = badgeColors[customer.churnLabel] || badgeColors.low
                return (
                  <tr key={customer.userId}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: '#1a1a2e' }}>
                      {customer.name || `Klant #${customer.userId}`}
                    </td>
                    <td style={{ ...tdStyle, color: '#6b7280', fontSize: '0.75rem' }}>
                      {customer.email || '-'}
                    </td>
                    <td style={{ ...tdStyle, color: '#6b7280' }}>
                      {formatDate(customer.lastOrderAt)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace', fontSize: '0.75rem', color: '#374151' }}>
                      {customer.daysSinceLastOrder}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace', fontSize: '0.75rem', color: '#374151' }}>
                      {(customer.churnRisk * 100).toFixed(0)}%
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        background: badge.bg,
                        color: badge.color,
                      }}>
                        {badge.text}
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
