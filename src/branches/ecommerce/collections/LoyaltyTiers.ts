import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const LoyaltyTiers: CollectionConfig = {
  slug: 'loyalty-tiers',
  labels: {
    singular: 'Loyalty Tier',
    plural: 'Loyalty Tiers',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Loyalty Program',
    defaultColumns: ['name', 'minPoints', 'multiplier', 'order'],
    description: 'Loyalty program tiers (Bronze, Silver, Gold, Platinum)',
    hidden: shouldHideCollection('loyalty'),
  },
  access: {
    read: () => true, // Public
    create: ({ req: { user } }) => checkRole(['admin'], user),
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tier Name',
      admin: {
        description: 'e.g., Bronze, Silver, Gold, Platinum',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon Emoji',
      admin: {
        description: 'e.g., 🥉 🥈 🥇 👑',
      },
    },
    {
      name: 'color',
      type: 'text',
      label: 'Color',
      admin: {
        description: 'Hex color code',
      },
    },
    {
      name: 'minPoints',
      type: 'number',
      required: true,
      label: 'Minimum Points Required',
      admin: {
        description: 'Points needed to reach this tier',
      },
    },
    {
      name: 'multiplier',
      type: 'number',
      required: true,
      label: 'Points Multiplier',
      defaultValue: 1,
      admin: {
        description: 'e.g., 2 = earn 2x points on purchases',
      },
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Benefits',
      fields: [
        {
          name: 'benefit',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'freeShipping',
      type: 'checkbox',
      label: 'Free Shipping',
      defaultValue: false,
    },
    {
      name: 'prioritySupport',
      type: 'checkbox',
      label: 'Priority Support',
      defaultValue: false,
    },
    {
      name: 'earlyAccess',
      type: 'checkbox',
      label: 'Early Access to Products',
      defaultValue: false,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first',
      },
    },
  ],
}
