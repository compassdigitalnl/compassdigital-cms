/**
 * Email Subscribers Collection
 *
 * Stores email marketing subscribers with full Listmonk integration
 * Automatically syncs with Listmonk on create/update/delete
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/features'

const isPlatformMode = isFeatureEnabled('platform')

export const EmailSubscribers: CollectionConfig = {
  slug: 'email-subscribers',
  admin: {
    hidden: !emailMarketingFeatures.isEnabled(),
    group: 'E-mail Marketing',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'status', 'lists', 'tenant', 'updatedAt'],
    description: 'Manage email marketing subscribers synced with Listmonk',
  },
  access: {
    // Tenant isolation: users can only access their tenant's subscribers
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
      return user.role === 'super-admin' || user.role === 'admin' || user.role === 'editor'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'super-admin' || user.role === 'admin' || user.role === 'editor'
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
      name: 'email',
      type: 'email',
      required: true,
      unique: false, // Unique per tenant, enforced via index
      index: true,
      admin: {
        description: 'Subscriber email address',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Subscriber full name',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'enabled',
      options: [
        { label: 'Enabled', value: 'enabled' },
        { label: 'Disabled', value: 'disabled' },
        { label: 'Blocklisted', value: 'blocklisted' },
      ],
      admin: {
        description: 'Subscriber status in Listmonk',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // RELATIONSHIPS
    // ═══════════════════════════════════════════════════════════
    ...(isPlatformMode
      ? [
          {
            name: 'tenant',
            type: 'relationship',
            relationTo: 'clients',
            required: true,
            admin: {
              position: 'sidebar',
              condition: () => false,
            },
            hooks: {
              beforeValidate: [
                async ({ req, data }) => {
                  if (req.user && !data?.tenant) {
                    return req.user.tenant
                  }
                  return data?.tenant
                },
              ],
            },
          } as const,
        ]
      : []),
    {
      name: 'lists',
      type: 'relationship',
      relationTo: 'email-lists',
      required: false,
      hasMany: true,
      admin: {
        description: 'Email lists this subscriber is part of',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // CUSTOM FIELDS (FLEXIBLE DATA)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'customFields',
      type: 'json',
      admin: {
        description: 'Custom attributes for this subscriber (synced to Listmonk attribs)',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // SUBSCRIPTION PREFERENCES
    // ═══════════════════════════════════════════════════════════
    {
      name: 'preferences',
      type: 'group',
      fields: [
        {
          name: 'marketingEmails',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Subscriber opted in for marketing emails',
          },
        },
        {
          name: 'productUpdates',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Subscriber opted in for product updates',
          },
        },
        {
          name: 'newsletter',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Subscriber opted in for newsletter',
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // SUBSCRIPTION SOURCE
    // ═══════════════════════════════════════════════════════════
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Manual Entry', value: 'manual' },
        { label: 'Website Form', value: 'website' },
        { label: 'Import', value: 'import' },
        { label: 'API', value: 'api' },
        { label: 'Checkout', value: 'checkout' },
      ],
      defaultValue: 'manual',
      admin: {
        description: 'How this subscriber was added',
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
        description: 'Listmonk subscriber ID (auto-synced)',
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
    // METADATA
    // ═══════════════════════════════════════════════════════════
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for organizing subscribers',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
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

        // Queue sync job (non-blocking)
        try {
          const { Queue } = await import('bullmq')
          const { getRedisClient } = await import('@/lib/queue/redis')

          const redis = getRedisClient()
          const queue = new Queue('email-marketing', { connection: redis })

          await queue.add('sync-subscriber', {
            subscriberId: doc.id,
            operation,
            tenantId: doc.tenant,
          })

          console.log(`[EmailSubscribers] Queued sync job for subscriber ${doc.id}`)
        } catch (error) {
          console.error('[EmailSubscribers] Failed to queue sync job:', error)
          // Don't throw - we don't want to block the main operation
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

          await queue.add('delete-subscriber', {
            listmonkId: doc.listmonkId,
            tenantId: doc.tenant,
          })

          console.log(`[EmailSubscribers] Queued delete job for subscriber ${doc.id}`)
        } catch (error) {
          console.error('[EmailSubscribers] Failed to queue delete job:', error)
        }
      },
    ],

    // ═══════════════════════════════════════════════════════════
    // BEFORE VALIDATE HOOK - DATA SANITIZATION
    // ═══════════════════════════════════════════════════════════
    beforeValidate: [
      ({ data }) => {
        // Normalize email to lowercase
        if (data?.email) {
          data.email = data.email.toLowerCase().trim()
        }

        // Capitalize name
        if (data?.name) {
          data.name = data.name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
        }

        return data
      },
    ],
  },
  timestamps: true,
}
