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
 * Parent-child feature relationships
 * Sub-features require their parent to be enabled
 */
const PARENT_FEATURES: Record<string, keyof ClientFeatures> = {
  // Shop sub-features
  volume_pricing: 'shop',
  compare_products: 'shop',
  quick_order: 'shop',
  brands: 'shop',
  recently_viewed: 'shop',

  // Cart sub-features
  mini_cart: 'cart',
  free_shipping_bar: 'cart',

  // Checkout sub-features
  guest_checkout: 'checkout',
  invoices: 'checkout',
  order_tracking: 'checkout',

  // My Account sub-features
  returns: 'myAccount',
  recurring_orders: 'myAccount',
  order_lists: 'myAccount',
  addresses: 'myAccount',
  account_invoices: 'myAccount',
  notifications: 'myAccount',

  // B2B sub-features
  customer_groups: 'b2b',
  group_pricing: 'b2b',
  barcode_scanner: 'b2b',

  // Marketplace sub-features
  vendor_reviews: 'vendors',
  workshops: 'vendors',
}

/**
 * Require a feature to be enabled, otherwise return 404
 * Use in Server Components (page.tsx)
 *
 * Automatically checks parent feature if this is a sub-feature
 */
export function requireFeature(feature: keyof ClientFeatures | string): void {
  // Convert camelCase to snake_case for lookup
  const featureKey = feature
    .toString()
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')

  // Check parent feature first (if this is a sub-feature)
  const parentFeature = PARENT_FEATURES[featureKey]
  if (parentFeature && !isFeatureEnabled(parentFeature.toString())) {
    console.log(
      `[FeatureGuard] Parent feature '${parentFeature}' is disabled for '${feature}' - returning 404`,
    )
    notFound()
  }

  // Check the feature itself
  if (!isFeatureEnabled(feature.toString())) {
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
