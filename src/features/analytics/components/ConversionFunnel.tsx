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
  '#1A237E', // navy
  '#283593',
  '#00695C',
  '#00897B', // teal
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

export function ConversionFunnel({ data, loading }: ConversionFunnelProps) {
  const steps = data.length > 0 ? data : DEFAULT_STEPS

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="h-5 w-40 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" style={{ width: `${100 - i * 15}%` }} />
          ))}
        </div>
      </div>
    )
  }

  const maxCount = steps[0]?.count || 1

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-6">Conversie funnel</h3>
      <div className="space-y-2">
        {steps.map((step, index) => {
          const widthPercent = maxCount > 0 ? Math.max((step.count / maxCount) * 100, 12) : 12
          const prevCount = index > 0 ? steps[index - 1].count : step.count
          const conversionRate = prevCount > 0 ? (step.count / prevCount) * 100 : 0
          const dropOff = index > 0 ? 100 - conversionRate : 0
          const color = FUNNEL_COLORS[index % FUNNEL_COLORS.length]

          return (
            <div key={step.label} className="flex items-center gap-4">
              <div className="w-28 shrink-0 text-right">
                <span className="text-sm font-medium text-gray-700">{step.label}</span>
              </div>
              <div className="flex-1 relative">
                <div
                  className="h-10 rounded-md flex items-center px-3 transition-all duration-300"
                  style={{ width: `${widthPercent}%`, backgroundColor: color }}
                >
                  <span className="text-sm font-bold text-white whitespace-nowrap">
                    {formatCount(step.count)}
                  </span>
                </div>
              </div>
              <div className="w-32 shrink-0 text-sm text-gray-500">
                {index > 0 && (
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">
                      {conversionRate.toFixed(1)}%
                    </span>
                    <span className="text-red-400 text-xs">
                      -{dropOff.toFixed(1)}%
                    </span>
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
