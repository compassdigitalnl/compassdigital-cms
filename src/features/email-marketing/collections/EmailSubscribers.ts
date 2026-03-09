/**
 * Email Subscribers Collection
 *
 * Stores email marketing subscribers with full Listmonk integration
 * Automatically syncs with Listmonk on create/update/delete
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/tenant/features'
import { isAdmin, isSuperAdmin, isUser, isAdminOrEditor, getUserClient } from '@/access/utilities'

const isPlatformMode = isFeatureEnabled('platform')

export const EmailSubscribers: CollectionConfig = {
  slug: 'email-subscribers',
  admin: {
    hidden: !emailMarketingFeatures.isEnabled(),
    group: 'E-mail Marketing',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'status', 'lists', 'updatedAt'],
    description: 'Beheer e-mail abonnees en nieuwsbrieflijsten',
  },
  access: {
    // Tenant isolation: users can only access their tenant's subscribers
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isSuperAdmin(user)) return true

      // Multi-tenant mode: filter by tenant
      if (isPlatformMode) {
        const clientId = getUserClient(user)
        if (clientId) {
          return {
            tenant: {
              equals: clientId,
            },
          }
        }
      }

      // Single-tenant mode: user can read all subscribers
      return true
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || isAdminOrEditor(user)
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || isAdminOrEditor(user)
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || isAdmin(user)
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
      label: 'E-mailadres',
      admin: {
        description: 'E-mailadres van de abonnee',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
      admin: {
        description: 'Volledige naam van de abonnee',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'enabled',
      label: 'Status',
      options: [
        { label: 'Actief', value: 'enabled' },
        { label: 'Uitgeschakeld', value: 'disabled' },
        { label: 'Geblokkeerd', value: 'blocklisted' },
      ],
      admin: {
        description: 'Status van de abonnee',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // RELATIONSHIPS
    // ═══════════════════════════════════════════════════════════
    ...(isPlatformMode
      ? [
          {
            name: 'tenant',
            type: 'relationship' as const,
            relationTo: 'clients' as const,
            required: true,
            admin: {
              position: 'sidebar' as const,
              condition: () => false,
            },
            hooks: {
              beforeValidate: [
                async ({ req, data }: any) => {
                  if (req.user && !data?.tenant) {
                    const clientId = getUserClient(req.user)
                    if (clientId) {
                      return clientId
                    }
                  }
                  return data?.tenant
                },
              ],
            },
          },
        ]
      : []),
    {
      name: 'lists',
      type: 'relationship',
      relationTo: 'email-lists',
      required: false,
      hasMany: true,
      label: 'Lijsten',
      admin: {
        description: 'E-maillijsten waar deze abonnee bij hoort',
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
        condition: () => false,
      },
    },

    // ═══════════════════════════════════════════════════════════
    // SUBSCRIPTION PREFERENCES
    // ═══════════════════════════════════════════════════════════
    {
      name: 'preferences',
      type: 'group',
      label: 'Voorkeuren',
      fields: [
        {
          name: 'marketingEmails',
          type: 'checkbox',
          defaultValue: true,
          label: 'Marketing e-mails',
          admin: {
            description: 'Abonnee ontvangt marketing e-mails',
          },
        },
        {
          name: 'productUpdates',
          type: 'checkbox',
          defaultValue: true,
          label: 'Product updates',
          admin: {
            description: 'Abonnee ontvangt product updates',
          },
        },
        {
          name: 'newsletter',
          type: 'checkbox',
          defaultValue: false,
          label: 'Nieuwsbrief',
          admin: {
            description: 'Abonnee ontvangt de nieuwsbrief',
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
      label: 'Bron',
      options: [
        { label: 'Handmatig', value: 'manual' },
        { label: 'Website formulier', value: 'website' },
        { label: 'Importbestand', value: 'import' },
        { label: 'API', value: 'api' },
        { label: 'Kassa/Checkout', value: 'checkout' },
      ],
      defaultValue: 'manual',
      admin: {
        description: 'Hoe is deze abonnee toegevoegd?',
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
        condition: () => false,
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
        condition: () => false,
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
        condition: () => false,
      },
    },
    {
      name: 'syncError',
      type: 'textarea',
      admin: {
        description: 'Last sync error message (if any)',
        readOnly: true,
        position: 'sidebar',
        condition: () => false,
      },
    },

    // ═══════════════════════════════════════════════════════════
    // METADATA
    // ═══════════════════════════════════════════════════════════
    {
      name: 'tags',
      type: 'array',
      label: 'Labels',
      admin: {
        description: 'Labels voor het organiseren van abonnees',
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
          const { redisConfig } = await import('@/lib/queue/redis')

          const queue = new Queue('email-marketing', { connection: redisConfig })

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
          const { redisConfig } = await import('@/lib/queue/redis')

          const queue = new Queue('email-marketing', { connection: redisConfig })

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
            .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
        }

        return data
      },
    ],
  },
  timestamps: true,
}
