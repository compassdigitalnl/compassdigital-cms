/**
 * Flow Instances Collection
 *
 * Tracks individual user progress through automation flows
 * Each instance represents one user's journey through a flow
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/features'

const isPlatformMode = isFeatureEnabled('platform')

export const FlowInstances: CollectionConfig = {
  slug: 'flow-instances',
  admin: {
    hidden: !emailMarketingFeatures.campaigns(),
    group: 'E-mail Marketing',
    useAsTitle: 'id',
    defaultColumns: ['flow', 'subscriber', 'currentStep', 'status', 'startedAt'],
    description: 'Individual user progress through automation flows',
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

      // Single-tenant mode: user can read all flow instances
      return true
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'super-admin' || user.role === 'admin'
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'super-admin' || user.role === 'admin'
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'super-admin' || user.role === 'admin'
    },
  },
  fields: [
    // ═══════════════════════════════════════════════════════════
    // FLOW & USER REFERENCES
    // ═══════════════════════════════════════════════════════════
    {
      name: 'flow',
      type: 'relationship',
      relationTo: 'automation-flows',
      required: true,
      admin: {
        description: 'The flow this instance belongs to',
      },
    },
    {
      name: 'subscriber',
      type: 'relationship',
      relationTo: 'email-subscribers',
      required: true,
      admin: {
        description: 'The subscriber in this flow',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // FLOW STATE
    // ═══════════════════════════════════════════════════════════
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Exited', value: 'exited' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        description: 'Current status of this flow instance',
      },
    },
    {
      name: 'currentStep',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Current step index (0-indexed)',
      },
    },
    {
      name: 'currentStepName',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Name of current step (for display)',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // TIMING
    // ═══════════════════════════════════════════════════════════
    {
      name: 'startedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        description: 'When this instance started',
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        description: 'When this instance completed',
      },
    },
    {
      name: 'nextStepScheduledAt',
      type: 'date',
      admin: {
        description: 'When the next step is scheduled to execute',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // STEP HISTORY
    // ═══════════════════════════════════════════════════════════
    {
      name: 'stepHistory',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'History of steps executed in this flow',
      },
      fields: [
        {
          name: 'stepIndex',
          type: 'number',
          required: true,
        },
        {
          name: 'stepName',
          type: 'text',
          required: true,
        },
        {
          name: 'stepType',
          type: 'text',
          required: true,
        },
        {
          name: 'executedAt',
          type: 'date',
          required: true,
        },
        {
          name: 'success',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'error',
          type: 'textarea',
          admin: {
            description: 'Error message if step failed',
          },
        },
        {
          name: 'metadata',
          type: 'json',
          admin: {
            description: 'Additional step execution data',
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // CONTEXT DATA (Event payload that triggered entry)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'entryEventData',
      type: 'json',
      admin: {
        description: 'Event data that triggered entry into this flow',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // EXIT INFO
    // ═══════════════════════════════════════════════════════════
    {
      name: 'exitReason',
      type: 'text',
      admin: {
        description: 'Reason for exiting flow (if exited early)',
        condition: (data) => data?.status === 'exited',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // ERROR INFO
    // ═══════════════════════════════════════════════════════════
    {
      name: 'lastError',
      type: 'textarea',
      admin: {
        description: 'Last error encountered',
        condition: (data) => data?.status === 'failed',
      },
    },
    {
      name: 'retryCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of retries attempted',
      },
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
        // Initialize stepHistory on creation
        if (operation === 'create' && !data.stepHistory) {
          data.stepHistory = []
        }
        return data
      },
    ],
  },
}
