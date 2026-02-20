/**
 * Feature Toggle System
 *
 * Phase 1: ENV-based feature toggles (current)
 * Phase 2: Settings global integration (future)
 *
 * See docs/FEATURES_MANAGEMENT_GUIDE.md for complete documentation
 */

/**
 * Check if a feature is enabled via environment variables
 *
 * @param feature - Feature name (e.g., 'shop', 'vendors', 'workshops')
 * @returns true if enabled (default), false if explicitly disabled
 */
export function isFeatureEnabled(feature: string): boolean {
  const envVar = `ENABLE_${feature.toUpperCase()}`
  const value = process.env[envVar]

  // Default to true if not explicitly set to 'false'
  // This ensures backward compatibility - all features enabled by default
  return value !== 'false'
}

/**
 * Convenience object for common feature checks
 *
 * Usage:
 * - if (features.shop) { ... }
 * - if (features.vendors) { ... }
 */
export const features = {
  // E-commerce
  shop: isFeatureEnabled('shop'),
  cart: isFeatureEnabled('cart'),
  checkout: isFeatureEnabled('checkout'),
  wishlists: isFeatureEnabled('wishlists'),
  productReviews: isFeatureEnabled('product_reviews'),

  // Marketplace (Sprint 5)
  vendors: isFeatureEnabled('vendors'),
  vendorReviews: isFeatureEnabled('vendor_reviews'),
  workshops: isFeatureEnabled('workshops'),

  // Content
  blog: isFeatureEnabled('blog'),
  faq: isFeatureEnabled('faq'),
  testimonials: isFeatureEnabled('testimonials'),
  cases: isFeatureEnabled('cases'),

  // Advanced
  multiLanguage: isFeatureEnabled('multi_language'),
  aiContent: isFeatureEnabled('ai_content'),
  platform: isFeatureEnabled('platform'),
} as const

/**
 * Feature categories for grouping
 */
export const featureCategories = {
  ecommerce: ['shop', 'cart', 'checkout', 'wishlists', 'productReviews'],
  marketplace: ['vendors', 'vendorReviews', 'workshops'],
  content: ['blog', 'faq', 'testimonials', 'cases'],
  advanced: ['multiLanguage', 'aiContent', 'platform'],
} as const

/**
 * Get all enabled features
 */
export function getEnabledFeatures(): string[] {
  return Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature)
}

/**
 * Check if any features in a category are enabled
 */
export function isCategoryEnabled(category: keyof typeof featureCategories): boolean {
  const categoryFeatures = featureCategories[category]
  return categoryFeatures.some((feature) => features[feature as keyof typeof features])
}
