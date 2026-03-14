/**
 * Publishing Templates Index
 */

// Magazine templates
export { default as MagazineArchiveTemplate } from './magazines/MagazineArchiveTemplate1'
export { default as MagazineDetailTemplate } from './magazines/MagazineDetailTemplate1'

// Subscription templates
export { default as SubscriptionPricingTemplate } from './subscription/SubscriptionPricingTemplate1'
export { default as SubscriptionCheckoutTemplate } from './subscription/SubscriptionCheckoutTemplate1'

// Type exports
export type { MagazineArchiveTemplate1Props as MagazineArchiveTemplateProps } from './magazines/MagazineArchiveTemplate1/types'
export type { MagazineDetailTemplate1Props as MagazineDetailTemplateProps } from './magazines/MagazineDetailTemplate1/types'
export type { SubscriptionPricingTemplate1Props as SubscriptionPricingTemplateProps } from './subscription/SubscriptionPricingTemplate1/types'
export type { SubscriptionCheckoutTemplate1Props as SubscriptionCheckoutTemplateProps } from './subscription/SubscriptionCheckoutTemplate1/types'
