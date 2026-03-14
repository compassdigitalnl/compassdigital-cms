/**
 * Beauty Blocks Index
 *
 * Exports all beauty-specific Payload blocks.
 * These blocks are only available when the Beauty feature is enabled.
 */

// Block configs
export { TreatmentGrid } from './TreatmentGrid'
export { PortfolioGrid } from './PortfolioGrid'
export { TeamShowcase } from './TeamShowcase'

// Block components
export { TreatmentGridComponent } from './TreatmentGrid/Component'
export { PortfolioGridComponent } from './PortfolioGrid/Component'
export { TeamShowcaseComponent } from './TeamShowcase/Component'

// Import for array export
import { TreatmentGrid } from './TreatmentGrid'
import { PortfolioGrid } from './PortfolioGrid'
import { TeamShowcase } from './TeamShowcase'

/**
 * All beauty blocks in one array
 */
export const beautyBlocks = [
  TreatmentGrid,
  PortfolioGrid,
  TeamShowcase,
]

/**
 * Block slugs for reference
 */
export const beautyBlockSlugs = beautyBlocks.map((block) => block.slug)
