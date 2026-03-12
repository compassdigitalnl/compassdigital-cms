import type { CollectionConfig } from 'payload'
import { publicAccess } from '@/access/publicAccess'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'
import { indexProject, deleteProjectFromIndex } from '@/features/search/lib/meilisearch/indexProjects'

export const branchOptions = [
  { label: 'E-commerce', value: 'e-commerce' },
  { label: 'Bouw & Installatie', value: 'construction' },
  { label: 'Beauty & Wellness', value: 'beauty' },
  { label: 'Horeca', value: 'horeca' },
  { label: 'Zorg & Welzijn', value: 'zorg' },
  { label: 'Dienstverlening', value: 'dienstverlening' },
  { label: 'Ervaringen & Events', value: 'ervaringen' },
  { label: 'Marketplace', value: 'marketplace' },
  { label: 'Publishing', value: 'publishing' },
]

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projecten',
  },
  versions: {
    drafts: { autosave: true },
    maxPerDoc: 10,
  },
  access: {
    read: publicAccess,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('projects'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'branch', 'client', 'featured', 'status', 'updatedAt'],
    group: 'Projecten',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: { position: 'sidebar' },
      hooks: {
        beforeValidate: [autoGenerateSlugFromName],
      },
    },
    {
      name: 'branch',
      type: 'select',
      required: true,
      label: 'Branche',
      options: branchOptions,
      admin: {
        position: 'sidebar',
        description: 'Aan welke branche hoort dit project?',
      },
    },
    {
      name: 'badges',
      type: 'array',
      label: 'Badges',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'badge', type: 'text', required: true, label: 'Badge tekst' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: { position: 'sidebar' },
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
      admin: { position: 'sidebar' },
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
              label: 'Klant / Opdrachtgever',
            },
            {
              name: 'industry',
              type: 'text',
              label: 'Branche / Sector',
              admin: { description: 'Bijv. "Retail", "Gezondheidszorg", "Bouw"' },
            },
            {
              name: 'location',
              type: 'text',
              label: 'Locatie',
              admin: { description: 'Stad of regio (bijv. "Amsterdam")' },
            },
            {
              name: 'year',
              type: 'number',
              label: 'Jaar',
              admin: { description: 'Jaar van oplevering' },
            },
            {
              name: 'duration',
              type: 'text',
              label: 'Doorlooptijd',
              admin: { description: 'Bijv. "3 maanden", "14 weken"' },
            },
            {
              name: 'resultHighlight',
              type: 'text',
              label: 'Resultaat highlight',
              admin: { description: 'Kort resultaat voor de kaart (bijv. "+280% omzet")' },
            },
            // Construction-specific
            {
              name: 'size',
              type: 'text',
              label: 'Oppervlakte',
              admin: {
                description: 'Bijv. "280m²"',
                condition: (data) => data?.branch === 'construction',
              },
            },
            {
              name: 'budget',
              type: 'text',
              label: 'Budget',
              admin: {
                description: 'Bijv. "€450.000 - €550.000"',
                condition: (data) => data?.branch === 'construction',
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
              admin: { rows: 2, description: 'Preview tekst voor kaarten' },
            },
            {
              name: 'longDescription',
              type: 'richText',
              label: 'Uitgebreide omschrijving',
            },
            {
              name: 'challenge',
              type: 'richText',
              label: 'Uitdaging',
              admin: { description: 'Wat was de uitdaging?' },
            },
            {
              name: 'solution',
              type: 'richText',
              label: 'Oplossing',
              admin: { description: 'Hoe hebben we het opgelost?' },
            },
            {
              name: 'resultDescription',
              type: 'richText',
              label: 'Resultaat',
              admin: { description: 'Wat is het eindresultaat?' },
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
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Galerij',
            },
            {
              name: 'beforeAfter',
              type: 'group',
              label: 'Voor/Na',
              admin: {
                condition: (data) => data?.branch === 'construction',
              },
              fields: [
                { name: 'before', type: 'upload', relationTo: 'media', label: 'Voor' },
                { name: 'after', type: 'upload', relationTo: 'media', label: 'Na' },
              ],
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
              fields: [
                { name: 'quote', type: 'textarea', label: 'Quote', admin: { rows: 3 } },
                { name: 'clientName', type: 'text', label: 'Naam' },
                { name: 'clientRole', type: 'text', label: 'Functie / Rol' },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc }) => {
        try {
          if (doc.status === 'published') {
            await indexProject(doc)
          } else {
            await deleteProjectFromIndex(doc.id)
          }
        } catch (error) {
          console.error('[Projects] Search index error:', error)
        }
        return doc
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        try {
          await deleteProjectFromIndex(doc.id)
        } catch (error) {
          console.error('[Projects] Search delete error:', error)
        }
        return doc
      },
    ],
  },
}

export default Projects
