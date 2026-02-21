import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const GiftVouchers: CollectionConfig = {
  slug: 'gift-vouchers',
  labels: {
    singular: 'Gift Voucher',
    plural: 'Gift Vouchers',
  },
  admin: {
    useAsTitle: 'code',
    group: 'Gift Vouchers',
    defaultColumns: ['code', 'recipientEmail', 'amount', 'balance', 'status', 'updatedAt'],
    description: 'Gift vouchers / cadeaubonnen',
    hidden: shouldHideCollection('giftVouchers'),
  },
  access: {
    read: ({ req: { user } }) => {
      if (checkRole(['admin'], user)) return true
      // Users can read their own vouchers
      return {
        or: [
          {
            recipientEmail: {
              equals: (user as any)?.email,
            },
          },
          {
            senderEmail: {
              equals: (user as any)?.email,
            },
          },
        ],
      }
    },
    create: () => true, // Anyone can purchase vouchers
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Voucher Code',
      admin: {
        description: 'e.g., GC-V8K2-M4N7',
        readOnly: true,
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Original Amount (€)',
      admin: {
        description: 'Original voucher value',
      },
    },
    {
      name: 'balance',
      type: 'number',
      required: true,
      label: 'Current Balance (€)',
      admin: {
        description: 'Remaining balance',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Fully Spent', value: 'spent' },
        { label: 'Expired', value: 'expired' },
        { label: 'Canceled', value: 'canceled' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'occasion',
      type: 'select',
      label: 'Occasion',
      options: [
        { label: 'Birthday', value: 'birthday', emoji: '🎂' },
        { label: 'Christmas', value: 'christmas', emoji: '🎄' },
        { label: 'Graduation', value: 'graduation', emoji: '🎓' },
        { label: 'Business', value: 'business', emoji: '💼' },
        { label: 'Love', value: 'love', emoji: '❤️' },
        { label: 'Thank You', value: 'thanks', emoji: '🙏' },
        { label: 'New Home', value: 'newhome', emoji: '🏠' },
        { label: 'Universal', value: 'universal', emoji: '✨' },
      ],
      defaultValue: 'universal',
    },
    {
      name: 'recipientName',
      type: 'text',
      label: 'Recipient Name',
    },
    {
      name: 'recipientEmail',
      type: 'email',
      required: true,
      label: 'Recipient Email',
    },
    {
      name: 'senderName',
      type: 'text',
      label: 'Sender Name',
    },
    {
      name: 'senderEmail',
      type: 'email',
      label: 'Sender Email',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Personal Message',
    },
    {
      name: 'deliveryMethod',
      type: 'select',
      required: true,
      label: 'Delivery Method',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Print', value: 'print' },
        { label: 'Post', value: 'post' },
      ],
      defaultValue: 'email',
    },
    {
      name: 'scheduledDelivery',
      type: 'date',
      label: 'Scheduled Delivery Date',
      admin: {
        description: 'Send voucher on specific date',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'sentAt',
      type: 'date',
      label: 'Sent At',
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
        description: 'Leave empty for no expiration',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'purchasedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Purchased By',
      hasMany: false,
    },
    {
      name: 'redeemedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Redeemed By',
      hasMany: false,
    },
  ],
}
