/**
 * Automation Rules Collection
 *
 * Event-driven automation for email marketing
 * Trigger campaigns based on user actions and conditions
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/tenant/features'
import { isAdmin, isSuperAdmin, isUser, isAdminOrEditor, getUserClient } from '@/access/utilities'

const isPlatformMode = isFeatureEnabled('platform')

export const AutomationRules: CollectionConfig = {
  slug: 'automation-rules',
  admin: {
    hidden: !emailMarketingFeatures.campaigns(),
    group: 'E-mail Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'trigger', 'updatedAt'],
    description: 'Maak automatische acties op basis van klantgedrag',
  },
  access: {
    // Tenant isolation (only in multi-tenant/platform mode)
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isSuperAdmin(user)) return true

      // Multi-tenant mode: filter by tenant
      if (isFeatureEnabled('platform')) {
        const clientId = getUserClient(user)
        if (clientId) {
          return {
            tenant: {
              equals: clientId,
            },
          }
        }
      }

      // Single-tenant mode: user can read all automation rules
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
      label: 'Regel naam',
      admin: {
        description: 'Interne naam voor deze automatiseringsregel',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Omschrijving',
      admin: {
        description: 'Beschrijf wat deze automatisering doet',
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
        description: 'Alleen actieve regels verwerken events',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // TRIGGER CONFIGURATION
    // ═══════════════════════════════════════════════════════════
    {
      name: 'trigger',
      type: 'group',
      label: 'Trigger',
      fields: [
        {
          name: 'eventType',
          type: 'select',
          required: true,
          options: [
            // User Events
            { label: 'Klant: Aangemeld', value: 'user.signup' },
            { label: 'Klant: Profiel bijgewerkt', value: 'user.updated' },
            { label: 'Klant: Ingelogd', value: 'user.login' },

            // Subscription Events
            { label: 'Abonnee: Toegevoegd', value: 'subscriber.added' },
            { label: 'Abonnee: Bevestigd', value: 'subscriber.confirmed' },
            { label: 'Abonnee: Uitgeschreven', value: 'subscriber.unsubscribed' },
            { label: 'Abonnee: Lijst gewijzigd', value: 'subscriber.list_changed' },

            // E-commerce Events
            { label: 'Bestelling: Geplaatst', value: 'order.placed' },
            { label: 'Bestelling: Voltooid', value: 'order.completed' },
            { label: 'Bestelling: Geannuleerd', value: 'order.cancelled' },
            { label: 'Winkelwagen: Verlaten', value: 'cart.abandoned' },
            { label: 'Product: Gekocht', value: 'product.purchased' },

            // Engagement Events
            { label: 'E-mail: Geopend', value: 'email.opened' },
            { label: 'E-mail: Geklikt', value: 'email.clicked' },
            { label: 'E-mail: Bounced', value: 'email.bounced' },
            { label: 'Campagne: Voltooid', value: 'campaign.completed' },

            // Custom Events
            { label: 'Aangepast: Event', value: 'custom.event' },
          ],
          admin: {
            description: 'Welk event triggert deze automatisering?',
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
    // CONDITIONS (Optional filters)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'conditions',
      type: 'array',
      label: 'Voorwaarden',
      admin: {
        description: 'Optioneel: voeg voorwaarden toe wanneer deze regel actief is',
      },
      fields: [
        {
          name: 'field',
          type: 'text',
          required: true,
          admin: {
            description: 'Field name to check (e.g., "email", "order.total", "user.role")',
          },
        },
        {
          name: 'operator',
          type: 'select',
          required: true,
          options: [
            { label: 'Equals', value: 'equals' },
            { label: 'Not Equals', value: 'not_equals' },
            { label: 'Contains', value: 'contains' },
            { label: 'Not Contains', value: 'not_contains' },
            { label: 'Greater Than', value: 'greater_than' },
            { label: 'Less Than', value: 'less_than' },
            { label: 'Starts With', value: 'starts_with' },
            { label: 'Ends With', value: 'ends_with' },
            { label: 'Is Empty', value: 'is_empty' },
            { label: 'Is Not Empty', value: 'is_not_empty' },
          ],
        },
        {
          name: 'value',
          type: 'text',
          admin: {
            description: 'Value to compare against (not needed for "is_empty" operators)',
            condition: (data, siblingData) =>
              siblingData?.operator !== 'is_empty' && siblingData?.operator !== 'is_not_empty',
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // ACTIONS (What happens when triggered)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'actions',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Acties',
      admin: {
        description: 'Wat moet er gebeuren als deze regel wordt getriggerd?',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'E-mail versturen', value: 'send_email' },
            { label: 'Toevoegen aan lijst', value: 'add_to_list' },
            { label: 'Verwijderen van lijst', value: 'remove_from_list' },
            { label: 'Label toevoegen', value: 'add_tag' },
            { label: 'Label verwijderen', value: 'remove_tag' },
            { label: 'Wachten', value: 'wait' },
            { label: 'Webhook', value: 'webhook' },
          ],
        },

        // Send Email Action
        {
          name: 'emailTemplate',
          type: 'relationship',
          relationTo: 'email-templates',
          admin: {
            description: 'Email template to send',
            condition: (data, siblingData) => siblingData?.type === 'send_email',
          },
        },

        // Add/Remove from List Actions
        {
          name: 'list',
          type: 'relationship',
          relationTo: 'email-lists',
          admin: {
            description: 'Email list to modify',
            condition: (data, siblingData) =>
              siblingData?.type === 'add_to_list' || siblingData?.type === 'remove_from_list',
          },
        },

        // Tag Actions
        {
          name: 'tagName',
          type: 'text',
          admin: {
            description: 'Tag name',
            condition: (data, siblingData) =>
              siblingData?.type === 'add_tag' || siblingData?.type === 'remove_tag',
          },
        },

        // Wait Action
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
              admin: {
                description: 'Wait duration',
              },
            },
            {
              name: 'unit',
              type: 'select',
              required: true,
              defaultValue: 'hours',
              options: [
                { label: 'Minutes', value: 'minutes' },
                { label: 'Hours', value: 'hours' },
                { label: 'Days', value: 'days' },
                { label: 'Weeks', value: 'weeks' },
              ],
            },
          ],
        },

        // Webhook Action
        {
          name: 'webhookUrl',
          type: 'text',
          admin: {
            description: 'Webhook URL to call',
            condition: (data, siblingData) => siblingData?.type === 'webhook',
          },
        },
        {
          name: 'webhookMethod',
          type: 'select',
          defaultValue: 'POST',
          options: [
            { label: 'POST', value: 'POST' },
            { label: 'GET', value: 'GET' },
            { label: 'PUT', value: 'PUT' },
            { label: 'PATCH', value: 'PATCH' },
          ],
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'webhook',
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // TIMING & SCHEDULING
    // ═══════════════════════════════════════════════════════════
    {
      name: 'timing',
      type: 'group',
      label: 'Timing',
      fields: [
        {
          name: 'delayEnabled',
          type: 'checkbox',
          defaultValue: false,
          label: 'Vertraging inschakelen',
          admin: {
            description: 'Voeg een vertraging toe voordat deze regel wordt uitgevoerd',
          },
        },
        {
          name: 'delay',
          type: 'group',
          admin: {
            condition: (data, siblingData) => siblingData?.delayEnabled === true,
          },
          fields: [
            {
              name: 'value',
              type: 'number',
              required: true,
              defaultValue: 1,
              admin: {
                description: 'Duur van de vertraging',
              },
            },
            {
              name: 'unit',
              type: 'select',
              required: true,
              defaultValue: 'hours',
              options: [
                { label: 'Minuten', value: 'minutes' },
                { label: 'Uren', value: 'hours' },
                { label: 'Dagen', value: 'days' },
                { label: 'Weken', value: 'weeks' },
              ],
            },
          ],
        },
        {
          name: 'maxExecutions',
          type: 'number',
          label: 'Max uitvoeringen',
          admin: {
            description: 'Max aantal keer dat deze regel per gebruiker kan triggeren (leeg = onbeperkt)',
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
        description: 'Automation performance statistics',
        condition: () => false,
      },
      fields: [
        {
          name: 'timesTriggered',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total times this rule was triggered',
          },
        },
        {
          name: 'timesSucceeded',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Times this rule completed successfully',
          },
        },
        {
          name: 'timesFailed',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Times this rule failed to execute',
          },
        },
        {
          name: 'lastTriggered',
          type: 'date',
          admin: {
            description: 'Last time this rule was triggered',
          },
        },
        {
          name: 'lastError',
          type: 'textarea',
          admin: {
            description: 'Last error message (if any)',
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
              condition: () => false, // Hide from form (auto-populated)
            },
            hooks: {
              beforeValidate: [
                async ({ req, data }: any) => {
                  // Auto-populate tenant from user
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
            timesTriggered: 0,
            timesSucceeded: 0,
            timesFailed: 0,
          }
        }
        return data
      },
    ],
  },
}
