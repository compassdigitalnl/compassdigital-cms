import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'

export const SubscriptionPlans: CollectionConfig = {
  slug: 'subscription-plans',
  labels: {
    singular: 'Subscription Plan',
    plural: 'Subscription Plans',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Subscriptions',
    defaultColumns: ['name', 'price', 'billingInterval', 'active', 'updatedAt'],
    description: 'Available subscription plans and pricing tiers',
  },
  access: {
    read: () => true, // Public catalog
    create: ({ req: { user } }) => checkRole(['admin'], user),
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Plan Name',
      admin: {
        description: 'e.g., Starter, Professional, Enterprise',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-friendly identifier',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Features',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
        {
          name: 'included',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Price',
      admin: {
        description: 'Price in euros',
      },
    },
    {
      name: 'pricePerUser',
      type: 'number',
      label: 'Price Per User',
      admin: {
        description: 'For user-based pricing (e.g., €29 per user)',
      },
    },
    {
      name: 'billingInterval',
      type: 'select',
      required: true,
      label: 'Billing Interval',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
        { label: 'Lifetime', value: 'lifetime' },
      ],
      defaultValue: 'monthly',
    },
    {
      name: 'limits',
      type: 'group',
      label: 'Usage Limits',
      fields: [
        {
          name: 'users',
          type: 'number',
          label: 'Max Users',
        },
        {
          name: 'storage',
          type: 'number',
          label: 'Storage (GB)',
        },
        {
          name: 'apiCalls',
          type: 'number',
          label: 'API Calls per Month',
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Whether this plan is available for new subscriptions',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured',
      defaultValue: false,
      admin: {
        description: 'Highlight this plan (e.g., "Most Popular")',
      },
    },
    {
      name: 'stripeProductId',
      type: 'text',
      label: 'Stripe Product ID',
      admin: {
        description: 'Stripe integration',
      },
    },
    {
      name: 'stripePriceId',
      type: 'text',
      label: 'Stripe Price ID',
      admin: {
        description: 'Stripe integration',
      },
    },
  ],
}
