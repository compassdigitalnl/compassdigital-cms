'use client'

interface PeriodOption {
  value: string
  label: string
}

const PERIODS: PeriodOption[] = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: '12m', label: '12m' },
]

interface PeriodSelectorProps {
  value: string
  onChange: (period: string) => void
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem', background: '#e5e7eb', borderRadius: '0.5rem', padding: '0.2rem' }}>
      {PERIODS.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: '0.4rem',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            background: value === period.value ? '#fff' : 'transparent',
            color: value === period.value ? '#1a1a2e' : '#6b7280',
            boxShadow: value === period.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}
