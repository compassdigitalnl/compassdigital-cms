'use client'

import React from 'react'
import { getIcon } from '@/utilities/getIcon'
import { TrendingUp } from 'lucide-react'
import type { MetricsGridProps } from './types'

/**
 * MetricsGrid — Result metrics display with icons and values.
 *
 * Shows project outcomes like conversion rates, speed scores, SEO rankings.
 * Supports gradient variant for hero-like emphasis.
 * All colors use CSS theme variables.
 */

const colClasses: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  metrics,
  columns = 4,
  variant = 'default',
  className = '',
}) => {
  if (!metrics || metrics.length === 0) return null

  const isGradient = variant === 'gradient'

  return (
    <div
      className={`grid ${colClasses[columns] || colClasses[4]} gap-4 ${className}`}
    >
      {metrics.map((metric, i) => {
        const IconComponent = metric.icon ? getIcon(metric.icon, TrendingUp) : TrendingUp

        return (
          <div
            key={i}
            className={`flex flex-col items-center rounded-xl p-5 text-center transition-all duration-200 hover:-translate-y-0.5 ${
              isGradient
                ? 'text-white'
                : 'border hover:shadow-md'
            }`}
            style={
              isGradient
                ? { background: 'var(--gradient-secondary)', borderRadius: 'var(--r-md)' }
                : {
                    borderColor: 'var(--grey)',
                    backgroundColor: 'var(--white)',
                    borderRadius: 'var(--r-md)',
                    boxShadow: 'var(--sh-sm)',
                  }
            }
          >
            {IconComponent && (
              <div
                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                style={
                  isGradient
                    ? { backgroundColor: 'rgba(255,255,255,0.1)' }
                    : { backgroundColor: 'var(--teal)', color: 'white', borderRadius: 'var(--r-sm)' }
                }
              >
                <IconComponent className={`h-5 w-5 ${isGradient ? 'text-white' : ''}`} />
              </div>
            )}
            <span
              className="block font-display text-2xl font-bold md:text-3xl"
              style={{ color: isGradient ? 'white' : 'var(--navy)' }}
            >
              {metric.value}
              {metric.suffix && (
                <span style={{ color: isGradient ? 'var(--teal-light)' : 'var(--teal)' }}>
                  {metric.suffix}
                </span>
              )}
            </span>
            <span
              className="mt-1 block text-xs font-semibold uppercase tracking-wider"
              style={{ color: isGradient ? 'rgba(255,255,255,0.7)' : 'var(--grey-dark)' }}
            >
              {metric.label}
            </span>
            {metric.description && (
              <span
                className="mt-1 block text-xs"
                style={{ color: isGradient ? 'rgba(255,255,255,0.5)' : 'var(--grey-mid)' }}
              >
                {metric.description}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default MetricsGrid
