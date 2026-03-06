import React from 'react'
import type { StatsBlock } from '@/payload-types'

/**
 * B23 - Stats Block Component
 *
 * Statistics showcase block for displaying key metrics and achievements.
 * Supports 2-4 columns with large numbers, labels, optional icons, and descriptions.
 *
 * FEATURES:
 * - 2/3/4 column grid layouts
 * - 4 background variants (white, grey, teal gradient, navy gradient)
 * - Optional emoji or icon support
 * - Responsive design
 *
 * @see docs/refactoring/blocks/sprint-9/shared/b23-stats.html
 */

export const StatsBlockComponent: React.FC<StatsBlock> = ({
  title,
  description,
  columns = '3',
  stats,
  backgroundColor = 'white',
}) => {
  // Map columns to grid classes
  const gridClass = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns]

  // Map background to classes (Sprint 10 uses 'tealGradient' and 'navyGradient')
  const bgClass = {
    white: 'bg-white',
    grey: 'bg-grey-light',
    tealGradient: 'bg-gradient-to-br from-teal to-teal-dark relative overflow-hidden',
    navyGradient: 'bg-gradient-to-br from-navy to-navy-light relative overflow-hidden',
  }[backgroundColor || 'white']

  const isDark = backgroundColor === 'tealGradient' || backgroundColor === 'navyGradient'

  return (
    <section className={`py-12 md:py-16 ${bgClass}`}>
      {/* Decorative glow for gradient backgrounds */}
      {isDark && (
        <div
          className="absolute -top-1/2 -right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
          style={{
            background: backgroundColor === 'tealGradient'
              ? 'radial-gradient(circle, rgba(255, 255, 255, 0.08), transparent 60%)'
              : 'radial-gradient(circle, var(--color-primary-glow), transparent 60%)',
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-10 md:mb-14">
            {title && (
              <h2 className={`font-display text-3xl md:text-4xl mb-3 ${isDark ? 'text-white' : 'text-navy'}`}>
                {title}
              </h2>
            )}
            {description && (
              <p className={`text-sm md:text-base max-w-2xl mx-auto ${isDark ? 'text-white/70' : 'text-grey-dark'}`}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        {stats && stats.length > 0 && (
          <div className={`grid gap-8 md:gap-10 ${gridClass}`}>
            {stats.map((stat, index) => (
              <div key={stat.id || index} className="text-center">
                {/* Icon */}
                {stat.icon && (
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center text-3xl ${
                      isDark ? 'bg-white/15' : 'bg-teal-glow'
                    }`}
                  >
                    {/* Render emoji (1-2 chars) or text icon */}
                    <span>{stat.icon}</span>
                  </div>
                )}

                {/* Value */}
                <span
                  className={`font-display text-4xl md:text-5xl block mb-2 leading-none ${
                    isDark ? 'text-white' : 'text-navy'
                  }`}
                >
                  {stat.value}
                </span>

                {/* Label */}
                <span
                  className={`text-sm font-semibold block ${
                    isDark ? 'text-white/80' : 'text-grey-dark'
                  }`}
                >
                  {stat.label}
                </span>

                {/* Description */}
                {stat.description && (
                  <span
                    className={`text-xs mt-1.5 block max-w-[220px] mx-auto leading-relaxed ${
                      isDark ? 'text-white/60' : 'text-grey-mid'
                    }`}
                  >
                    {stat.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default StatsBlockComponent
