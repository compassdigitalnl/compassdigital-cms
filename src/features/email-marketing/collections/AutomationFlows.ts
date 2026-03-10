/**
 * Automation Flows Collection
 *
 * Multi-step automation workflows with state tracking
 * Flows are sequences of actions executed over time for individual users
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/tenant/features'
import { isAdmin, isSuperAdmin, isUser, isAdminOrEditor, getUserClient } from '@/access/utilities'

const isPlatformMode = isFeatureEnabled('platform')

export const AutomationFlows: CollectionConfig = {
  slug: 'automation-flows',
  admin: {
    hidden: !emailMarketingFeatures.campaigns(),
    group: 'E-mail Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'updatedAt'],
    description: 'Maak automatische e-mail reeksen (bijv. welkomstmail serie)',
    components: {
      edit: {
        Description: '@/features/email-marketing/components/admin/FlowEditBanner#FlowEditBanner',
      },
    },
  },
  access: {
    // Tenant isolation (only in multi-tenant/platform mode)
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

      // Single-tenant mode: user can read all automation flows
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
    // BASIC INFORMATION
    // ═══════════════════════════════════════════════════════════
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Flow naam',
      admin: {
        description: 'Naam van de flow (bijv. "Welkomst reeks", "Onboarding")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Omschrijving',
      admin: {
        description: 'Beschrijf wat deze flow doet',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Actief', value: 'active' },
        { label: 'Gepauzeerd', value: 'paused' },
      ],
      admin: {
        description: 'Alleen actieve flows accepteren nieuwe instappen',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // ENTRY TRIGGER
    // ═══════════════════════════════════════════════════════════
    {
      name: 'entryTrigger',
      type: 'group',
      label: 'Trigger',
      admin: {
        description: 'Wat start deze flow?',
      },
      fields: [
        {
          name: 'eventType',
          type: 'select',
          required: true,
          options: [
            { label: 'Klant: Aangemeld', value: 'user.signup' },
            { label: 'Abonnee: Toegevoegd', value: 'subscriber.added' },
            { label: 'Abonnee: Bevestigd', value: 'subscriber.confirmed' },
            { label: 'Bestelling: Geplaatst', value: 'order.placed' },
            { label: 'Winkelwagen: Verlaten', value: 'cart.abandoned' },
            { label: 'E-mail: Geklikt', value: 'email.clicked' },
            { label: 'Aangepast: Event', value: 'custom.event' },
          ],
          admin: {
            description: 'Welk event start deze flow?',
          },
        },
        {
          name: 'customEventName',
          type: 'text',
          admin: {
            description: 'Naam van het aangepaste event',
            condition: (data, siblingData) => siblingData?.eventType === 'custom.event',
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // ENTRY CONDITIONS (Optional)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'entryConditions',
      type: 'array',
      label: 'Startvoorwaarden',
      admin: {
        description: 'Optioneel: voeg voorwaarden toe wie deze flow mag starten',
      },
      fields: [
        {
          name: 'field',
          type: 'text',
          required: true,
          admin: {
            description: 'Field name to check (e.g., "email", "order.total")',
          },
        },
        {
          name: 'operator',
          type: 'select',
          required: true,
          options: [
            { label: 'Equals', value: 'equals' },
            { label: 'Greater Than', value: 'greater_than' },
            { label: 'Less Than', value: 'less_than' },
            { label: 'Contains', value: 'contains' },
          ],
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // FLOW STEPS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Stappen',
      admin: {
        description: 'De stappen in deze flow (worden op volgorde uitgevoerd)',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Step name (for internal reference)',
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'E-mail versturen', value: 'send_email' },
            { label: 'Wachten', value: 'wait' },
            { label: 'Toevoegen aan lijst', value: 'add_to_list' },
            { label: 'Verwijderen van lijst', value: 'remove_from_list' },
            { label: 'Label toevoegen', value: 'add_tag' },
            { label: 'Label verwijderen', value: 'remove_tag' },
            { label: 'Voorwaarde', value: 'condition' },
            { label: 'Webhook', value: 'webhook' },
            { label: 'Flow beëindigen', value: 'exit' },
          ],
        },

        // Send Email
        {
          name: 'emailTemplate',
          type: 'relationship',
          relationTo: 'email-templates',
          admin: {
            description: 'Email template to send',
            condition: (data, siblingData) => siblingData?.type === 'send_email',
          },
        },

        // Wait
        {
          name: 'waitDuration',
          type: 'group',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'wait',
          },
          fields: [
            {
              name: 'value',
              type: 'number',
              required: true,
              defaultValue: 1,
            },
            {
              name: 'unit',
              type: 'select',
              required: true,
              defaultValue: 'days',
              options: [
                { label: 'Hours', value: 'hours' },
                { label: 'Days', value: 'days' },
                { label: 'Weeks', value: 'weeks' },
              ],
            },
          ],
        },

        // Add/Remove List
        {
          name: 'list',
          type: 'relationship',
          relationTo: 'email-lists',
          admin: {
            description: 'Email list',
            condition: (data, siblingData) =>
              siblingData?.type === 'add_to_list' || siblingData?.type === 'remove_from_list',
          },
        },

        // Tags
        {
          name: 'tagName',
          type: 'text',
          admin: {
            description: 'Tag name',
            condition: (data, siblingData) =>
              siblingData?.type === 'add_tag' || siblingData?.type === 'remove_tag',
          },
        },

        // Condition Check (Branching)
        {
          name: 'condition',
          type: 'group',
          admin: {
            description: 'Branching logic',
            condition: (data, siblingData) => siblingData?.type === 'condition',
          },
          fields: [
            {
              name: 'field',
              type: 'text',
              required: true,
              admin: {
                description: 'Field to check',
              },
            },
            {
              name: 'operator',
              type: 'select',
              required: true,
              options: [
                { label: 'Equals', value: 'equals' },
                { label: 'Greater Than', value: 'greater_than' },
                { label: 'Contains', value: 'contains' },
              ],
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
            {
              name: 'ifTrue',
              type: 'number',
              admin: {
                description: 'Go to step # if condition is true (1-indexed)',
              },
            },
            {
              name: 'ifFalse',
              type: 'number',
              admin: {
                description: 'Go to step # if condition is false (1-indexed)',
              },
            },
          ],
        },

        // Webhook
        {
          name: 'webhookUrl',
          type: 'text',
          admin: {
            description: 'Webhook URL',
            condition: (data, siblingData) => siblingData?.type === 'webhook',
          },
        },

        // Exit Reason (for exit steps)
        {
          name: 'exitReason',
          type: 'text',
          admin: {
            description: 'Reason for exiting flow',
            condition: (data, siblingData) => siblingData?.type === 'exit',
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // EXIT CONDITIONS (When to remove users from flow)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'exitConditions',
      type: 'array',
      label: 'Stop voorwaarden',
      admin: {
        description: 'Optioneel: wanneer wordt een abonnee uit deze flow gehaald?',
      },
      fields: [
        {
          name: 'eventType',
          type: 'select',
          options: [
            { label: 'Abonnee: Uitgeschreven', value: 'subscriber.unsubscribed' },
            { label: 'Bestelling: Geplaatst', value: 'order.placed' },
            { label: 'Aangepast: Event', value: 'custom.event' },
          ],
        },
        {
          name: 'customEventName',
          type: 'text',
          admin: {
            condition: (data, siblingData) => siblingData?.eventType === 'custom.event',
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // STATISTICS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'stats',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Flow performance statistics',
        condition: () => false,
      },
      fields: [
        {
          name: 'totalEntries',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total users who entered this flow',
          },
        },
        {
          name: 'activeInstances',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Users currently in this flow',
          },
        },
        {
          name: 'completedInstances',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Users who completed this flow',
          },
        },
        {
          name: 'exitedInstances',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Users who exited early',
          },
        },
        {
          name: 'lastEntry',
          type: 'date',
          admin: {
            description: 'Last time someone entered this flow',
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // SETTINGS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'settings',
      type: 'group',
      label: 'Instellingen',
      fields: [
        {
          name: 'allowReentry',
          type: 'checkbox',
          defaultValue: false,
          label: 'Opnieuw instappen toestaan',
          admin: {
            description: 'Mogen gebruikers deze flow opnieuw doorlopen na voltooiing?',
          },
        },
        {
          name: 'maxEntriesPerUser',
          type: 'number',
          label: 'Max aantal keer per abonnee',
          admin: {
            description: 'Max aantal keer dat een abonnee deze flow kan doorlopen (leeg = onbeperkt)',
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // TENANT & METADATA (Platform mode only)
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
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Initialize stats on creation
        if (operation === 'create' && !data.stats) {
          data.stats = {
            totalEntries: 0,
            activeInstances: 0,
            completedInstances: 0,
            exitedInstances: 0,
          }
        }
        return data
      },
    ],
  },
}
