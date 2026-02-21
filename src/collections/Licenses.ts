import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const Licenses: CollectionConfig = {
  slug: 'licenses',
  labels: {
    singular: 'License',
    plural: 'Licenses',
  },
  admin: {
    useAsTitle: 'productName',
    group: 'Licenses',
    defaultColumns: ['productName', 'user', 'licenseKey', 'type', 'status', 'updatedAt'],
    description: 'Software licenses and digital products',
    hidden: shouldHideCollection('licenses'),
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
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      label: 'Product',
      hasMany: false,
      admin: {
        description: 'Link to product if applicable',
      },
    },
    {
      name: 'productName',
      type: 'text',
      required: true,
      label: 'Product Name',
      admin: {
        description: 'e.g., ProDesign Suite 4.2',
      },
    },
    {
      name: 'licenseKey',
      type: 'text',
      required: true,
      unique: true,
      label: 'License Key',
      admin: {
        description: 'e.g., PDSS-4K9X-M7B2-7A3F',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'License Type',
      options: [
        { label: 'Personal', value: 'personal' },
        { label: 'Professional', value: 'professional' },
        { label: 'Enterprise', value: 'enterprise' },
        { label: 'Lifetime', value: 'lifetime' },
        { label: 'Yearly', value: 'yearly' },
        { label: 'E-book', value: 'ebook' },
        { label: 'Templates', value: 'templates' },
      ],
      defaultValue: 'personal',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Revoked', value: 'revoked' },
        { label: 'Pending Renewal', value: 'pending_renewal' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'maxActivations',
      type: 'number',
      label: 'Max Activations',
      defaultValue: 1,
      admin: {
        description: 'Maximum number of devices',
      },
    },
    {
      name: 'currentActivations',
      type: 'number',
      label: 'Current Activations',
      defaultValue: 0,
      admin: {
        description: 'Number of active devices',
      },
    },
    {
      name: 'version',
      type: 'text',
      label: 'Product Version',
      admin: {
        description: 'e.g., v4.2.0',
      },
    },
    {
      name: 'purchasedAt',
      type: 'date',
      required: true,
      label: 'Purchase Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expiration Date',
      admin: {
        description: 'Leave empty for lifetime licenses',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Order',
      hasMany: false,
      admin: {
        description: 'Original purchase order',
      },
    },
    {
      name: 'downloadUrl',
      type: 'text',
      label: 'Download URL',
      admin: {
        description: 'Direct download link',
      },
    },
    {
      name: 'downloads',
      type: 'array',
      label: 'Download History',
      fields: [
        {
          name: 'version',
          type: 'text',
          required: true,
        },
        {
          name: 'downloadedAt',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'fileSize',
          type: 'text',
          label: 'File Size (MB)',
        },
      ],
    },
  ],
}
