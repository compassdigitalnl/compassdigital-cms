/**
 * API Keys Collection
 *
 * Manages API keys for external access to email marketing APIs
 *
 * Features:
 * - Secure API key generation (cryptographically random)
 * - Key expiration and rotation
 * - Scoped permissions
 * - Usage tracking
 * - IP whitelisting
 */

import type { CollectionConfig } from 'payload'
import { isAdmin, isSuperAdmin } from '@/access/roles'

export const ApiKeys: CollectionConfig = {
  slug: 'api-keys',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tenant', 'scopes', 'status', 'expiresAt'],
    group: 'Systeem',
    description: 'Manage API keys for external access to email marketing APIs',
  },
  access: {
    // Only admins and super-admins can manage API keys
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isSuperAdmin, // Only super-admins can delete
  },
  fields: [
    // Basic Information
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Descriptive name for this API key (e.g., "Production Server", "Webhook Integration")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description of what this key is used for',
      },
    },

    // Tenant Association
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      hasMany: false,
      admin: {
        description: 'Client/tenant that owns this API key',
      },
    },

    // API Key (hashed)
    {
      name: 'keyHash',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'SHA-256 hash of the API key (for security)',
      },
    },
    {
      name: 'keyPrefix',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        description: 'First 8 characters of the key (for identification)',
      },
    },

    // Permissions & Scopes
    {
      name: 'scopes',
      type: 'select',
      required: true,
      hasMany: true,
      options: [
        { label: 'Read Subscribers', value: 'subscribers:read' },
        { label: 'Write Subscribers', value: 'subscribers:write' },
        { label: 'Read Lists', value: 'lists:read' },
        { label: 'Write Lists', value: 'lists:write' },
        { label: 'Read Campaigns', value: 'campaigns:read' },
        { label: 'Write Campaigns', value: 'campaigns:write' },
        { label: 'Trigger Campaigns', value: 'campaigns:trigger' },
        { label: 'Read Templates', value: 'templates:read' },
        { label: 'Write Templates', value: 'templates:write' },
        { label: 'Trigger Automations', value: 'automations:trigger' },
        { label: 'Read Usage Stats', value: 'usage:read' },
        { label: 'Webhook Events', value: 'webhooks:write' },
        { label: 'Full Access', value: 'admin:*' },
      ],
      admin: {
        description: 'Permissions granted to this API key',
      },
    },

    // Status & Expiration
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Revoked', value: 'revoked' },
        { label: 'Expired', value: 'expired' },
      ],
      admin: {
        description: 'Current status of this API key',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'Optional expiration date (leave empty for no expiration)',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },

    // Security Settings
    {
      name: 'ipWhitelist',
      type: 'array',
      admin: {
        description: 'Optional IP addresses that can use this key (leave empty to allow all)',
      },
      fields: [
        {
          name: 'ip',
          type: 'text',
          required: true,
          admin: {
            placeholder: '192.168.1.1 or 10.0.0.0/24',
          },
        },
        {
          name: 'description',
          type: 'text',
          admin: {
            placeholder: 'e.g., "Office network"',
          },
        },
      ],
    },

    // Rate Limiting
    {
      name: 'rateLimit',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable custom rate limiting for this key',
          },
        },
        {
          name: 'maxRequests',
          type: 'number',
          defaultValue: 100,
          admin: {
            description: 'Maximum requests per minute',
            condition: (data, siblingData) => siblingData?.enabled === true,
          },
        },
      ],
    },

    // Usage Tracking
    {
      name: 'usage',
      type: 'group',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'totalRequests',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total number of API requests made with this key',
          },
        },
        {
          name: 'lastUsedAt',
          type: 'date',
          admin: {
            description: 'Last time this key was used',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'lastUsedIp',
          type: 'text',
          admin: {
            description: 'IP address of last request',
          },
        },
      ],
    },

    // Metadata
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'User who created this API key',
      },
    },
    {
      name: 'revokedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User who revoked this key',
        condition: (data) => data.status === 'revoked',
      },
    },
    {
      name: 'revokedAt',
      type: 'date',
      admin: {
        description: 'When this key was revoked',
        condition: (data) => data.status === 'revoked',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Set createdBy on creation
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }

        // Auto-set status to revoked if revoked fields are set
        if (data.revokedAt && !data.revokedBy) {
          data.status = 'revoked'
          if (req.user) {
            data.revokedBy = req.user.id
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}
