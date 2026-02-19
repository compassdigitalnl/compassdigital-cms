import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Producten',
  },
  admin: {
    useAsTitle: 'title',
    group: 'E-commerce',
    defaultColumns: ['title', 'price', 'stock', 'status', 'updatedAt'],
    // In tenant deployments, always show; in platform, hide from non-editors and non-webshop clients
    hidden: ({ user }) =>
      isClientDeployment()
        ? false
        : !checkRole(['editor'], user) || (user as any)?.clientType !== 'webshop',
  },
  access: {
    read: () => true, // Products are publicly accessible (webshop catalog)
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Product Naam',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.title && !value) {
              return data.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
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
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Prijs (€)',
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      min: 0,
      label: 'Vergelijk Prijs (€)',
      admin: {
        step: 0.01,
        description: 'Originele prijs voor doorstreepte prijzen',
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Product Afbeeldingen',
    },
    {
      name: 'stock',
      type: 'number',
      min: 0,
      defaultValue: 0,
      label: 'Voorraad',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sku',
      type: 'text',
      label: 'SKU / Artikelnummer',
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      label: 'Categorieën',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      label: 'Merk',
      admin: {
        position: 'sidebar',
        description: 'Bijv: Hartmann, BSN Medical, 3M',
      },
    },
    {
      name: 'badge',
      type: 'select',
      label: 'Product Badge',
      defaultValue: 'none',
      options: [
        {
          label: 'Geen',
          value: 'none',
        },
        {
          label: 'Nieuw',
          value: 'new',
        },
        {
          label: 'Sale / Aanbieding',
          value: 'sale',
        },
        {
          label: 'Populair',
          value: 'popular',
        },
        {
          label: 'Uitverkocht',
          value: 'sold-out',
        },
      ],
      admin: {
        position: 'sidebar',
        description: 'Badge die op de productkaart verschijnt',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        {
          label: 'Concept',
          value: 'draft',
        },
        {
          label: 'Gepubliceerd',
          value: 'published',
        },
        {
          label: 'Uitverkocht',
          value: 'sold-out',
        },
        {
          label: 'Gearchiveerd',
          value: 'archived',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured Product',
      admin: {
        position: 'sidebar',
        description: 'Toon dit product in featured secties',
      },
    },
    // Product Details
    {
      name: 'specifications',
      type: 'array',
      label: 'Specificaties',
      admin: {
        description: 'Product specificaties (bijv: Afmetingen, Materiaal, etc.)',
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          label: 'Naam',
          admin: {
            placeholder: 'bijv: Afmetingen, Materiaal, Kleur',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Waarde',
          admin: {
            placeholder: 'bijv: 30cm x 20cm, Nitrile, Blauw',
          },
        },
      ],
    },
    {
      name: 'downloads',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Downloads',
      admin: {
        description: 'PDF datasheets, handleidingen, certificaten, etc.',
      },
      filterOptions: {
        mimeType: { contains: 'pdf' },
      },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Gerelateerde Producten',
      admin: {
        description: 'Producten die vaak samen gekocht worden',
      },
    },
    // SEO Fields
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Beschrijving',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
        },
      ],
    },
  ],
}
