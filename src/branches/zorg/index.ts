/**
 * Zorg Branch
 *
 * Complete healthcare / practice template system.
 * Includes treatment management, appointments, insurance info, and practitioner profiles.
 *
 * Use case: Fysiotherapeuten, tandartsen, huisartsen, psychologen, etc.
 */

// Collections removed — replaced by unified Content collections
// (ContentServices, ContentBookings, ContentTeam, ContentReviews)

// Export branch metadata
export const branchMetadata = {
  name: 'zorg',
  displayName: 'Zorg & Praktijk',
  description: 'Complete template voor zorgpraktijken, fysiotherapeuten, tandartsen en meer',
  collections: [
    'content-services',
    'content-bookings',
    'content-team',
    'content-reviews',
  ],
  routes: [
    '/(zorg)/behandelingen',
    '/(zorg)/behandelingen/[slug]',
    '/(zorg)/afspraak-maken',
    '/(zorg)/team',
    '/(zorg)/contact',
  ],
  features: [
    'Treatment management',
    'Online appointments',
    'Insurance info',
    'Practitioner profiles',
    'Patient reviews',
    'Opening hours',
    'Referral tracking',
  ],
  featureFlag: 'ENABLE_ZORG',
  platformOnly: false,
  category: 'Industry-Specific',
  templates: [
    'zorgtreatments1',
    'zorgtreatmentdetail1',
    'zorgappointment1',
    'zorgteam1',
    'zorgcontact1',
  ],
  version: '1.0.0',
  createdAt: '2026-03-13',
  updatedAt: '2026-03-13',
} as const
