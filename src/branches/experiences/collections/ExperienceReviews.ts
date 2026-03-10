import type { CollectionConfig } from 'payload'
import { publicAccess } from '@/access/publicAccess'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'

export const ExperienceReviews: CollectionConfig = {
  slug: 'experience-reviews',
  labels: {
    singular: 'Ervaring Review',
    plural: 'Ervaring Reviews',
  },
  access: {
    read: publicAccess,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('experiences'),
    useAsTitle: 'author',
    defaultColumns: ['author', 'experience', 'overallRating', 'featured', 'status', 'updatedAt'],
    group: 'Ervaringen',
  },
  fields: [
    {
      name: 'experience',
      type: 'relationship',
      relationTo: 'experiences',
      required: true,
      label: 'Ervaring',
      admin: {
        description: 'Welke ervaring wordt beoordeeld',
      },
    },
    {
      name: 'author',
      type: 'text',
      required: true,
      label: 'Auteur',
      admin: {
        description: 'Naam van de reviewer',
      },
    },
    {
      name: 'authorInitials',
      type: 'text',
      label: 'Initialen',
      maxLength: 3,
      admin: {
        description: 'Initialen voor avatar (bijv. "JD")',
        position: 'sidebar',
      },
    },
    {
      name: 'groupType',
      type: 'text',
      label: 'Groepstype',
      admin: {
        description: 'Bijv. "Bedrijfsuitje · 80 personen", "Vrijgezellenfeest · 12 personen"',
      },
    },
    {
      name: 'date',
      type: 'date',
      label: 'Datum',
      admin: {
        description: 'Datum van de ervaring',
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'overallRating',
      type: 'number',
      required: true,
      min: 1,
      max: 10,
      label: 'Algemene beoordeling',
      admin: {
        description: 'Score van 1 tot 10',
        position: 'sidebar',
        step: 0.5,
      },
    },
    {
      name: 'ratings',
      type: 'group',
      label: 'Deelbeoordelingen',
      admin: {
        description: 'Scores per onderdeel (1-10)',
      },
      fields: [
        {
          name: 'organization',
          type: 'number',
          min: 1,
          max: 10,
          label: 'Organisatie',
          admin: {
            step: 0.5,
          },
        },
        {
          name: 'location',
          type: 'number',
          min: 1,
          max: 10,
          label: 'Locatie',
          admin: {
            step: 0.5,
          },
        },
        {
          name: 'foodDrink',
          type: 'number',
          min: 1,
          max: 10,
          label: 'Eten & Drinken',
          admin: {
            step: 0.5,
          },
        },
        {
          name: 'atmosphere',
          type: 'number',
          min: 1,
          max: 10,
          label: 'Sfeer',
          admin: {
            step: 0.5,
          },
        },
        {
          name: 'valueForMoney',
          type: 'number',
          min: 1,
          max: 10,
          label: 'Prijs-kwaliteit',
          admin: {
            step: 0.5,
          },
        },
      ],
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Review tekst',
      admin: {
        description: 'De volledige review',
        rows: 5,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: {
        description: 'Toon op homepage of ervaringenpagina',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'In afwachting', value: 'pending' },
        { label: 'Goedgekeurd', value: 'approved' },
        { label: 'Afgekeurd', value: 'rejected' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

export default ExperienceReviews
