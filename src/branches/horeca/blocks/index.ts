/**
 * Horeca Blocks Index
 *
 * Exports all horeca-specific Payload blocks.
 * These blocks are only available when the Horeca feature is enabled.
 *
 * Usage in Pages collection:
 * ```ts
 * import { horecaBlocks } from '@/branches/horeca/blocks'
 *
 * blocks: [
 *   // Shared blocks
 *   HeroBlock,
 *   ContentBlock,
 *
 *   // Horeca blocks (conditional)
 *   ...(disabledCollections.has('menuItems') ? [] : horecaBlocks),
 * ]
 * ```
 */

export { ReservationForm } from './ReservationForm'

// Re-import for array export
import { ReservationForm } from './ReservationForm'

/**
 * All horeca blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const horecaBlocks = [ReservationForm]

/**
 * Block slugs for reference
 */
export const horecaBlockSlugs = horecaBlocks.map((block) => block.slug)
