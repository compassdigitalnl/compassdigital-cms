/**
 * Publishing Branch
 *
 * Complete template for publishers, magazines, editorial platforms, and knowledge bases.
 * Includes blog management, magazine publishing, premium content with paywall,
 * subscription system, digital library, and reading analytics.
 *
 * Collections: BlogPosts, BlogCategories, Magazines
 * Feature flag: ENABLE_PUBLISHING (backwards-compatible with ENABLE_CONTENT)
 */

// Export all collections
export { default as BlogPosts } from './collections/BlogPosts'
export { default as DigitalEditionPages } from './collections/DigitalEditionPages'

// Export providers
export { getEditionProvider } from './providers'
export type { EditionProvider, MagazineSummary, Edition, PageImage, RecentRead } from './providers'

// Export all blocks
export * from './blocks'
export { publishingBlocks, publishingBlockSlugs } from './blocks'

// Export all templates
export * from './templates'

// Export branch metadata
export const branchMetadata = {
  name: 'publishing',
  displayName: 'Publishing & Media',
  description: 'Complete template voor uitgevers, magazines en kennisplatformen',
  collections: ['blog-posts', 'blog-categories', 'magazines', 'digital-edition-pages'],
  routes: [
    '/(content)/blog',
    '/(content)/blog/[category]/[slug]',
    '/(content)/knowledge-base',
    '/(content)/tijdschriften',
    '/(content)/tijdschriften/[slug]',
    '/(content)/abonnement',
  ],
  features: [
    'Blog management',
    'Knowledge base',
    'Magazine publishing',
    'Premium content',
    'Subscription system',
    'Digital library',
    'Reading analytics',
  ],
  featureFlag: 'ENABLE_PUBLISHING',
  platformOnly: false,
  category: 'Industry-Specific',
  templates: [
    'publishingblog1',
    'publishingknowledgebase1',
    'publishingmagazine1',
    'publishingmagazinedetail1',
    'publishingsubscription1',
  ],
  version: '2.0.0',
  createdAt: '2026-02-21',
  updatedAt: '2026-03-13',
} as const
