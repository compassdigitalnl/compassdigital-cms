/**
 * Beauty Branch - Hair & Beauty Salon Template
 *
 * Collections for beauty salons, hair studios, spas, and wellness centers.
 * Supports service bookings, stylist management, and portfolio showcasing.
 *
 * Collections:
 * - BeautyServices: Treatments/services (hair, beauty, wellness, nails, bridal)
 * - Stylists: Team members (stylists, beauticians, specialists)
 * - BeautyBookings: Customer appointment bookings
 */

// Export all collections
export { BeautyServices } from './collections/BeautyServices'
export { Stylists } from './collections/Stylists'
export { BeautyBookings } from './collections/BeautyBookings'

// Branch metadata for feature flagging
export const branchMetadata = {
  name: 'beauty',
  displayName: 'Beauty & Salon',
  description: 'Hair & beauty salon, spa, and wellness center template',
  collections: ['beautyServices', 'stylists', 'beautyBookings'],
  featureFlag: 'ENABLE_BEAUTY',
  icon: '✨',
} as const
