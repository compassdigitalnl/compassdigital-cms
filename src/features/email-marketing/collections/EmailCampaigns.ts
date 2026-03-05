/**
 * Email Campaigns Collection
 *
 * Manages bulk email campaigns with full Listmonk integration
 * Supports scheduling, analytics, and campaign management
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/features'
import { isAdmin, checkRole, isUser, isSuperAdmin, isAdminOrEditor, getUserClient } from '@/access/utilities'

const isPlatformMode = isFeatureEnabled('platform')

export const EmailCampaigns: CollectionConfig = {
  slug: 'email-campaigns',
  admin: {
    hidden: !emailMarketingFeatures.campaigns(),
    group: 'E-mail Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'lists', 'scheduledFor', 'updatedAt'],
    description: 'Maak en verstuur e-mail campagnes',
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

      // Single-tenant mode: user can read all campaigns
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
    // CAMPAIGN DASHBOARD (UI Component)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'campaignDashboard',
      type: 'ui',
      admin: {
        components: {
          Field: '@/features/email-marketing/collections/components/CampaignDashboard#CampaignDashboard',
        },
        condition: (data) => !!data?.id, // Only show on existing campaigns
      },
    },

    // ═══════════════════════════════════════════════════════════
    // BASIC FIELDS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Campagne naam',
      admin: {
        description: 'Interne campagnenaam (niet zichtbaar voor abonnees)',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Onderwerpregel',
      admin: {
        description: 'Onderwerpregel van de e-mail',
      },
    },
    {
      name: 'preheader',
      type: 'text',
      label: 'Inbox voorbeeldtekst',
      admin: {
        description: 'Voorbeeldtekst zichtbaar in de inbox',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // SENDER INFORMATION
    // ═══════════════════════════════════════════════════════════
    {
      name: 'fromName',
      type: 'text',
      label: 'Afzendernaam',
      admin: {
        description: 'Naam van de afzender (bijv. "Jan van Plastimed")',
      },
    },
    {
      name: 'fromEmail',
      type: 'email',
      label: 'Afzender e-mail',
      admin: {
        description: 'E-mailadres van de afzender (leeg = standaard SMTP)',
      },
    },
    {
      name: 'replyTo',
      type: 'email',
      label: 'Antwoord e-mail',
      admin: {
        description: 'E-mailadres voor antwoorden (optioneel)',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // CONTENT
    // ═══════════════════════════════════════════════════════════
    {
      name: 'contentType',
      type: 'select',
      required: true,
      defaultValue: 'template',
      label: 'Inhoud type',
      options: [
        {
          label: 'Bestaande template gebruiken',
          value: 'template',
        },
        {
          label: 'Eigen HTML',
          value: 'custom',
        },
      ],
      admin: {
        description: 'Gebruik een bestaande template of eigen HTML',
      },
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'email-templates',
      label: 'Template',
      admin: {
        description: 'Selecteer een template',
        condition: (data) => data.contentType === 'template',
      },
    },
    {
      name: 'templateVariables',
      type: 'json',
      admin: {
        description: 'Variables to replace in template',
        condition: () => false,
      },
    },
    {
      name: 'html',
      type: 'code',
      label: 'HTML inhoud',
      admin: {
        language: 'html',
        description: 'Eigen HTML inhoud',
        condition: (data) => data.contentType === 'custom',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // RECIPIENTS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'lists',
      type: 'relationship',
      relationTo: 'email-lists',
      required: true,
      hasMany: true,
      label: 'Ontvangers',
      admin: {
        description: 'Naar welke e-maillijsten wordt deze campagne verstuurd?',
      },
    },
    {
      name: 'excludeLists',
      type: 'relationship',
      relationTo: 'email-lists',
      hasMany: true,
      label: 'Uitsluiten',
      admin: {
        description: 'Abonnees op deze lijsten worden uitgesloten (optioneel)',
      },
    },
    {
      name: 'segmentRules',
      type: 'group',
      admin: {
        description: 'Advanced segmentation (optional)',
        condition: () => false,
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable segmentation',
          },
        },
        {
          name: 'query',
          type: 'textarea',
          admin: {
            description: 'SQL WHERE clause for filtering (e.g., "attribs->>\'country\' = \'NL\'")',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // SCHEDULING
    // ═══════════════════════════════════════════════════════════
    {
      name: 'scheduledFor',
      type: 'date',
      label: 'Inplannen op',
      admin: {
        description: 'Wanneer moet deze campagne verstuurd worden? (leeg = concept)',
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm',
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'timezone',
      type: 'select',
      defaultValue: 'Europe/Amsterdam',
      label: 'Tijdzone',
      options: [
        { label: 'Europe/Amsterdam', value: 'Europe/Amsterdam' },
        { label: 'America/New_York', value: 'America/New_York' },
        { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
        { label: 'UTC', value: 'UTC' },
      ],
      admin: {
        description: 'Tijdzone voor het inplannen',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // STATUS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Ingepland', value: 'scheduled' },
        { label: 'Wordt verstuurd', value: 'running' },
        { label: 'Gepauzeerd', value: 'paused' },
        { label: 'Voltooid', value: 'finished' },
        { label: 'Geannuleerd', value: 'cancelled' },
      ],
      admin: {
        description: 'Status van de campagne',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      label: 'Gestart op',
      admin: {
        description: 'Wanneer is de campagne gestart met verzenden',
        readOnly: true,
        position: 'sidebar',
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm:ss',
        },
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      label: 'Voltooid op',
      admin: {
        description: 'Wanneer is de campagne klaar met verzenden',
        readOnly: true,
        position: 'sidebar',
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm:ss',
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // ANALYTICS & STATS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'stats',
      type: 'group',
      label: 'Statistieken',
      admin: {
        description: 'Prestaties van de campagne',
      },
      fields: [
        {
          name: 'sent',
          type: 'number',
          defaultValue: 0,
          label: 'Verstuurd',
          admin: {
            description: 'Totaal aantal verstuurde e-mails',
            readOnly: true,
          },
        },
        {
          name: 'delivered',
          type: 'number',
          defaultValue: 0,
          label: 'Afgeleverd',
          admin: {
            description: 'Succesvol afgeleverd',
            readOnly: true,
          },
        },
        {
          name: 'bounced',
          type: 'number',
          defaultValue: 0,
          label: 'Bounced',
          admin: {
            description: 'Niet-afgeleverde e-mails',
            readOnly: true,
          },
        },
        {
          name: 'opened',
          type: 'number',
          defaultValue: 0,
          label: 'Geopend',
          admin: {
            description: 'Unieke opens',
            readOnly: true,
          },
        },
        {
          name: 'clicked',
          type: 'number',
          defaultValue: 0,
          label: 'Geklikt',
          admin: {
            description: 'Unieke kliks',
            readOnly: true,
          },
        },
        {
          name: 'openRate',
          type: 'number',
          defaultValue: 0,
          label: 'Open ratio',
          admin: {
            description: 'Open ratio (%)',
            readOnly: true,
          },
        },
        {
          name: 'clickRate',
          type: 'number',
          defaultValue: 0,
          label: 'Klik ratio',
          admin: {
            description: 'Klik ratio (%)',
            readOnly: true,
          },
        },
        {
          name: 'bounceRate',
          type: 'number',
          defaultValue: 0,
          label: 'Bounce ratio',
          admin: {
            description: 'Bounce ratio (%)',
            readOnly: true,
          },
        },
        {
          name: 'unsubscribed',
          type: 'number',
          defaultValue: 0,
          label: 'Uitgeschreven',
          admin: {
            description: 'Uitschrijvingen door deze campagne',
            readOnly: true,
          },
        },
      ],
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
    // TAGS & CATEGORIES
    // ═══════════════════════════════════════════════════════════
    {
      name: 'category',
      type: 'select',
      label: 'Categorie',
      options: [
        { label: 'Nieuwsbrief', value: 'newsletter' },
        { label: 'Promotie', value: 'promotional' },
        { label: 'Product update', value: 'product_update' },
        { label: 'Aankondiging', value: 'announcement' },
        { label: 'Overig', value: 'other' },
      ],
      admin: {
        description: 'Categorie van de campagne',
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Labels',
      admin: {
        description: 'Labels voor het organiseren van campagnes',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // A/B TESTING (Future feature)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'abTest',
      type: 'group',
      admin: {
        description: 'A/B testing settings (optional)',
        condition: () => false,
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Enable A/B testing',
          },
        },
        {
          name: 'variants',
          type: 'array',
          admin: {
            description: 'Test variants',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Variant name (e.g., "Version A")',
              },
            },
            {
              name: 'subject',
              type: 'text',
              required: true,
              admin: {
                description: 'Test subject line',
              },
            },
            {
              name: 'percentage',
              type: 'number',
              required: true,
              admin: {
                description: 'Percentage of recipients (%)',
              },
            },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // LISTMONK SYNC FIELDS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'listmonkCampaignId',
      type: 'number',
      admin: {
        description: 'Listmonk campaign ID (auto-synced)',
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
  ],
  hooks: {
    // ═══════════════════════════════════════════════════════════
    // AFTER CHANGE HOOK - SYNC TO LISTMONK
    // ═══════════════════════════════════════════════════════════
    afterChange: [
      async ({ doc, req, operation }) => {
        // Skip sync if feature is disabled
        if (!emailMarketingFeatures.campaigns()) {
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

          await queue.add('sync-campaign', {
            campaignId: doc.id,
            operation,
            tenantId: doc.tenant,
          })

          console.log(`[EmailCampaigns] Queued sync job for campaign ${doc.id}`)
        } catch (error) {
          console.error('[EmailCampaigns] Failed to queue sync job:', error)
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
        if (!emailMarketingFeatures.campaigns()) {
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

          await queue.add('delete-campaign', {
            listmonkId: doc.listmonkCampaignId,
            tenantId: doc.tenant,
          })

          console.log(`[EmailCampaigns] Queued delete job for campaign ${doc.id}`)
        } catch (error) {
          console.error('[EmailCampaigns] Failed to queue delete job:', error)
        }
      },
    ],

    // ═══════════════════════════════════════════════════════════
    // BEFORE VALIDATE HOOK - DATA SANITIZATION
    // ═══════════════════════════════════════════════════════════
    beforeValidate: [
      ({ data }) => {
        // Trim campaign name and subject
        if (data?.name) {
          data.name = data.name.trim()
        }
        if (data?.subject) {
          data.subject = data.subject.trim()
        }

        // Validate scheduled date is in future
        if (data?.scheduledFor) {
          const scheduledDate = new Date(data.scheduledFor)
          if (scheduledDate < new Date()) {
            throw new Error('Scheduled date must be in the future')
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}
