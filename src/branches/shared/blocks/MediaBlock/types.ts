import type { MediaBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-06 Media Block Props
 *
 * Extends the Payload-generated MediaBlock interface with animation props.
 */
export interface MediaBlockProps extends MediaBlock, BlockAnimationProps {}

export type MediaBlockSize = 'narrow' | 'wide' | 'full'
