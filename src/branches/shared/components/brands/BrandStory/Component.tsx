'use client'

import React from 'react'
import { ContentStory } from '@/branches/shared/components/ui/ContentStory/Component'
import type { BrandStoryProps } from './types'

export const BrandStory: React.FC<BrandStoryProps> = ({
  description,
  className = '',
}) => {
  return (
    <ContentStory
      description={description}
      title="Over het merk"
      className={className}
    />
  )
}
