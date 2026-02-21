/**
 * Construction Blocks Index
 *
 * Exports all construction-specific Payload blocks.
 * These blocks are only available when the Construction feature is enabled.
 *
 * Usage in Pages collection:
 * ```ts
 * import { isConstructionEnabled } from '@/lib/features/isFeatureEnabled'
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

export { ConstructionHero } from './ConstructionHero'
export { ServicesGrid } from './ServicesGrid'
export { ProjectsGrid } from './ProjectsGrid'
export { ReviewsGrid } from './ReviewsGrid'
export { StatsBar } from './StatsBar'
export { CTABanner } from './CTABanner'

// Export all blocks as array for easy conditional registration
import { ConstructionHero } from './ConstructionHero'
import { ServicesGrid } from './ServicesGrid'
import { ProjectsGrid } from './ProjectsGrid'
import { ReviewsGrid } from './ReviewsGrid'
import { StatsBar } from './StatsBar'
import { CTABanner } from './CTABanner'

/**
 * All construction blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const constructionBlocks = [
  ConstructionHero,
  ServicesGrid,
  ProjectsGrid,
  ReviewsGrid,
  StatsBar,
  CTABanner,
]

/**
 * Block slugs for reference
 */
export const constructionBlockSlugs = constructionBlocks.map((block) => block.slug)
