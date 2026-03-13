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

// Collections removed — replaced by unified Content collections
// (ContentServices, ContentTeam, ContentBookings)

// Branch metadata for feature flagging
export const branchMetadata = {
  name: 'beauty',
  displayName: 'Beauty & Salon',
  description: 'Hair & beauty salon, spa, and wellness center template',
  collections: [],
  featureFlag: 'ENABLE_BEAUTY',
} as const
