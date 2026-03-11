import type { SpacerBlock } from '@/payload-types'

/**
 * B-37 Spacer Block Props
 *
 * No animation props — utility block.
 */
export interface SpacerBlockProps extends SpacerBlock {}

export type SpacerSize = 'sm' | 'md' | 'lg' | 'xl'
export type DividerColor = 'grey' | 'teal' | 'navy'
