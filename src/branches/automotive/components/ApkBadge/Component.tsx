import React from 'react'
import type { ApkBadgeProps } from './types'

type ApkStatus = 'valid' | 'expiring' | 'expired'

const STATUS_CONFIG: Record<ApkStatus, { label: string; bgClass: string; textClass: string; icon: string }> = {
  valid: {
    label: 'APK geldig',
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-700',
    icon: '\u2713',
  },
  expiring: {
    label: 'APK verloopt binnenkort',
    bgClass: 'bg-amber-50 border-amber-200',
    textClass: 'text-amber-700',
    icon: '!',
  },
  expired: {
    label: 'APK verlopen',
    bgClass: 'bg-red-50 border-red-200',
    textClass: 'text-red-700',
    icon: '\u2717',
  },
}

function getApkStatus(apkExpiry: string): ApkStatus {
  const expiry = new Date(apkExpiry)
  const now = new Date()
  const twoMonthsFromNow = new Date()
  twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2)

  if (expiry < now) return 'expired'
  if (expiry < twoMonthsFromNow) return 'expiring'
  return 'valid'
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export const ApkBadge: React.FC<ApkBadgeProps> = ({ apkExpiry, className = '' }) => {
  if (!apkExpiry) return null

  const status = getApkStatus(apkExpiry)
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.bgClass} ${config.textClass} ${className}`}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-current/10 text-[10px] font-bold leading-none">
        {config.icon}
      </span>
      <span>{config.label}</span>
      <span className="font-normal opacity-80">&middot; {formatDate(apkExpiry)}</span>
    </span>
  )
}

export default ApkBadge
