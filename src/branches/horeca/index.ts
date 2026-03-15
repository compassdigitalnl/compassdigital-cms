/**
 * Horeca Branch
 *
 * Complete restaurant / cafe / eatery template system.
 * Includes menu management, reservations, events, and team profiles.
 *
 * Use case: Restaurants, cafes, bars, bistros, catering
 */

// Collections removed — replaced by unified Content collections
// (ContentServices, ContentActivities, ContentBookings, ContentTeam, ContentReviews)

// Export all blocks
export * from './blocks'
export { horecaBlocks, horecaBlockSlugs } from './blocks'

// Export all templates
export * from './templates'

// Export branch metadata
export const branchMetadata = {
  name: 'horeca',
  displayName: 'Horeca',
  description: 'Complete template voor restaurants, cafes en eetgelegenheden',
  collections: [
    'content-services',
    'content-activities',
    'content-bookings',
    'content-team',
    'content-reviews',
  ],
  routes: [
    '/(horeca)/menukaart',
    '/(horeca)/menukaart/[slug]',
    '/(horeca)/reserveren',
    '/(horeca)/evenementen',
    '/(horeca)/contact',
  ],
  features: [
    'Menu management',
    'Online reservations',
    'Event listings',
    'Team profiles',
    'Guest reviews',
    'Opening hours',
    'Allergen display',
  ],
  featureFlag: 'ENABLE_HORECA',
  platformOnly: false,
  category: 'Industry-Specific',
  templates: [
    'horecamenu1',
    'horecamenudetail1',
    'horecareservation1',
    'horecaevents1',
    'horecacontact1',
  ],
  version: '2.0.0',
  createdAt: '2026-02-21',
  updatedAt: '2026-03-13',
} as const
