/**
 * Content Branch
 *
 * Vertical slice containing all content-related collections, components, and logic.
 *
 * Collections: BlogPosts, FAQs, Testimonials, Cases
 */

// Export all collections
export { default as BlogPosts } from './collections/BlogPosts'
export { default as FAQs } from '../shared/collections/FAQs'
export { default as Testimonials } from '../shared/collections/Testimonials'
export { default as Cases } from '../shared/collections/Cases'

// Export branch metadata
export const branchMetadata = {
  name: 'content',
  collections: [
  "BlogPosts",
  "FAQs",
  "Testimonials",
  "Cases"
],
  featureFlag: 'ENABLE_CONTENT',
} as const

// Export branch routes (to be implemented)
// export { routes } from './routes'
