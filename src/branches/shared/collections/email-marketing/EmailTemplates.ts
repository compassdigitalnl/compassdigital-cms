/**
 * Email Templates Collection
 *
 * Manages reusable email templates with GrapesJS visual editor
 * Supports both campaign and transactional email templates
 */

import React from 'react'
import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/features'

const isPlatformMode = isFeatureEnabled('platform')

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  admin: {
    hidden: !emailMarketingFeatures.isEnabled(),
    group: 'Email Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'isDefault', 'tenant', 'updatedAt'],
    description: 'Create and manage email templates with visual editor',
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
    // BASIC FIELDS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Template name (e.g., "Welcome Email", "Product Launch")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'What is this template used for?',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // TEMPLATE TYPE
    // ═══════════════════════════════════════════════════════════
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 0,
      options: [
        {
          label: 'Campaign Template',
          value: 0,
        },
        {
          label: 'Transactional Template',
          value: 1,
        },
      ],
      admin: {
        description: 'Campaign templates are for bulk emails, transactional are for automated emails',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Use this as the default template for this type',
        position: 'sidebar',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // TEMPLATE CONTENT
    // ═══════════════════════════════════════════════════════════
    {
      name: 'defaultSubject',
      type: 'text',
      admin: {
        description: 'Default subject line (can be overridden in campaigns)',
      },
    },
    {
      name: 'preheader',
      type: 'text',
      admin: {
        description: 'Email preheader text (preview text shown in inbox)',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // VISUAL EDITOR (GRAPESJS) - Conditionally shown
    // ═══════════════════════════════════════════════════════════
    {
      name: 'useVisualEditor',
      type: 'checkbox',
      defaultValue: emailMarketingFeatures.grapesEditor(),
      admin: {
        description: 'Use visual editor (GrapesJS) or raw HTML',
        condition: () => emailMarketingFeatures.grapesEditor(),
      },
    },
    {
      name: 'grapesData',
      type: 'json',
      admin: {
        description: 'Visual email template editor',
        condition: (data) => data.useVisualEditor === true && emailMarketingFeatures.grapesEditor(),
        components: {
          Field: '@/branches/shared/components/GrapesEmailEditor/PayloadField#GrapesJSField',
        },
      },
    },

    // ═══════════════════════════════════════════════════════════
    // HTML CONTENT (Always present - either from GrapesJS export or manual)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'html',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
        description: 'HTML content (auto-generated from visual editor or manually written)',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // TEMPLATE VARIABLES
    // ═══════════════════════════════════════════════════════════
    {
      name: 'variables',
      type: 'group',
      admin: {
        description: 'Template variables that can be replaced in campaigns',
      },
      fields: [
        {
          name: 'list',
          type: 'array',
          admin: {
            description: 'Define custom variables (e.g., {{company_name}}, {{product_name}})',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Variable name (without {{ }})',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Human-readable label',
              },
            },
            {
              name: 'defaultValue',
              type: 'text',
              admin: {
                description: 'Default value if not provided',
              },
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Is this variable required?',
              },
            },
          ],
        },
        {
          name: 'builtIn',
          type: 'group',
          admin: {
            description: 'Built-in Listmonk variables always available',
            readOnly: true,
          },
          fields: [
            // UI component temporarily disabled for migration generation (JSX not supported in .ts files)
            // TODO: Re-enable after migration or move to separate .tsx component file
            // {
            //   name: 'info',
            //   type: 'ui',
            //   admin: {
            //     components: {
            //       Field: () => (
            //         <div style={{ padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            //           <p style={{ margin: 0, fontSize: '13px' }}>
            //             <strong>Built-in Listmonk variables:</strong>
            //           </p>
            //           <ul style={{ margin: '8px 0', paddingLeft: '20px', fontSize: '12px' }}>
            //             <li>{'{{ .Subscriber.Email }}'} - Subscriber email</li>
            //             <li>{'{{ .Subscriber.Name }}'} - Subscriber name</li>
            //             <li>{'{{ .Subscriber.UUID }}'} - Subscriber UUID</li>
            //             <li>{'{{ .Campaign.Name }}'} - Campaign name</li>
            //             <li>{'{{ .Campaign.Subject }}'} - Campaign subject</li>
            //             <li>{'{{ .UnsubscribeURL }}'} - Unsubscribe link</li>
            //             <li>{'{{ .OptinURL }}'} - Opt-in confirmation link</li>
            //             <li>{'{{ .Date }}'} - Current date</li>
            //           </ul>
            //         </div>
            //       ),
            //     },
            //   },
            // },
          ],
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
    // CATEGORIES & TAGS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Welcome Series', value: 'welcome' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Promotional', value: 'promotional' },
        { label: 'Transactional', value: 'transactional' },
        { label: 'Notification', value: 'notification' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Template category for organization',
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for organizing templates',
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
    // TESTING
    // ═══════════════════════════════════════════════════════════
    {
      name: 'testSettings',
      type: 'group',
      admin: {
        description: 'Settings for testing this template',
      },
      fields: [
        {
          name: 'testRecipients',
          type: 'array',
          admin: {
            description: 'Email addresses for test sends',
          },
          fields: [
            {
              name: 'email',
              type: 'email',
              required: true,
            },
          ],
        },
        {
          name: 'lastTestedAt',
          type: 'date',
          admin: {
            description: 'Last time this template was tested',
            readOnly: true,
            date: {
              displayFormat: 'yyyy-MM-dd HH:mm:ss',
            },
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // LISTMONK SYNC FIELDS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'listmonkId',
      type: 'number',
      admin: {
        description: 'Listmonk template ID (auto-synced)',
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
        description: 'Active templates can be used in campaigns',
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

          await queue.add('sync-template', {
            templateId: doc.id,
            operation,
            tenantId: doc.tenant,
          })

          console.log(`[EmailTemplates] Queued sync job for template ${doc.id}`)
        } catch (error) {
          console.error('[EmailTemplates] Failed to queue sync job:', error)
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

          await queue.add('delete-template', {
            listmonkId: doc.listmonkId,
            tenantId: doc.tenant,
          })

          console.log(`[EmailTemplates] Queued delete job for template ${doc.id}`)
        } catch (error) {
          console.error('[EmailTemplates] Failed to queue delete job:', error)
        }
      },
    ],

    // ═══════════════════════════════════════════════════════════
    // BEFORE VALIDATE HOOK - DATA SANITIZATION
    // ═══════════════════════════════════════════════════════════
    beforeValidate: [
      ({ data }) => {
        // Trim template name
        if (data?.name) {
          data.name = data.name.trim()
        }

        // Ensure only one default template per type
        // TODO: Implement unique constraint check

        return data
      },
    ],
  },
  timestamps: true,
}
