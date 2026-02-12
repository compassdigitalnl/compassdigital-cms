import type { CollectionConfig } from 'payload'

export const CustomerGroups: CollectionConfig = {
  slug: 'customer-groups',
  labels: {
    singular: 'Klantengroep',
    plural: 'Klantengroepen',
  },
  admin: {
    useAsTitle: 'name',
    group: 'E-commerce',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'b2c',
      options: [
        { label: 'B2C (Consument)', value: 'b2c' },
        { label: 'B2B (Zakelijk)', value: 'b2b' },
      ],
    },
    {
      name: 'discount',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      max: 100,
    },
    {
      name: 'priority',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 1,
      max: 100,
    },
    {
      name: 'minOrderAmount',
      type: 'number',
      min: 0,
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'canViewCatalog',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'canPlaceOrders',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'canRequestQuotes',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'canDownloadInvoices',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'canViewOrderHistory',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
