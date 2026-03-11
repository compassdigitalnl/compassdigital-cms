/**
 * Construction Blocks Index
 *
 * Exports all construction-specific Payload blocks.
 * These blocks are only available when the Construction feature is enabled.
 *
 * Removed blocks (use shared equivalents instead):
 * - StatsBar → use shared Stats block
 * - CTABanner → use shared CTA block
 * - ReviewsGrid → use shared ReviewsWidget block
 *
 * Usage in Pages collection:
 * ```ts
 * import { isFeatureEnabled } from '@/lib/tenant/features'
 * import { constructionBlocks } from '@/branches/construction/blocks'
 *
 * blocks: [
 *   // Shared blocks
 *   HeroBlock,
 *   ContentBlock,
 *
 *   // Construction blocks (conditional)
 *   ...(isConstructionEnabled() ? constructionBlocks : []),
 * ]
 * ```
 */

// Block configs
export { ConstructionHero } from './ConstructionHero'
export { ServicesGrid } from './ServicesGrid'
export { ProjectsGrid } from './ProjectsGrid'

// Block components
export { ConstructionHeroComponent } from './ConstructionHero/Component'
export { ServicesGridComponent } from './ServicesGrid/Component'
export { ProjectsGridComponent } from './ProjectsGrid/Component'

// Import for array export
import { ConstructionHero } from './ConstructionHero'
import { ServicesGrid } from './ServicesGrid'
import { ProjectsGrid } from './ProjectsGrid'

/**
 * All construction blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const constructionBlocks = [
  ConstructionHero,
  ServicesGrid,
  ProjectsGrid,
]

/**
 * Block slugs for reference
 */
export const constructionBlockSlugs = constructionBlocks.map((block) => block.slug)
