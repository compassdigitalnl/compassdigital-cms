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

// Collections removed — replaced by unified Content collections
// (ContentServices, ContentActivities, ContentBookings)

// Branch metadata for feature flagging
export const branchMetadata = {
  name: 'horeca',
  displayName: 'Horeca',
  description: 'Template voor restaurants, cafes en eetgelegenheden',
  collections: [],
  featureFlag: 'ENABLE_HORECA',
} as const
