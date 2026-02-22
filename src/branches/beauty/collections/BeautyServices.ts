import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * BeautyServices Collection
 *
 * Hair, beauty, wellness, and spa treatments/services
 */
export const BeautyServices: CollectionConfig = {
  slug: 'beautyServices',
  access: {
    read: ({ req: { user } }) => {
      if (checkRole(['admin', 'editor'], user)) return true
      return {
        _status: { equals: 'published' },
      }
    },
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('beauty'),
    group: 'Beauty',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'duration', 'price', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'beautyServices',
        })
        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'beautyServices',
      }),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Behandelingnaam',
      admin: {
        description: 'Bijv: Knippen dames, Balayage, Luxury Facial',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'category',
              type: 'select',
              label: 'Categorie',
              required: true,
              options: [
                { label: '✂️ Hair', value: 'hair' },
                { label: '✨ Beauty & Skincare', value: 'beauty' },
                { label: '💆 Wellness & Massage', value: 'wellness' },
                { label: '💅 Nails', value: 'nails' },
                { label: '💍 Bridal & Events', value: 'bridal' },
                { label: '🎨 Color Specialist', value: 'color' },
              ],
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon emoji',
              admin: {
                description: 'Emoji voor de behandeling, bijv: ✂️ 💅 ✨',
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Korte omschrijving',
              required: true,
              admin: {
                description: '1-2 zinnen voor in lijstjes',
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Uitgebreide omschrijving',
            },
            {
              name: 'benefits',
              type: 'array',
              label: 'Voordelen/Resultaten',
              fields: [
                {
                  name: 'benefit',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'process',
              type: 'array',
              label: 'Behandelproces stappen',
              fields: [
                {
                  name: 'step',
                  type: 'text',
                  label: 'Stap titel',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Stap beschrijving',
                },
              ],
            },
          ],
        },
        {
          label: 'Prijzen & Planning',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'duration',
                  type: 'number',
                  label: 'Duur (minuten)',
                  required: true,
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'price',
                  type: 'number',
                  label: 'Prijs (€)',
                  required: true,
                  admin: {
                    width: '50%',
                    step: 0.5,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'priceFrom',
                  type: 'number',
                  label: 'Prijs vanaf (€)',
                  admin: {
                    width: '50%',
                    description: 'Voor variabele prijzen (bijv: v.a. €75)',
                    step: 0.5,
                  },
                },
                {
                  name: 'priceTo',
                  type: 'number',
                  label: 'Prijs tot (€)',
                  admin: {
                    width: '50%',
                    step: 0.5,
                  },
                },
              ],
            },
            {
              name: 'tags',
              type: 'select',
              label: 'Labels',
              hasMany: true,
              options: [
                { label: 'Populair', value: 'popular' },
                { label: 'Nieuw', value: 'new' },
                { label: 'Promo', value: 'promo' },
                { label: 'Specialist', value: 'specialist' },
                { label: 'Bestseller', value: 'bestseller' },
              ],
            },
            {
              name: 'bookable',
              type: 'checkbox',
              label: 'Online boekbaar',
              defaultValue: true,
            },
            {
              name: 'requiresConsultation',
              type: 'checkbox',
              label: 'Vereist consultatie',
              defaultValue: false,
              admin: {
                description: 'Klant moet eerst een consultatie boeken',
              },
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Featured afbeelding',
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Foto galerij',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Bijschrift',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Meta titel',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Meta beschrijving',
                },
                {
                  name: 'keywords',
                  type: 'text',
                  label: 'Keywords',
                },
              ],
            },
            slugField(),
          ],
        },
      ],
    },
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'beautyServices',
      hasMany: true,
      label: 'Gerelateerde behandelingen',
    },
    {
      name: 'stylists',
      type: 'relationship',
      relationTo: 'stylists',
      hasMany: true,
      label: 'Beschikbare stylisten',
      admin: {
        description: 'Welke stylisten kunnen deze behandeling uitvoeren?',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publicatiedatum',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
}
