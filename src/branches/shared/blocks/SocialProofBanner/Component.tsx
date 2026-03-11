import React from 'react'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import type { SocialProofBannerBlockProps, SocialProofBannerVariant, MetricItem } from './types'

/**
 * B-41 SocialProofBanner Block Component (Server)
 *
 * Horizontal banner with big metrics numbers.
 * Dark navy, light, or gradient background. Centered layout.
 */

const variantStyles: Record<SocialProofBannerVariant, {
  bg: string
  value: string
  label: string
  trust: string
  divider: string
}> = {
  dark: {
    bg: 'bg-gradient-to-r from-navy to-navy/90',
    value: 'text-white',
    label: 'text-white/70',
    trust: 'text-white/60',
    divider: 'bg-white/20',
  },
  light: {
    bg: 'bg-white border-y border-grey',
    value: 'text-navy',
    label: 'text-grey-dark',
    trust: 'text-grey-mid',
    divider: 'bg-grey',
  },
  gradient: {
    bg: 'bg-gradient-to-r from-teal to-teal-light',
    value: 'text-white',
    label: 'text-white/80',
    trust: 'text-white/60',
    divider: 'bg-white/20',
  },
}

export const SocialProofBannerBlockComponent: React.FC<SocialProofBannerBlockProps> = ({
  metrics,
  trustText,
  variant = 'dark',
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  const validMetrics = (metrics || []) as MetricItem[]
  if (validMetrics.length === 0) return null

  const currentVariant = (variant || 'dark') as SocialProofBannerVariant
  const styles = variantStyles[currentVariant]

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      as="section"
      className={`social-proof-banner-block py-10 md:py-14 ${styles.bg}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Metrics row */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-0">
          {validMetrics.map((metric, index) => (
            <React.Fragment key={metric.id || index}>
              {/* Divider between items (desktop only) */}
              {index > 0 && (
                <div className={`mx-8 hidden h-12 w-px md:block ${styles.divider}`} />
              )}

              <div className="text-center">
                <div className={`font-display text-3xl font-bold md:text-4xl lg:text-5xl ${styles.value}`}>
                  {metric.value}
                </div>
                <div className={`mt-1 text-sm md:text-base ${styles.label}`}>
                  {metric.label}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Trust text */}
        {trustText && (
          <p className={`mt-6 text-center text-sm ${styles.trust}`}>
            {trustText}
          </p>
        )}
      </div>
    </AnimationWrapper>
  )
}

export default SocialProofBannerBlockComponent
