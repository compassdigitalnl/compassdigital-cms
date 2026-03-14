/**
 * Onderwijs Blocks Index
 *
 * Exports all onderwijs-specific Payload blocks.
 * These blocks are only available when the Education feature is enabled.
 */

// Block configs
export { FeaturedCourses } from './FeaturedCourses'
export { CategoryGrid } from './CategoryGrid'
export { CourseSearchHero } from './CourseSearchHero'

// Block components
export { FeaturedCoursesComponent } from './FeaturedCourses/Component'
export { CategoryGridComponent } from './CategoryGrid/Component'
export { CourseSearchHeroComponent } from './CourseSearchHero/Component'

// Re-import for array export
import { FeaturedCourses } from './FeaturedCourses'
import { CategoryGrid } from './CategoryGrid'
import { CourseSearchHero } from './CourseSearchHero'

/**
 * All onderwijs blocks in one array
 * Use this for conditional registration in Pages collection
 */
export const onderwijsBlocks = [FeaturedCourses, CategoryGrid, CourseSearchHero]

/**
 * Block slugs for reference
 */
export const onderwijsBlockSlugs = onderwijsBlocks.map((block) => block.slug)
