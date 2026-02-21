import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'

export const LoyaltyRewards: CollectionConfig = {
  slug: 'loyalty-rewards',
  labels: {
    singular: 'Loyalty Reward',
    plural: 'Loyalty Rewards',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Loyalty Program',
    defaultColumns: ['name', 'pointsCost', 'type', 'active', 'updatedAt'],
    description: 'Rewards that users can redeem with points',
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
      label: 'Reward Name',
      admin: {
        description: 'e.g., €5 discount, Free shipping, VIP Event access',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon Emoji',
      admin: {
        description: 'e.g., 🏷️ 🚚 🎁',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Reward Type',
      options: [
        { label: 'Discount', value: 'discount' },
        { label: 'Free Shipping', value: 'shipping' },
        { label: 'Gift', value: 'gift' },
        { label: 'Upgrade', value: 'upgrade' },
        { label: 'Event Access', value: 'event' },
        { label: 'Merchandise', value: 'merchandise' },
      ],
      defaultValue: 'discount',
    },
    {
      name: 'pointsCost',
      type: 'number',
      required: true,
      label: 'Points Cost',
      admin: {
        description: 'How many points to redeem this reward',
      },
    },
    {
      name: 'value',
      type: 'number',
      label: 'Monetary Value (€)',
      admin: {
        description: 'For discounts and gifts',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Available for redemption',
      },
    },
    {
      name: 'stock',
      type: 'number',
      label: 'Stock Quantity',
      admin: {
        description: 'Leave empty for unlimited',
      },
    },
    {
      name: 'tierRequired',
      type: 'relationship',
      relationTo: 'loyalty-tiers',
      label: 'Required Tier',
      hasMany: false,
      admin: {
        description: 'Minimum tier required (optional)',
      },
    },
    {
      name: 'expiryDays',
      type: 'number',
      label: 'Expiry Days',
      admin: {
        description: 'Days until reward expires after redemption',
      },
    },
    {
      name: 'terms',
      type: 'textarea',
      label: 'Terms & Conditions',
    },
  ],
}
