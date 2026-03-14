/**
 * Automotive Branch
 *
 * Complete automotive dealer / garage / rental template system.
 * Includes vehicle management, workshop services, test drive bookings,
 * trade-in module, and financing calculator.
 *
 * Use case: Auto dealers, garages, verhuurbedrijven
 */

// Collections removed from this file — registered directly in payload.config.ts
// (Vehicles, VehicleBrands + unified Content collections)

// Export all blocks
export * from './blocks'
export { automotiveBlocks, automotiveBlockSlugs } from './blocks'

// Export all templates
export * from './templates'

// Export branch metadata
export const branchMetadata = {
  name: 'automotive',
  displayName: 'Automotive & Voertuigen',
  description: 'Complete template voor autobedrijven, garages en dealers',
  collections: [
    'vehicles',
    'vehicle-brands',
    'content-services',
    'content-bookings',
    'content-team',
    'content-reviews',
  ],
  routes: [
    '/(automotive)/occasions',
    '/(automotive)/occasions/[slug]',
    '/(automotive)/werkplaats',
    '/(automotive)/afspraak-maken',
    '/(automotive)/inruilen',
    '/(automotive)/contact',
  ],
  features: [
    'Vehicle management',
    'RDW license plate lookup',
    'Workshop booking',
    'Financing calculator',
    'Trade-in module',
    'Vehicle comparison',
    'Test drive requests',
    'APK reminders',
  ],
  featureFlag: 'ENABLE_AUTOMOTIVE',
  platformOnly: false,
  category: 'Industry-Specific',
  templates: [
    'automotivevehicles1',
    'automotivevehicledetail1',
    'automotiveworkshop1',
    'automotivebooking1',
    'automotivetradein1',
    'automotivecontact1',
  ],
  version: '2.0.0',
  createdAt: '2026-03-14',
  updatedAt: '2026-03-14',
} as const
