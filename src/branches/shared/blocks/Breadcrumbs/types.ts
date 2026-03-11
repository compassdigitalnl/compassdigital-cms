import type { BreadcrumbsBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-35 Breadcrumbs Block Props
 */
export interface BreadcrumbsBlockProps extends BreadcrumbsBlock, BlockAnimationProps {}

export type BreadcrumbSeparator = 'slash' | 'chevron' | 'dot'

export interface BreadcrumbItem {
  label: string
  link?: string | null
  id?: string | null
}
