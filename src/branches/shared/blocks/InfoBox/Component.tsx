import React from 'react'
import Link from 'next/link'
import { AnimationWrapper } from '../_shared/AnimationWrapper'
import { DismissButton } from './DismissButton'
import type { InfoBoxBlockProps, InfoBoxVariant } from './types'

/**
 * B-33 InfoBox Block Component (Server)
 *
 * Colored notification box. Info=blue, success=green, warning=amber, error=red.
 * Left border accent with icon per variant.
 * Dismissible version uses client component DismissButton.
 */

const variantStyles: Record<InfoBoxVariant, { container: string; border: string; icon: string; iconPath: string }> = {
  info: {
    container: 'bg-blue-50 text-blue-900',
    border: 'border-l-4 border-blue-500',
    icon: 'text-blue-500',
    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  success: {
    container: 'bg-green-50 text-green-900',
    border: 'border-l-4 border-green-500',
    icon: 'text-green-500',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  warning: {
    container: 'bg-amber-50 text-amber-900',
    border: 'border-l-4 border-amber-500',
    icon: 'text-amber-500',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  error: {
    container: 'bg-red-50 text-red-900',
    border: 'border-l-4 border-red-500',
    icon: 'text-red-500',
    iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
}

export const InfoBoxBlockComponent: React.FC<InfoBoxBlockProps> = ({
  title,
  content,
  link,
  linkLabel,
  variant = 'info',
  dismissible = false,
  enableAnimation,
  animationType,
  animationDuration,
  animationDelay,
}) => {
  if (!content) return null

  const currentVariant = (variant || 'info') as InfoBoxVariant
  const styles = variantStyles[currentVariant]

  const boxContent = (
    <div className={`relative rounded-lg ${styles.container} ${styles.border} p-4 md:p-5`}>
      <div className="flex gap-3">
        {/* Icon */}
        <div className="shrink-0 pt-0.5">
          <svg className={`h-5 w-5 ${styles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={styles.iconPath} />
          </svg>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {title && (
            <h4 className="mb-1 text-sm font-bold">{title}</h4>
          )}
          <p className="text-sm leading-relaxed">{content}</p>
          {link && linkLabel && (
            <Link
              href={link}
              className="mt-2 inline-block text-sm font-semibold underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              {linkLabel}
            </Link>
          )}
        </div>

        {/* Dismiss button */}
        {dismissible && <DismissButton variant={currentVariant} />}
      </div>
    </div>
  )

  return (
    <AnimationWrapper
      enableAnimation={enableAnimation}
      animationType={animationType}
      animationDuration={animationDuration}
      animationDelay={animationDelay}
      className="info-box-block mx-auto max-w-4xl px-6 py-4"
    >
      {boxContent}
    </AnimationWrapper>
  )
}

export default InfoBoxBlockComponent
