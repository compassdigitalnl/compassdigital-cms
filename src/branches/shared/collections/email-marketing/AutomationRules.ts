/**
 * Automation Rules Collection
 *
 * Event-driven automation for email marketing
 * Trigger campaigns based on user actions and conditions
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/features'
import { isAdmin, isSuperAdmin, isUser, isAdminOrEditor, getUserClient } from '@/access/utilities'

const isPlatformMode = isFeatureEnabled('platform')

export const AutomationRules: CollectionConfig = {
  slug: 'automation-rules',
  admin: {
    hidden: !emailMarketingFeatures.campaigns(),
    group: 'E-mail Marketing',
    useAsTitle: 'name',
    defaultColumns: isPlatformMode
      ? ['name', 'trigger', 'status', 'stats', 'tenant', 'updatedAt']
      : ['name', 'trigger', 'status', 'stats', 'updatedAt'],
    description: 'Create event-driven automation rules for email campaigns',
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
      admin: {
        description: 'Internal name for this automation rule',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Describe what this automation does',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
      ],
      admin: {
        description: 'Only active rules will process events',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // TRIGGER CONFIGURATION
    // ═══════════════════════════════════════════════════════════
    {
      name: 'trigger',
      type: 'group',
      fields: [
        {
          name: 'eventType',
          type: 'select',
          required: true,
          options: [
            // User Events
            { label: '👤 User: Signed Up', value: 'user.signup' },
            { label: '👤 User: Profile Updated', value: 'user.updated' },
            { label: '👤 User: Logged In', value: 'user.login' },

            // Subscription Events
            { label: '📧 Subscriber: Added', value: 'subscriber.added' },
            { label: '📧 Subscriber: Confirmed', value: 'subscriber.confirmed' },
            { label: '📧 Subscriber: Unsubscribed', value: 'subscriber.unsubscribed' },
            { label: '📧 Subscriber: List Changed', value: 'subscriber.list_changed' },

            // E-commerce Events
            { label: '🛒 Order: Placed', value: 'order.placed' },
            { label: '🛒 Order: Completed', value: 'order.completed' },
            { label: '🛒 Order: Cancelled', value: 'order.cancelled' },
            { label: '🛒 Cart: Abandoned', value: 'cart.abandoned' },
            { label: '🛒 Product: Purchased', value: 'product.purchased' },

            // Engagement Events
            { label: '✉️ Email: Opened', value: 'email.opened' },
            { label: '✉️ Email: Clicked', value: 'email.clicked' },
            { label: '✉️ Email: Bounced', value: 'email.bounced' },
            { label: '✉️ Campaign: Completed', value: 'campaign.completed' },

            // Custom Events
            { label: '🔔 Custom: Event', value: 'custom.event' },
          ],
          admin: {
            description: 'Which event triggers this automation?',
          },
        },
        {
          name: 'customEventName',
          type: 'text',
          admin: {
            description: 'Custom event name (when event type is "custom.event")',
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
      admin: {
        description: 'Optional: Add conditions to filter when this automation runs',
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
      admin: {
        description: 'Actions to perform when this rule is triggered',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: '📧 Send Email Template', value: 'send_email' },
            { label: '📝 Add to List', value: 'add_to_list' },
            { label: '🗑️ Remove from List', value: 'remove_from_list' },
            { label: '🏷️ Add Tag', value: 'add_tag' },
            { label: '🏷️ Remove Tag', value: 'remove_tag' },
            { label: '⏰ Wait (Delay)', value: 'wait' },
            { label: '🔗 Webhook', value: 'webhook' },
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
      fields: [
        {
          name: 'delayEnabled',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Add a delay before executing this rule?',
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
                description: 'Delay duration',
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
        {
          name: 'maxExecutions',
          type: 'number',
          admin: {
            description: 'Max times this rule can trigger per user (leave empty for unlimited)',
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
