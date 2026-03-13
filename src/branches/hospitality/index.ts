/**
 * Hospitality Branch
 *
 * Vertical slice for hospitality/healthcare businesses (physiotherapy, dental, etc.)
 *
 * Collections: Treatments, Practitioners, Appointments, PatientInfo
 * Features: Treatment detail pages, practitioner profiles, appointment booking
 */

// Collections removed — replaced by unified Content collections
// (ContentServices, ContentTeam, ContentBookings)

// Export branch metadata
export const branchMetadata = {
  name: 'hospitality',
  collections: [],
  featureFlag: 'ENABLE_HOSPITALITY',
} as const
