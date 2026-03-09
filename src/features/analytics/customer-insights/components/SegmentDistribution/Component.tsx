'use client'

import { SEGMENT_CONFIG } from '../../lib/constants'
import type { SegmentDistributionProps } from './types'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(value)

export function SegmentDistribution({ segments }: SegmentDistributionProps) {
  const maxPercentage = Math.max(...segments.map((s) => s.percentage), 1)

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Klantsegmenten</h3>
      <div className="space-y-3">
        {segments.map((seg) => {
          const config = SEGMENT_CONFIG[seg.segment]
          return (
            <div key={seg.segment} className="flex items-center gap-3">
              <span className="w-6 text-center text-lg" title={config.description}>
                {config.icon}
              </span>
              <div className="w-32 shrink-0">
                <p className="text-sm font-medium text-gray-700">{config.label}</p>
                <p className="text-xs text-gray-500">{seg.count} klanten</p>
              </div>
              <div className="flex-1">
                <div className="h-6 w-full rounded-full bg-gray-100">
                  <div
                    className="flex h-6 items-center rounded-full px-2 text-xs font-medium text-white transition-all duration-500"
                    style={{
                      width: `${Math.max(2, (seg.percentage / maxPercentage) * 100)}%`,
                      backgroundColor: config.color,
                    }}
                  >
                    {seg.percentage > 5 ? `${seg.percentage}%` : ''}
                  </div>
                </div>
              </div>
              <div className="w-20 shrink-0 text-right text-xs text-gray-500">
                {seg.percentage}%
              </div>
              <div className="w-28 shrink-0 text-right">
                <p className="text-sm font-medium text-gray-700">{formatCurrency(seg.totalRevenue)}</p>
                <p className="text-xs text-gray-400">Gem. CLV: {formatCurrency(seg.avgClv)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
