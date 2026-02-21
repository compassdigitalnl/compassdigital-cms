/**
 * Feature Detection Utility
 *
 * Checks if a feature/collection is enabled for the current client instance.
 * Works with DISABLED_COLLECTIONS environment variable for per-client customization.
 *
 * Usage:
 * ```ts
 * import { isFeatureEnabled, isConstructionEnabled } from '@/lib/features/isFeatureEnabled'
 *
 * // Generic check
 * if (isFeatureEnabled('construction-services')) {
 *   // Feature is enabled
 * }
 *
 * // Specific check
 * if (isConstructionEnabled()) {
 *   // Construction feature is enabled
 * }
 * ```
 */

// Parse DISABLED_COLLECTIONS from environment
const disabledCollectionsEnv = process.env.DISABLED_COLLECTIONS || ''
const disabledSet = new Set(
  disabledCollectionsEnv.split(',').map((s) => s.trim()).filter(Boolean),
)

/**
 * Check if a specific collection/feature is enabled
 * @param collectionSlug - The collection slug to check (e.g., 'construction-services')
 * @returns true if enabled, false if disabled
 */
export const isFeatureEnabled = (collectionSlug: string): boolean => {
  return !disabledSet.has(collectionSlug)
}

/**
 * Check if ANY collection from a list is enabled
 * @param collectionSlugs - Array of collection slugs
 * @returns true if at least one is enabled
 */
export const isAnyFeatureEnabled = (collectionSlugs: string[]): boolean => {
  return collectionSlugs.some((slug) => isFeatureEnabled(slug))
}

/**
 * Check if ALL collections from a list are enabled
 * @param collectionSlugs - Array of collection slugs
 * @returns true if all are enabled
 */
export const areAllFeaturesEnabled = (collectionSlugs: string[]): boolean => {
  return collectionSlugs.every((slug) => isFeatureEnabled(slug))
}

// ═══════════════════════════════════════════════════════════════════════════
// Branch-specific helpers
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if Construction branch is enabled
 * Returns true if ANY construction collection is enabled
 */
export const isConstructionEnabled = (): boolean => {
  return isAnyFeatureEnabled([
    'construction-services',
    'construction-projects',
    'construction-reviews',
    'quote-requests',
  ])
}

/**
 * Check if E-commerce branch is enabled
 * Returns true if ANY ecommerce collection is enabled
 */
export const isEcommerceEnabled = (): boolean => {
  return isAnyFeatureEnabled([
    'products',
    'orders',
    'product-categories',
  ])
}

/**
 * Check if Content branch is enabled
 * Returns true if ANY content collection is enabled
 */
export const isContentEnabled = (): boolean => {
  return isAnyFeatureEnabled([
    'blog-posts',
    'blog-categories',
    'faqs',
    'testimonials',
  ])
}

/**
 * Check if Marketplace branch is enabled
 * Returns true if ANY marketplace collection is enabled
 */
export const isMarketplaceEnabled = (): boolean => {
  return isAnyFeatureEnabled([
    'vendors',
    'vendor-reviews',
    'workshops',
  ])
}

/**
 * Check if this is the platform instance
 * Platform has all features enabled (empty DISABLED_COLLECTIONS)
 */
export const isPlatformInstance = (): boolean => {
  return disabledSet.size === 0
}

/**
 * Get list of all disabled collections
 */
export const getDisabledCollections = (): string[] => {
  return Array.from(disabledSet)
}

/**
 * Get list of enabled branch names
 */
export const getEnabledBranches = (): string[] => {
  const branches: string[] = []

  if (isEcommerceEnabled()) branches.push('ecommerce')
  if (isContentEnabled()) branches.push('content')
  if (isMarketplaceEnabled()) branches.push('marketplace')
  if (isConstructionEnabled()) branches.push('construction')
  if (isPlatformInstance()) branches.push('platform')

  return branches
}

// Export the disabled set for internal use (e.g., in payload.config.ts)
export const _disabledCollectionsSet = disabledSet
