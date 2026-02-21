import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'
import { shouldHideOnPlatform } from '@/lib/shouldHideCollection'

export const LoyaltyTransactions: CollectionConfig = {
  slug: 'loyalty-transactions',
  labels: {
    singular: 'Loyalty Transaction',
    plural: 'Loyalty Transactions',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Loyalty Program',
    defaultColumns: ['user', 'type', 'points', 'description', 'createdAt'],
    description: 'Points earning and spending history',
    hidden: shouldHideOnPlatform(),
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
      label: 'User',
      hasMany: false,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Transaction Type',
      options: [
        { label: 'Earned - Purchase', value: 'earned_purchase' },
        { label: 'Earned - Review', value: 'earned_review' },
        { label: 'Earned - Referral', value: 'earned_referral' },
        { label: 'Earned - Birthday', value: 'earned_birthday' },
        { label: 'Earned - Bonus', value: 'earned_bonus' },
        { label: 'Spent - Reward', value: 'spent_reward' },
        { label: 'Expired', value: 'expired' },
        { label: 'Adjustment', value: 'adjustment' },
      ],
    },
    {
      name: 'points',
      type: 'number',
      required: true,
      label: 'Points',
      admin: {
        description: 'Positive for earning, negative for spending',
      },
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Description',
      admin: {
        description: 'e.g., "Order #DS-2026-0847" or "Review written"',
      },
    },
    {
      name: 'relatedOrder',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Related Order',
      hasMany: false,
    },
    {
      name: 'relatedReward',
      type: 'relationship',
      relationTo: 'loyalty-rewards',
      label: 'Related Reward',
      hasMany: false,
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Metadata',
      admin: {
        description: 'Additional data (JSON)',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expires At',
      admin: {
        description: 'When these points expire (optional)',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
  ],
}
