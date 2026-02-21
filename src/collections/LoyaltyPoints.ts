import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const LoyaltyPoints: CollectionConfig = {
  slug: 'loyalty-points',
  labels: {
    singular: 'Loyalty Points Balance',
    plural: 'Loyalty Points Balances',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Loyalty Program',
    defaultColumns: ['user', 'availablePoints', 'totalEarned', 'tier', 'updatedAt'],
    description: 'User loyalty points balances',
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
    create: ({ req: { user } }) => checkRole(['admin'], user),
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      label: 'User',
      hasMany: false,
    },
    {
      name: 'availablePoints',
      type: 'number',
      required: true,
      label: 'Available Points',
      defaultValue: 0,
      admin: {
        description: 'Current spendable balance',
      },
    },
    {
      name: 'totalEarned',
      type: 'number',
      required: true,
      label: 'Total Points Earned',
      defaultValue: 0,
      admin: {
        description: 'Lifetime points earned (for tier calculation)',
      },
    },
    {
      name: 'totalSpent',
      type: 'number',
      required: true,
      label: 'Total Points Spent',
      defaultValue: 0,
      admin: {
        description: 'Lifetime points redeemed',
      },
    },
    {
      name: 'tier',
      type: 'relationship',
      relationTo: 'loyalty-tiers',
      label: 'Current Tier',
      hasMany: false,
      admin: {
        description: 'Calculated based on totalEarned',
      },
    },
    {
      name: 'stats',
      type: 'group',
      label: 'Statistics',
      fields: [
        {
          name: 'totalOrders',
          type: 'number',
          label: 'Total Orders',
          defaultValue: 0,
        },
        {
          name: 'totalSpentMoney',
          type: 'number',
          label: 'Total Spent (€)',
          defaultValue: 0,
        },
        {
          name: 'rewardsRedeemed',
          type: 'number',
          label: 'Rewards Redeemed',
          defaultValue: 0,
        },
        {
          name: 'referrals',
          type: 'number',
          label: 'Successful Referrals',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'referralCode',
      type: 'text',
      label: 'Referral Code',
      unique: true,
      admin: {
        description: 'Unique code for referring friends',
      },
    },
    {
      name: 'memberSince',
      type: 'date',
      label: 'Member Since',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
}
