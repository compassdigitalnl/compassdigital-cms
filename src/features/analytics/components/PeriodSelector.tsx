'use client'

import { cn } from '@/lib/utils'

interface PeriodOption {
  value: string
  label: string
}

const PERIODS: PeriodOption[] = [
  { value: '7d', label: '7 dagen' },
  { value: '30d', label: '30 dagen' },
  { value: '90d', label: '90 dagen' },
  { value: '12m', label: '12 maanden' },
]

interface PeriodSelectorProps {
  value: string
  onChange: (period: string) => void
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
      {PERIODS.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-colors',
            value === period.value
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}
