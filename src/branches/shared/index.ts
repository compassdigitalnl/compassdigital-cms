/**
 * Shared Branch
 *
 * Vertical slice containing all shared-related collections, components, and logic.
 *
 * Collections: Pages, Media, Users, Partners, ServicesCollection, Notifications
 */

// Export all collections
export { default as Pages } from './collections/Pages'
export { default as Media } from './collections/Media'
export { default as Users } from './collections/Users'
export { default as Partners } from './collections/Partners'
export { default as ServicesCollection } from './collections/ServicesCollection'
export { default as Notifications } from './collections/Notifications'

// Export branch metadata
export const branchMetadata = {
  name: 'shared',
  collections: [
  "Pages",
  "Media",
  "Users",
  "Partners",
  "ServicesCollection",
  "Notifications"
],
  featureFlag: 'ENABLE_SHARED',
} as const

// Export branch routes (to be implemented)
// export { routes } from './routes'
