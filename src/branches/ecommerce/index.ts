/**
 * Ecommerce Branch
 *
 * Vertical slice containing all ecommerce-related collections, components, and logic.
 *
 * Collections: Products, ProductCategories, Orders, Carts, CustomerGroups, Brands, Invoices, RecentlyViewed, Returns, RecurringOrders, OrderLists, SubscriptionPlans, UserSubscriptions, PaymentMethods, GiftVouchers, Licenses, LicenseActivations, LoyaltyTiers, LoyaltyRewards
 */

// Export all collections
export { default as Products } from './collections/Products'
export { default as ProductCategories } from './collections/ProductCategories'
export { default as Orders } from './collections/Orders'
export { default as Carts } from './collections/Carts'
export { default as CustomerGroups } from './collections/CustomerGroups'
export { default as Brands } from './collections/Brands'
export { default as Invoices } from './collections/Invoices'
export { default as RecentlyViewed } from './collections/RecentlyViewed'
export { default as Returns } from './collections/Returns'
export { default as RecurringOrders } from './collections/RecurringOrders'
export { default as OrderLists } from './collections/OrderLists'
export { default as SubscriptionPlans } from './collections/SubscriptionPlans'
export { default as UserSubscriptions } from './collections/UserSubscriptions'
export { default as PaymentMethods } from './collections/PaymentMethods'
export { default as GiftVouchers } from './collections/GiftVouchers'
export { default as Licenses } from './collections/Licenses'
export { default as LicenseActivations } from './collections/LicenseActivations'
export { default as LoyaltyTiers } from './collections/LoyaltyTiers'
export { default as LoyaltyRewards } from './collections/LoyaltyRewards'

// Export branch metadata
export const branchMetadata = {
  name: 'ecommerce',
  collections: [
  "Products",
  "ProductCategories",
  "Orders",
  "Carts",
  "CustomerGroups",
  "Brands",
  "Invoices",
  "RecentlyViewed",
  "Returns",
  "RecurringOrders",
  "OrderLists",
  "SubscriptionPlans",
  "UserSubscriptions",
  "PaymentMethods",
  "GiftVouchers",
  "Licenses",
  "LicenseActivations",
  "LoyaltyTiers",
  "LoyaltyRewards"
],
  featureFlag: 'ENABLE_ECOMMERCE',
} as const

// Export branch routes (to be implemented)
// export { routes } from './routes'
