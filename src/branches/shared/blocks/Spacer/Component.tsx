import React from 'react'

/**
 * B26 - Spacer Block Component
 *
 * Creates vertical whitespace between content sections with optional divider line.
 *
 * FEATURES:
 * - 4 sizes: sm (24px), md (48px), lg (80px → 64px mobile), xl (120px → 80px mobile)
 * - Optional horizontal divider line centered in spacer
 * - Server component (no interactivity)
 * - Invisible to screen readers (aria-hidden)
 *
 * @see src/branches/shared/blocks/Spacer/config.ts
 * @see docs/refactoring/sprint-6/b26-spacer.html
 */

interface SpacerBlockProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showDivider?: boolean
}

export const SpacerBlockComponent: React.FC<SpacerBlockProps> = ({ size = 'md', showDivider = false }) => {
  // Height mapping based on size
  const heightClasses = {
    sm: 'h-6', // 24px (no mobile change)
    md: 'h-12', // 48px (no mobile change)
    lg: 'h-16 md:h-20', // 64px mobile → 80px desktop
    xl: 'h-20 md:h-[120px]', // 80px mobile → 120px desktop
  }

  return (
    <div
      className={`relative ${heightClasses[size]}`}
      aria-hidden="true"
      role="presentation"
    >
      {showDivider && (
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
          <div className="h-px bg-grey" />
        </div>
      )}
    </div>
  )
}
