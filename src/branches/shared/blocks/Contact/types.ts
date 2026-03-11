import type { ContactBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

export interface ContactBlockProps extends ContactBlock, BlockAnimationProps {}
export type ContactVariant = 'info-only' | 'info-form' | 'info-form-reversed' | 'stacked'
