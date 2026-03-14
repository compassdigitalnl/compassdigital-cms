/**
 * Vastgoed Branch
 *
 * Complete vastgoed & makelaardij template system.
 * Includes property management, viewing bookings, valuation requests,
 * mortgage calculator, and property search with map view.
 *
 * Use case: Makelaars, vastgoedkantoren, woningmakelaars
 */

// Collections removed from this file — registered directly in payload.config.ts
// (Properties + unified Content collections)

// Export all blocks
export { vastgoedBlocks, vastgoedBlockSlugs } from './blocks'

// Export all templates (placeholder — templates will be added in Fase 4)
// export * from './templates'

// Export branch metadata
export const branchMetadata = {
  name: 'vastgoed',
  displayName: 'Vastgoed & Makelaardij',
  description: 'Complete template voor makelaars, vastgoedkantoren en woningmakelaars',
  collections: [
    'properties',
    'content-services',
    'content-bookings',
    'content-team',
    'content-reviews',
    'content-inquiries',
  ],
  routes: [
    '/(vastgoed)/woningen',
    '/(vastgoed)/woningen/[slug]',
    '/(vastgoed)/waardebepaling',
    '/(vastgoed)/bezichtiging',
    '/(vastgoed)/contact',
  ],
  features: [
    'Property management',
    'Property search with filters',
    'Map view with markers',
    'Viewing bookings (fysiek/online)',
    'Valuation requests',
    'Mortgage calculator',
    'Energy label badges',
    'Agent profiles',
    'Favorite properties',
    'Price per m² calculation',
  ],
  featureFlag: 'ENABLE_REAL_ESTATE',
  platformOnly: false,
  category: 'Industry-Specific',
  gradient: {
    from: '#3F51B5',
    to: '#303F9F',
  },
  templates: [
    'vastgoedwoningen1',
    'vastgoedwoningdetail1',
    'vastgoedwaardebepaling1',
    'vastgoedbezichtiging1',
    'vastgoedcontact1',
  ],
  version: '1.0.0',
  createdAt: '2026-03-14',
  updatedAt: '2026-03-14',
} as const
