'use client'
import React from 'react'
import { Icon } from '@/branches/shared/components/common/Icon'
import type { InfoBoxBlock } from '@/payload-types'

/**
 * InfoBox Component - 100% Theme Variable Compliant
 *
 * Uses CSS variables from ThemeProvider for all colors:
 * - Success: var(--color-success), var(--color-success-light), var(--color-success-dark)
 * - Warning: var(--color-warning), var(--color-warning-light), var(--color-warning-dark)
 * - Error: var(--color-error), var(--color-error-light), var(--color-error-dark)
 * - Info: var(--color-info), var(--color-info-light), var(--color-info-dark)
 *
 * All colors are now CMS-driven via the Theme global.
 */
export const InfoBoxComponent: React.FC<InfoBoxBlock> = ({ type = 'info', icon, title, content }) => {
  // Map type to Tailwind utility classes that use theme variables
  const getVariantClasses = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-warning-light border-warning',
          iconBg: 'bg-surface', // white background
          iconColor: 'text-warning',
        }
      case 'success':
        return {
          container: 'bg-success-light border-success',
          iconBg: 'bg-surface',
          iconColor: 'text-success',
        }
      case 'danger':
        return {
          container: 'bg-error-light border-error',
          iconBg: 'bg-surface',
          iconColor: 'text-error',
        }
      default: // info
        return {
          container: 'bg-info-light border-info',
          iconBg: 'bg-surface',
          iconColor: 'text-info',
        }
    }
  }

  const classes = getVariantClasses()

  return (
    <div
      className={`
        ${classes.container}
        border
        rounded-xl
        p-5 sm:p-6
        my-6
        flex gap-4
      `}
    >
      {/* Icon */}
      <div
        className={`
          ${classes.iconBg}
          w-9 h-9
          rounded-lg
          flex items-center justify-center
          flex-shrink-0
        `}
      >
        <Icon
          name={icon || 'Lightbulb'}
          size={18}
          className={classes.iconColor}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-bold text-sm text-primary-text mb-1">
            {title}
          </div>
        )}
        <div className="text-sm text-secondary-text leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  )
}
