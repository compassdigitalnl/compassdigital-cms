import type { CollectionConfig } from 'payload'
import { publicAccess } from '@/access/publicAccess'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'
import { indexProfessionalService, deleteProfessionalServiceFromIndex } from '@/features/search/lib/meilisearch/indexProfessionalServices'

export const ProfessionalServices: CollectionConfig = {
  slug: 'professional-services',
  labels: {
    singular: 'Dienst',
    plural: 'Diensten',
  },
  access: {
    read: publicAccess,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('professional_services'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: 'Zakelijke Dienstverlening',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      admin: {
        description: 'Naam van de dienst (bijv. "Accountancy", "Juridisch advies")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'URL-vriendelijke versie (bijv. "accountancy", "juridisch-advies")',
        position: 'sidebar',
      },
          hooks: {
        beforeValidate: [autoGenerateSlugFromName],
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon',
      admin: {
        description: 'Emoji of icon naam (bijv. "⚖️", "briefcase")',
        position: 'sidebar',
      },
    },
    {
      name: 'color',
      type: 'select',
      label: 'Kleur',
      options: [
        { label: 'Teal', value: 'teal' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Purple', value: 'purple' },
        { label: 'Amber', value: 'amber' },
        { label: 'Coral', value: 'coral' },
      ],
      defaultValue: 'teal',
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Inhoud',
          fields: [
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              label: 'Korte omschrijving',
              admin: {
                description: 'Voor kaarten en previews (max ~150 karakters)',
                rows: 3,
              },
            },
            {
              name: 'longDescription',
              type: 'richText',
              label: 'Uitgebreide omschrijving',
              admin: {
                description: 'Volledige omschrijving voor detail pagina',
              },
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'features',
              type: 'array',
              label: 'Kenmerken',
              admin: {
                description: 'Key features die bovenaan getoond worden',
              },
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true,
                  label: 'Kenmerk',
                },
              ],
            },
            {
              name: 'processSteps',
              type: 'array',
              label: 'Proces stappen',
              admin: {
                description: 'Hoe het proces verloopt (stap voor stap)',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Titel',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  label: 'Omschrijving',
                  admin: {
                    rows: 2,
                  },
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                  admin: {
                    description: 'Lucide icon naam (bijv. "clipboard-check")',
                  },
                },
              ],
            },
            {
              name: 'serviceTypes',
              type: 'array',
              label: 'Dienst types',
              admin: {
                description: 'Verschillende varianten van deze dienst',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Naam',
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Omschrijving',
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                },
              ],
            },
            {
              name: 'usps',
              type: 'array',
              label: 'USPs / Voordelen',
              admin: {
                description: 'Unique Selling Points',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Titel',
                },
                {
                  name: 'description',
                  type: 'text',
                  required: true,
                  label: 'Omschrijving',
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                  admin: {
                    description: 'Lucide icon naam',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faq',
              type: 'array',
              label: 'Veelgestelde vragen',
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  label: 'Vraag',
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                  label: 'Antwoord',
                  admin: {
                    rows: 3,
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero afbeelding',
              admin: {
                description: 'Hoofdafbeelding voor de dienst',
              },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Galerij',
              admin: {
                description: 'Extra afbeeldingen',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'Meta gegevens',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'SEO Titel',
                  admin: {
                    description: 'Titel voor zoekmachines (max 60 karakters)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'SEO Omschrijving',
                  admin: {
                    description: 'Meta omschrijving (max 160 karakters)',
                    rows: 2,
                  },
                },
                {
                  name: 'keywords',
                  type: 'text',
                  label: 'Zoekwoorden',
                  admin: {
                    description: 'Komma-gescheiden (bijv. "accountant, boekhouder, belastingadvies")',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          if (doc.status === 'published') {
            await indexProfessionalService(doc)
          } else {
            await deleteProfessionalServiceFromIndex(doc.id)
          }
        } catch (error) {
          console.error(`[ProfessionalServices] Search index error:`, error)
        }
        return doc
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          await deleteProfessionalServiceFromIndex(doc.id)
        } catch (error) {
          console.error(`[ProfessionalServices] Search delete error:`, error)
        }
        return doc
      },
    ],
  },
}

export default ProfessionalServices
