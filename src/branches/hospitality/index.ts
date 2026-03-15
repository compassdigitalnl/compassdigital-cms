/**
 * Hospitality Branch (Deprecated)
 *
 * Superseded by the Zorg branch which covers healthcare/physiotherapy use cases.
 * Kept for backwards compatibility with existing route groups.
 * Uses unified Content collections from shared.
 */

// Export branch metadata
export const branchMetadata = {
  name: 'hospitality',
  displayName: 'Hospitality (Deprecated)',
  description: 'Deprecated — gebruik de Zorg branche voor zorgpraktijken',
  collections: [
    'content-services',
    'content-team',
    'content-bookings',
  ],
  routes: [
    '/(hospitality)/fysio',
    '/(hospitality)/treatments/[slug]',
  ],
  features: [],
  featureFlag: 'ENABLE_HOSPITALITY',
  platformOnly: false,
  category: 'Deprecated',
  deprecated: true,
  supersededBy: 'zorg',
  version: '0.1.0',
} as const
