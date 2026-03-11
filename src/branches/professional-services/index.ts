/**
 * Professional Services Branch
 *
 * Complete professional services / zakelijke dienstverlening template system.
 * Includes services, case studies, reviews, and consultation request functionality.
 *
 * Use case: Accountants, lawyers, real estate agents, marketing agencies,
 * IT companies, consultancies, HR firms, notaries
 * Based on: Construction branch pattern
 */

// Export all collections
export { default as ProfessionalServices } from './collections/ProfessionalServices'
export { default as ProfessionalCases } from './collections/ProfessionalCases'
export { default as ProfessionalReviews } from './collections/ProfessionalReviews'
export { default as ConsultationRequests } from './collections/ConsultationRequests'

// Export all blocks
export * from './blocks'
export { professionalServicesBlocks, professionalServicesBlockSlugs } from './blocks'

// Export all templates
export * from './templates'

// Export branch metadata
export const branchMetadata = {
  name: 'professional-services',
  displayName: 'Zakelijke Dienstverlening',
  description: 'Complete template voor zakelijke dienstverleners',
  collections: [
    'professional-services',
    'professional-cases',
    'professional-reviews',
    'consultation-requests',
  ],
  routes: [
    '/(professional-services)/dienstverlening',
    '/(professional-services)/dienstverlening/[slug]',
    '/(professional-services)/cases',
    '/(professional-services)/cases/[slug]',
    '/(professional-services)/adviesgesprek-aanvragen',
  ],
  features: [
    'Services management',
    'Case study portfolio',
    'Client reviews/testimonials',
    'Consultation request system',
    'Multi-step forms',
    'FAQ sections',
    'JSON-LD structured data',
  ],
  featureFlag: 'ENABLE_PROFESSIONAL_SERVICES',
  platformOnly: false,
  category: 'Industry-Specific',
  templates: [
    'professionalservice1',
    'professionalcase1',
    'professionalcasesarchive1',
    'professionalconsultation1',
  ],
  version: '1.0.0',
  createdAt: '2026-03-11',
  updatedAt: '2026-03-11',
} as const

// Export individual collections for direct import
export * from './collections/ProfessionalServices'
export * from './collections/ProfessionalCases'
export * from './collections/ProfessionalReviews'
export * from './collections/ConsultationRequests'
