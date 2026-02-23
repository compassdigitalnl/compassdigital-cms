/**
 * Spacer Component - 100% Theme Variable Compliant
 *
 * Already compliant - no colors, pure spacing element.
 */
import React from 'react'
import type { SpacerBlock } from '@/payload-types'

export const SpacerBlockComponent: React.FC<SpacerBlock> = ({ height }) => {
  // HTML Design System sizes: 24px / 48px / 80px / 120px (4px grid)
  const heightClass =
    height === 'xlarge' ? 'h-30' :  // 120px
    height === 'large' ? 'h-20' :   // 80px
    height === 'small' ? 'h-6' :    // 24px
    'h-12'                          // 48px (medium default)

  return <div className={heightClass} aria-hidden="true"></div>
}
