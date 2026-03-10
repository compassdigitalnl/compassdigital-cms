import type { CollectionConfig } from 'payload'
import { publicAccess } from '@/access/publicAccess'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { slugField } from 'payload'

export const ExperienceCategories: CollectionConfig = {
  slug: 'experience-categories',
  labels: {
    singular: 'Ervaring Categorie',
    plural: 'Ervaring Categorieën',
  },
  access: {
    read: publicAccess,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('experiences'),
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order', 'updatedAt'],
    group: 'Ervaringen',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
      admin: {
        description: 'Naam van de categorie (bijv. "Teambuilding", "Outdoor")',
      },
    },
    slugField(),
    {
      name: 'icon',
      type: 'text',
      label: 'Icon',
      admin: {
        description: 'Emoji voor de categorie (bijv. "🎉", "🏔️")',
        placeholder: '🎉',
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Omschrijving',
      admin: {
        description: 'Korte omschrijving van de categorie',
        rows: 3,
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Afbeelding',
      admin: {
        description: 'Afbeelding voor de categorie',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Volgorde',
      defaultValue: 0,
      admin: {
        description: 'Sorteervolgorde (lager = eerder)',
        position: 'sidebar',
      },
    },
  ],
}

export default ExperienceCategories
