/**
 * Email Lists Collection
 *
 * Manages email lists (audiences) with Listmonk integration
 * Lists are used to segment subscribers for targeted campaigns
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/tenant/features'
import { isAdmin, checkRole, isUser, isSuperAdmin, getUserClient } from '@/access/utilities'

const isPlatformMode = isFeatureEnabled('platform')

export const EmailLists: CollectionConfig = {
  slug: 'email-lists',
  admin: {
    hidden: !emailMarketingFeatures.isEnabled(),
    group: 'E-mail Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'subscriberCount', 'updatedAt'],
    description: 'Beheer e-maillijsten en doelgroepen',
  },
  access: {
    // Tenant isolation
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

      // Single-tenant mode: user can read all lists
      return true
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || isAdmin(user)
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || isAdmin(user)
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Lijst naam',
      admin: {
        description: 'Naam van de lijst (bijv. "Nieuwsbrief abonnees", "VIP Klanten")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Omschrijving',
      admin: {
        description: 'Waarvoor wordt deze lijst gebruikt?',
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
      label: 'Type',
      options: [
        {
          label: 'Openbaar',
          value: 'public',
        },
        {
          label: 'Privé',
          value: 'private',
        },
      ],
      admin: {
        description: 'Openbare lijsten staan zelf-aanmelding toe, privélijsten worden beheerd door admins',
      },
    },
    {
      name: 'optin',
      type: 'select',
      required: true,
      defaultValue: 'single',
      label: 'Aanmeldmethode',
      options: [
        {
          label: 'Enkele aanmelding',
          value: 'single',
        },
        {
          label: 'Dubbele aanmelding (aanbevolen)',
          value: 'double',
        },
      ],
      admin: {
        description: 'Dubbele aanmelding vereist e-mailbevestiging, enkele aanmelding is direct',
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

    // ═══════════════════════════════════════════════════════════
    // STATS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'subscriberCount',
      type: 'number',
      defaultValue: 0,
      label: 'Aantal abonnees',
      admin: {
        description: 'Aantal abonnees in deze lijst',
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
      label: 'Aanmeldinstellingen',
      admin: {
        description: 'Instellingen voor openbare aanmeldformulieren',
        condition: (data) => data.type === 'public',
      },
      fields: [
        {
          name: 'welcomeEmail',
          type: 'checkbox',
          defaultValue: true,
          label: 'Welkomstmail',
          admin: {
            description: 'Stuur een welkomstmail bij aanmelding',
          },
        },
        {
          name: 'welcomeEmailTemplate',
          type: 'relationship',
          relationTo: 'email-templates',
          label: 'Welkomstmail template',
          admin: {
            description: 'Template voor de welkomstmail',
            condition: (data, siblingData) => siblingData?.welcomeEmail === true,
          },
        },
        {
          name: 'confirmationPage',
          type: 'text',
          label: 'Bevestigingspagina',
          admin: {
            description: 'URL om naar door te sturen na aanmelding',
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
      label: 'Labels',
      admin: {
        description: 'Labels voor het organiseren van lijsten',
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
      label: 'Categorie',
      options: [
        { label: 'Nieuwsbrief', value: 'newsletter' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Transactioneel', value: 'transactional' },
        { label: 'Updates', value: 'updates' },
        { label: 'Klanten', value: 'customers' },
        { label: 'Overig', value: 'other' },
      ],
      admin: {
        description: 'Categorie voor het organiseren van lijsten',
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
    // STATUS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Actief',
      admin: {
        description: 'Inactieve lijsten ontvangen geen e-mails',
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
          const { redisConfig } = await import('@/lib/queue/redis')

          const queue = new Queue('email-marketing', { connection: redisConfig })

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
          const { redisConfig } = await import('@/lib/queue/redis')

          const queue = new Queue('email-marketing', { connection: redisConfig })

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
