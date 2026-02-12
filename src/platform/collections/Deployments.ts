/**
 * 🚀 Deployments Collection
 *
 * Tracks deployment history for all client sites.
 * Maintains audit trail of all deployment activities.
 */

import type { CollectionConfig } from 'payload'

export const Deployments: CollectionConfig = {
  slug: 'deployments',
  admin: {
    useAsTitle: 'id',
    group: 'Platform Management',
    defaultColumns: ['client', 'status', 'environment', 'createdAt'],
    description: 'Deployment history and audit trail',
  },
  access: {
    // Only platform admins can manage deployments
    // For now, allow all authenticated users
    read: ({ req: { user } }) => {
      return !!user // Must be logged in
      // TODO: Add role check when Users collection supports custom roles
    },
    create: ({ req: { user } }) => {
      return !!user
      // TODO: Add role check
    },
    update: ({ req: { user } }) => {
      return !!user
      // TODO: Add role check
    },
    delete: ({ req: { user } }) => {
      return !!user
      // TODO: Add role check
    },
  },
  fields: [
    // Client Reference
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      label: 'Client',
      admin: {
        description: 'The client this deployment belongs to',
      },
    },

    // Deployment Info
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          label: 'Status',
          options: [
            { label: '⏳ Pending', value: 'pending' },
            { label: '🔄 In Progress', value: 'in_progress' },
            { label: '✅ Success', value: 'success' },
            { label: '❌ Failed', value: 'failed' },
            { label: '🔙 Rolled Back', value: 'rolled_back' },
            { label: '🚫 Cancelled', value: 'cancelled' },
          ],
        },
        {
          name: 'environment',
          type: 'select',
          required: true,
          defaultValue: 'production',
          label: 'Environment',
          options: [
            { label: 'Production', value: 'production' },
            { label: 'Staging', value: 'staging' },
            { label: 'Development', value: 'development' },
          ],
        },
      ],
    },

    // Deployment Type
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Deployment Type',
      options: [
        { label: 'Initial Provision', value: 'initial' },
        { label: 'Update', value: 'update' },
        { label: 'Hotfix', value: 'hotfix' },
        { label: 'Rollback', value: 'rollback' },
        { label: 'Migration', value: 'migration' },
      ],
    },

    // Version & Git Info
    {
      type: 'collapsible',
      label: 'Version Information',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'version',
              type: 'text',
              label: 'Version',
              admin: {
                description: 'Semantic version (e.g., 1.2.3)',
              },
            },
            {
              name: 'gitCommit',
              type: 'text',
              label: 'Git Commit Hash',
              admin: {
                description: 'Git commit SHA',
              },
            },
          ],
        },
        {
          name: 'gitBranch',
          type: 'text',
          label: 'Git Branch',
        },
      ],
    },

    // Vercel Integration
    {
      type: 'collapsible',
      label: 'Vercel Deployment',
      fields: [
        {
          name: 'vercelDeploymentId',
          type: 'text',
          label: 'Vercel Deployment ID',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'vercelDeploymentUrl',
          type: 'text',
          label: 'Vercel Deployment URL',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'vercelProjectId',
          type: 'text',
          label: 'Vercel Project ID',
          admin: {
            readOnly: true,
          },
        },
      ],
    },

    // Timing
    {
      type: 'collapsible',
      label: 'Timing',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'startedAt',
              type: 'date',
              label: 'Started At',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'completedAt',
              type: 'date',
              label: 'Completed At',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
          ],
        },
        {
          name: 'duration',
          type: 'number',
          label: 'Duration (seconds)',
          admin: {
            description: 'Total deployment time in seconds',
            readOnly: true,
          },
        },
      ],
    },

    // Logs & Output
    {
      type: 'collapsible',
      label: 'Logs & Output',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'logs',
          type: 'textarea',
          label: 'Deployment Logs',
          admin: {
            description: 'Full deployment log output',
            rows: 15,
            readOnly: true,
          },
        },
        {
          name: 'errorMessage',
          type: 'textarea',
          label: 'Error Message',
          admin: {
            description: 'Error message if deployment failed',
            condition: (data) => data.status === 'failed',
          },
        },
        {
          name: 'errorStack',
          type: 'textarea',
          label: 'Error Stack Trace',
          admin: {
            description: 'Full error stack trace',
            condition: (data) => data.status === 'failed',
            rows: 10,
          },
        },
      ],
    },

    // Configuration Snapshot
    {
      type: 'collapsible',
      label: 'Configuration Snapshot',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'configSnapshot',
          type: 'json',
          label: 'Configuration at Deploy Time',
          admin: {
            description: 'Snapshot of client configuration when deployed',
          },
        },
        {
          name: 'environmentSnapshot',
          type: 'json',
          label: 'Environment Variables',
          admin: {
            description: 'Environment variables used (sensitive values redacted)',
          },
        },
      ],
    },

    // Metadata
    {
      type: 'collapsible',
      label: 'Metadata',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'triggeredBy',
          type: 'text',
          label: 'Triggered By',
          admin: {
            description: 'User or system that triggered the deployment',
          },
        },
        {
          name: 'reason',
          type: 'textarea',
          label: 'Deployment Reason',
          admin: {
            description: 'Why this deployment was triggered',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          label: 'Notes',
          admin: {
            description: 'Additional notes about this deployment',
          },
        },
      ],
    },

    // Health Check Results
    {
      type: 'collapsible',
      label: 'Post-Deployment Health',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'healthCheckPassed',
          type: 'checkbox',
          label: 'Health Check Passed',
          admin: {
            description: 'Did post-deployment health checks pass?',
          },
        },
        {
          name: 'healthCheckResults',
          type: 'json',
          label: 'Health Check Results',
          admin: {
            description: 'Detailed health check results',
          },
        },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Calculate duration if completed
        if (data.completedAt && data.startedAt) {
          const start = new Date(data.startedAt).getTime()
          const end = new Date(data.completedAt).getTime()
          data.duration = Math.round((end - start) / 1000) // seconds
        }

        // Auto-set startedAt if status changes to in_progress
        if (operation === 'update' && data.status === 'in_progress' && !data.startedAt) {
          data.startedAt = new Date().toISOString()
        }

        // Auto-set completedAt if status changes to success/failed
        if (
          operation === 'update' &&
          (data.status === 'success' || data.status === 'failed') &&
          !data.completedAt
        ) {
          data.completedAt = new Date().toISOString()
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        // Log deployment status changes
        if (operation === 'create') {
          console.log(`[Deployment] New deployment started for client ID: ${doc.client}`)
        }

        if (doc.status === 'success') {
          console.log(`[Deployment] Deployment ${doc.id} completed successfully in ${doc.duration}s`)
        }

        if (doc.status === 'failed') {
          console.error(`[Deployment] Deployment ${doc.id} failed: ${doc.errorMessage}`)
        }
      },
    ],
  },
}
