import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

export const SupportCategories: CollectionConfig = {
  slug: 'support-categories',
  labels: {
    singular: 'Support Categorie',
    plural: 'Support Categorieën',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Support',
    defaultColumns: ['name', 'slug', 'icon', 'isActive'],
    description: 'Categorieën voor support tickets',
    hidden: shouldHideCollection('support'),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Automatisch gegenereerd uit naam',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (!value && siblingData?.name) {
              return siblingData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Icoon',
      options: [
        { label: 'Headset', value: 'headset' },
        { label: 'Bug', value: 'bug' },
        { label: 'Vraag', value: 'question' },
        { label: 'Instellingen', value: 'settings' },
        { label: 'Pakket', value: 'package' },
        { label: 'Betaling', value: 'credit-card' },
        { label: 'Beveiliging', value: 'shield' },
        { label: 'Bliksem', value: 'zap' },
      ],
    },
    {
      name: 'parentCategory',
      type: 'relationship',
      relationTo: 'support-categories',
      label: 'Bovenliggende categorie',
      admin: {
        description: 'Optioneel: maak een subcategorie',
      },
    },
    {
      name: 'autoAssignTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Automatisch toewijzen aan',
      admin: {
        description: 'Nieuwe tickets in deze categorie worden automatisch toegewezen',
      },
    },
    {
      name: 'sla',
      type: 'group',
      label: 'SLA',
      fields: [
        {
          name: 'responseTimeHours',
          type: 'number',
          label: 'Responstijd (uren)',
          defaultValue: 24,
          admin: {
            description: 'Max. tijd voor eerste reactie',
          },
        },
        {
          name: 'resolutionTimeHours',
          type: 'number',
          label: 'Oplostijd (uren)',
          defaultValue: 72,
          admin: {
            description: 'Max. tijd voor oplossing',
          },
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Actief',
      defaultValue: true,
    },
  ],
}
