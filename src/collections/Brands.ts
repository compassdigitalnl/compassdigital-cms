import type { CollectionConfig } from 'payload'
import { checkRole } from '../access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: {
    singular: 'Merk',
    plural: 'Merken',
  },
  admin: {
    useAsTitle: 'name',
    group: 'E-commerce',
    defaultColumns: ['name', 'featured', 'updatedAt'],
    description: 'Product merken zoals Hartmann, BSN Medical, 3M, etc.',
    hidden: ({ user }) =>
      isClientDeployment()
        ? false
        : !checkRole(['editor'], user) || (user as any)?.clientType !== 'webshop',
  },
  access: {
    read: () => true, // Brands are publicly accessible (webshop catalog)
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Merknaam',
      admin: {
        description: 'Bijv: Hartmann, BSN Medical, 3M',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
        description: 'Automatisch gegenereerd uit de naam',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (data?.name && !value) {
              return data.name
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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: {
        description: 'Merklogo (voorkeur: SVG of PNG met transparante achtergrond)',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Beschrijving',
      admin: {
        description: 'Optionele beschrijving over het merk',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website URL',
      admin: {
        description: 'Bijv: https://www.hartmann.nl',
        placeholder: 'https://',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Toon in LogoBar',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Featured merken worden getoond in de LogoBar op de homepage',
      },
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
          admin: {
            description: 'SEO titel voor de merkpagina',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Beschrijving',
          maxLength: 160,
          admin: {
            description: 'Korte beschrijving voor zoekmachines (max 160 tekens)',
          },
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
