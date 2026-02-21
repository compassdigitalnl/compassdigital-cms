/**
 * Feature Toggle System (Multi-Level)
 *
 * Level 1: Client-specific features (database) — highest priority
 * Level 2: ENV variables — fallback
 * Level 3: Defaults — final fallback
 *
 * Architecture:
 * - Platform CMS (cms.compassdigital.nl): Admins manage features per client
 * - Client deployments (plastimed01.compassdigital.nl): Use ENV from provisioning
 * - ENV variables generated during provisioning based on client.features
 *
 * See docs/FEATURES_MANAGEMENT_GUIDE.md for complete documentation
 */

import { isClientDeployment } from './isClientDeployment'
import type { Payload } from 'payload'

/**
 * Client Features interface (matches Clients.features group)
 */
export interface ClientFeatures {
  // E-commerce
  shop?: boolean
  cart?: boolean
  checkout?: boolean
  wishlists?: boolean
  productReviews?: boolean
  customerGroups?: boolean

  // Marketplace (Sprint 5)
  vendors?: boolean
  vendorReviews?: boolean
  workshops?: boolean

  // Sprint 6 Features
  subscriptions?: boolean
  giftVouchers?: boolean
  licenses?: boolean
  loyalty?: boolean

  // Content
  blog?: boolean
  faq?: boolean
  testimonials?: boolean
  cases?: boolean
  partners?: boolean
  brands?: boolean
  services?: boolean
  orderLists?: boolean

  // Advanced
  multiLanguage?: boolean
  aiContent?: boolean
  authentication?: boolean
}

/**
 * Get client features from database
 * Only used in platform CMS to check client-specific feature flags
 */
export async function getClientFeatures(
  payload: Payload,
  clientId: string,
): Promise<ClientFeatures> {
  try {
    const client = await payload.findByID({
      collection: 'clients',
      id: clientId,
    })

    return client.features || {}
  } catch (error) {
    console.error('[Features] Failed to get client features:', error)
    return {}
  }
}

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
 * Check if a feature is enabled for a specific client (database-driven)
 * Fallback to ENV if client features not found
 */
export async function isFeatureEnabledForClient(
  payload: Payload,
  clientId: string,
  feature: keyof ClientFeatures,
): Promise<boolean> {
  const clientFeatures = await getClientFeatures(payload, clientId)

  // If client has explicit setting, use it
  if (typeof clientFeatures[feature] === 'boolean') {
    return clientFeatures[feature]!
  }

  // Fallback to ENV
  return isFeatureEnabled(feature)
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

  // Sprint 6
  subscriptions: isFeatureEnabled('subscriptions'),
  giftVouchers: isFeatureEnabled('gift_vouchers'),
  licenses: isFeatureEnabled('licenses'),
  loyalty: isFeatureEnabled('loyalty'),

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
  sprint6: ['subscriptions', 'giftVouchers', 'licenses', 'loyalty'],
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

/**
 * Generate ENV variables for client deployment based on features
 * Used during provisioning to create .env file for client
 */
export function generateFeatureEnvVars(clientFeatures: ClientFeatures): Record<string, string> {
  const envVars: Record<string, string> = {}

  // Map client features to ENV variables
  const featureMap: Record<keyof ClientFeatures, string> = {
    shop: 'ENABLE_SHOP',
    cart: 'ENABLE_CART',
    checkout: 'ENABLE_CHECKOUT',
    wishlists: 'ENABLE_WISHLISTS',
    productReviews: 'ENABLE_PRODUCT_REVIEWS',
    customerGroups: 'ENABLE_CUSTOMER_GROUPS',
    vendors: 'ENABLE_VENDORS',
    vendorReviews: 'ENABLE_VENDOR_REVIEWS',
    workshops: 'ENABLE_WORKSHOPS',
    subscriptions: 'ENABLE_SUBSCRIPTIONS',
    giftVouchers: 'ENABLE_GIFT_VOUCHERS',
    licenses: 'ENABLE_LICENSES',
    loyalty: 'ENABLE_LOYALTY',
    blog: 'ENABLE_BLOG',
    faq: 'ENABLE_FAQ',
    testimonials: 'ENABLE_TESTIMONIALS',
    cases: 'ENABLE_CASES',
    partners: 'ENABLE_PARTNERS',
    brands: 'ENABLE_BRANDS',
    services: 'ENABLE_SERVICES',
    orderLists: 'ENABLE_ORDER_LISTS',
    multiLanguage: 'ENABLE_MULTI_LANGUAGE',
    aiContent: 'ENABLE_AI_CONTENT',
    authentication: 'ENABLE_AUTHENTICATION',
  }

  // Generate ENV vars from client features
  for (const [feature, envVar] of Object.entries(featureMap)) {
    const featureKey = feature as keyof ClientFeatures
    const value = clientFeatures[featureKey]

    if (typeof value === 'boolean') {
      envVars[envVar] = String(value)
    }
  }

  return envVars
}

/**
 * Get collection slug to feature mapping
 * Used to determine which collections should be hidden based on features
 */
export function getCollectionFeatureMap(): Record<string, keyof ClientFeatures> {
  return {
    // E-commerce
    products: 'shop',
    'product-categories': 'shop',
    brands: 'brands',
    orders: 'checkout',
    'customer-groups': 'customerGroups',
    'order-lists': 'orderLists',

    // Marketplace (Sprint 5)
    vendors: 'vendors',
    'vendor-reviews': 'vendorReviews',
    workshops: 'workshops',

    // Sprint 6 - Subscriptions
    'subscription-plans': 'subscriptions',
    'user-subscriptions': 'subscriptions',
    'payment-methods': 'subscriptions',

    // Sprint 6 - Gift Vouchers
    'gift-vouchers': 'giftVouchers',

    // Sprint 6 - Licenses
    licenses: 'licenses',
    'license-activations': 'licenses',

    // Sprint 6 - Loyalty Program
    'loyalty-tiers': 'loyalty',
    'loyalty-rewards': 'loyalty',
    'loyalty-points': 'loyalty',
    'loyalty-transactions': 'loyalty',
    'loyalty-redemptions': 'loyalty',

    // Content
    'blog-posts': 'blog',
    faqs: 'faq',
    testimonials: 'testimonials',
    cases: 'cases',
    partners: 'partners',
    services: 'services',

    // Users
    users: 'authentication',
  }
}

/**
 * Check if a collection should be visible based on features
 * Used in payload.config.ts to conditionally hide collections
 */
export function isCollectionVisible(
  collectionSlug: string,
  clientFeatures?: ClientFeatures,
): boolean {
  const featureMap = getCollectionFeatureMap()
  const requiredFeature = featureMap[collectionSlug]

  // If no feature requirement, always visible
  if (!requiredFeature) return true

  // If client features provided, check them
  if (clientFeatures) {
    return clientFeatures[requiredFeature] !== false
  }

  // Fallback to ENV check
  return isFeatureEnabled(requiredFeature)
}
