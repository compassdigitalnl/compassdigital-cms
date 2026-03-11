import type { CollectionConfig } from 'payload'
import { publicAccess } from '@/access/publicAccess'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'
import { indexProfessionalCase, deleteProfessionalCaseFromIndex } from '@/features/search/lib/meilisearch/indexProfessionalCases'

export const ProfessionalCases: CollectionConfig = {
  slug: 'professional-cases',
  labels: {
    singular: 'Case Study',
    plural: 'Case Studies',
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 10,
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
    defaultColumns: ['title', 'category', 'client', 'featured', 'status', 'updatedAt'],
    group: 'Zakelijke Dienstverlening',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      admin: {
        description: 'Case study naam (bijv. "Digitale transformatie — Advocatenkantoor De Vries")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
      },
          hooks: {
        beforeValidate: [autoGenerateSlugFromName],
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'professional-services',
      label: 'Categorie',
      admin: {
        description: 'Type dienst (accountancy, juridisch, etc.)',
        position: 'sidebar',
      },
    },
    {
      name: 'badges',
      type: 'array',
      label: 'Badges',
      admin: {
        description: 'Labels die op de case study kaart getoond worden',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'badge',
          type: 'text',
          required: true,
          label: 'Badge tekst',
          admin: {
            description: 'Bijv. "Accountancy", "2024", "Succesvol"',
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'client',
              type: 'text',
              label: 'Klant',
              admin: {
                description: 'Naam van de klant of organisatie',
              },
            },
            {
              name: 'industry',
              type: 'text',
              label: 'Branche',
              admin: {
                description: 'Branche van de klant (bijv. "Gezondheidszorg")',
              },
            },
            {
              name: 'duration',
              type: 'text',
              label: 'Duur',
              admin: {
                description: 'Looptijd van het traject (bijv. "6 maanden")',
              },
            },
            {
              name: 'result',
              type: 'text',
              label: 'Resultaat',
              admin: {
                description: 'Kernresultaat (bijv. "30% kostenbesparing")',
              },
            },
          ],
        },
        {
          label: 'Inhoud',
          fields: [
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              label: 'Korte omschrijving',
              admin: {
                description: 'Preview tekst voor kaarten',
                rows: 2,
              },
            },
            {
              name: 'longDescription',
              type: 'richText',
              label: 'Uitgebreide omschrijving',
              admin: {
                description: 'Volledige case study beschrijving',
              },
            },
            {
              name: 'challenge',
              type: 'richText',
              label: 'Uitdaging',
              admin: {
                description: 'Wat was de uitdaging bij deze case?',
              },
            },
            {
              name: 'solution',
              type: 'richText',
              label: 'Oplossing',
              admin: {
                description: 'Hoe hebben we het opgelost?',
              },
            },
            {
              name: 'resultDescription',
              type: 'richText',
              label: 'Resultaat',
              admin: {
                description: 'Wat is het eindresultaat?',
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
              required: true,
              label: 'Hoofd afbeelding',
              admin: {
                description: 'Hero image voor case study',
              },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Galerij',
              admin: {
                description: 'Case study foto\'s',
              },
            },
          ],
        },
        {
          label: 'Testimonial',
          fields: [
            {
              name: 'testimonial',
              type: 'group',
              label: 'Klant testimonial',
              admin: {
                description: 'Review van de klant voor deze case',
              },
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  label: 'Quote',
                  admin: {
                    rows: 3,
                  },
                },
                {
                  name: 'clientName',
                  type: 'text',
                  label: 'Klant naam',
                },
                {
                  name: 'clientRole',
                  type: 'text',
                  label: 'Klant rol',
                  admin: {
                    description: 'Bijv. "Directeur", "CFO"',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            // meta fields are auto-added by seoPlugin
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: {
        description: 'Toon op homepage',
        position: 'sidebar',
      },
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
            await indexProfessionalCase(doc)
          } else {
            await deleteProfessionalCaseFromIndex(doc.id)
          }
        } catch (error) {
          console.error(`[ProfessionalCases] Search index error:`, error)
        }
        return doc
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          await deleteProfessionalCaseFromIndex(doc.id)
        } catch (error) {
          console.error(`[ProfessionalCases] Search delete error:`, error)
        }
        return doc
      },
    ],
  },
}

export default ProfessionalCases
