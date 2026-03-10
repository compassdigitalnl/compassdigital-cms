/**
 * Horeca Branch - Restaurant, Cafe & Eetgelegenheid Template
 *
 * Collections for restaurants, cafes, bars, and food service businesses.
 * Supports menu management, reservations, and event listings.
 *
 * Collections:
 * - MenuItems: Menu items with categories, pricing, and allergens
 * - Reservations: Customer table reservations
 * - Events: Special events, themed nights, live music, etc.
 */

// Export all collections
export { default as MenuItems } from './collections/MenuItems'
export { default as Reservations } from './collections/Reservations'
export { default as Events } from './collections/Events'

// Branch metadata for feature flagging
export const branchMetadata = {
  name: 'horeca',
  displayName: 'Horeca',
  description: 'Template voor restaurants, cafes en eetgelegenheden',
  collections: ['menuItems', 'reservations', 'events'],
  featureFlag: 'ENABLE_HORECA',
  icon: '🍽️',
} as const
