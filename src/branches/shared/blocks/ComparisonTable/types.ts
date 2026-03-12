import type { CompetitorComparisonBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

export interface CompetitorComparisonBlockProps extends CompetitorComparisonBlock, BlockAnimationProps {}
export type ComparisonValue = 'yes' | 'no' | 'partial' | 'custom'
