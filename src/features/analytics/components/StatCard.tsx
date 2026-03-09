'use client'

import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  change?: number
  prefix?: string
  suffix?: string
  loading?: boolean
}

export function StatCard({ title, value, change, prefix, suffix, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    )
  }

  const isPositive = change !== undefined && change >= 0
  const isNegative = change !== undefined && change < 0

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">
        {prefix && <span>{prefix}</span>}
        {value}
        {suffix && <span className="text-base font-normal text-gray-500 ml-1">{suffix}</span>}
      </p>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          <span
            className={cn(
              'inline-flex items-center text-sm font-medium',
              isPositive && 'text-green-600',
              isNegative && 'text-red-600'
            )}
          >
            {isPositive ? (
              <svg className="h-4 w-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="h-4 w-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-sm text-gray-400">vs vorige periode</span>
        </div>
      )}
    </div>
  )
}
