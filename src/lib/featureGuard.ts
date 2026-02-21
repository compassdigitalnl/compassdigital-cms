/**
 * Feature Guard Utilities
 *
 * Protect routes based on feature toggles
 * Use in page.tsx files to return 404 if feature is disabled
 *
 * Usage:
 * ```tsx
 * import { requireFeature } from '@/lib/featureGuard'
 *
 * export default async function VendorsPage() {
 *   // Return 404 if vendors feature is disabled
 *   requireFeature('vendors')
 *
 *   // Rest of page...
 * }
 * ```
 */

import { notFound } from 'next/navigation'
import { isFeatureEnabled } from './features'
import type { ClientFeatures } from './features'

/**
 * Require a feature to be enabled, otherwise return 404
 * Use in Server Components (page.tsx)
 */
export function requireFeature(feature: keyof ClientFeatures): void {
  if (!isFeatureEnabled(feature)) {
    console.log(`[FeatureGuard] Feature '${feature}' is disabled - returning 404`)
    notFound()
  }
}

/**
 * Require multiple features to be enabled (AND logic)
 * All features must be enabled, otherwise return 404
 */
export function requireFeatures(...features: (keyof ClientFeatures)[]): void {
  const disabledFeatures = features.filter((f) => !isFeatureEnabled(f))

  if (disabledFeatures.length > 0) {
    console.log(
      `[FeatureGuard] Features disabled: ${disabledFeatures.join(', ')} - returning 404`,
    )
    notFound()
  }
}

/**
 * Require at least one feature to be enabled (OR logic)
 * At least one feature must be enabled, otherwise return 404
 */
export function requireAnyFeature(...features: (keyof ClientFeatures)[]): void {
  const hasEnabledFeature = features.some((f) => isFeatureEnabled(f))

  if (!hasEnabledFeature) {
    console.log(`[FeatureGuard] None of ${features.join(', ')} enabled - returning 404`)
    notFound()
  }
}

/**
 * Check if a feature is enabled (non-throwing version)
 * Use for conditional rendering in components
 */
export function hasFeature(feature: keyof ClientFeatures): boolean {
  return isFeatureEnabled(feature)
}

/**
 * Get route to feature mapping
 * Used to automatically protect routes based on path
 */
export function getRouteFeatureMap(): Record<string, keyof ClientFeatures> {
  return {
    '/vendors': 'vendors',
    '/vendors/[slug]': 'vendors',
    '/workshops': 'workshops',
    '/blog': 'blog',
    '/blog/[category]': 'blog',
    '/blog/[category]/[slug]': 'blog',
    '/cart': 'cart',
    '/checkout': 'checkout',
    '/shop': 'shop',
    '/shop/[slug]': 'shop',
    '/account': 'authentication',
    '/my-account': 'authentication',
    '/login': 'authentication',
    '/register': 'authentication',
  }
}
