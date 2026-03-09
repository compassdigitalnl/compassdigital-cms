import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlug } from '@/utilities/slugify'
import { autoFillSEO, autoSetPublishedDate } from '@/features/seo/lib/seoAutoFill'

export const Cases: CollectionConfig = {
  slug: 'cases',
  admin: {
    group: 'Marketing',
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'updatedAt'],
    hidden: shouldHideCollection('cases'),
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
        description: 'Auto-gegenereerd uit titel (kan handmatig overschreven worden)',
      },
      hooks: {
        beforeValidate: [autoGenerateSlug],
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
  hooks: {
    beforeChange: [
      autoFillSEO, // Auto-fill meta title, description, OG image
      autoSetPublishedDate, // Auto-set published date on status change
    ],
  },
}
export default Cases
