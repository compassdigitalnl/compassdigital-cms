/**
 * Email Events Collection
 *
 * Tracks all email activity for billing and analytics
 * Events: sent, delivered, opened, clicked, bounced, complained, unsubscribed
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/features'
import { isAdmin, checkRole, isUser, getUserClient } from '@/access/utilities'

const isPlatformMode = isFeatureEnabled('platform')

export const EmailEvents: CollectionConfig = {
  slug: 'email-events',
  admin: {
    hidden: !emailMarketingFeatures.campaigns(),
    group: 'E-mail Marketing',
    useAsTitle: 'id',
    defaultColumns: ['type', 'campaign', 'subscriber', 'createdAt'],
    description: 'Email activity tracking for billing and analytics',
  },
  access: {
    // Tenant isolation
    read: ({ req: { user } }) => {
      if (!user) return false
      if (checkRole(['super-admin'], user)) return true
      const clientId = getUserClient(user)
      if (clientId) {
        return {
          tenant: {
            equals: clientId,
          },
        }
      }
      return false
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['super-admin'], user) || isAdmin(user)
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['super-admin'], user)
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return checkRole(['super-admin'], user)
    },
  },
  fields: [
    // ═══════════════════════════════════════════════════════════
    // EVENT TYPE
    // ═══════════════════════════════════════════════════════════
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Sent', value: 'sent' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Opened', value: 'opened' },
        { label: 'Clicked', value: 'clicked' },
        { label: 'Bounced', value: 'bounced' },
        { label: 'Complained (Spam)', value: 'complained' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        description: 'Type of email event',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // REFERENCES
    // ═══════════════════════════════════════════════════════════
    {
      name: 'campaign',
      type: 'relationship',
      relationTo: 'email-campaigns',
      admin: {
        description: 'Campaign this event belongs to (if applicable)',
      },
    },
    {
      name: 'subscriber',
      type: 'relationship',
      relationTo: 'email-subscribers',
      required: true,
      admin: {
        description: 'Subscriber who received this email',
      },
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'email-templates',
      admin: {
        description: 'Template used (if applicable)',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // EVENT METADATA
    // ═══════════════════════════════════════════════════════════
    {
      name: 'messageId',
      type: 'text',
      admin: {
        description: 'Email provider message ID (for tracking)',
      },
    },
    {
      name: 'subject',
      type: 'text',
      admin: {
        description: 'Email subject line',
      },
    },
    {
      name: 'recipientEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Recipient email address',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // EVENT DETAILS (for specific event types)
    // ═══════════════════════════════════════════════════════════
    {
      name: 'clickedUrl',
      type: 'text',
      admin: {
        description: 'URL that was clicked (for click events)',
        condition: (data) => data?.type === 'clicked',
      },
    },
    {
      name: 'bounceType',
      type: 'select',
      options: [
        { label: 'Hard Bounce', value: 'hard' },
        { label: 'Soft Bounce', value: 'soft' },
      ],
      admin: {
        description: 'Type of bounce (for bounce events)',
        condition: (data) => data?.type === 'bounced',
      },
    },
    {
      name: 'bounceReason',
      type: 'textarea',
      admin: {
        description: 'Bounce reason details',
        condition: (data) => data?.type === 'bounced',
      },
    },
    {
      name: 'failureReason',
      type: 'textarea',
      admin: {
        description: 'Failure reason (for failed events)',
        condition: (data) => data?.type === 'failed',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // METADATA & CONTEXT
    // ═══════════════════════════════════════════════════════════
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional event metadata (IP, user agent, etc.)',
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'campaign',
      options: [
        { label: 'Campaign', value: 'campaign' },
        { label: 'Automation Rule', value: 'automation' },
        { label: 'Flow', value: 'flow' },
        { label: 'Transactional', value: 'transactional' },
      ],
      admin: {
        description: 'Source of this email send',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // TENANT & TIMESTAMP
    // ═══════════════════════════════════════════════════════════
    ...(isPlatformMode
      ? [
          {
            name: 'tenant',
            type: 'relationship',
            relationTo: 'clients' as const,
            required: true,
            admin: {
              position: 'sidebar',
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
          } as any,
        ]
      : []),
  ],
  timestamps: true, // createdAt, updatedAt
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Ensure recipientEmail is populated from subscriber if missing
        if (operation === 'create' && !data.recipientEmail && data.subscriber) {
          // Will be populated by worker/service
        }
        return data
      },
    ],
  },
}
