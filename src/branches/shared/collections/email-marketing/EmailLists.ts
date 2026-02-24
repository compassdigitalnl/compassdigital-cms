/**
 * Email Lists Collection
 *
 * Manages email lists (audiences) with Listmonk integration
 * Lists are used to segment subscribers for targeted campaigns
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures } from '@/lib/features'

export const EmailLists: CollectionConfig = {
  slug: 'email-lists',
  admin: {
    hidden: !emailMarketingFeatures.isEnabled(),
    group: 'Email Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'subscriberCount', 'tenant', 'updatedAt'],
    description: 'Manage email lists for segmenting subscribers',
  },
  access: {
    // Tenant isolation
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true
      return {
        tenant: {
          equals: user.tenant,
        },
      }
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'super-admin' || user.role === 'admin'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'super-admin' || user.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'super-admin' || user.role === 'admin'
    },
  },
  fields: [
    // ═══════════════════════════════════════════════════════════
    // BASIC FIELDS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'List name (e.g., "Newsletter Subscribers", "VIP Customers")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'What is this list for?',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // LIST CONFIGURATION
    // ═══════════════════════════════════════════════════════════
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'private',
      options: [
        {
          label: 'Public',
          value: 'public',
        },
        {
          label: 'Private',
          value: 'private',
        },
      ],
      admin: {
        description: 'Public lists allow self-subscription, private lists are admin-managed',
      },
    },
    {
      name: 'optin',
      type: 'select',
      required: true,
      defaultValue: 'single',
      options: [
        {
          label: 'Single Opt-in',
          value: 'single',
        },
        {
          label: 'Double Opt-in',
          value: 'double',
        },
      ],
      admin: {
        description: 'Double opt-in requires email confirmation, single opt-in is immediate',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // RELATIONSHIPS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      hasMany: false,
      index: true,
      admin: {
        description: 'Tenant this list belongs to',
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ req, value }) => {
            // Auto-assign tenant from logged-in user
            if (!value && req.user?.tenant) {
              return req.user.tenant
            }
            return value
          },
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════
    // STATS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'subscriberCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of subscribers in this list',
        readOnly: true,
        position: 'sidebar',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // SUBSCRIPTION FORM SETTINGS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'subscriptionSettings',
      type: 'group',
      admin: {
        description: 'Settings for public subscription forms',
        condition: (data) => data.type === 'public',
      },
      fields: [
        {
          name: 'welcomeEmail',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Send welcome email on subscription',
          },
        },
        {
          name: 'welcomeEmailTemplate',
          type: 'relationship',
          relationTo: 'email-templates',
          admin: {
            description: 'Template for welcome email',
            condition: (data, siblingData) => siblingData?.welcomeEmail === true,
          },
        },
        {
          name: 'confirmationPage',
          type: 'text',
          admin: {
            description: 'URL to redirect after subscription',
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // TAGS & CATEGORIES
    // ═══════════════════════════════════════════════════════════
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for organizing lists',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Transactional', value: 'transactional' },
        { label: 'Updates', value: 'updates' },
        { label: 'Customers', value: 'customers' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'List category for organization',
        position: 'sidebar',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // LISTMONK SYNC FIELDS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'listmonkId',
      type: 'number',
      admin: {
        description: 'Listmonk list ID (auto-synced)',
        readOnly: true,
        position: 'sidebar',
      },
      index: true,
    },
    {
      name: 'lastSyncedAt',
      type: 'date',
      admin: {
        description: 'Last synced with Listmonk',
        readOnly: true,
        position: 'sidebar',
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm:ss',
        },
      },
    },
    {
      name: 'syncStatus',
      type: 'select',
      options: [
        { label: 'Synced', value: 'synced' },
        { label: 'Pending', value: 'pending' },
        { label: 'Error', value: 'error' },
      ],
      defaultValue: 'pending',
      admin: {
        description: 'Sync status with Listmonk',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'syncError',
      type: 'textarea',
      admin: {
        description: 'Last sync error message (if any)',
        readOnly: true,
        position: 'sidebar',
        condition: (data) => data.syncStatus === 'error',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // STATUS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Active lists can receive campaigns, inactive lists are archived',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    // ═══════════════════════════════════════════════════════════
    // AFTER CHANGE HOOK - SYNC TO LISTMONK
    // ═══════════════════════════════════════════════════════════
    afterChange: [
      async ({ doc, req, operation }) => {
        // Skip sync if feature is disabled
        if (!emailMarketingFeatures.isEnabled()) {
          return doc
        }

        // Skip during database migrations
        if (process.env.SKIP_EMAIL_SYNC === 'true') {
          return doc
        }

        // Queue sync job
        try {
          const { Queue } = await import('bullmq')
          const { getRedisClient } = await import('@/lib/queue/redis')

          const redis = getRedisClient()
          const queue = new Queue('email-marketing', { connection: redis })

          await queue.add('sync-list', {
            listId: doc.id,
            operation,
            tenantId: doc.tenant,
          })

          console.log(`[EmailLists] Queued sync job for list ${doc.id}`)
        } catch (error) {
          console.error('[EmailLists] Failed to queue sync job:', error)
        }

        return doc
      },
    ],

    // ═══════════════════════════════════════════════════════════
    // AFTER DELETE HOOK - DELETE FROM LISTMONK
    // ═══════════════════════════════════════════════════════════
    afterDelete: [
      async ({ doc }) => {
        // Skip sync if feature is disabled
        if (!emailMarketingFeatures.isEnabled()) {
          return
        }

        // Skip during database migrations
        if (process.env.SKIP_EMAIL_SYNC === 'true') {
          return
        }

        // Queue delete job
        try {
          const { Queue } = await import('bullmq')
          const { getRedisClient } = await import('@/lib/queue/redis')

          const redis = getRedisClient()
          const queue = new Queue('email-marketing', { connection: redis })

          await queue.add('delete-list', {
            listmonkId: doc.listmonkId,
            tenantId: doc.tenant,
          })

          console.log(`[EmailLists] Queued delete job for list ${doc.id}`)
        } catch (error) {
          console.error('[EmailLists] Failed to queue delete job:', error)
        }
      },
    ],

    // ═══════════════════════════════════════════════════════════
    // BEFORE VALIDATE HOOK - DATA SANITIZATION
    // ═══════════════════════════════════════════════════════════
    beforeValidate: [
      ({ data }) => {
        // Trim list name
        if (data?.name) {
          data.name = data.name.trim()
        }

        return data
      },
    ],
  },
  timestamps: true,
}
