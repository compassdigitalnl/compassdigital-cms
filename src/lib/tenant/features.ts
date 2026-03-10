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
 * Organized hierarchically: parent features and their sub-features
 */
export interface ClientFeatures {
  // === SHOP (top-level) ===
  shop?: boolean
  // Shop sub-features
  volumePricing?: boolean
  compareProducts?: boolean
  quickOrder?: boolean
  recentlyViewed?: boolean
  variableProducts?: boolean
  mixAndMatch?: boolean
  bookableProducts?: boolean
  bundleProducts?: boolean
  configuratorProducts?: boolean
  personalizedProducts?: boolean
  editionNotifications?: boolean
  globalVolumePricing?: boolean

  // === CART (top-level) ===
  cart?: boolean
  // Cart sub-features
  miniCart?: boolean
  freeShippingBar?: boolean

  // === CHECKOUT (top-level) ===
  checkout?: boolean
  // Checkout sub-features
  guestCheckout?: boolean
  invoices?: boolean
  orderTracking?: boolean
  discounts?: boolean

  // === MY ACCOUNT (top-level) ===
  myAccount?: boolean
  // My Account sub-features
  returns?: boolean
  recurringOrders?: boolean
  orderLists?: boolean
  addresses?: boolean
  accountInvoices?: boolean
  notifications?: boolean

  // === B2B (top-level) ===
  b2b?: boolean
  // B2B sub-features
  customerGroups?: boolean
  groupPricing?: boolean
  barcodeScanner?: boolean
  companyAccounts?: boolean
  approvalWorkflow?: boolean
  budgetLimits?: boolean
  creditLimit?: boolean

  // === MARKETPLACE (top-level) ===
  vendors?: boolean
  // Marketplace sub-features
  vendorReviews?: boolean
  workshops?: boolean

  // === SPRINT 6 (top-level) ===
  subscriptions?: boolean
  subscriptionManagement?: boolean
  subscriptionPages?: boolean
  giftVouchers?: boolean
  licenses?: boolean
  loyalty?: boolean

  // === CATALOG ===
  catalogBranches?: boolean

  // === PUBLISHING ===
  magazines?: boolean

  // === CONTENT ===
  blog?: boolean
  faq?: boolean
  testimonials?: boolean
  cases?: boolean
  partners?: boolean
  brands?: boolean
  services?: boolean
  wishlists?: boolean

  // === INDUSTRY BRANCHES ===
  construction?: boolean
  hospitality?: boolean
  beauty?: boolean
  realEstate?: boolean
  professionalServices?: boolean
  tourism?: boolean

  // === ADVANCED ===
  multiLanguage?: boolean
  aiContent?: boolean
  search?: boolean
  newsletter?: boolean
  authentication?: boolean
  chatbot?: boolean
  abTesting?: boolean

  // === EMAIL MARKETING ===
  emailMarketing?: boolean
  // Email Marketing sub-features
  emailCampaigns?: boolean
  emailAutomation?: boolean
  emailFlows?: boolean
  emailGrapesEditor?: boolean
  emailDeliverability?: boolean
  emailAnalytics?: boolean

  // === PWA ===
  pushNotifications?: boolean

  // Legacy - keeping for backwards compatibility
  productReviews?: boolean
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

