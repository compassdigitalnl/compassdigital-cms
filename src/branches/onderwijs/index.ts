/**
 * Onderwijs Branch
 *
 * Complete onderwijs & cursusplatform template system.
 * Includes course management, curriculum builder, enrollment system,
 * instructor profiles, and student progress tracking.
 *
 * Use case: Online academies, cursusplatformen, trainingscentra
 */

// Collections removed from this file — registered directly in payload.config.ts
// (Courses, CourseCategories, Enrollments + unified Content collections)

// Export all blocks
export { onderwijsBlocks, onderwijsBlockSlugs } from './blocks'

// Export branch metadata
export const branchMetadata = {
  name: 'onderwijs',
  displayName: 'Onderwijs & Cursussen',
  description: 'Complete template voor online academies, cursusplatformen en trainingscentra',
  collections: [
    'courses',
    'course-categories',
    'enrollments',
    'content-services',
    'content-bookings',
    'content-team',
    'content-reviews',
    'content-inquiries',
  ],
  routes: [
    '/(onderwijs)/cursussen',
    '/(onderwijs)/cursussen/[slug]',
    '/(onderwijs)/cursussen/[slug]/inschrijven',
    '/(onderwijs)/docenten',
    '/(onderwijs)/contact',
  ],
  features: [
    'Course management',
    'Curriculum builder with sections & lessons',
    'Multi-step enrollment wizard',
    'Payment processing (iDEAL/creditcard/PayPal)',
    'Student progress tracking',
    'Certificate issuance',
    'Instructor profiles',
    'Course reviews & ratings',
    'Category-based course discovery',
    'Discount & early bird pricing',
  ],
  featureFlag: 'ENABLE_EDUCATION',
  platformOnly: false,
  category: 'Industry-Specific',
  gradient: {
    from: '#2563EB',
    to: '#1E40AF',
  },
  templates: [
    'onderwijscursussen1',
    'onderwijscursusdetail1',
    'onderwijsinschrijving1',
    'onderwijsdocenten1',
    'onderwijscontact1',
  ],
  version: '1.0.0',
  createdAt: '2026-03-14',
  updatedAt: '2026-03-14',
} as const
