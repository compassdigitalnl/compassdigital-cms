/**
 * Construction Branch
 *
 * Complete construction/bouwbedrijf template system.
 * Includes services, projects, reviews, and quote request functionality.
 *
 * Use case: Construction companies, contractors, renovation specialists
 * Based on: VanderBouw template (Sprint 2)
 */

// Export all collections
export { default as ConstructionServices } from './collections/ConstructionServices'
export { default as ConstructionProjects } from './collections/ConstructionProjects'
export { default as ConstructionReviews } from './collections/ConstructionReviews'
export { default as QuoteRequests } from './collections/QuoteRequests'

// Export all blocks
export * from './blocks'
export { constructionBlocks, constructionBlockSlugs } from './blocks'

// Export branch metadata
export const branchMetadata = {
  name: 'construction',
  displayName: 'Bouwbedrijf',
  description: 'Complete template voor bouwbedrijven en aannemers',
  collections: [
    'construction-services',
    'construction-projects',
    'construction-reviews',
    'quote-requests',
  ],
  routes: [
    '/(construction)/diensten',
    '/(construction)/diensten/[slug]',
    '/(construction)/projecten',
    '/(construction)/projecten/[slug]',
    '/(construction)/offerte-aanvragen',
  ],
  features: [
    'Services management',
    'Project portfolio',
    'Client reviews/testimonials',
    'Quote request system',
    'Multi-step forms',
    'Before/after galleries',
    'FAQ sections',
  ],
  featureFlag: 'ENABLE_CONSTRUCTION', // Optional feature flag
  platformOnly: false, // Available for all clients
  category: 'Industry-Specific',
  version: '1.0.0',
  createdAt: '2026-02-21',
} as const

// Export individual collections for direct import
export * from './collections/ConstructionServices'
export * from './collections/ConstructionProjects'
export * from './collections/ConstructionReviews'
export * from './collections/QuoteRequests'
