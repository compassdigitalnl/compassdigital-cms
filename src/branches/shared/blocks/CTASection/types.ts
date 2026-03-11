import type { CTASectionBlock } from '@/payload-types'
import type { BlockAnimationProps } from '../_shared/types'

/**
 * B-45 CTA Section Block Props
 *
 * Extends the Payload-generated CTASectionBlock interface with animation props.
 */
export interface CTASectionBlockProps extends CTASectionBlock, BlockAnimationProps {}

export type CTASectionVariant = 'navy' | 'teal' | 'white'
export type CTASectionButtonStyle = 'primary' | 'secondary'
export type CTASectionButtonIcon = 'arrow-right' | 'sparkles' | 'mail' | 'phone' | 'calendar' | null
