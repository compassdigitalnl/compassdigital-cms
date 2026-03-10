'use client'

interface FunnelStep {
  label: string
  count: number
}

interface ConversionFunnelProps {
  data: FunnelStep[]
  loading?: boolean
}

const FUNNEL_COLORS = [
  '#1A237E',
  '#283593',
  '#00695C',
  '#00897B',
  '#26A69A',
]

const DEFAULT_STEPS: FunnelStep[] = [
  { label: 'Bezoekers', count: 0 },
  { label: 'Winkelwagen', count: 0 },
  { label: 'Checkout', count: 0 },
  { label: 'Bestelling', count: 0 },
  { label: 'Betaald', count: 0 },
]

function formatCount(value: number): string {
  return new Intl.NumberFormat('nl-NL').format(value)
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '0.75rem',
  padding: '1.5rem',
  border: '1px solid #e5e7eb',
}

export function ConversionFunnel({ data, loading }: ConversionFunnelProps) {
  const steps = data.length > 0 ? data : DEFAULT_STEPS

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ height: '1.25rem', width: '10rem', background: '#e5e7eb', borderRadius: '0.25rem', marginBottom: '1.5rem' }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ height: '2.5rem', background: '#f3f4f6', borderRadius: '0.375rem', marginBottom: '0.5rem', width: `${100 - i * 15}%` }} />
        ))}
      </div>
    )
  }

  const maxCount = steps[0]?.count || 1

  return (
    <div style={cardStyle}>
      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '1.5rem' }}>Conversie funnel</h3>
      <div>
        {steps.map((step, index) => {
          const widthPercent = maxCount > 0 ? Math.max((step.count / maxCount) * 100, 12) : 12
          const prevCount = index > 0 ? steps[index - 1].count : step.count
          const conversionRate = prevCount > 0 ? (step.count / prevCount) * 100 : 0
          const dropOff = index > 0 ? 100 - conversionRate : 0
          const color = FUNNEL_COLORS[index % FUNNEL_COLORS.length]

          return (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '7rem', flexShrink: 0, textAlign: 'right', fontSize: '0.8125rem', fontWeight: 500, color: '#4b5563' }}>
                {step.label}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    height: '2.5rem',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '0.75rem',
                    width: `${widthPercent}%`,
                    backgroundColor: color,
                    transition: 'width 0.4s',
                  }}
                >
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>
                    {formatCount(step.count)}
                  </span>
                </div>
              </div>
              <div style={{ width: '8rem', flexShrink: 0, fontSize: '0.75rem' }}>
                {index > 0 && (
                  <span>
                    <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{conversionRate.toFixed(1)}%</span>
                    {' '}
                    <span style={{ color: '#ef4444', fontSize: '0.6875rem' }}>-{dropOff.toFixed(1)}%</span>
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
