import React from 'react'
import type { SpacerBlock } from '@/payload-types'

export const SpacerBlockComponent: React.FC<SpacerBlock> = ({ height }) => {
  const heightClass =
    height === 'xlarge' ? 'h-40' :
    height === 'large' ? 'h-30' :
    height === 'small' ? 'h-10' : 'h-20'

  return <div className={heightClass} aria-hidden="true"></div>
}
