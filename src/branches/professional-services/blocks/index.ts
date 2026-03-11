/**
 * Professional Services Blocks Index
 *
 * Exports all professional-services-specific Payload blocks.
 * These blocks are only available when the Professional Services feature is enabled.
 *
 * Usage in Pages collection:
 * ```ts
 * import { isFeatureEnabled } from '@/lib/tenant/features'
 * import { professionalServicesBlocks } from '@/branches/professional-services/blocks'
 *
 * blocks: [
 *   // Shared blocks
 *   HeroBlock,
 *   ContentBlock,
 *
 *   // Professional Services blocks (conditional)
 *   ...(isProfessionalServicesEnabled() ? professionalServicesBlocks : []),
 * ]
 * ```
 */

// Block configs
export { ProfessionalHero } from './ProfessionalHero'
export { ProfessionalServicesGrid } from './ServicesGrid'
export { CasesGrid } from './CasesGrid'

// Import for array export
import { ProfessionalHero } from './ProfessionalHero'
import { ProfessionalServicesGrid } from './ServicesGrid'
import { CasesGrid } from './CasesGrid'

/**
 * All professional services blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const professionalServicesBlocks = [
  ProfessionalHero,
  ProfessionalServicesGrid,
  CasesGrid,
]

/**
 * Block slugs for reference
 */
export const professionalServicesBlockSlugs = professionalServicesBlocks.map((block) => block.slug)
