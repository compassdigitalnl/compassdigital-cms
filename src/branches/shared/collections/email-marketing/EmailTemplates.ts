/**
 * Email Templates Collection
 *
 * Manages reusable email templates with GrapesJS visual editor
 * Supports both campaign and transactional email templates
 */

import React from 'react'
import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/features'
import { isAdmin, checkRole, isUser, isSuperAdmin, getUserClient, isAdminOrEditor } from '@/access/utilities'

const isPlatformMode = isFeatureEnabled('platform')

export const EmailTemplates: CollectionConfig = {
  slug: 'email-templates',
  admin: {
    hidden: !emailMarketingFeatures.isEnabled(),
    group: 'E-mail Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'isDefault', 'updatedAt'],
    description: 'Maak en beheer e-mail templates',
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

      // Single-tenant mode: user can read all templates
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Template naam',
      admin: {
        description: 'Naam van het template (bijv. "Welkomstmail", "Product lancering")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Omschrijving',
      admin: {
        description: 'Waarvoor wordt dit template gebruikt?',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // TEMPLATE TYPE
    // ═══════════════════════════════════════════════════════════
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'campaign',
      label: 'Type',
      options: [
        {
          label: 'Campagne template',
          value: 'campaign',
        },
        {
          label: 'Transactionele template',
          value: 'transactional',
        },
      ],
      admin: {
        description: 'Campagne templates zijn voor bulk e-mails, transactionele voor geautomatiseerde e-mails',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Standaard template',
      admin: {
        description: 'Gebruik als standaard voor dit type',
        position: 'sidebar',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // TEMPLATE CONTENT
    // ═══════════════════════════════════════════════════════════
    {
      name: 'defaultSubject',
      type: 'text',
      label: 'Standaard onderwerp',
      admin: {
        description: 'Kan worden overschreven in campagnes',
      },
    },
    {
      name: 'preheader',
      type: 'text',
      label: 'Voorbeeldtekst',
      admin: {
        description: 'Tekst die zichtbaar is in de inbox preview',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // VISUAL EDITOR (GRAPESJS) - Conditionally shown
    // ═══════════════════════════════════════════════════════════
    {
      name: 'useVisualEditor',
      type: 'checkbox',
      defaultValue: emailMarketingFeatures.grapesEditor(),
      label: 'Visuele editor gebruiken',
      admin: {
        description: 'Gebruik de visuele editor (GrapesJS) of platte HTML',
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
      label: 'HTML inhoud',
      admin: {
        language: 'html',
        description: 'HTML code van de e-mail (automatisch gegenereerd bij visuele editor)',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // TEMPLATE VARIABLES
    // ═══════════════════════════════════════════════════════════
    {
      name: 'variables',
      type: 'group',
      label: 'Template variabelen',
      admin: {
        description: 'Variabelen die kunnen worden vervangen in campagnes',
      },
      fields: [
        {
          name: 'list',
          type: 'array',
          admin: {
            description: 'Definieer eigen variabelen (bijv. {{bedrijfsnaam}}, {{productnaam}})',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description: 'Variabele naam (zonder {{ }})',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                description: 'Leesbaar label',
              },
            },
            {
              name: 'defaultValue',
              type: 'text',
              admin: {
                description: 'Standaard waarde indien niet opgegeven',
              },
            },
            {
              name: 'required',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Is deze variabele verplicht?',
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
            condition: () => false,
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
    // CATEGORIES & TAGS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'category',
      type: 'select',
      label: 'Categorie',
      options: [
        { label: 'Welkomst serie', value: 'welcome' },
        { label: 'Nieuwsbrief', value: 'newsletter' },
        { label: 'Promotioneel', value: 'promotional' },
        { label: 'Transactioneel', value: 'transactional' },
        { label: 'Notificatie', value: 'notification' },
        { label: 'Overig', value: 'other' },
      ],
      admin: {
        description: 'Categorie voor het organiseren van templates',
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Labels',
      admin: {
        description: 'Labels voor het organiseren van templates',
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
      label: 'Test instellingen',
      admin: {
        description: 'Instellingen voor het testen van deze template',
      },
      fields: [
        {
          name: 'testRecipients',
          type: 'array',
          label: 'Test ontvangers',
          admin: {
            description: 'E-mailadressen voor test verzendingen',
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
          label: 'Laatst getest op',
          admin: {
            description: 'Laatste keer dat dit template is getest',
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
        description: 'Alleen actieve templates kunnen in campagnes worden gebruikt',
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
          const { redisConfig } = await import('@/lib/queue/redis')

          const queue = new Queue('email-marketing', { connection: redisConfig })

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
