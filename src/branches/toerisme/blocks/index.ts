/**
 * Toerisme Blocks Index
 *
 * Exports all toerisme-specific Payload blocks.
 * These blocks are only available when the Tourism feature is enabled.
 */

// Block configs
export { FeaturedTours } from './FeaturedTours'
export { DestinationGrid } from './DestinationGrid'
export { AccommodationShowcase } from './AccommodationShowcase'
export { TourSearchHero } from './TourSearchHero'

// Block components
export { FeaturedToursComponent } from './FeaturedTours/Component'
export { DestinationGridComponent } from './DestinationGrid/Component'
export { AccommodationShowcaseComponent } from './AccommodationShowcase/Component'
export { TourSearchHeroComponent } from './TourSearchHero/Component'

// Re-import for array export
import { FeaturedTours } from './FeaturedTours'
import { DestinationGrid } from './DestinationGrid'
import { AccommodationShowcase } from './AccommodationShowcase'
import { TourSearchHero } from './TourSearchHero'

/**
 * All toerisme blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const toerismeBlocks = [FeaturedTours, DestinationGrid, AccommodationShowcase, TourSearchHero]

/**
 * Block slugs for reference
 */
export const toerismeBlockSlugs = toerismeBlocks.map((block) => block.slug)
