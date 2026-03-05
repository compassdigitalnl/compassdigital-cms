/**
 * Ecommerce Branch
 *
 * Vertical slice containing all ecommerce-related collections, components, and logic.
 * Collections organized by subdomain: orders/, loyalty/, subscriptions/, etc.
 */

// Product Management
export { default as Products } from './collections/products'
export { default as ProductCategories } from './collections/catalog/ProductCategories'
export { default as Brands } from './collections/catalog/Brands'
export { default as RecentlyViewed } from './collections/catalog/RecentlyViewed'
export { default as CustomerGroups } from './collections/customers/CustomerGroups'

// Orders & Fulfillment
export { default as Orders } from './collections/orders/Orders'
export { default as OrderLists } from './collections/orders/OrderLists'
export { default as Invoices } from './collections/orders/Invoices'
export { default as Returns } from './collections/orders/Returns'
export { default as RecurringOrders } from './collections/orders/RecurringOrders'

// Subscriptions
export { default as SubscriptionPlans } from './collections/subscriptions/SubscriptionPlans'
export { default as UserSubscriptions } from './collections/subscriptions/UserSubscriptions'

// Checkout & Payment
export { default as PaymentMethods } from './collections/checkout/PaymentMethods'

// Marketing
export { default as GiftVouchers } from './collections/marketing/GiftVouchers'

// Licenses
export { default as Licenses } from './collections/licenses/Licenses'
export { default as LicenseActivations } from './collections/licenses/LicenseActivations'

// Loyalty
export { default as LoyaltyTiers } from './collections/loyalty/LoyaltyTiers'
export { default as LoyaltyRewards } from './collections/loyalty/LoyaltyRewards'

// Cart (external module)
export { Carts } from '../../../packages/modules/cart/collections/Carts'

// Export branch metadata
export const branchMetadata = {
  name: 'ecommerce',
  collections: [
    'Products', 'ProductCategories', 'Orders', 'Carts', 'CustomerGroups',
    'Brands', 'Invoices', 'RecentlyViewed', 'Returns', 'RecurringOrders',
    'OrderLists', 'SubscriptionPlans', 'UserSubscriptions', 'PaymentMethods',
    'GiftVouchers', 'Licenses', 'LicenseActivations', 'LoyaltyTiers', 'LoyaltyRewards',
  ],
  featureFlag: 'ENABLE_ECOMMERCE',
} as const
