import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'

export const UserSubscriptions: CollectionConfig = {
  slug: 'user-subscriptions',
  labels: {
    singular: 'User Subscription',
    plural: 'User Subscriptions',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Subscriptions',
    defaultColumns: ['user', 'plan', 'status', 'currentPeriodEnd', 'updatedAt'],
    description: 'Active user subscriptions',
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
      name: 'plan',
      type: 'relationship',
      relationTo: 'subscription-plans',
      required: true,
      label: 'Subscription Plan',
      hasMany: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Trialing', value: 'trialing' },
        { label: 'Past Due', value: 'past_due' },
        { label: 'Canceled', value: 'canceled' },
        { label: 'Unpaid', value: 'unpaid' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Start Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'currentPeriodStart',
      type: 'date',
      required: true,
      label: 'Current Period Start',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'currentPeriodEnd',
      type: 'date',
      required: true,
      label: 'Current Period End',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'cancelAtPeriodEnd',
      type: 'checkbox',
      label: 'Cancel at Period End',
      defaultValue: false,
      admin: {
        description: 'Subscription will cancel when current period ends',
      },
    },
    {
      name: 'canceledAt',
      type: 'date',
      label: 'Canceled At',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'usage',
      type: 'group',
      label: 'Current Usage',
      fields: [
        {
          name: 'users',
          type: 'number',
          label: 'Active Users',
          defaultValue: 1,
        },
        {
          name: 'storage',
          type: 'number',
          label: 'Storage Used (GB)',
          defaultValue: 0,
        },
        {
          name: 'apiCalls',
          type: 'number',
          label: 'API Calls This Month',
          defaultValue: 0,
        },
      ],
    },
    {
      name: 'addons',
      type: 'array',
      label: 'Add-ons',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          required: true,
        },
        {
          name: 'addedAt',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'stripeSubscriptionId',
      type: 'text',
      label: 'Stripe Subscription ID',
      admin: {
        description: 'Stripe integration',
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      label: 'Stripe Customer ID',
      admin: {
        description: 'Stripe integration',
      },
    },
  ],
}
