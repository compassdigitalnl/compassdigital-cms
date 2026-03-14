/**
 * Vastgoed Blocks Index
 *
 * Exports all vastgoed-specific Payload blocks.
 * These blocks are only available when the Real Estate feature is enabled.
 */

// Block configs
export { FeaturedProperties } from './FeaturedProperties'
export { PropertySearch } from './PropertySearch'
export { ValuationCTA } from './ValuationCTA'

// Block components
export { FeaturedPropertiesComponent } from './FeaturedProperties/Component'
export { PropertySearchComponent } from './PropertySearch/Component'
export { ValuationCTAComponent } from './ValuationCTA/Component'

// Re-import for array export
import { FeaturedProperties } from './FeaturedProperties'
import { PropertySearch } from './PropertySearch'
import { ValuationCTA } from './ValuationCTA'

/**
 * All vastgoed blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const vastgoedBlocks = [FeaturedProperties, PropertySearch, ValuationCTA]

/**
 * Block slugs for reference
 */
export const vastgoedBlockSlugs = vastgoedBlocks.map((block) => block.slug)
