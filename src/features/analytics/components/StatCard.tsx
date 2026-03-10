'use client'

interface StatCardProps {
  title: string
  value: string
  change?: number
  prefix?: string
  suffix?: string
  loading?: boolean
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '0.75rem',
  padding: '1.25rem',
  border: '1px solid #e5e7eb',
}

export function StatCard({ title, value, change, prefix, suffix, loading }: StatCardProps) {
  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ height: '1rem', width: '6rem', background: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '0.75rem' }} />
        <div style={{ height: '2rem', width: '8rem', background: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '0.5rem' }} />
        <div style={{ height: '1rem', width: '5rem', background: '#e5e7eb', borderRadius: '0.25rem' }} />
      </div>
    )
  }

  const isPositive = change !== undefined && change >= 0
  const isNegative = change !== undefined && change < 0

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>{title}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a1a2e' }}>
        {prefix && <span>{prefix}</span>}
        {value}
        {suffix && <span style={{ fontSize: '1rem', fontWeight: 400, color: '#6b7280', marginLeft: '0.25rem' }}>{suffix}</span>}
      </div>
      {change !== undefined && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.5rem', color: isPositive ? '#059669' : '#dc2626' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            {isPositive ? (
              <path d="M5 10l7-7 7 7" />
            ) : (
              <path d="M19 14l-7 7-7-7" />
            )}
          </svg>
          {Math.abs(change).toFixed(1)}%
          <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 400 }}>vs vorige periode</span>
        </div>
      )}
    </div>
  )
}
