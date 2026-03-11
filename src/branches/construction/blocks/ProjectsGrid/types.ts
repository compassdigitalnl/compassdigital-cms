import type { ProjectsGridBlock, ConstructionProject, ConstructionService } from '@/payload-types'

/**
 * ProjectsGrid Block Props
 *
 * Uses the Payload-generated ProjectsGridBlock interface directly.
 * Re-exported here for convenience and to add any component-specific types.
 */
export type ProjectsGridProps = ProjectsGridBlock

export type ProjectsSource = 'auto' | 'featured' | 'manual' | 'category'

export type GridColumns = '2' | '3' | '4'

export { ConstructionProject, ConstructionService }
