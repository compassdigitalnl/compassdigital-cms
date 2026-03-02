import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * A/B Test Results Collection
 *
 * Tracks individual user assignments to A/B test variants and their conversions.
 * One record per user per test = variant assignment + conversion tracking.
 *
 * Flow:
 * 1. User visits page with active A/B test
 * 2. System assigns user to variant (based on distribution)
 * 3. ABTestResult record created with variant assignment
 * 4. User completes conversion (e.g., completes order)
 * 5. ABTestResult updated: converted = true, conversionValue set
 *
 * Privacy:
 * - Uses sessionId (cookie) for guests
 * - Uses userId for logged-in users
 * - No PII stored
 */
export const ABTestResults: CollectionConfig = {
  slug: 'ab-test-results',
  labels: {
    singular: 'A/B Test Result',
    plural: 'A/B Test Results',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Marketing',
    defaultColumns: ['test', 'variant', 'converted', 'conversionValue', 'createdAt'],
    description: 'A/B test variant assignments en conversie tracking',
    hidden: shouldHideCollection('shop'),
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins can read all results
      if (checkRole(['admin'], user)) return true
      return false
    },
    create: () => true, // System can create (frontend assignment)
    update: () => true, // System can update (conversion tracking)
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // Test Reference
    {
      name: 'test',
      type: 'relationship',
      relationTo: 'ab-tests',
      required: true,
      label: 'A/B Test',
      admin: {
        description: 'Which A/B test this result belongs to',
      },
    },

    // Variant Assignment
    {
      name: 'variant',
      type: 'text',
      required: true,
      label: 'Assigned Variant',
      admin: {
        description: 'Which variant was shown to this user (e.g., "template1", "template2")',
      },
    },

    // User Identification
    {
      name: 'userId',
      type: 'relationship',
      relationTo: 'users',
      label: 'User',
      admin: {
        description: 'Logged-in user (if applicable)',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      label: 'Session ID',
      admin: {
        description: 'Browser session ID (for guest users)',
      },
    },

    // Conversion Tracking
    {
      name: 'converted',
      type: 'checkbox',
      defaultValue: false,
      label: 'Converted',
      admin: {
        description: 'Did this user complete the desired action?',
      },
    },
    {
      name: 'conversionValue',
      type: 'number',
      label: 'Conversion Value',
      admin: {
        description: 'Order total, revenue, or other conversion value (optional)',
      },
    },
    {
      name: 'convertedAt',
      type: 'date',
      label: 'Conversion Date',
      admin: {
        description: 'When the conversion occurred',
      },
    },

    // Order Reference (for cart/checkout tests)
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Order',
      admin: {
        description: 'Associated order (if conversion = order completion)',
      },
    },

    // Metadata
    {
      name: 'userAgent',
      type: 'text',
      label: 'User Agent',
      admin: {
        description: 'Browser/device info (for segmentation analysis)',
      },
    },
    {
      name: 'referrer',
      type: 'text',
      label: 'Referrer',
      admin: {
        description: 'Where the user came from',
      },
    },
  ],
  indexes: [
    {
      fields: ['test', 'sessionId'],
      unique: true,
    },
    {
      fields: ['test', 'userId'],
    },
    {
      fields: ['test', 'variant'],
    },
    {
      fields: ['converted'],
    },
  ],
}
