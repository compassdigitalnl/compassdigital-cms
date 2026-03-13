/**
 * Experiences Branch
 *
 * Complete experiences/ervaringen template system.
 * Includes experience categories, experiences with pricing, and review functionality.
 *
 * Use case: Experience providers, team building companies, event organizers
 */

// Collections removed — replaced by unified Content collections
// (ContentActivities, ContentReviews)

// Export branch metadata
export const branchMetadata = {
  name: 'experiences',
  displayName: 'Ervaringen',
  description: 'Complete template voor ervaringen en belevenissen aanbieders',
  collections: [
    'experience-categories',
    'experiences',
    'experience-reviews',
  ],
  routes: [
    '/(experiences)/ervaringen',
    '/(experiences)/ervaringen/[slug]',
    '/(experiences)/ervaringen/categorie/[slug]',
  ],
  features: [
    'Experience categories',
    'Experience detail pages with pricing',
    'Extras/add-ons management',
    'Client reviews with detailed ratings',
    'Gallery with video support',
    'SEO meta fields',
    'Draft/publish workflow',
  ],
  featureFlag: 'ENABLE_EXPERIENCES',
  platformOnly: false,
  category: 'Industry-Specific',
  version: '1.0.0',
  createdAt: '2026-03-10',
} as const

// Export blocks
export { experienceBlocks, experienceBlockSlugs } from './blocks'

// Individual collection exports removed — use unified Content collections
