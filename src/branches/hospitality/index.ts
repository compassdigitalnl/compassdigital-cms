/**
 * Hospitality Branch
 *
 * Vertical slice for hospitality/healthcare businesses (physiotherapy, dental, etc.)
 *
 * Collections: Treatments, Practitioners, Appointments, PatientInfo
 * Features: Treatment detail pages, practitioner profiles, appointment booking
 */

// Export all collections
export { default as Treatments } from './collections/Treatments'
export { default as Practitioners } from './collections/Practitioners'
export { default as Appointments } from './collections/Appointments'

// Export branch metadata
export const branchMetadata = {
  name: 'hospitality',
  collections: ['Treatments', 'Practitioners', 'Appointments'],
  featureFlag: 'ENABLE_HOSPITALITY',
} as const
