import React from 'react'
import { KeyRound, Monitor, AlertTriangle, Download } from 'lucide-react'
import type { LicenseStatsBarProps } from './types'

export function LicenseStatsBar({
  activeLicenses,
  totalDevices,
  actionRequired,
  totalDownloads,
}: LicenseStatsBarProps) {
  const stats = [
    {
      value: activeLicenses,
      label: 'Actieve licenties',
      icon: KeyRound,
      color: 'var(--color-primary)',
    },
    {
      value: totalDevices,
      label: 'Apparaten',
      icon: Monitor,
      color: '#2196F3',
    },
    {
      value: actionRequired,
      label: 'Actie nodig',
      icon: AlertTriangle,
      color: 'var(--color-warning)',
    },
    {
      value: totalDownloads,
      label: 'Downloads',
      icon: Download,
      color: 'var(--color-success)',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-4 lg:mb-5">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-xl lg:rounded-2xl p-4 text-center"
          >
            <div
              className="text-xl lg:text-2xl font-extrabold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
              <Icon className="w-3 h-3" />
              {stat.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
