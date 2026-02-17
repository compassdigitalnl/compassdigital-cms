/**
 * 👥 Clients Collection
 *
 * Manages all client sites in the multi-tenant platform.
 * Each client represents a separate deployed site.
 */

import type { CollectionConfig } from 'payload'
import { checkRole } from '../../access/utilities'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'name',
    group: 'Platform Management',
    defaultColumns: ['name', 'domain', 'template', 'status', 'createdAt'],
    description: 'Manage client sites and deployments',
    // Hide from non-admin users in the sidebar
    hidden: ({ user }) => !checkRole(['admin'], user),
  },
  access: {
    // Only admins (CompassDigital) can manage clients - never expose to editors/klanten
    read: ({ req: { user } }) => checkRole(['admin'], user),
    create: ({ req: { user } }) => checkRole(['admin'], user),
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    // Basic Information
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Client Name',
          admin: {
            description: 'Name of the client/company',
          },
        },
        {
          name: 'domain',
          type: 'text',
          required: true,
          unique: true,
          label: 'Domain',
          admin: {
            description: 'Subdomain for the client (e.g., "clientA" for clientA.yourplatform.com)',
          },
          validate: (val) => {
            if (!val) return 'Domain is required'
            if (!/^[a-z0-9-]+$/.test(val)) {
              return 'Domain must contain only lowercase letters, numbers, and hyphens'
            }
            return true
          },
        },
      ],
    },

    // Contact Information
    {
      type: 'collapsible',
      label: 'Contact Information',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              required: true,
              label: 'Contact Email',
              admin: {
                description: 'Primary contact email for the client',
              },
            },
            {
              name: 'contactName',
              type: 'text',
              label: 'Contact Name',
            },
          ],
        },
        {
          name: 'contactPhone',
          type: 'text',
          label: 'Phone Number',
        },
      ],
    },

    // Template Configuration
    {
      type: 'collapsible',
      label: 'Template & Features',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'template',
          type: 'select',
          required: true,
          label: 'Site Template',
          options: [
            { label: 'E-commerce Store', value: 'ecommerce' },
            { label: 'Blog & Magazine', value: 'blog' },
            { label: 'B2B Platform', value: 'b2b' },
            { label: 'Portfolio & Agency', value: 'portfolio' },
            { label: 'Corporate Website', value: 'corporate' },
          ],
          admin: {
            description: 'Base template for the client site',
          },
        },
        {
          name: 'enabledFeatures',
          type: 'array',
          label: 'Enabled Features',
          admin: {
            description: 'Additional features to enable for this client',
          },
          fields: [
            {
              name: 'feature',
              type: 'select',
              options: [
                { label: 'E-commerce', value: 'ecommerce' },
                { label: 'Blog', value: 'blog' },
                { label: 'Forms', value: 'forms' },
                { label: 'Authentication', value: 'authentication' },
                { label: 'Multi-language', value: 'multiLanguage' },
                { label: 'AI Features', value: 'ai' },
              ],
            },
          ],
        },
        {
          name: 'disabledCollections',
          type: 'array',
          label: 'Disabled Collections',
          admin: {
            description: 'Collections from template to disable for this client',
          },
          fields: [
            {
              name: 'collection',
              type: 'text',
            },
          ],
        },
      ],
    },

    // Deployment Information
    {
      type: 'collapsible',
      label: 'Deployment',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          label: 'Deployment Status',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Provisioning', value: 'provisioning' },
            { label: 'Deploying', value: 'deploying' },
            { label: 'Active', value: 'active' },
            { label: 'Failed', value: 'failed' },
            { label: 'Suspended', value: 'suspended' },
            { label: 'Archived', value: 'archived' },
          ],
          admin: {
            description: 'Current deployment status',
          },
        },
        {
          name: 'deploymentUrl',
          type: 'text',
          label: 'Deployment URL',
          admin: {
            description: 'Full URL to the deployed site',
            readOnly: true,
          },
        },
        {
          name: 'adminUrl',
          type: 'text',
          label: 'Admin Panel URL',
          admin: {
            description: 'URL to the client admin panel',
            readOnly: true,
          },
        },
        {
          name: 'deploymentProvider',
          type: 'select',
          label: 'Deployment Provider',
          options: [
            { label: 'Vercel', value: 'vercel' },
            { label: 'Ploi', value: 'ploi' },
            { label: 'Custom', value: 'custom' },
          ],
          admin: {
            description: 'Deployment platform used for this client',
            readOnly: true,
          },
        },
        {
          name: 'deploymentProviderId',
          type: 'text',
          label: 'Provider Project ID',
          admin: {
            description: 'Project/site identifier from deployment provider (Vercel, Ploi, etc.)',
            readOnly: true,
          },
        },
        {
          name: 'lastDeploymentId',
          type: 'text',
          label: 'Last Deployment ID',
          admin: {
            description: 'Most recent deployment identifier',
            readOnly: true,
          },
        },
        {
          name: 'lastDeployedAt',
          type: 'date',
          label: 'Last Deployed',
          admin: {
            description: 'Timestamp of most recent deployment',
            readOnly: true,
          },
        },
        {
          name: 'databaseUrl',
          type: 'text',
          label: 'Database URL',
          admin: {
            description: 'PostgreSQL connection string (encrypted)',
            readOnly: true,
          },
        },
        {
          name: 'databaseProviderId',
          type: 'text',
          label: 'Database Provider ID',
          admin: {
            description: 'Railway service ID for the client database',
            readOnly: true,
          },
        },
      ],
    },

    // Configuration & Settings
    {
      type: 'collapsible',
      label: 'Configuration',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'customEnvironment',
          type: 'json',
          label: 'Custom Environment Variables',
          admin: {
            description: 'Additional environment variables for this client',
          },
        },
        {
          name: 'customSettings',
          type: 'json',
          label: 'Custom Settings',
          admin: {
            description: 'Client-specific settings and configuration',
          },
        },
      ],
    },

    // Billing & Subscription
    {
      type: 'collapsible',
      label: 'Billing',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'plan',
              type: 'select',
              label: 'Subscription Plan',
              options: [
                { label: 'Free', value: 'free' },
                { label: 'Starter', value: 'starter' },
                { label: 'Professional', value: 'professional' },
                { label: 'Enterprise', value: 'enterprise' },
              ],
              defaultValue: 'starter',
            },
            {
              name: 'billingStatus',
              type: 'select',
              label: 'Billing Status',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Past Due', value: 'past_due' },
                { label: 'Cancelled', value: 'cancelled' },
                { label: 'Trial', value: 'trial' },
              ],
              defaultValue: 'active',
            },
          ],
        },
        {
          name: 'monthlyFee',
          type: 'number',
          label: 'Monthly Fee (EUR)',
          admin: {
            description: 'Monthly subscription cost',
          },
        },
        {
          name: 'nextBillingDate',
          type: 'date',
          label: 'Next Billing Date',
        },
      ],
    },

    // Stripe Connect Payments
    {
      type: 'collapsible',
      label: 'Stripe Connect Payments',
      admin: {
        initCollapsed: true,
        description: 'Payment processing setup for e-commerce clients',
      },
      fields: [
        {
          name: 'paymentsEnabled',
          type: 'checkbox',
          label: 'Payments Enabled',
          defaultValue: false,
          admin: {
            description: 'Enable Stripe Connect payment processing for this client',
          },
        },
        {
          name: 'stripeAccountId',
          type: 'text',
          label: 'Stripe Account ID',
          admin: {
            description: 'Connected Stripe account ID (acct_...)',
            readOnly: true,
          },
        },
        {
          name: 'stripeAccountStatus',
          type: 'select',
          label: 'Stripe Account Status',
          options: [
            { label: 'Not Started', value: 'not_started' },
            { label: 'Pending', value: 'pending' },
            { label: 'Enabled', value: 'enabled' },
            { label: 'Rejected', value: 'rejected' },
            { label: 'Restricted', value: 'restricted' },
          ],
          defaultValue: 'not_started',
          admin: {
            description: 'Current onboarding status',
            readOnly: true,
          },
        },
        {
          name: 'paymentPricingTier',
          type: 'select',
          label: 'Payment Pricing Tier',
          options: [
            { label: 'Standard (2.4% + €0.25)', value: 'standard' },
            { label: 'Professional (1.9% + €0.25)', value: 'professional' },
            { label: 'Enterprise (1.6% + €0.20)', value: 'enterprise' },
            { label: 'Custom', value: 'custom' },
          ],
          defaultValue: 'standard',
          admin: {
            description: 'Transaction fee tier for this client',
            condition: (data) => data.paymentsEnabled === true,
          },
        },
        {
          name: 'customTransactionFee',
          type: 'group',
          label: 'Custom Transaction Fee',
          admin: {
            description: 'Custom pricing (only if tier is "custom")',
            condition: (data) => data.paymentPricingTier === 'custom',
          },
          fields: [
            {
              name: 'percentage',
              type: 'number',
              label: 'Percentage (%)',
              admin: {
                description: 'e.g., 1.5 for 1.5%',
                step: 0.1,
              },
            },
            {
              name: 'fixed',
              type: 'number',
              label: 'Fixed Fee (EUR)',
              admin: {
                description: 'e.g., 0.25 for €0.25',
                step: 0.01,
              },
            },
          ],
        },
        {
          name: 'totalPaymentVolume',
          type: 'number',
          label: 'Total Payment Volume (EUR)',
          admin: {
            description: 'Lifetime transaction volume processed',
            readOnly: true,
          },
        },
        {
          name: 'totalPaymentRevenue',
          type: 'number',
          label: 'Total Payment Revenue (EUR)',
          admin: {
            description: 'Lifetime platform fees earned from payments',
            readOnly: true,
          },
        },
        {
          name: 'lastPaymentAt',
          type: 'date',
          label: 'Last Payment',
          admin: {
            description: 'Most recent payment processed',
            readOnly: true,
          },
        },
      ],
    },

    // MultiSafePay Connect Payments
    {
      type: 'collapsible',
      label: 'MultiSafePay Connect Payments',
      admin: {
        initCollapsed: true,
        description: 'Payment processing via MultiSafePay (recommended for NL/EU markets)',
      },
      fields: [
        {
          name: 'multiSafepayEnabled',
          type: 'checkbox',
          label: 'MultiSafePay Enabled',
          defaultValue: false,
          admin: {
            description: 'Enable MultiSafePay Connect payment processing for this client',
          },
        },
        {
          name: 'multiSafepayAffiliateId',
          type: 'text',
          label: 'MultiSafePay Affiliate ID',
          admin: {
            description: 'Affiliate/sub-merchant ID',
            readOnly: true,
          },
        },
        {
          name: 'multiSafepayAccountStatus',
          type: 'select',
          label: 'MultiSafePay Account Status',
          options: [
            { label: 'Not Started', value: 'not_started' },
            { label: 'Pending Verification', value: 'pending' },
            { label: 'Active', value: 'active' },
            { label: 'Suspended', value: 'suspended' },
            { label: 'Rejected', value: 'rejected' },
          ],
          defaultValue: 'not_started',
          admin: {
            description: 'Current account status',
            readOnly: true,
          },
        },
        {
          name: 'multiSafepayPricingTier',
          type: 'select',
          label: 'MultiSafePay Pricing Tier',
          options: [
            { label: 'Standard (iDEAL €0.35, Cards 1.8%)', value: 'standard' },
            { label: 'Professional (iDEAL €0.30, Cards 1.6%)', value: 'professional' },
            { label: 'Enterprise (iDEAL €0.28, Cards 1.5%)', value: 'enterprise' },
            { label: 'Custom Partner Rates', value: 'custom' },
          ],
          defaultValue: 'standard',
          admin: {
            description: 'Transaction fee tier for this client (lower = better deal)',
            condition: (data) => data.multiSafepayEnabled === true,
          },
        },
        {
          name: 'multiSafepayCustomRates',
          type: 'group',
          label: 'Custom MultiSafePay Rates',
          admin: {
            description: 'Custom partner pricing (requires partner approval)',
            condition: (data) => data.multiSafepayPricingTier === 'custom',
          },
          fields: [
            {
              name: 'idealFee',
              type: 'number',
              label: 'iDEAL Fee (EUR)',
              admin: {
                description: 'e.g., 0.25 for €0.25 per transaction',
                step: 0.01,
              },
            },
            {
              name: 'cardPercentage',
              type: 'number',
              label: 'Card Percentage (%)',
              admin: {
                description: 'e.g., 1.5 for 1.5%',
                step: 0.1,
              },
            },
            {
              name: 'cardFixed',
              type: 'number',
              label: 'Card Fixed Fee (EUR)',
              admin: {
                description: 'e.g., 0.25 for €0.25',
                step: 0.01,
              },
            },
          ],
        },
        {
          name: 'multiSafepayTotalVolume',
          type: 'number',
          label: 'Total MultiSafePay Volume (EUR)',
          admin: {
            description: 'Lifetime transaction volume via MultiSafePay',
            readOnly: true,
          },
        },
        {
          name: 'multiSafepayTotalRevenue',
          type: 'number',
          label: 'Total MultiSafePay Revenue (EUR)',
          admin: {
            description: 'Lifetime platform fees earned from MultiSafePay payments',
            readOnly: true,
          },
        },
        {
          name: 'multiSafepayLastPaymentAt',
          type: 'date',
          label: 'Last MultiSafePay Payment',
          admin: {
            description: 'Most recent payment via MultiSafePay',
            readOnly: true,
          },
        },
      ],
    },

    // Health & Monitoring
    {
      type: 'collapsible',
      label: 'Health & Monitoring',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'lastHealthCheck',
          type: 'date',
          label: 'Last Health Check',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'healthStatus',
          type: 'select',
          label: 'Health Status',
          options: [
            { label: 'Healthy', value: 'healthy' },
            { label: 'Warning', value: 'warning' },
            { label: 'Critical', value: 'critical' },
            { label: 'Unknown', value: 'unknown' },
          ],
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'uptimePercentage',
          type: 'number',
          label: 'Uptime %',
          admin: {
            description: '30-day uptime percentage',
            readOnly: true,
          },
        },
      ],
    },

    // Notes & Internal
    {
      type: 'collapsible',
      label: 'Internal Notes',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'notes',
          type: 'textarea',
          label: 'Internal Notes',
          admin: {
            description: 'Notes for platform administrators (not visible to client)',
          },
        },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Auto-generate URLs on creation
        if (operation === 'create' && data.domain) {
          const baseUrl = process.env.PLATFORM_BASE_URL || 'yourplatform.com'
          data.deploymentUrl = `https://${data.domain}.${baseUrl}`
          data.adminUrl = `https://${data.domain}.${baseUrl}/admin`
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        // Log client creation
        if (operation === 'create') {
          console.log(`[Platform] New client created: ${doc.name} (${doc.domain})`)
        }
      },
    ],
  },
}
