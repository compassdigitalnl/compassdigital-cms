/**
 * Ecommerce Branch Blocks — Barrel Export
 *
 * All e-commerce specific blocks. These are feature-gated
 * and only available when the shop feature is enabled.
 */

// ── B-13: Product Grid ─────────────────────────────────────────────
export { ProductGrid } from './ProductGrid'

// ── B-14: Product Embed ─────────────────────────────────────────────
export { ProductEmbed } from './ProductEmbed'

// ── B-15: Category Grid ─────────────────────────────────────────────
export { CategoryGrid } from './CategoryGrid'

// ── B-16: Pricing ───────────────────────────────────────────────────
export { Pricing } from './Pricing'

// ── B-17: Subscription Pricing ──────────────────────────────────────
export { SubscriptionPricing } from './SubscriptionPricing'

// ── B-18: Quick Order ───────────────────────────────────────────────
export { QuickOrder } from './QuickOrder'

// ── B-19: Staffel Pricing ───────────────────────────────────────────
export { StaffelPricing } from './StaffelPricing'

// ── B-20: Bundle Builder ────────────────────────────────────────────
export { BundleBuilder } from './BundleBuilder'

// ── B-23: Subscription Options ──────────────────────────────────────
export { SubscriptionOptions } from './SubscriptionOptions'

// ── B-26: Vendor Showcase ───────────────────────────────────────────
export { VendorShowcase } from './VendorShowcase'

// ── Comparison Table (existing) ─────────────────────────────────────
export { ComparisonTable } from './ComparisonTable'

// ── B-17c: Pricing Gradient Featured ─────────────────────────────────
export { PricingGradient } from './PricingGradient'

/**
 * All ecommerce blocks as an array for use in Payload config blocks arrays.
 * Usage: blocks: [...ecommerceBlocks]
 */
import { ProductGrid } from './ProductGrid'
import { ProductEmbed } from './ProductEmbed'
import { CategoryGrid } from './CategoryGrid'
import { Pricing } from './Pricing'
import { SubscriptionPricing } from './SubscriptionPricing'
import { QuickOrder } from './QuickOrder'
import { StaffelPricing } from './StaffelPricing'
import { BundleBuilder } from './BundleBuilder'
import { SubscriptionOptions } from './SubscriptionOptions'
import { VendorShowcase } from './VendorShowcase'
import { ComparisonTable } from './ComparisonTable'
import { PricingGradient } from './PricingGradient'

export const ecommerceBlocks = [
  ProductGrid,
  ProductEmbed,
  CategoryGrid,
  Pricing,
  SubscriptionPricing,
  QuickOrder,
  StaffelPricing,
  BundleBuilder,
  SubscriptionOptions,
  VendorShowcase,
  ComparisonTable,
  PricingGradient,
]

export const ecommerceBlockSlugs = [
  'productGrid',
  'productEmbed',
  'categoryGrid',
  'pricing',
  'subscriptionPricing',
  'quickOrder',
  'staffelPricing',
  'bundleBuilder',
  'subscriptionOptions',
  'vendorShowcase',
  'comparisontable',
  'pricingGradient',
] as const
