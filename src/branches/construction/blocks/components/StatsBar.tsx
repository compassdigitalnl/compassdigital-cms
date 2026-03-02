/**
 * StatsBarComponent - Statistics bar block
 *
 * Features:
 * - Multiple style variants (default, accent, dark, transparent)
 * - Horizontal or grid layout
 * - Optional dividers between stats
 * - Icon support
 * - Animation support (future enhancement)
 */

import React from 'react'
import { Icon } from '@/branches/shared/components/common/Icon'
import type { StatsBarBlock } from '@/payload-types'

export const StatsBarComponent: React.FC<StatsBarBlock> = ({
  style = 'default',
  stats,
  layout = 'horizontal',
  animate = false,
  dividers = true,
}) => {
  if (!stats || stats.length === 0) {
    return null
  }

  // Style classes
  const styleClasses = {
    default: 'bg-white border-t border-b border-grey',
    accent: 'bg-primary text-white',
    dark: 'bg-gray-900 text-white',
    transparent: 'bg-transparent',
  }
  const styleClass = styleClasses[style || 'default'] || styleClasses.default

  // Layout classes
  const layoutClasses = {
    horizontal: 'flex flex-wrap justify-around items-center',
    grid: 'grid grid-cols-2 md:grid-cols-4 gap-6',
  }
  const layoutClass = layoutClasses[layout || 'horizontal'] || layoutClasses.horizontal

  // Icon map
  const iconMap: Record<string, any> = {
    construction: 'HardHat',
    star: 'Star',
    users: 'Users',
    trophy: 'Trophy',
    chart: 'TrendingUp',
    check: 'CheckCircle',
    target: 'Target',
    briefcase: 'Briefcase',
  }

  return (
    <section className={`py-8 md:py-12 ${styleClass}`}>
      <div className="container mx-auto px-4">
        <div className={layoutClass}>
          {stats.map((stat, index) => {
            const iconName = stat.icon !== 'none' && stat.icon ? iconMap[stat.icon] : null
            const isDark = style === 'dark' || style === 'accent'
            const showDivider = dividers && layout === 'horizontal' && index < stats.length - 1

            return (
              <div
                key={index}
                className={`text-center px-4 md:px-6 ${
                  layout === 'horizontal' && showDivider
                    ? `border-r ${isDark ? 'border-white/20' : 'border-grey'}`
                    : ''
                }`}
              >
                {/* Icon */}
                {iconName && (
                  <div className="flex justify-center mb-2">
                    <Icon
                      name={iconName}
                      size={32}
                      className={isDark ? 'text-white/80' : 'text-primary'}
                    />
                  </div>
                )}

                {/* Value */}
                <div
                  className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1 ${
                    isDark ? 'text-white' : 'text-secondary-color'
                  }`}
                >
                  {stat.value}
                </div>

                {/* Label */}
                <div
                  className={`text-sm md:text-base font-medium ${
                    isDark ? 'text-white/70' : 'text-grey-mid'
                  }`}
                >
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
