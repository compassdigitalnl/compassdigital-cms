/**
 * Automotive Blocks Index
 *
 * Exports all automotive-specific Payload blocks.
 * These blocks are only available when the Automotive feature is enabled.
 */

// Block configs
export { VehicleGrid } from './VehicleGrid'
export { FeaturedVehicles } from './FeaturedVehicles'
export { WorkshopServices } from './WorkshopServices'
export { TradeInCTA } from './TradeInCTA'

// Block components
export { VehicleGridComponent } from './VehicleGrid/Component'
export { FeaturedVehiclesComponent } from './FeaturedVehicles/Component'
export { WorkshopServicesComponent } from './WorkshopServices/Component'
export { TradeInCTAComponent } from './TradeInCTA/Component'

// Re-import for array export
import { VehicleGrid } from './VehicleGrid'
import { FeaturedVehicles } from './FeaturedVehicles'
import { WorkshopServices } from './WorkshopServices'
import { TradeInCTA } from './TradeInCTA'

/**
 * All automotive blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const automotiveBlocks = [VehicleGrid, FeaturedVehicles, WorkshopServices, TradeInCTA]

/**
 * Block slugs for reference
 */
export const automotiveBlockSlugs = automotiveBlocks.map((block) => block.slug)
