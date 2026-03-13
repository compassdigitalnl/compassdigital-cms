/**
 * Content Branch
 *
 * Vertical slice containing all content-related collections, components, and logic.
 *
 * Collections: BlogPosts
 * (Testimonials, Cases moved to unified ContentReviews, ContentCases)
 */

// Export all collections
export { default as BlogPosts } from './collections/BlogPosts'

// Export branch metadata
export const branchMetadata = {
  name: 'content',
  collections: [
  "BlogPosts"
],
  featureFlag: 'ENABLE_CONTENT',
} as const

// Export branch routes (to be implemented)
// export { routes } from './routes'
