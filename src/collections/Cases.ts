import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const Cases: CollectionConfig = {
  slug: 'cases',
  admin: {
    group: 'Marketing',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'updatedAt'],
    hidden: ({ user }) => checkRole(['admin'], user),
  },
  access: {
    read: () => true, // Publiek leesbaar
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL slug',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'client',
      type: 'text',
      required: true,
      label: 'Klant',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      label: 'Korte beschrijving',
      admin: {
        description: 'Korte samenvatting voor in overzichten (max 160 tekens)',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Hoofdafbeelding',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Uitgebreide beschrijving',
    },
    {
      name: 'services',
      type: 'array',
      label: 'Diensten',
      fields: [
        {
          name: 'service',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'liveUrl',
      type: 'text',
      label: 'Live website URL',
      admin: {
        placeholder: 'https://example.com',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Afbeeldingen gallerij',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
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
