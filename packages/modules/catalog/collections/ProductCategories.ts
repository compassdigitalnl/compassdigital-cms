import type { CollectionConfig } from 'payload'

/**
 * Product Categories Collection
 * Hierarchical category system for products
 */
export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: {
    singular: 'Product Categorie',
    plural: 'Product Categorieën',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'level', 'order', 'visible', 'updatedAt'],
    group: 'Catalog',
    description: 'Beheer product categorieën (hiërarchisch)',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Categorie Naam',
      admin: {
        description: 'Naam zoals getoond aan klanten',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-vriendelijke naam',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Beschrijving',
      admin: {
        description: 'Categorie beschrijving voor SEO en landingspagina',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'product-categories',
      label: 'Bovenliggende Categorie',
      admin: {
        description: 'Laat leeg voor hoofdcategorie',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'level',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
          label: 'Niveau',
          admin: {
            width: '33%',
            description: '0 = hoofdcategorie, 1 = subcategorie, etc.',
            readOnly: true,
          },
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Volgorde',
          admin: {
            width: '33%',
            description: 'Sorteervolgorde (laag = eerst)',
          },
        },
        {
          name: 'visible',
          type: 'checkbox',
          defaultValue: true,
          label: 'Zichtbaar',
          admin: {
            width: '34%',
            description: 'Tonen in menu/filters',
          },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Categorie Afbeelding',
      admin: {
        description: 'Afbeelding voor categorie overzicht',
      },
    },
    {
      type: 'collapsible',
      label: 'SEO',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Titel',
          maxLength: 60,
          admin: {
            description: 'Titel voor zoekmachines (max 60 karakters)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Beschrijving',
          maxLength: 160,
          admin: {
            description: 'Beschrijving voor zoekmachines (max 160 karakters)',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        // Auto-calculate level based on parent
        if (data.parent) {
          const parent = await req.payload.findByID({
            collection: 'product-categories',
            id: data.parent,
          })
          data.level = (parent?.level || 0) + 1
        } else {
          data.level = 0
        }

        return data
      },
    ],
  },
  timestamps: true,
}
