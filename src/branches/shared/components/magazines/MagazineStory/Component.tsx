'use client'

import React from 'react'
import { ContentStory } from '@/branches/shared/components/ui/ContentStory/Component'
import type { MagazineStoryProps } from './types'

export const MagazineStory: React.FC<MagazineStoryProps> = ({
  description,
  className = '',
}) => {
  return (
    <ContentStory
      description={description}
      title="Over dit magazine"
      className={className}
    />
  )
}