    // Convert null values to undefined to match ClientFeatures type
    const features = client.features || {}
    const cleanedFeatures: ClientFeatures = {}
    for (const [key, value] of Object.entries(features)) {
      if (value !== null) {
        cleanedFeatures[key as keyof ClientFeatures] = value as any
      }
    }
    return cleanedFeatures
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
 * Check if sub-feature is enabled.
 * Sub-feature is only enabled if BOTH the parent AND the sub-feature are enabled.
 *
 * @param parent - Parent feature name (e.g., 'shop', 'my_account')
 * @param child - Sub-feature name (e.g., 'volume_pricing', 'returns')
 * @returns true if both parent and child are enabled
 */
export function isSubFeatureEnabled(parent: string, child: string): boolean {
  return isFeatureEnabled(parent) && isFeatureEnabled(child)
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
 * - if (features.volumePricing) { ... }
 */
export const features = {
  // === SHOP ===
  shop: isFeatureEnabled('shop'),
  volumePricing: isFeatureEnabled('volume_pricing'),
  compareProducts: isFeatureEnabled('compare_products'),
  quickOrder: isFeatureEnabled('quick_order'),
  brands: isFeatureEnabled('brands'),
  recentlyViewed: isFeatureEnabled('recently_viewed'),
  variableProducts: isFeatureEnabled('variable_products'),
  mixAndMatch: isFeatureEnabled('mix_and_match'),
  bookableProducts: isFeatureEnabled('bookable_products'),
  bundleProducts: isFeatureEnabled('bundle_products'),
  configuratorProducts: isFeatureEnabled('configurator_products'),
  personalizedProducts: isFeatureEnabled('personalized_products'),
  editionNotifications: isFeatureEnabled('edition_notifications'),
  globalVolumePricing: isFeatureEnabled('global_volume_pricing'),

  // === CART ===
  cart: isFeatureEnabled('cart'),
  miniCart: isFeatureEnabled('mini_cart'),
  freeShippingBar: isFeatureEnabled('free_shipping_bar'),

  // === CHECKOUT ===
  checkout: isFeatureEnabled('checkout'),
  guestCheckout: isFeatureEnabled('guest_checkout'),
  invoices: isFeatureEnabled('invoices'),
  orderTracking: isFeatureEnabled('order_tracking'),
  discounts: isFeatureEnabled('discounts'),

  // === MY ACCOUNT ===
  myAccount: isFeatureEnabled('my_account'),
  returns: isFeatureEnabled('returns'),
  recurringOrders: isFeatureEnabled('recurring_orders'),
  orderLists: isFeatureEnabled('order_lists'),
  addresses: isFeatureEnabled('addresses'),
  accountInvoices: isFeatureEnabled('account_invoices'),
  notifications: isFeatureEnabled('notifications'),

  // === B2B ===
  b2b: isFeatureEnabled('b2b'),
  customerGroups: isFeatureEnabled('customer_groups'),
  groupPricing: isFeatureEnabled('group_pricing'),
  barcodeScanner: isFeatureEnabled('barcode_scanner'),
  companyAccounts: isFeatureEnabled('company_accounts'),
  approvalWorkflow: isFeatureEnabled('approval_workflow'),
  budgetLimits: isFeatureEnabled('budget_limits'),
  creditLimit: isFeatureEnabled('credit_limit'),

  // === MARKETPLACE ===
  vendors: isFeatureEnabled('vendors'),
  vendorReviews: isFeatureEnabled('vendor_reviews'),
  workshops: isFeatureEnabled('workshops'),

  // === SPRINT 6 ===
  subscriptions: isFeatureEnabled('subscriptions'),
  subscriptionManagement: isFeatureEnabled('subscription_management'),
  subscriptionPages: isFeatureEnabled('subscription_pages'),
  giftVouchers: isFeatureEnabled('gift_vouchers'),
  licenses: isFeatureEnabled('licenses'),
  loyalty: isFeatureEnabled('loyalty'),

  // === CATALOG ===
  catalogBranches: isFeatureEnabled('catalog_branches'),

  // === PUBLISHING ===
  magazines: isFeatureEnabled('magazines'),

  // === CONTENT ===
  blog: isFeatureEnabled('blog'),
  faq: isFeatureEnabled('faq'),
  testimonials: isFeatureEnabled('testimonials'),
  cases: isFeatureEnabled('cases'),
  partners: isFeatureEnabled('partners'),
  services: isFeatureEnabled('services'),
  wishlists: isFeatureEnabled('wishlists'),

  // === INDUSTRY BRANCHES ===
  construction: isFeatureEnabled('construction'),
  hospitality: isFeatureEnabled('hospitality'),
  beauty: isFeatureEnabled('beauty'),
  realEstate: isFeatureEnabled('real_estate'),
  professionalServices: isFeatureEnabled('professional_services'),
  tourism: isFeatureEnabled('tourism'),

  // === ADVANCED ===
  multiLanguage: isFeatureEnabled('multi_language'),
  aiContent: isFeatureEnabled('ai_content'),
  search: isFeatureEnabled('search'),
  newsletter: isFeatureEnabled('newsletter'),
  platform: isFeatureEnabled('platform'),
  authentication: isFeatureEnabled('authentication'),
  chatbot: isFeatureEnabled('chatbot'),
  abTesting: isFeatureEnabled('ab_testing'),

  // === EMAIL MARKETING ===
  emailMarketing: isFeatureEnabled('email_marketing'),
  emailCampaigns: isFeatureEnabled('email_campaigns'),
  emailAutomation: isFeatureEnabled('email_automation'),
  emailFlows: isFeatureEnabled('email_flows'),
  emailGrapesEditor: isFeatureEnabled('email_grapes_editor'),
  emailDeliverability: isFeatureEnabled('email_deliverability'),
  emailAnalytics: isFeatureEnabled('email_analytics'),

  // === PWA ===
  pushNotifications: isFeatureEnabled('push_notifications'),

  // Legacy
  productReviews: isFeatureEnabled('product_reviews'),
} as const

/**
 * Feature categories for grouping
 */
export const featureCategories = {
  shop: [
    'shop',
    'volumePricing',
    'compareProducts',
    'quickOrder',
    'brands',
    'recentlyViewed',
    'variableProducts',
    'mixAndMatch',
    'bookableProducts',
    'bundleProducts',
    'configuratorProducts',
    'personalizedProducts',
    'editionNotifications',
    'globalVolumePricing',
  ],
  cart: ['cart', 'miniCart', 'freeShippingBar'],
  checkout: ['checkout', 'guestCheckout', 'invoices', 'orderTracking'],
  myAccount: [
    'myAccount',
    'returns',
    'recurringOrders',
    'orderLists',
    'addresses',
    'accountInvoices',
    'notifications',
  ],
  b2b: ['b2b', 'customerGroups', 'groupPricing', 'barcodeScanner', 'companyAccounts', 'approvalWorkflow', 'budgetLimits', 'creditLimit'],
  marketplace: ['vendors', 'vendorReviews', 'workshops'],
  sprint6: ['subscriptions', 'subscriptionManagement', 'subscriptionPages', 'giftVouchers', 'licenses', 'loyalty'],
  catalog: ['catalogBranches'],
  publishing: ['magazines'],
  content: ['blog', 'faq', 'testimonials', 'cases', 'partners', 'services', 'wishlists'],
  advanced: ['multiLanguage', 'aiContent', 'search', 'newsletter', 'platform', 'authentication', 'chatbot', 'abTesting'],
  emailMarketing: ['emailMarketing', 'emailCampaigns', 'emailAutomation', 'emailFlows', 'emailGrapesEditor', 'emailDeliverability', 'emailAnalytics'],
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
    // === SHOP ===
    shop: 'ENABLE_SHOP',
    volumePricing: 'ENABLE_VOLUME_PRICING',
    compareProducts: 'ENABLE_COMPARE_PRODUCTS',
    quickOrder: 'ENABLE_QUICK_ORDER',
    recentlyViewed: 'ENABLE_RECENTLY_VIEWED',
    variableProducts: 'ENABLE_VARIABLE_PRODUCTS',
    mixAndMatch: 'ENABLE_MIX_AND_MATCH',
    bookableProducts: 'ENABLE_BOOKABLE_PRODUCTS',
    bundleProducts: 'ENABLE_BUNDLE_PRODUCTS',
    configuratorProducts: 'ENABLE_CONFIGURATOR_PRODUCTS',
    personalizedProducts: 'ENABLE_PERSONALIZED_PRODUCTS',
    editionNotifications: 'ENABLE_EDITION_NOTIFICATIONS',
    globalVolumePricing: 'ENABLE_GLOBAL_VOLUME_PRICING',

    // === CART ===
    cart: 'ENABLE_CART',
    miniCart: 'ENABLE_MINI_CART',
    freeShippingBar: 'ENABLE_FREE_SHIPPING_BAR',

    // === CHECKOUT ===
    checkout: 'ENABLE_CHECKOUT',
    guestCheckout: 'ENABLE_GUEST_CHECKOUT',
    invoices: 'ENABLE_INVOICES',
    orderTracking: 'ENABLE_ORDER_TRACKING',
    discounts: 'ENABLE_DISCOUNTS',

    // === MY ACCOUNT ===
    myAccount: 'ENABLE_MY_ACCOUNT',
    returns: 'ENABLE_RETURNS',
    recurringOrders: 'ENABLE_RECURRING_ORDERS',
    orderLists: 'ENABLE_ORDER_LISTS',
    addresses: 'ENABLE_ADDRESSES',
    accountInvoices: 'ENABLE_ACCOUNT_INVOICES',
    notifications: 'ENABLE_NOTIFICATIONS',

    // === B2B ===
    b2b: 'ENABLE_B2B',
    customerGroups: 'ENABLE_CUSTOMER_GROUPS',
    groupPricing: 'ENABLE_GROUP_PRICING',
    barcodeScanner: 'ENABLE_BARCODE_SCANNER',
    companyAccounts: 'ENABLE_COMPANY_ACCOUNTS',
    approvalWorkflow: 'ENABLE_APPROVAL_WORKFLOW',
    budgetLimits: 'ENABLE_BUDGET_LIMITS',
    creditLimit: 'ENABLE_CREDIT_LIMIT',

    // === MARKETPLACE ===
    vendors: 'ENABLE_VENDORS',
    vendorReviews: 'ENABLE_VENDOR_REVIEWS',
    workshops: 'ENABLE_WORKSHOPS',

    // === SPRINT 6 ===
    subscriptions: 'ENABLE_SUBSCRIPTIONS',
    subscriptionManagement: 'ENABLE_SUBSCRIPTION_MANAGEMENT',
    subscriptionPages: 'ENABLE_SUBSCRIPTION_PAGES',
    giftVouchers: 'ENABLE_GIFT_VOUCHERS',
    licenses: 'ENABLE_LICENSES',
    loyalty: 'ENABLE_LOYALTY',

    // === CATALOG ===
    catalogBranches: 'ENABLE_CATALOG_BRANCHES',

    // === PUBLISHING ===
    magazines: 'ENABLE_MAGAZINES',

    // === CONTENT ===
    blog: 'ENABLE_BLOG',
    faq: 'ENABLE_FAQ',
    testimonials: 'ENABLE_TESTIMONIALS',
    cases: 'ENABLE_CASES',
    partners: 'ENABLE_PARTNERS',
    brands: 'ENABLE_BRANDS',
    services: 'ENABLE_SERVICES',
    wishlists: 'ENABLE_WISHLISTS',

    // === INDUSTRY BRANCHES ===
    construction: 'ENABLE_CONSTRUCTION',
    hospitality: 'ENABLE_HOSPITALITY',
    beauty: 'ENABLE_BEAUTY',
    realEstate: 'ENABLE_REAL_ESTATE',
    professionalServices: 'ENABLE_PROFESSIONAL_SERVICES',
    tourism: 'ENABLE_TOURISM',

    // === ADVANCED ===
    multiLanguage: 'ENABLE_MULTI_LANGUAGE',
    aiContent: 'ENABLE_AI_CONTENT',
    search: 'ENABLE_SEARCH',
    newsletter: 'ENABLE_NEWSLETTER',
    authentication: 'ENABLE_AUTHENTICATION',
    chatbot: 'ENABLE_CHATBOT',
    abTesting: 'ENABLE_AB_TESTING',

    // === EMAIL MARKETING ===
    emailMarketing: 'ENABLE_EMAIL_MARKETING',
    emailCampaigns: 'ENABLE_EMAIL_CAMPAIGNS',
    emailAutomation: 'ENABLE_EMAIL_AUTOMATION',
    emailFlows: 'ENABLE_EMAIL_FLOWS',
    emailGrapesEditor: 'ENABLE_EMAIL_GRAPES_EDITOR',
    emailDeliverability: 'ENABLE_EMAIL_DELIVERABILITY',
    emailAnalytics: 'ENABLE_EMAIL_ANALYTICS',

    // === PWA ===
    pushNotifications: 'ENABLE_PUSH_NOTIFICATIONS',

    // Legacy
    productReviews: 'ENABLE_PRODUCT_REVIEWS',
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
    // === SHOP ===
    products: 'shop',
    'product-categories': 'shop',
    branches: 'catalogBranches',
    magazines: 'magazines',
    brands: 'brands',
    'recently-viewed': 'recentlyViewed',
    'edition-notifications': 'editionNotifications',

    // === CHECKOUT ===
    orders: 'checkout',
    invoices: 'invoices',
    // discount-codes merged into promotions

    // === MY ACCOUNT ===
    returns: 'returns',
    'recurring-orders': 'recurringOrders',
    'order-lists': 'orderLists',
    notifications: 'notifications',

    // === B2B ===
    'customer-groups': 'customerGroups',
    'company-invites': 'companyAccounts',
    'approval-requests': 'approvalWorkflow',

    // === MARKETPLACE ===
    vendors: 'vendors',
    'vendor-reviews': 'vendorReviews',
    workshops: 'workshops',

    // === SPRINT 6 ===
    'subscription-plans': 'subscriptionManagement',
    'subscription-pages': 'subscriptionPages',
    'user-subscriptions': 'subscriptionManagement',
    'payment-methods': 'subscriptionManagement',
    'gift-vouchers': 'giftVouchers',
    licenses: 'licenses',
    'license-activations': 'licenses',
    'loyalty-tiers': 'loyalty',
    'loyalty-rewards': 'loyalty',
    'loyalty-transactions': 'loyalty',

    // === CONTENT ===
    'blog-posts': 'blog',
    faqs: 'faq',
    testimonials: 'testimonials',
    cases: 'cases',
    partners: 'partners',
    services: 'services',

    // === INDUSTRY BRANCHES ===
    'construction-services': 'construction',
    'construction-projects': 'construction',
    'construction-reviews': 'construction',
    'quote-requests': 'construction',

    // === HOSPITALITY ===
    'treatments': 'hospitality',
    'practitioners': 'hospitality',
    'appointments': 'hospitality',

    // === USERS ===
    users: 'authentication',

    // === A/B TESTING ===
    'ab-tests': 'abTesting',
    'ab-test-results': 'abTesting',

    // === PWA ===
    'push-subscriptions': 'pushNotifications',
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

/**
 * Email Marketing Feature Helpers
 * Structured feature checks for email marketing module
 */
export const emailMarketingFeatures = {
  isEnabled: () => features.emailMarketing,
  campaigns: () => features.emailMarketing && features.emailCampaigns,
  automation: () => features.emailMarketing && features.emailAutomation,
  flows: () => features.emailMarketing && features.emailFlows,
  grapesEditor: () => features.emailMarketing && features.emailGrapesEditor,
  deliverability: () => features.emailMarketing && features.emailDeliverability,
  analytics: () => features.emailMarketing && features.emailAnalytics,
} as const
