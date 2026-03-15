/**
 * Horeca Blocks Index
 *
 * Exports all horeca-specific Payload blocks.
 * These blocks are only available when the Horeca feature is enabled.
 */

// Block configs
export { ReservationForm } from './ReservationForm'
export { MenuGrid } from './MenuGrid'
export { EventsGrid } from './EventsGrid'
export { HorecaTeamShowcase } from './TeamShowcase'

// Block components
export { MenuGridComponent } from './MenuGrid/Component'
export { EventsGridComponent } from './EventsGrid/Component'
export { HorecaTeamShowcaseComponent } from './TeamShowcase/Component'

// Re-import for array export
import { ReservationForm } from './ReservationForm'
import { MenuGrid } from './MenuGrid'
import { EventsGrid } from './EventsGrid'
import { HorecaTeamShowcase } from './TeamShowcase'

/**
 * All horeca blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const horecaBlocks = [ReservationForm, MenuGrid, EventsGrid, HorecaTeamShowcase]

/**
 * Block slugs for reference
 */
export const horecaBlockSlugs = horecaBlocks.map((block) => block.slug)
