import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const PaymentMethods: CollectionConfig = {
  slug: 'payment-methods',
  labels: {
    singular: 'Payment Method',
    plural: 'Payment Methods',
  },
  admin: {
    useAsTitle: 'id',
    group: 'Subscriptions',
    defaultColumns: ['user', 'type', 'last4', 'isDefault', 'createdAt'],
    description: 'Saved payment methods for users',
    hidden: shouldHideCollection('subscriptions'),
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
    create: () => true, // Users can add payment methods
    update: ({ req: { user } }) => {
      if (checkRole(['admin'], user)) return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (checkRole(['admin'], user)) return true
      return {
        user: {
          equals: user?.id,
        },
      }
    },
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
      label: 'Payment Method Type',
      options: [
        { label: 'SEPA Direct Debit', value: 'sepa' },
        { label: 'Credit Card', value: 'card' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'iDEAL', value: 'ideal' },
      ],
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      label: 'Default Payment Method',
      defaultValue: false,
      admin: {
        description: 'Use this method for subscriptions',
      },
    },
    // SEPA fields
    {
      name: 'sepa',
      type: 'group',
      label: 'SEPA Direct Debit',
      admin: {
        condition: (data: any) => data.type === 'sepa',
      },
      fields: [
        {
          name: 'accountHolderName',
          type: 'text',
          label: 'Account Holder Name',
        },
        {
          name: 'iban',
          type: 'text',
          label: 'IBAN',
          admin: {
            description: 'Last 4 digits stored',
          },
        },
        {
          name: 'bankName',
          type: 'text',
          label: 'Bank Name',
        },
      ],
    },
    // Card fields
    {
      name: 'card',
      type: 'group',
      label: 'Credit/Debit Card',
      admin: {
        condition: (data: any) => data.type === 'card',
      },
      fields: [
        {
          name: 'brand',
          type: 'select',
          label: 'Card Brand',
          options: [
            { label: 'Visa', value: 'visa' },
            { label: 'Mastercard', value: 'mastercard' },
            { label: 'American Express', value: 'amex' },
          ],
        },
        {
          name: 'last4',
          type: 'text',
          label: 'Last 4 Digits',
        },
        {
          name: 'expiryMonth',
          type: 'number',
          label: 'Expiry Month',
        },
        {
          name: 'expiryYear',
          type: 'number',
          label: 'Expiry Year',
        },
      ],
    },
    {
      name: 'stripePaymentMethodId',
      type: 'text',
      label: 'Stripe Payment Method ID',
      admin: {
        description: 'Stripe integration',
      },
    },
    {
      name: 'last4',
      type: 'text',
      label: 'Last 4 Digits',
      admin: {
        description: 'Last 4 digits for display',
      },
    },
  ],
}
