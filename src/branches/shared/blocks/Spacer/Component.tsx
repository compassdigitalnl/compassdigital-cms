import React from 'react'
import type { SpacerBlockProps, SpacerSize, DividerColor } from './types'

/**
 * B-37 Spacer Block Component (Server)
 *
 * Simple spacing utility. sm=32px, md=64px, lg=96px, xl=128px.
 * Optional horizontal divider line with configurable color.
 */

const sizeClasses: Record<SpacerSize, string> = {
  sm: 'h-6 md:h-8',        // 24px mobile → 32px desktop
  md: 'h-10 md:h-16',      // 40px mobile → 64px desktop
  lg: 'h-16 md:h-24',      // 64px mobile → 96px desktop
  xl: 'h-20 md:h-[128px]', // 80px mobile → 128px desktop
}

const dividerColors: Record<DividerColor, string> = {
  grey: 'bg-grey',
  teal: 'bg-teal',
  navy: 'bg-navy',
}

export const SpacerBlockComponent: React.FC<SpacerBlockProps> = ({
  size = 'md',
  showDivider = false,
  dividerColor = 'grey',
}) => {
  const currentSize = (size || 'md') as SpacerSize
  const currentDividerColor = (dividerColor || 'grey') as DividerColor

  return (
    <div
      className={`relative ${sizeClasses[currentSize]}`}
      aria-hidden="true"
      role="presentation"
    >
      {showDivider && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6">
          <div className="mx-auto max-w-6xl">
            <div className={`h-px ${dividerColors[currentDividerColor]}`} />
          </div>
        </div>
      )}
    </div>
  )
}

export default SpacerBlockComponent
