/**
 * Zorg Blocks Index
 *
 * Exports all zorg-specific Payload blocks.
 * These blocks are only available when the Zorg feature is enabled.
 */

// Block configs
export { ZorgTreatmentGrid } from './TreatmentGrid'
export { ZorgTeamShowcase } from './ZorgTeamShowcase'
export { PatientReviews } from './PatientReviews'

// Block components
export { ZorgTreatmentGridComponent } from './TreatmentGrid/Component'
export { ZorgTeamShowcaseComponent } from './ZorgTeamShowcase/Component'
export { PatientReviewsComponent } from './PatientReviews/Component'

// Re-import for array export
import { ZorgTreatmentGrid } from './TreatmentGrid'
import { ZorgTeamShowcase } from './ZorgTeamShowcase'
import { PatientReviews } from './PatientReviews'

/**
 * All zorg blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const zorgBlocks = [ZorgTreatmentGrid, ZorgTeamShowcase, PatientReviews]

/**
 * Block slugs for reference
 */
export const zorgBlockSlugs = zorgBlocks.map((block) => block.slug)
