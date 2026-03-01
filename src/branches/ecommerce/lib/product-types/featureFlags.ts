/**
 * Product Types Feature Flags
 * Centralized feature flag management for conditional loading
 *
 * Usage:
 * - Set environment variables in .env to enable/disable features
 * - Import PRODUCT_TYPE_FLAGS to check if a feature is enabled
 * - Use conditional exports to reduce bundle size
 */

export const PRODUCT_TYPE_FLAGS = {
  VARIABLE_PRODUCTS: process.env.ENABLE_VARIABLE_PRODUCTS === 'true',
  PERSONALIZATION: process.env.ENABLE_PERSONALIZATION === 'true',
  CONFIGURATOR: process.env.ENABLE_CONFIGURATOR === 'true',
  SUBSCRIPTIONS: process.env.ENABLE_SUBSCRIPTIONS === 'true',
  BUNDLES: process.env.ENABLE_BUNDLES === 'true',
  MIX_MATCH: process.env.ENABLE_MIX_MATCH === 'true',
} as const

export type ProductTypeFeature = keyof typeof PRODUCT_TYPE_FLAGS

/**
 * Check if a specific product type feature is enabled
 */
export function isFeatureEnabled(feature: ProductTypeFeature): boolean {
  return PRODUCT_TYPE_FLAGS[feature]
}

/**
 * Get list of all enabled features
 */
export function getEnabledFeatures(): ProductTypeFeature[] {
  return Object.entries(PRODUCT_TYPE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([feature]) => feature as ProductTypeFeature)
}

/**
 * Get list of all disabled features
 */
export function getDisabledFeatures(): ProductTypeFeature[] {
  return Object.entries(PRODUCT_TYPE_FLAGS)
    .filter(([_, enabled]) => !enabled)
    .map(([feature]) => feature as ProductTypeFeature)
}

/**
 * React hook for checking feature flags in components
 * Note: This is NOT a React hook (doesn't use useState/useEffect)
 * Just a helper function that can be called in components
 */
export function useProductTypeFeature(feature: ProductTypeFeature): boolean {
  return PRODUCT_TYPE_FLAGS[feature]
}

/**
 * Get human-readable feature names
 */
export function getFeatureName(feature: ProductTypeFeature): string {
  const names: Record<ProductTypeFeature, string> = {
    VARIABLE_PRODUCTS: 'Variable Products (maten/kleuren)',
    PERSONALIZATION: 'Personalisatie (graveren, monogrammen)',
    CONFIGURATOR: 'Product Configurator (multi-step)',
    SUBSCRIPTIONS: 'Abonnementen',
    BUNDLES: 'Product Bundels',
    MIX_MATCH: 'Mix & Match Boxes',
  }
  return names[feature]
}

/**
 * Get estimated bundle size impact for each feature (KB)
 */
export function getFeatureBundleSize(feature: ProductTypeFeature): number {
  const sizes: Record<ProductTypeFeature, number> = {
    VARIABLE_PRODUCTS: 120, // VP01-VP13 components
    PERSONALIZATION: 80, // PP01-PP08 components
    CONFIGURATOR: 150, // PC01-PC08 components
    SUBSCRIPTIONS: 40, // Subscription components
    BUNDLES: 30, // Bundle components
    MIX_MATCH: 60, // Mix & Match components
  }
  return sizes[feature]
}

/**
 * Get total bundle size for all enabled features
 */
export function getTotalBundleSize(): number {
  return getEnabledFeatures().reduce((total, feature) => {
    return total + getFeatureBundleSize(feature)
  }, 0)
}

/**
 * Log enabled features (useful for debugging)
 */
export function logEnabledFeatures(): void {
  const enabled = getEnabledFeatures()
  const totalSize = getTotalBundleSize()

  console.log('🚩 Product Type Features:')
  console.log(`  ✅ Enabled: ${enabled.length}/${Object.keys(PRODUCT_TYPE_FLAGS).length}`)

  enabled.forEach(feature => {
    const size = getFeatureBundleSize(feature)
    console.log(`    - ${getFeatureName(feature)} (~${size}KB)`)
  })

  console.log(`  📦 Total Bundle Size: ~${totalSize}KB`)

  const disabled = getDisabledFeatures()
  if (disabled.length > 0) {
    console.log(`  ❌ Disabled: ${disabled.length}`)
    disabled.forEach(feature => {
      console.log(`    - ${getFeatureName(feature)}`)
    })
  }
}

// Auto-log on import (only in development)
if (process.env.NODE_ENV === 'development') {
  logEnabledFeatures()
}
