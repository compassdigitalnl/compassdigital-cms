import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { ProcessStepsBlockProps, ProcessStepsBgColor, ProcessStepsIcon, ProcessStepItem } from './types'

/**
 * B-44 Process Steps Block Component
 *
 * "How It Works" process flow with 2-4 numbered steps.
 * The center step is visually highlighted with a gradient, scale, and shadow.
 *
 * Grid adapts based on step count:
 * - 2 steps: grid-cols-1 md:grid-cols-2
 * - 3 steps: grid-cols-1 md:grid-cols-3
 * - 4 steps: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
 */

/* ─── Icon SVG Paths ─────────────────────────────────────────────── */

const iconPaths: Record<ProcessStepsIcon, React.ReactNode> = {
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  'check-circle': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  zap: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  rocket: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  target: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  'bar-chart': (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  lightbulb: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  ),
  palette: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  smartphone: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
}

/* ─── Grid Classes ───────────────────────────────────────────────── */

function getGridClasses(count: number): string {
  switch (count) {
    case 2:
      return 'grid-cols-1 md:grid-cols-2'
    case 3:
      return 'grid-cols-1 md:grid-cols-3'
    case 4:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    default:
      return 'grid-cols-1 md:grid-cols-3'
  }
}

/* ─── Highlight Index ────────────────────────────────────────────── */

function getHighlightIndex(count: number): number {
  // Odd count: true center; Even count: index 1
  if (count % 2 === 1) {
    return Math.floor(count / 2)
  }
  return 1
}

/* ─── Background Classes ─────────────────────────────────────────── */

function getBgClasses(bg: ProcessStepsBgColor): string {
  return bg === 'white' ? 'bg-white' : 'bg-grey-light'
}

/* ─── Component ──────────────────────────────────────────────────── */

export const ProcessStepsBlockComponent: React.FC<ProcessStepsBlockProps> = ({
  title,
  subtitle,
  steps,
  backgroundColor = 'light-grey',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentBg = (backgroundColor || 'light-grey') as ProcessStepsBgColor
  const stepItems = (steps as ProcessStepItem[]) || []
  const stepCount = stepItems.length
  const highlightIdx = getHighlightIndex(stepCount)

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`process-steps-block py-12 md:py-16 lg:py-20 ${getBgClasses(currentBg)}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <h2 className="font-display text-2xl md:text-3xl text-navy mb-3">{title}</h2>
          {subtitle && (
            <p className="text-sm md:text-base text-grey-dark">{subtitle}</p>
          )}
        </div>

        {/* Steps grid */}
        {stepCount > 0 && (
          <div className={`grid ${getGridClasses(stepCount)} gap-6 md:gap-8 items-stretch`}>
            {stepItems.map((step, idx) => {
              const isHighlighted = idx === highlightIdx
              const iconKey = (step.icon || 'search') as ProcessStepsIcon
              const iconSvg = iconPaths[iconKey] || iconPaths.search

              return (
                <div
                  key={step.id || idx}
                  className={`
                    relative rounded-2xl border p-6 transition-all duration-300
                    ${
                      isHighlighted
                        ? 'bg-gradient-to-br from-navy to-navy-light text-white border-transparent scale-[1.05] shadow-lg z-10'
                        : 'bg-white border-grey-light hover:shadow-md hover:-translate-y-1'
                    }
                  `}
                >
                  {/* Step number badge */}
                  <div
                    className={`
                      absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                      ${isHighlighted ? 'bg-white/20 text-white' : 'bg-teal text-white'}
                    `}
                  >
                    {idx + 1}
                  </div>

                  {/* Icon box */}
                  <div
                    className={`
                      w-14 h-14 rounded-xl flex items-center justify-center mb-4
                      ${isHighlighted ? 'bg-white/10 text-white' : 'bg-navy text-white'}
                    `}
                  >
                    {iconSvg}
                  </div>

                  {/* Step title */}
                  <h3
                    className={`font-semibold text-lg mb-2 ${
                      isHighlighted ? 'text-white' : 'text-navy'
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Step description */}
                  <p
                    className={`text-sm leading-relaxed ${
                      isHighlighted ? 'text-white/80' : 'text-grey-dark'
                    }`}
                  >
                    {step.description}
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

export default ProcessStepsBlockComponent
