import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const LoyaltyRedemptions: CollectionConfig = {
  slug: 'loyalty-redemptions',
  labels: {
    singular: 'Loyalty Redemption',
    plural: 'Loyalty Redemptions',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Loyalty Program',
    defaultColumns: ['user', 'reward', 'status', 'redeemedAt', 'expiresAt'],
    description: 'Redeemed rewards and their status',
    hidden: shouldHideCollection('loyalty'),
  },
  access: {
    read: ({ req: { user } }) => {
      if (checkRole(['admin'], user)) return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
    create: () => true, // Users can redeem rewards
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'User',
      hasMany: false,
    },
    {
      name: 'reward',
      type: 'relationship',
      relationTo: 'loyalty-rewards',
      required: true,
      label: 'Reward',
      hasMany: false,
    },
    {
      name: 'pointsSpent',
      type: 'number',
      required: true,
      label: 'Points Spent',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Used', value: 'used' },
        { label: 'Expired', value: 'expired' },
        { label: 'Canceled', value: 'canceled' },
      ],
      defaultValue: 'available',
    },
    {
      name: 'redeemedAt',
      type: 'date',
      required: true,
      label: 'Redeemed At',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'usedAt',
      type: 'date',
      label: 'Used At',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expires At',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'code',
      type: 'text',
      label: 'Redemption Code',
      unique: true,
      admin: {
        description: 'Unique code to use the reward',
      },
    },
    {
      name: 'usedInOrder',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Used in Order',
      hasMany: false,
      admin: {
        description: 'Order where reward was applied',
      },
    },
  ],
}
