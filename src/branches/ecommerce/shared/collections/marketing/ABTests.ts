import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * A/B Tests Collection
 *
 * Manages A/B testing experiments for multi-variant testing.
 * Use cases:
 * - Test different cart templates (Template1 vs Template2)
 * - Test different checkout flows
 * - Test different login/registration pages
 * - Test different product page layouts
 *
 * Features:
 * - Multiple variants per test
 * - Custom distribution (50/50, 70/30, etc.)
 * - Auto-winner selection based on conversions
 * - Per-client isolation (multi-tenant)
 */
export const ABTests: CollectionConfig = {
  slug: 'ab-tests',
  labels: {
    singular: 'A/B Test',
    plural: 'A/B Tests',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Marketing',
    defaultColumns: ['name', 'targetPage', 'status', 'startDate', 'winner'],
    description: 'A/B testing experiments voor multi-variant testing',
    hidden: shouldHideCollection('ab-tests' as any),
  },
  access: {
    read: ({ req: { user } }) => {
      // Admins can read all tests
      if (checkRole(['admin'], user)) return true
      // Super-admins (platform users) can read all tests
      if (checkRole(['super-admin'], user)) return true
      return false
    },
    create: ({ req: { user } }) => checkRole(['admin', 'super-admin'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'super-admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin', 'super-admin'], user),
  },
  fields: [
    // Basic Info
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Test Name',
      admin: {
        description: 'Internal name for this A/B test (e.g., "Cart Template Test Q1 2026")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'What are you testing? What do you expect to learn?',
      },
    },

    // Test Configuration
    {
      name: 'targetPage',
      type: 'select',
      required: true,
      label: 'Target Page',
      options: [
        { label: 'Cart Page', value: 'cart' },
        { label: 'Checkout Page', value: 'checkout' },
        { label: 'Login Page', value: 'login' },
        { label: 'Registration Page', value: 'registration' },
        { label: 'Product Page', value: 'product' },
        { label: 'Homepage', value: 'homepage' },
      ],
      admin: {
        description: 'Which page/component to test',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Running', value: 'running' },
        { label: 'Paused', value: 'paused' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: {
        description: 'Test status',
      },
    },

    // Variants
    {
      name: 'variants',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 10,
      label: 'Variants',
      admin: {
        description: 'Define the variants to test (e.g., Template1, Template2)',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Variant Name',
          admin: {
            description: 'e.g., "template1", "template2", "control", "variation"',
            placeholder: 'template1',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Display Label',
          admin: {
            description: 'Human-readable label for admin panel',
            placeholder: 'Template 1 (Table View)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            description: 'What makes this variant unique?',
          },
        },
        {
          name: 'distribution',
          type: 'number',
          required: true,
          defaultValue: 50,
          min: 0,
          max: 100,
          label: 'Distribution (%)',
          admin: {
            description: 'Percentage of traffic to this variant (total must = 100%)',
          },
        },
      ],
    },

    // Dates
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: 'Start Date',
          admin: {
            width: '50%',
            description: 'When to start the test',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'End Date',
          admin: {
            width: '50%',
            description: 'When to end the test (optional)',
          },
        },
      ],
    },

    // Results & Winner
    {
      name: 'winner',
      type: 'text',
      label: 'Winner',
      admin: {
        description: 'Winning variant (auto-selected or manually chosen)',
        readOnly: true,
      },
    },
    {
      name: 'totalParticipants',
      type: 'number',
      label: 'Total Participants',
      defaultValue: 0,
      admin: {
        description: 'Total number of users assigned to this test',
        readOnly: true,
      },
    },
    {
      name: 'totalConversions',
      type: 'number',
      label: 'Total Conversions',
      defaultValue: 0,
      admin: {
        description: 'Total number of conversions across all variants',
        readOnly: true,
      },
    },

    // Auto-Winner
    {
      name: 'autoWinner',
      type: 'group',
      label: 'Auto-Winner Selection',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Auto-Winner',
          admin: {
            description: 'Automatically select winner when threshold is reached',
          },
        },
        {
          name: 'conversionThreshold',
          type: 'number',
          defaultValue: 100,
          min: 10,
          label: 'Conversion Threshold',
          admin: {
            description: 'Minimum total conversions before auto-selecting winner',
          },
        },
        {
          name: 'confidenceLevel',
          type: 'number',
          defaultValue: 95,
          min: 90,
          max: 99,
          label: 'Confidence Level (%)',
          admin: {
            description: 'Statistical confidence required (95% = p < 0.05)',
          },
        },
      ],
    },

    // Multi-Tenant Isolation (only on platform instances)
    ...(process.env.ENABLE_PLATFORM === 'true'
      ? [
          {
            name: 'client',
            type: 'relationship',
            relationTo: 'clients' as const,
            label: 'Client',
            admin: {
              description: 'Limit test to specific client (optional, for multi-tenant)',
              condition: (data: any, siblingData: any, { user }: any) => {
                return checkRole(['super-admin'], user)
              },
            },
          },
        ]
      : [] as any),

    // Notes
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
      admin: {
        description: 'Internal notes, learnings, observations',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Validate variant distributions sum to 100%
        if (data.variants && Array.isArray(data.variants)) {
          const total = data.variants.reduce((sum, v) => sum + (v.distribution || 0), 0)
          if (Math.abs(total - 100) > 0.01) {
            throw new Error(
              `Variant distributions must sum to 100% (current: ${total.toFixed(1)}%)`,
            )
          }
        }
        return data
      },
    ],
  },
}
