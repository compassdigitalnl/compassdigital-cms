import type { CaseStudyGridBlock, Media } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-43 CaseStudyGrid Block Props
 */
export interface CaseStudyGridBlockProps extends CaseStudyGridBlock, BlockAnimationProps {}

export type CaseStudyLayout = 'grid' | 'featured'

export interface ResultMetric {
  metric?: string | null
  value?: string | null
  id?: string | null
}

export interface CaseStudyItem {
  title: string
  client?: string | null
  description?: string | null
  image?: Media | number | null
  results?: ResultMetric[] | null
  link?: string | null
  id?: string | null
}
