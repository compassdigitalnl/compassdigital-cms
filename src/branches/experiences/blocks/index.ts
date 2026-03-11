/**
 * Experiences Blocks Index
 *
 * Exports all experiences-specific Payload blocks.
 * These blocks are only available when the Experiences feature is enabled.
 *
 * Usage in Pages collection:
 * ```ts
 * import { experienceBlocks } from '@/branches/experiences/blocks'
 *
 * blocks: [
 *   // Shared blocks
 *   HeroBlock,
 *   ContentBlock,
 *
 *   // Experience blocks (conditional)
 *   ...(disabledCollections.has('experiences') ? [] : experienceBlocks),
 * ]
 * ```
 */

export { ExperienceHero } from './ExperienceHero'
export { ExperienceGrid } from './ExperienceGrid'
export { ExperienceCategoryGrid } from './ExperienceCategoryGrid'
export { ExperienceSocialProof } from './ExperienceSocialProof'
export { WorkshopRegistration } from './WorkshopRegistration'

// Re-import for array export
import { ExperienceHero } from './ExperienceHero'
import { ExperienceGrid } from './ExperienceGrid'
import { ExperienceCategoryGrid } from './ExperienceCategoryGrid'
import { ExperienceSocialProof } from './ExperienceSocialProof'
import { WorkshopRegistration } from './WorkshopRegistration'

/**
 * All experience blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const experienceBlocks = [
  ExperienceHero,
  ExperienceGrid,
  ExperienceCategoryGrid,
  ExperienceSocialProof,
  WorkshopRegistration,
]

/**
 * Block slugs for reference
 */
export const experienceBlockSlugs = experienceBlocks.map((block) => block.slug)
