import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { slugField } from 'payload'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * Treatments Collection
 *
 * Healthcare treatments/services (physiotherapy, dental procedures, etc.)
 */
export const Treatments: CollectionConfig = {
  slug: 'treatments',
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
    hidden: shouldHideCollection('hospitality'),
    group: 'Hospitality',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'duration', 'price', 'updatedAt'],
    livePreview: {
      url: ({ data }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'treatments',
        })
        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'treatments',
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Behandeling naam',
      admin: {
        description: 'Bijv: Manuele therapie, Sportfysiotherapie',
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
              options: [
                { label: 'Fysiotherapie', value: 'fysiotherapie' },
                { label: 'Manuele therapie', value: 'manuele-therapie' },
                { label: 'Sportfysiotherapie', value: 'sportfysiotherapie' },
                { label: 'Kinderfysiotherapie', value: 'kinderfysiotherapie' },
                { label: 'Psychosomatisch', value: 'psychosomatisch' },
                { label: 'Revalidatie', value: 'revalidatie' },
                { label: 'Dry needling', value: 'dry-needling' },
                { label: 'Shockwave', value: 'shockwave' },
              ],
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icon emoji',
              admin: {
                description: 'Emoji voor de behandeling, bijv: 🦴 🏃 👶',
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
              required: true,
            },
            {
              name: 'symptoms',
              type: 'array',
              label: 'Klachten die behandeld worden',
              fields: [
                {
                  name: 'symptom',
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
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Details',
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
                  name: 'intakeDuration',
                  type: 'number',
                  label: 'Intake duur (minuten)',
                  admin: {
                    width: '50%',
                    description: 'Duur van eerste afspraak',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  label: 'Tarief (€)',
                  required: true,
                  admin: {
                    width: '50%',
                    step: 0.5,
                  },
                },
                {
                  name: 'intakePrice',
                  type: 'number',
                  label: 'Intake tarief (€)',
                  admin: {
                    width: '50%',
                    step: 0.5,
                  },
                },
              ],
            },
            {
              name: 'insurance',
              type: 'select',
              label: 'Vergoeding',
              options: [
                { label: 'Volledig vergoed (aanvullend)', value: 'covered' },
                { label: 'Deels vergoed', value: 'partial' },
                { label: 'Niet vergoed', value: 'not-covered' },
              ],
              defaultValue: 'covered',
            },
            {
              name: 'averageTreatments',
              type: 'text',
              label: 'Gemiddeld aantal behandelingen',
              admin: {
                description: 'Bijv: 4-8, 6-12',
              },
            },
            {
              name: 'successRate',
              type: 'number',
              label: 'Succespercentage',
              admin: {
                description: 'Bijv: 93 voor 93% pijnreductie',
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
      name: 'relatedTreatments',
      type: 'relationship',
      relationTo: 'treatments',
      hasMany: true,
      label: 'Gerelateerde behandelingen',
    },
    {
      name: 'practitioners',
      type: 'relationship',
      relationTo: 'practitioners',
      hasMany: true,
      label: 'Behandelaars',
      admin: {
        description: 'Welke behandelaars bieden deze behandeling aan?',
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
