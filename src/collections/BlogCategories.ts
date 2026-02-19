import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  labels: {
    singular: 'Blog Categorie',
    plural: 'Blog Categorieën',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Website',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    hidden: ({ user }) => (isClientDeployment() ? false : checkRole(['admin'], user)),
  },
  access: {
    read: () => true, // Public toegang voor blog categorieën
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Auto-generate slug from name if not provided
        if (!data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Categorie Naam',
      admin: {
        placeholder: 'Bijv: Nieuws, Tips, Tutorials',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Auto-gegenereerd uit categorie naam',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
      admin: {
        description: 'Korte beschrijving van deze categorie (optioneel)',
        rows: 3,
      },
    },
    {
      name: 'color',
      type: 'select',
      label: 'Kleur',
      defaultValue: 'blue',
      options: [
        { label: 'Blauw', value: 'blue' },
        { label: 'Groen', value: 'green' },
        { label: 'Rood', value: 'red' },
        { label: 'Paars', value: 'purple' },
        { label: 'Oranje', value: 'orange' },
        { label: 'Roze', value: 'pink' },
        { label: 'Grijs', value: 'gray' },
      ],
      admin: {
        description: 'Kleur voor categorie badge',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Categorie Afbeelding',
      admin: {
        description: 'Optionele afbeelding voor categorie overzicht',
      },
    },
  ],
}
