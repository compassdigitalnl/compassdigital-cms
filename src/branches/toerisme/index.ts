/**
 * Toerisme Branch
 *
 * Complete toerisme & reizen template system.
 * Includes tour management, destinations, accommodations,
 * booking wizard, and travel search.
 *
 * Use case: Reisbureaus, touroperators, vakantieaanbieders
 */

// Collections removed from this file — registered directly in payload.config.ts
// (Tours, Destinations, Accommodations + unified Content collections)

// Export all blocks
export * from './blocks'
export { toerismeBlocks, toerismeBlockSlugs } from './blocks'

// Export branch metadata
export const branchMetadata = {
  name: 'toerisme',
  displayName: 'Toerisme & Reizen',
  description: 'Complete template voor reisbureaus, touroperators en vakantieaanbieders',
  collections: [
    'tours',
    'destinations',
    'accommodations',
    'content-bookings',
    'content-reviews',
    'content-team',
  ],
  routes: [
    '/(toerisme)/reizen',
    '/(toerisme)/reizen/[slug]',
    '/(toerisme)/accommodaties',
    '/(toerisme)/accommodaties/[slug]',
    '/(toerisme)/boeken',
    '/(toerisme)/contact',
  ],
  features: [
    'Tour management',
    'Destination management',
    'Accommodation management',
    'Booking wizard',
    'Travel search',
    'Itinerary planning',
    'Availability calendar',
    'Early bird pricing',
    'Continent filtering',
    'Meal plan options',
  ],
  featureFlag: 'ENABLE_TOURISM',
  platformOnly: false,
  category: 'Industry-Specific',
  templates: [
    'toerismereizen1',
    'toerismereizendetail1',
    'toerismeaccommodaties1',
    'toerismeaccommodatiedetail1',
    'toerismeboeken1',
    'toerismecontact1',
  ],
  version: '1.0.0',
  createdAt: '2026-03-14',
  updatedAt: '2026-03-14',
} as const
