import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { PainPointsBlockProps, PainPointsBgColor, PainPointsIcon, PainPointItem } from './types'

/**
 * Pain Points Block Component
 *
 * Displays 3-4 recognizable pain points to trigger emotional recognition
 * in the target audience. Each card shows an icon in a red circle,
 * a title, and a description.
 */

/* ─── Icon SVG Paths ─────────────────────────────────────────────── */

const iconPaths: Record<PainPointsIcon, React.ReactNode> = {
  'alert-triangle': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  clock: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  frown: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
  'trending-down': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
  'phone-missed': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="23" y1="1" x2="17" y2="7" />
      <line x1="17" y1="1" x2="23" y2="7" />
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  ban: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  'help-circle': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  'thumbs-down': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
    </svg>
  ),
  repeat: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  ),
}

/* ─── Grid Classes ───────────────────────────────────────────────── */

function getGridClasses(columns: string): string {
  switch (columns) {
    case '2':
      return 'grid-cols-1 md:grid-cols-2'
    case '3':
      return 'grid-cols-1 md:grid-cols-3'
    case '4':
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    default:
      return 'grid-cols-1 md:grid-cols-2'
  }
}

/* ─── Background Classes ─────────────────────────────────────────── */

function getBgClasses(bg: PainPointsBgColor): string {
  switch (bg) {
    case 'white':
      return 'bg-white'
    case 'red-tint':
      return 'bg-coral-50'
    case 'light-grey':
    default:
      return 'bg-[#F8F9FA]'
  }
}

/* ─── Component ──────────────────────────────────────────────────── */

export const PainPointsBlockComponent: React.FC<PainPointsBlockProps> = ({
  title,
  subtitle,
  painPoints,
  bgColor = 'light-grey',
  columns = '2',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentBg = (bgColor || 'light-grey') as PainPointsBgColor
  const currentColumns = columns || '2'
  const items = (painPoints as PainPointItem[]) || []

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`pain-points-block py-12 md:py-16 lg:py-20 ${getBgClasses(currentBg)}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm md:text-base text-gray-600">{subtitle}</p>
          )}
        </div>

        {/* Pain points grid */}
        {items.length > 0 && (
          <div className={`grid ${getGridClasses(currentColumns)} gap-6 md:gap-8`}>
            {items.map((item, idx) => {
              const iconKey = (item.icon || 'alert-triangle') as PainPointsIcon
              const iconSvg = iconPaths[iconKey] || iconPaths['alert-triangle']

              return (
                <div
                  key={item.id || idx}
                  className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
                >
                  {/* Icon circle */}
                  <div className="w-12 h-12 rounded-full bg-coral-100 text-coral flex items-center justify-center mb-4">
                    {iconSvg}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default PainPointsBlockComponent
