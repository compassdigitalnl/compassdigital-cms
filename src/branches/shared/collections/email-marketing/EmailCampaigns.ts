/**
 * Email Campaigns Collection
 *
 * Manages bulk email campaigns with full Listmonk integration
 * Supports scheduling, analytics, and campaign management
 */

import React from 'react'
import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/features'
import { CampaignDashboard } from './components/CampaignDashboard'

const isPlatformMode = isFeatureEnabled('platform')

export const EmailCampaigns: CollectionConfig = {
  slug: 'email-campaigns',
  admin: {
    hidden: !emailMarketingFeatures.campaigns(),
    group: 'E-mail Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'lists', 'scheduledFor', 'tenant', 'updatedAt'],
    description: 'Create and manage email marketing campaigns',
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
    // CAMPAIGN DASHBOARD (UI Component)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'campaignDashboard',
      type: 'ui',
      admin: {
        components: {
          Field: CampaignDashboard,
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
      admin: {
        description: 'Internal campaign name (not shown to subscribers)',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: {
        description: 'Email subject line',
      },
    },
    {
      name: 'preheader',
      type: 'text',
      admin: {
        description: 'Preview text shown in inbox',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // SENDER INFORMATION
    // ═══════════════════════════════════════════════════════════
    {
      name: 'fromName',
      type: 'text',
      admin: {
        description: 'Sender name (e.g., "John from Acme Inc")',
      },
    },
    {
      name: 'fromEmail',
      type: 'email',
      admin: {
        description: 'Sender email (leave empty to use default from SMTP config)',
      },
    },
    {
      name: 'replyTo',
      type: 'email',
      admin: {
        description: 'Reply-to email address (optional)',
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
      options: [
        {
          label: 'Use Template',
          value: 'template',
        },
        {
          label: 'Custom HTML',
          value: 'custom',
        },
      ],
      admin: {
        description: 'Use existing template or create custom HTML',
      },
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'email-templates',
      admin: {
        description: 'Select template to use',
        condition: (data) => data.contentType === 'template',
      },
    },
    {
      name: 'templateVariables',
      type: 'json',
      admin: {
        description: 'Variables to replace in template (e.g., {"product_name": "Pro Plan"})',
        condition: (data) => data.contentType === 'template',
      },
    },
    {
      name: 'html',
      type: 'code',
      admin: {
        language: 'html',
        description: 'Custom HTML content',
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
      admin: {
        description: 'Which email lists to send this campaign to',
      },
    },
    {
      name: 'excludeLists',
      type: 'relationship',
      relationTo: 'email-lists',
      hasMany: true,
      admin: {
        description: 'Exclude subscribers from these lists (optional)',
      },
    },
    {
      name: 'segmentRules',
      type: 'group',
      admin: {
        description: 'Advanced segmentation (optional)',
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
      admin: {
        description: 'When to send this campaign (leave empty for draft)',
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
      options: [
        { label: 'Europe/Amsterdam', value: 'Europe/Amsterdam' },
        { label: 'America/New_York', value: 'America/New_York' },
        { label: 'America/Los_Angeles', value: 'America/Los_Angeles' },
        { label: 'UTC', value: 'UTC' },
      ],
      admin: {
        description: 'Timezone for scheduled send',
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
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sending', value: 'running' },
        { label: 'Paused', value: 'paused' },
        { label: 'Completed', value: 'finished' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Campaign status',
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'startedAt',
      type: 'date',
      admin: {
        description: 'When campaign started sending',
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
      admin: {
        description: 'When campaign finished sending',
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
      admin: {
        description: 'Campaign performance statistics',
      },
      fields: [
        {
          name: 'sent',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total emails sent',
            readOnly: true,
          },
        },
        {
          name: 'delivered',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Successfully delivered',
            readOnly: true,
          },
        },
        {
          name: 'bounced',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Bounced emails',
            readOnly: true,
          },
        },
        {
          name: 'opened',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Unique opens',
            readOnly: true,
          },
        },
        {
          name: 'clicked',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Unique clicks',
            readOnly: true,
          },
        },
        {
          name: 'openRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Open rate (%)',
            readOnly: true,
          },
        },
        {
          name: 'clickRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Click rate (%)',
            readOnly: true,
          },
        },
        {
          name: 'bounceRate',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Bounce rate (%)',
            readOnly: true,
          },
        },
        {
          name: 'unsubscribed',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Unsubscribes from this campaign',
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

    // ═══════════════════════════════════════════════════════════
    // TAGS & CATEGORIES
    // ═══════════════════════════════════════════════════════════
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Promotional', value: 'promotional' },
        { label: 'Product Update', value: 'product_update' },
        { label: 'Announcement', value: 'announcement' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Campaign category',
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for organizing campaigns',
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
          const { getRedisClient } = await import('@/lib/queue/redis')

          const redis = getRedisClient()
          const queue = new Queue('email-marketing', { connection: redis })

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
          const { getRedisClient } = await import('@/lib/queue/redis')

          const redis = getRedisClient()
          const queue = new Queue('email-marketing', { connection: redis })

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
