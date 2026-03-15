import React from 'react'
import { Users, HardDrive, Zap, TrendingUp } from 'lucide-react'
import type { UsageMetersProps } from './types'

function calculatePercentage(current: number, limit: number): number {
  return Math.min(Math.round((current / limit) * 100), 100)
}

function getBarColor(pct: number): string {
  if (pct >= 90) return 'bg-amber-400'
  if (pct >= 75) return 'bg-[var(--color-primary-light)]'
  return 'bg-[var(--color-primary-glow)]0'
}

interface MeterProps {
  label: string
  icon: React.ReactNode
  current: number
  limit: number
  formatValue: (n: number) => string
}

function UsageMeter({ label, icon, current, limit, formatValue }: MeterProps) {
  const pct = calculatePercentage(current, limit)
  const isWarning = pct >= 90

  return (
    <div
      className={`bg-white border rounded-lg p-4 ${isWarning ? 'border-amber-400' : 'border-grey-light'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-sm font-bold">
          {icon}
          {label}
        </div>
        <div
          className={`text-xs font-mono font-bold ${isWarning ? 'text-amber-500' : 'text-[var(--color-primary)]'}`}
        >
          {pct}%
        </div>
      </div>
      <div className="h-2 bg-grey-light rounded-full overflow-hidden mb-1">
        <div
          className={`h-full rounded-full transition-all ${getBarColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-grey-mid">
        <span>{formatValue(current)} gebruikt</span>
        <span>{formatValue(limit)} limiet</span>
      </div>
    </div>
  )
}

export function UsageMeters({ usage }: UsageMetersProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
        Gebruik
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UsageMeter
          label="Gebruikers"
          icon={<Users className="w-4 h-4 text-[var(--color-primary)]" />}
          current={usage.users.current}
          limit={usage.users.limit}
          formatValue={(n) => String(n)}
        />
        <UsageMeter
          label="Opslag"
          icon={<HardDrive className="w-4 h-4 text-[var(--color-primary)]" />}
          current={usage.storage.current}
          limit={usage.storage.limit}
          formatValue={(n) => `${n} GB`}
        />
        <UsageMeter
          label="API Calls"
          icon={<Zap className="w-4 h-4 text-[var(--color-primary)]" />}
          current={usage.apiCalls.current}
          limit={usage.apiCalls.limit}
          formatValue={(n) => n.toLocaleString('nl-NL')}
        />
      </div>
    </div>
  )
}
