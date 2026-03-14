import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'

/**
 * Vehicle Brands Collection — Automotive Branch
 *
 * Beheer van voertuigmerken (bijv. Volkswagen, BMW, Toyota).
 * Wordt gebruikt als relatie in de Vehicles collection.
 */
export const VehicleBrands: CollectionConfig = {
  slug: 'vehicle-brands',
  labels: {
    singular: 'Voertuigmerk',
    plural: 'Voertuigmerken',
  },
  admin: {
    group: 'Automotive',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
    hidden: shouldHideCollection('automotive'),
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
      admin: {
        description: 'Bijv. Volkswagen, BMW, Toyota',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      hooks: {
        beforeValidate: [autoGenerateSlugFromName],
      },
      admin: {
        description: 'Automatisch gegenereerd uit de naam',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: {
        description: 'Merklogo (voorkeur: SVG of PNG met transparante achtergrond)',
      },
    },
    {
      name: 'popularModels',
      type: 'array',
      label: 'Populaire modellen',
      admin: {
        description: 'Veelvoorkomende modellen van dit merk',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Modelnaam',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Volgorde',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Sorteer volgorde (lager = eerder getoond)',
      },
    },
  ],
}
