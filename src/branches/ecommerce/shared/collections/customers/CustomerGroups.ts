import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'

export const CustomerGroups: CollectionConfig = {
  slug: 'customer-groups',
  labels: {
    singular: 'Klantengroep',
    plural: 'Klantengroepen',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Webshop',
    hidden: shouldHideCollection('customerGroups'),
  },
  access: {
    read: () => true, // Customer groups are publicly readable (for pricing tiers)
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
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
          hooks: {
        beforeValidate: [autoGenerateSlugFromName],
      },
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
      label: 'Type',
      options: [
        { label: 'B2C (Consument)', value: 'b2c' },
        { label: 'B2B (Zakelijk)', value: 'b2b' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'discount',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      max: 100,
      label: 'Korting (%)',
      admin: {
        position: 'sidebar',
        description: 'Standaard korting voor deze groep',
      },
    },
    {
      name: 'priority',
      type: 'number',
      required: true,
      defaultValue: 50,
      min: 1,
      max: 100,
      label: 'Prioriteit',
      admin: {
        position: 'sidebar',
        description: 'Hogere waarde = hogere prioriteit',
      },
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
      label: 'Standaard groep',
      admin: {
        position: 'sidebar',
        description: 'Nieuwe klanten krijgen automatisch deze groep',
      },
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
export default CustomerGroups
