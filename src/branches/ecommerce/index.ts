/**
 * Ecommerce Branch
 *
 * Vertical slice containing all ecommerce-related collections, components, and logic.
 * Collections organized by subdomain: orders/, loyalty/, subscriptions/, etc.
 */

// Product Management (shared)
export { default as Products } from './shared/collections/products'
export { default as ProductCategories } from './shared/collections/catalog/ProductCategories'
export { default as Brands } from './shared/collections/catalog/Brands'
export { default as RecentlyViewed } from './shared/collections/catalog/RecentlyViewed'
export { default as CustomerGroups } from './shared/collections/customers/CustomerGroups'

// Orders & Fulfillment (shared + b2b)
export { default as Orders } from './shared/collections/orders/Orders'
export { default as OrderLists } from './b2b/collections/orders/OrderLists'
export { default as Invoices } from './shared/collections/orders/Invoices'
export { default as Returns } from './shared/collections/orders/Returns'
export { default as RecurringOrders } from './b2b/collections/orders/RecurringOrders'

// Subscriptions (shared)
export { default as SubscriptionPlans } from './shared/collections/subscriptions/SubscriptionPlans'
export { default as UserSubscriptions } from './shared/collections/subscriptions/UserSubscriptions'

// Checkout & Payment (shared)
export { default as PaymentMethods } from './shared/collections/checkout/PaymentMethods'

// Marketing (b2c)
export { default as GiftVouchers } from './b2c/collections/marketing/GiftVouchers'

// Licenses (b2b)
export { default as Licenses } from './b2b/collections/licenses/Licenses'
export { default as LicenseActivations } from './b2b/collections/licenses/LicenseActivations'

// Loyalty (b2c) — LoyaltyPoints merged into Users, LoyaltyRedemptions merged into LoyaltyTransactions
export { default as LoyaltyTiers } from './b2c/collections/loyalty/LoyaltyTiers'
export { default as LoyaltyRewards } from './b2c/collections/loyalty/LoyaltyRewards'
export { LoyaltyTransactions } from './b2c/collections/loyalty/LoyaltyTransactions'

// Cart & Addresses
export { Carts } from './shared/collections/checkout/Carts'
export { Addresses } from './shared/collections/customers/Addresses'

// Export branch metadata
export const branchMetadata = {
  name: 'ecommerce',
  collections: [
    'Products', 'ProductCategories', 'Orders', 'Carts', 'CustomerGroups',
    'Brands', 'Invoices', 'RecentlyViewed', 'Returns', 'RecurringOrders',
    'OrderLists', 'SubscriptionPlans', 'UserSubscriptions', 'PaymentMethods',
    'GiftVouchers', 'Licenses', 'LicenseActivations',
    'LoyaltyTiers', 'LoyaltyRewards', 'LoyaltyTransactions',
  ],
  featureFlag: 'ENABLE_ECOMMERCE',
} as const
