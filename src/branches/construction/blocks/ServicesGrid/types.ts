import type { ServicesGridBlock, ConstructionService } from '@/payload-types'

/**
 * ServicesGrid Block Props
 *
 * Uses the Payload-generated ServicesGridBlock interface directly.
 * Re-exported here for convenience and to add any component-specific types.
 */
export type ServicesGridProps = ServicesGridBlock

export type ServicesSource = 'auto' | 'manual'

export type GridColumns = '2' | '3' | '4'

export { ConstructionService }
