import React from 'react'
import type { AccountStatCardProps } from './types'

export function AccountStatCard({
  icon: Icon,
  value,
  label,
  subtitle,
  iconBg = 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
  iconColor = 'var(--color-primary)',
}: AccountStatCardProps) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between lg:mb-3">
        <div
          className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg lg:rounded-xl flex items-center justify-center order-2 lg:order-1"
          style={{ background: iconBg }}
        >
          <Icon className="w-4 h-4 lg:w-5 lg:h-5" style={{ color: iconColor }} />
        </div>
        <div className="text-xl lg:text-2xl font-extrabold text-gray-900 order-1 lg:order-2">
          {value}
        </div>
      </div>
      <div className="text-xs lg:text-sm font-semibold text-gray-900 mt-2 lg:mt-0">{label}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  )
}
