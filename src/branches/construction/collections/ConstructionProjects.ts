import type { CollectionConfig } from 'payload'
import { publicAccess } from '@/access/publicAccess'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

export const ConstructionProjects: CollectionConfig = {
  slug: 'construction-projects',
  labels: {
    singular: 'Bouw Project',
    plural: 'Bouw Projecten',
  },
  access: {
    read: publicAccess,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('construction'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'year', 'featured', 'status', 'updatedAt'],
    group: 'Construction',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      admin: {
        description: 'Project naam (bijv. "Villa met zwembad — Amstelveen")',
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
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'construction-services',
      label: 'Categorie',
      admin: {
        description: 'Type project (nieuwbouw, renovatie, etc.)',
        position: 'sidebar',
      },
    },
    {
      name: 'badges',
      type: 'array',
      label: 'Badges',
      admin: {
        description: 'Labels die op de project kaart getoond worden',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'badge',
          type: 'text',
          required: true,
          label: 'Badge tekst',
          admin: {
            description: 'Bijv. "Nieuwbouw", "2024", "Gereed"',
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
              name: 'location',
              type: 'text',
              label: 'Locatie',
              admin: {
                description: 'Stad of wijk (bijv. "Amstelveen")',
              },
            },
            {
              name: 'year',
              type: 'number',
              label: 'Jaar',
              admin: {
                description: 'Jaar van oplevering',
              },
            },
            {
              name: 'duration',
              type: 'text',
              label: 'Duur',
              admin: {
                description: 'Bouwtijd (bijv. "14 maanden")',
              },
            },
            {
              name: 'size',
              type: 'text',
              label: 'Oppervlakte',
              admin: {
                description: 'Vloeroppervlak (bijv. "280m²")',
              },
            },
            {
              name: 'budget',
              type: 'text',
              label: 'Budget',
              admin: {
                description: 'Optioneel budget range (bijv. "€450.000 - €550.000")',
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
                description: 'Volledige project beschrijving',
              },
            },
            {
              name: 'challenge',
              type: 'richText',
              label: 'Uitdaging',
              admin: {
                description: 'Wat was de uitdaging bij dit project?',
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
              name: 'result',
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
                description: 'Hero image voor project',
              },
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Galerij',
              admin: {
                description: 'Project foto\'s',
              },
            },
            {
              name: 'beforeAfter',
              type: 'group',
              label: 'Voor/Na',
              admin: {
                description: 'Voor en na foto\'s (vooral voor renovaties)',
              },
              fields: [
                {
                  name: 'before',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Voor',
                },
                {
                  name: 'after',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Na',
                },
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
              admin: {
                description: 'Review van de klant voor dit project',
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
                    description: 'Bijv. "Eigenaar villa"',
                  },
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
              label: 'Meta gegevens',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'SEO Titel',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'SEO Omschrijving',
                  admin: {
                    rows: 2,
                  },
                },
              ],
            },
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
}

export default ConstructionProjects
