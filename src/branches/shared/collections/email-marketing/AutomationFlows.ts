/**
 * Automation Flows Collection
 *
 * Multi-step automation workflows with state tracking
 * Flows are sequences of actions executed over time for individual users
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/features'

const isPlatformMode = isFeatureEnabled('platform')

export const AutomationFlows: CollectionConfig = {
  slug: 'automation-flows',
  admin: {
    hidden: !emailMarketingFeatures.campaigns(),
    group: 'E-mail Marketing',
    useAsTitle: 'name',
    defaultColumns: isPlatformMode
      ? ['name', 'status', 'stats', 'tenant', 'updatedAt']
      : ['name', 'status', 'stats', 'updatedAt'],
    description: 'Multi-step automation workflows with state tracking',
  },
  access: {
    // Tenant isolation (only in multi-tenant/platform mode)
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'super-admin') return true

      // Multi-tenant mode: filter by tenant
      if (isPlatformMode && user.tenant) {
        return {
          tenant: {
            equals: user.tenant,
          },
        }
      }

      // Single-tenant mode: user can read all automation flows
      return true
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
    // BASIC INFORMATION
    // ═══════════════════════════════════════════════════════════
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Flow name (e.g., "Welcome Sequence", "Onboarding Flow")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Describe what this flow does',
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
        description: 'Only active flows will accept new entries',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // ENTRY TRIGGER
    // ═══════════════════════════════════════════════════════════
    {
      name: 'entryTrigger',
      type: 'group',
      admin: {
        description: 'What triggers users to enter this flow?',
      },
      fields: [
        {
          name: 'eventType',
          type: 'select',
          required: true,
          options: [
            { label: '👤 User: Signed Up', value: 'user.signup' },
            { label: '📧 Subscriber: Added', value: 'subscriber.added' },
            { label: '📧 Subscriber: Confirmed', value: 'subscriber.confirmed' },
            { label: '🛒 Order: Placed', value: 'order.placed' },
            { label: '🛒 Cart: Abandoned', value: 'cart.abandoned' },
            { label: '✉️ Email: Clicked', value: 'email.clicked' },
            { label: '🔔 Custom: Event', value: 'custom.event' },
          ],
          admin: {
            description: 'Which event starts this flow?',
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
    // ENTRY CONDITIONS (Optional)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'entryConditions',
      type: 'array',
      admin: {
        description: 'Optional: Add conditions to filter who can enter this flow',
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
      admin: {
        description: 'Flow steps (executed in sequence)',
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
            { label: '📧 Send Email', value: 'send_email' },
            { label: '⏰ Wait', value: 'wait' },
            { label: '📝 Add to List', value: 'add_to_list' },
            { label: '🗑️ Remove from List', value: 'remove_from_list' },
            { label: '🏷️ Add Tag', value: 'add_tag' },
            { label: '🏷️ Remove Tag', value: 'remove_tag' },
            { label: '🔀 Condition Check', value: 'condition' },
            { label: '🔗 Webhook', value: 'webhook' },
            { label: '🚪 Exit Flow', value: 'exit' },
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
      admin: {
        description: 'Optional: Conditions that will exit users from this flow early',
      },
      fields: [
        {
          name: 'eventType',
          type: 'select',
          options: [
            { label: 'User: Unsubscribed', value: 'subscriber.unsubscribed' },
            { label: 'Order: Placed', value: 'order.placed' },
            { label: 'Custom Event', value: 'custom.event' },
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
      fields: [
        {
          name: 'allowReentry',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Allow users to re-enter this flow after completion?',
          },
        },
        {
          name: 'maxEntriesPerUser',
          type: 'number',
          admin: {
            description: 'Max times a user can enter this flow (leave empty for unlimited)',
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
