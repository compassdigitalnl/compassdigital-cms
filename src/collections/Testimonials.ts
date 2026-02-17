import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'rating', 'updatedAt'],
    hidden: ({ user }) => checkRole(['admin'], user),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Naam',
    },
    {
      name: 'role',
      type: 'text',
      label: 'Functie',
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      label: 'Bedrijf',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Foto',
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Review tekst',
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      label: 'Beoordeling',
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: {
        description: 'Sterren (1-5)',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: {
        description: 'Toon op homepage',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Gepubliceerd', value: 'published' },
        { label: 'Concept', value: 'draft' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
