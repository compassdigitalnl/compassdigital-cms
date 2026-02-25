'use client'

import React from 'react'
import * as Icons from 'lucide-react'
import type { TrustSignalItemProps } from './types'

/**
 * TrustSignalItem - Individual trust signal item (icon + text)
 * Part of EC09: TrustSignals component
 */
export function TrustSignalItem({ icon, text, variant }: TrustSignalItemProps) {
  // Dynamically get the icon component from lucide-react
  const IconComponent = Icons[icon as keyof typeof Icons] as React.FC<{
    size?: number
    'aria-hidden'?: boolean
    className?: string
  }>

  // Icon size based on variant
  const iconSize = variant === 'compact' ? 14 : 16

  return (
    <li
      className="flex items-center gap-2"
      style={{
        fontSize: variant === 'compact' ? '12px' : '13px',
        color: 'var(--grey-dark)',
      }}
    >
      {IconComponent && (
        <IconComponent
          size={iconSize}
          aria-hidden="true"
          className="flex-shrink-0"
          style={{ color: 'var(--teal)' }}
        />
      )}
      {text}
    </li>
  )
}
