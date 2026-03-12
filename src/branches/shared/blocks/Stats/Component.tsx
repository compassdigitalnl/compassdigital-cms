import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { getIcon } from '@/utilities/getIcon'
import type { StatsBlockProps, StatsItem } from './types'

/**
 * B-09 - Stats Block Component
 *
 * Statistics display with Lucide icons, values, labels and descriptions.
 * Supports gradient backgrounds (navy, teal) with white text.
 */

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  grey: 'bg-grey-light',
  tealGradient: 'bg-gradient-to-br from-teal to-teal-dark',
  navyGradient: 'bg-gradient-to-br from-navy to-navy-light',
  // Legacy values
  navy: 'bg-gradient-to-br from-navy to-navy-light',
  teal: 'bg-gradient-to-br from-teal to-teal-dark',
}

const isDarkBg = (bg: string) =>
  bg === 'tealGradient' || bg === 'navyGradient' || bg === 'navy' || bg === 'teal'

export const StatsBlockComponent: React.FC<StatsBlockProps> = ({
  title,
  description,
  stats,
  items,
  columns = '4',
  variant,
  backgroundColor = 'white',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  // Support both 'stats' (config) and 'items' (legacy) field names
  const statItems = stats || items
  if (!statItems || statItems.length === 0) return null

  const dark = isDarkBg(backgroundColor || 'white')
  const bgClass = bgClasses[backgroundColor || 'white'] || bgClasses.white

  // Map columns to grid class
  const colsMap: Record<string, string> = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-3',
    '4': 'md:grid-cols-4',
  }
  const gridCols = colsMap[columns || '4'] || colsMap['4']

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
    >
      <section className={`py-16 md:py-24 ${bgClass}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          {(title || description) && (
            <div className="mb-12 text-center">
              {title && (
                <h2
                  className={`font-display text-2xl md:text-3xl lg:text-4xl font-bold ${
                    dark ? 'text-white' : 'text-navy'
                  }`}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  className={`mt-3 text-base md:text-lg max-w-2xl mx-auto ${
                    dark ? 'text-white/70' : 'text-grey-dark'
                  }`}
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Stats grid */}
          <div className={`grid grid-cols-2 gap-6 md:gap-8 ${gridCols}`}>
            {statItems.map((item, index) => (
              <StatCard key={item.id || index} item={item} dark={dark} />
            ))}
          </div>
        </div>
      </section>
    </AnimationWrapper>
  )
}

/** Individual stat card with icon */
const StatCard: React.FC<{ item: StatsItem; dark: boolean }> = ({ item, dark }) => {
  const IconComponent = item.icon ? getIcon(item.icon) : null

  return (
    <div className="text-center">
      {/* Icon */}
      {IconComponent && (
        <div className="flex justify-center mb-4">
          <div
            className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${
              dark
                ? 'bg-white/10 text-white'
                : 'bg-teal/10 text-teal'
            }`}
          >
            <IconComponent className="h-7 w-7" />
          </div>
        </div>
      )}

      {/* Value */}
      <span
        className={`block font-display text-3xl md:text-4xl lg:text-5xl font-bold ${
          dark ? 'text-white' : 'text-navy'
        }`}
      >
        {item.value}
        {item.suffix && (
          <span className={dark ? 'text-teal-light' : 'text-teal'}>{item.suffix}</span>
        )}
      </span>

      {/* Label */}
      <span
        className={`mt-2 block text-sm md:text-base font-semibold uppercase tracking-wider ${
          dark ? 'text-white/80' : 'text-grey-dark'
        }`}
      >
        {item.label}
      </span>

      {/* Description */}
      {item.description && (
        <span
          className={`mt-1 block text-xs md:text-sm ${
            dark ? 'text-white/60' : 'text-grey-mid'
          }`}
        >
          {item.description}
        </span>
      )}
    </div>
  )
}

export default StatsBlockComponent
