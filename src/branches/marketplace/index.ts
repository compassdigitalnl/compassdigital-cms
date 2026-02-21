/**
 * Marketplace Branch
 *
 * Vertical slice containing all marketplace-related collections, components, and logic.
 *
 * Collections: Vendors, VendorReviews, Workshops
 */

// Export all collections
export { default as Vendors } from './collections/Vendors'
export { default as VendorReviews } from './collections/VendorReviews'
export { default as Workshops } from './collections/Workshops'

// Export branch metadata
export const branchMetadata = {
  name: 'marketplace',
  collections: [
  "Vendors",
  "VendorReviews",
  "Workshops"
],
  featureFlag: 'ENABLE_MARKETPLACE',
} as const

// Export branch routes (to be implemented)
// export { routes } from './routes'
