/**
 * Email API Keys Collection
 *
 * Manages API keys for external access to email marketing endpoints
 * Provides scoped access with rate limiting and usage tracking
 */

import type { CollectionConfig } from 'payload'
import { emailMarketingFeatures, isFeatureEnabled } from '@/lib/features'
import crypto from 'crypto'
import { isAdmin, checkRole, isUser, isSuperAdmin, getUserClient } from '@/access/utilities'

/**
 * Generate a secure API key
 * Format: sk_live_[32 random bytes as hex] or sk_test_[32 random bytes as hex]
 */
function generateApiKey(environment: 'live' | 'test'): string {
  const randomBytes = crypto.randomBytes(32).toString('hex')
  return `sk_${environment}_${randomBytes}`
}

/**
 * Hash API key for secure storage
 * We store the hash, not the plaintext key
 */
function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex')
}

const isPlatformMode = isFeatureEnabled('platform')

export const EmailApiKeys: CollectionConfig = {
  slug: 'email-api-keys',
  admin: {
    hidden: !emailMarketingFeatures.isEnabled(),
    group: 'E-mail Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'keyPrefix', 'environment', 'status', 'tenant', 'lastUsedAt'],
    description: 'Manage API keys for email marketing API access',
  },
  access: {
    // Tenant isolation: users can only access their tenant's API keys
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

      // Single-tenant mode: user can read all API keys
      return true
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || isAdmin(user)
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || isAdmin(user)
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
      admin: {
        description: 'Friendly name to identify this API key (e.g., "Production API", "Staging Server")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description of what this key is used for',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // API KEY FIELDS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'keyHash',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'SHA-256 hash of the API key (for secure storage)',
        readOnly: true,
        hidden: true, // Never show the hash
      },
    },
    {
      name: 'keyPrefix',
      type: 'text',
      required: true,
      admin: {
        description: 'First 12 characters of the key (for identification)',
        readOnly: true,
      },
    },
    {
      name: 'environment',
      type: 'select',
      required: true,
      defaultValue: 'test',
      options: [
        { label: 'Live (Production)', value: 'live' },
        { label: 'Test (Development)', value: 'test' },
      ],
      admin: {
        description: 'Environment this key is for (live or test)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Revoked', value: 'revoked' },
      ],
      admin: {
        description: 'Key status (only active keys can be used)',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // SCOPES & PERMISSIONS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'scopes',
      type: 'select',
      required: true,
      hasMany: true,
      defaultValue: ['subscribers:read'],
      options: [
        // Subscribers
        { label: 'Read Subscribers', value: 'subscribers:read' },
        { label: 'Create Subscribers', value: 'subscribers:create' },
        { label: 'Update Subscribers', value: 'subscribers:update' },
        { label: 'Delete Subscribers', value: 'subscribers:delete' },

        // Lists
        { label: 'Read Lists', value: 'lists:read' },
        { label: 'Create Lists', value: 'lists:create' },
        { label: 'Update Lists', value: 'lists:update' },
        { label: 'Delete Lists', value: 'lists:delete' },

        // Campaigns
        { label: 'Read Campaigns', value: 'campaigns:read' },
        { label: 'Create Campaigns', value: 'campaigns:create' },
        { label: 'Update Campaigns', value: 'campaigns:update' },
        { label: 'Send Campaigns', value: 'campaigns:send' },
        { label: 'Delete Campaigns', value: 'campaigns:delete' },

        // Templates
        { label: 'Read Templates', value: 'templates:read' },
        { label: 'Create Templates', value: 'templates:create' },
        { label: 'Update Templates', value: 'templates:update' },
        { label: 'Delete Templates', value: 'templates:delete' },

        // Analytics
        { label: 'Read Analytics', value: 'analytics:read' },

        // Events
        { label: 'Send Webhook Events', value: 'events:send' },

        // Automation
        { label: 'Read Automation', value: 'automation:read' },
        { label: 'Trigger Automation', value: 'automation:trigger' },
      ],
      admin: {
        description: 'Permissions granted to this API key',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // RATE LIMITING
    // ═══════════════════════════════════════════════════════════
    {
      name: 'rateLimit',
      type: 'group',
      fields: [
        {
          name: 'requestsPerMinute',
          type: 'number',
          required: true,
          defaultValue: 60,
          min: 1,
          max: 1000,
          admin: {
            description: 'Maximum requests per minute for this key',
          },
        },
        {
          name: 'requestsPerHour',
          type: 'number',
          required: true,
          defaultValue: 1000,
          min: 1,
          max: 100000,
          admin: {
            description: 'Maximum requests per hour for this key',
          },
        },
        {
          name: 'requestsPerDay',
          type: 'number',
          required: true,
          defaultValue: 10000,
          min: 1,
          max: 1000000,
          admin: {
            description: 'Maximum requests per day for this key',
          },
        },
      ],
      admin: {
        description: 'Rate limiting configuration for this API key',
      },
    },

    // ═══════════════════════════════════════════════════════════
    // USAGE TRACKING
    // ═══════════════════════════════════════════════════════════
    {
      name: 'usage',
      type: 'group',
      admin: {
        description: 'Usage statistics for this API key',
        readOnly: true,
      },
      fields: [
        {
          name: 'totalRequests',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total requests made with this key',
            readOnly: true,
          },
        },
        {
          name: 'lastUsedAt',
          type: 'date',
          admin: {
            description: 'Last time this key was used',
            readOnly: true,
            date: {
              displayFormat: 'yyyy-MM-dd HH:mm:ss',
            },
          },
        },
        {
          name: 'lastUsedIp',
          type: 'text',
          admin: {
            description: 'IP address that last used this key',
            readOnly: true,
          },
        },
        {
          name: 'lastUsedEndpoint',
          type: 'text',
          admin: {
            description: 'Last endpoint accessed with this key',
            readOnly: true,
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════
    // SECURITY
    // ═══════════════════════════════════════════════════════════
    {
      name: 'security',
      type: 'group',
      fields: [
        {
          name: 'allowedIps',
          type: 'array',
          admin: {
            description: 'IP addresses allowed to use this key (empty = all IPs allowed)',
          },
          fields: [
            {
              name: 'ip',
              type: 'text',
              required: true,
              admin: {
                placeholder: '192.168.1.1 or 192.168.1.0/24',
              },
            },
          ],
        },
        {
          name: 'expiresAt',
          type: 'date',
          admin: {
            description: 'Optional expiry date for this key (empty = never expires)',
            date: {
              displayFormat: 'yyyy-MM-dd',
            },
          },
        },
        {
          name: 'rotatedFrom',
          type: 'text',
          admin: {
            description: 'Previous key hash (if this key was rotated)',
            readOnly: true,
            hidden: true,
          },
        },
        {
          name: 'rotatedAt',
          type: 'date',
          admin: {
            description: 'When this key was last rotated',
            readOnly: true,
            condition: (data) => !!data?.security?.rotatedFrom,
          },
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
    {
      name: 'createdBy',
      type: 'relationship' as const,
      relationTo: 'users' as const,
      admin: {
        description: 'User who created this API key',
        readOnly: true,
        position: 'sidebar' as const,
      },
      hooks: {
        beforeChange: [
          ({ req, value, operation }: any) => {
            if (operation === 'create' && req.user) {
              return req.user.id
            }
            return value
          },
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════
    // WEBHOOK NOTIFICATIONS
    // ═══════════════════════════════════════════════════════════
    {
      name: 'webhookUrl',
      type: 'text',
      admin: {
        description: 'Optional webhook URL to notify on key usage/errors',
        placeholder: 'https://example.com/webhooks/api-key-events',
      },
    },
  ],
  hooks: {
    // ═══════════════════════════════════════════════════════════
    // BEFORE CHANGE HOOK - GENERATE API KEY
    // ═══════════════════════════════════════════════════════════
    beforeChange: [
      async ({ data, operation, req }) => {
        // Only generate key on create
        if (operation !== 'create') {
          return data
        }

        const environment = data.environment || 'test'
        const apiKey = generateApiKey(environment)

        // Store hash (secure)
        data.keyHash = hashApiKey(apiKey)

        // Store prefix (for identification)
        data.keyPrefix = apiKey.substring(0, 12) + '...'

        // Initialize usage stats
        data.usage = {
          totalRequests: 0,
          lastUsedAt: null,
          lastUsedIp: null,
          lastUsedEndpoint: null,
        }

        // Show the full key ONCE to the user via flash message
        if (req?.payload) {
          // Store in context so we can show it after creation
          req.context = {
            ...req.context,
            generatedApiKey: apiKey,
          }
        }

        return data
      },
    ],

    // ═══════════════════════════════════════════════════════════
    // AFTER CHANGE HOOK - NOTIFY USER OF NEW KEY
    // ═══════════════════════════════════════════════════════════
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create' && req?.context?.generatedApiKey) {
          console.log('\n' + '═'.repeat(80))
          console.log('🔑 NEW API KEY CREATED')
          console.log('═'.repeat(80))
          console.log(`Name: ${doc.name}`)
          console.log(`Environment: ${doc.environment}`)
          console.log(`Key: ${req.context.generatedApiKey}`)
          console.log('\n⚠️  IMPORTANT: Save this key now! It will not be shown again.')
          console.log('═'.repeat(80) + '\n')

          // Note: In a real app, you'd display this in the admin UI
          // For now, we log it and rely on webhook notification
        }

        return doc
      },
    ],

    // ═══════════════════════════════════════════════════════════
    // BEFORE VALIDATE HOOK - VALIDATE SCOPES
    // ═══════════════════════════════════════════════════════════
    beforeValidate: [
      ({ data }) => {
        // Ensure at least one scope is selected
        if (data?.scopes && data.scopes.length === 0) {
          throw new Error('At least one scope must be selected')
        }

        // Validate IP addresses format (basic validation)
        if (data?.security?.allowedIps) {
          for (const ipEntry of data.security.allowedIps) {
            if (!ipEntry.ip) continue

            // Basic IP validation (IPv4 and CIDR)
            const ipPattern =
              /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/
            if (!ipPattern.test(ipEntry.ip)) {
              throw new Error(`Invalid IP address format: ${ipEntry.ip}`)
            }
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}
