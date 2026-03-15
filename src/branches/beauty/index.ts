/**
 * Beauty Branch
 *
 * Complete beauty salon / hair studio / spa template system.
 * Includes treatments, portfolio, bookings, and team management.
 *
 * Use case: Beauty salons, hair studios, spas, wellness centers
 */

// Collections removed — replaced by unified Content collections
// (ContentServices, ContentTeam, ContentBookings, ContentCases, ContentReviews)

// Export all blocks
export * from './blocks'
export { beautyBlocks, beautyBlockSlugs } from './blocks'

// Export all templates
export * from './templates'

// Export branch metadata
export const branchMetadata = {
  name: 'beauty',
  displayName: 'Beauty & Salon',
  description: 'Complete template voor beautysalons, kappers en wellness',
  collections: [
    'content-services',
    'content-team',
    'content-bookings',
    'content-cases',
    'content-reviews',
  ],
  routes: [
    '/(beauty)/behandelingen',
    '/(beauty)/behandelingen/[slug]',
    '/(beauty)/boeken',
    '/(beauty)/portfolio',
    '/(beauty)/contact',
  ],
  features: [
    'Treatment management',
    'Online booking system',
    'Stylist/team profiles',
    'Before/after portfolio',
    'Client reviews',
    'Opening hours display',
    'Category filtering',
  ],
  featureFlag: 'ENABLE_BEAUTY',
  platformOnly: false,
  category: 'Industry-Specific',
  templates: [
    'beautytreatments1',
    'beautytreatmentdetail1',
    'beautybooking1',
    'beautyportfolio1',
    'beautycontact1',
  ],
  version: '2.0.0',
  createdAt: '2026-02-21',
  updatedAt: '2026-03-13',
} as const
