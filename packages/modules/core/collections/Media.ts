import type { CollectionConfig } from 'payload'

/**
 * Media Collection - Extended with metadata and organization
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
    group: 'Core',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  upload: {
    staticDir: 'media',
    staticURL: '/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 150,
        height: 150,
        position: 'centre',
      },
      {
        name: 'card',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 768,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'desktop',
        width: 1440,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*', 'application/pdf', 'video/*'],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Tekst',
      admin: {
        description: 'Beschrijving voor toegankelijkheid en SEO',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Bijschrift',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          label: 'Categorie',
          options: [
            { label: 'Product Afbeeldingen', value: 'product' },
            { label: 'Banners', value: 'banner' },
            { label: 'Content', value: 'content' },
            { label: 'Documenten', value: 'document' },
            { label: 'Video\'s', value: 'video' },
            { label: 'Overig', value: 'other' },
          ],
          admin: {
            width: '50%',
          },
        },
        {
          name: 'tags',
          type: 'text',
          label: 'Tags',
          hasMany: true,
          admin: {
            width: '50%',
            description: 'Komma-gescheiden tags voor zoeken',
          },
        },
      ],
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Gekoppelde Producten',
      admin: {
        description: 'Producten waar deze media bij hoort',
      },
    },
    {
      type: 'collapsible',
      label: 'Metadata',
      fields: [
        {
          name: 'copyright',
          type: 'text',
          label: 'Copyright',
        },
        {
          name: 'photographer',
          type: 'text',
          label: 'Fotograaf/Auteur',
        },
        {
          name: 'source',
          type: 'text',
          label: 'Bron',
        },
        {
          name: 'license',
          type: 'select',
          label: 'Licentie',
          options: [
            { label: 'Copyright', value: 'copyright' },
            { label: 'Creative Commons', value: 'cc' },
            { label: 'Public Domain', value: 'public' },
            { label: 'Royalty Free', value: 'royalty-free' },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
