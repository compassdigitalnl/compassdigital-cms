import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: {
    singular: 'Merk',
    plural: 'Merken',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Webshop',
    defaultColumns: ['name', 'parent', 'level', 'featured', 'updatedAt'],
    description: 'Product merken zoals Hartmann, BSN Medical, 3M, etc.',
    hidden: shouldHideCollection('brands'),
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.parent) {
          const parent = await req.payload.findByID({
            collection: 'brands',
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
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 10,
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
        beforeValidate: [autoGenerateSlugFromName],
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'brands',
      label: 'Bovenliggend Merk',
      admin: {
        description: 'Selecteer de fabrikant als dit een productlijn/submerk is',
      },
    },
    {
      name: 'level',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      label: 'Niveau',
      admin: {
        position: 'sidebar',
        description: '0 = fabrikant, 1 = productlijn',
        readOnly: true,
      },
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      admin: {
        description: 'Bijv: Officiële partner, Premium merk, etc.',
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
        description: 'Merkverhaal en beschrijving',
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
      name: 'certifications',
      type: 'array',
      label: 'Certificeringen',
      admin: {
        description: 'Bijv: ISO 13485, CE Markering, OEKO-TEX',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Naam',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icoon',
          admin: {
            description: 'Lucide icoon naam (bijv: shield-check, award)',
          },
        },
      ],
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
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: true,
      label: 'Zichtbaar',
      admin: {
        position: 'sidebar',
        description: 'Tonen in merkenoverzicht',
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
export default Brands
