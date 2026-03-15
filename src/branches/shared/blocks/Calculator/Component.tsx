import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { CalculatorClient } from './CalculatorClient'
import type { CalculatorBlockProps, CalculatorBgColor, SliderItem } from './types'

/**
 * Calculator Block — Server Component Wrapper
 *
 * Interactive "Calculate your savings" calculator.
 * Renders heading + subtitle, then delegates interactive sliders
 * and results to the CalculatorClient client component.
 */

/* ─── Background Classes ─────────────────────────────────────────── */

function getBgClasses(bg: CalculatorBgColor): string {
  switch (bg) {
    case 'white':
      return 'bg-white'
    case 'light-grey':
      return 'bg-grey-light'
    case 'gradient':
      return 'bg-gradient-to-br from-teal-50 to-teal-50'
    default:
      return 'bg-gradient-to-br from-teal-50 to-teal-50'
  }
}

/* ─── Component ──────────────────────────────────────────────────── */

export const CalculatorBlockComponent: React.FC<CalculatorBlockProps> = ({
  title,
  subtitle,
  ourMonthlyPrice,
  sliders,
  ctaLabel,
  ctaLink,
  bgColor = 'gradient',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const currentBg = (bgColor || 'gradient') as CalculatorBgColor
  const sliderItems = (sliders as SliderItem[]) || []

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`calculator-block py-16 md:py-24 ${getBgClasses(currentBg)}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          {title && (
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-navy mb-3">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm md:text-base text-grey-dark max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Interactive calculator */}
        {sliderItems.length > 0 && (
          <CalculatorClient
            sliders={sliderItems}
            ourMonthlyPrice={ourMonthlyPrice ?? 99}
            ctaLabel={ctaLabel}
            ctaLink={ctaLink}
          />
        )}
      </div>
    </AnimationWrapper>
  )
}

export default CalculatorBlockComponent
