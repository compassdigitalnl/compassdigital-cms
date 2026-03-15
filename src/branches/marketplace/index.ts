/**
 * Marketplace Branch
 *
 * Vertical slice containing all marketplace-related collections, components, and logic.
 *
 * Collections: Vendors, VendorReviews, Workshops, VendorApplications
 */

// Export all collections
export { default as Vendors } from './collections/Vendors'
export { default as VendorReviews } from './collections/VendorReviews'
export { default as Workshops } from './collections/Workshops'
export { default as VendorApplications } from './collections/VendorApplications'

// Export branch metadata
export const branchMetadata = {
  name: 'marketplace',
  displayName: 'Marktplaats',
  description: 'Multi-vendor marketplace met leveranciers, reviews, workshops en aanvragen',
  collections: ['vendors', 'vendor-reviews', 'workshops', 'vendor-applications'],
  routes: [
    '/(ecommerce)/vendors',
    '/(ecommerce)/vendors/[slug]',
    '/(ecommerce)/workshops',
    '/(ecommerce)/workshops/[slug]',
  ],
  features: [
    'Leverancier profielen met tabs',
    'Product-vendor koppelingen',
    'Vendor reviews & beoordelingen',
    'Workshops & trainingen',
    'Vendor aanmeldformulier',
    'Filter tags & zoeken',
  ],
  featureFlag: 'ENABLE_VENDORS',
  platformOnly: false,
  category: 'E-commerce',
  version: '2.0.0',
  createdAt: '2026-02-21',
  updatedAt: '2026-03-14',
} as const
