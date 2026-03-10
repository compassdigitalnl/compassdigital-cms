import type { CollectionConfig } from 'payload'
import { publicAccess } from '@/access/publicAccess'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { slugField } from 'payload'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  labels: {
    singular: 'Ervaring',
    plural: 'Ervaringen',
  },
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
    hidden: shouldHideCollection('experiences'),
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'pricePerPerson', 'status', 'featured', 'updatedAt'],
    group: 'Ervaringen',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 10,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      admin: {
        description: 'Naam van de ervaring',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            slugField(),
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Korte omschrijving',
              maxLength: 200,
              admin: {
                description: 'Voor kaarten en previews (max 200 karakters)',
                rows: 3,
              },
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Uitgebreide omschrijving',
              admin: {
                description: 'Volledige omschrijving voor detail pagina',
              },
            },
            {
              name: 'highlights',
              type: 'array',
              label: 'Highlights',
              admin: {
                description: 'Belangrijkste kenmerken van de ervaring',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Label',
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                  admin: {
                    description: 'Emoji of icon (bijv. "🎯", "⏱️")',
                  },
                },
              ],
            },
            {
              name: 'included',
              type: 'array',
              label: 'Inbegrepen',
              admin: {
                description: 'Wat is inbegrepen bij de ervaring',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Label',
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon',
                  admin: {
                    description: 'Emoji of icon (bijv. "🍽️", "🎵")',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'experience-categories',
              label: 'Categorie',
              admin: {
                description: 'Categorie van de ervaring',
              },
            },
            {
              name: 'duration',
              type: 'text',
              label: 'Duur',
              admin: {
                description: 'Bijv. "4 uur", "hele dag", "2-3 uur"',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'minPersons',
                  type: 'number',
                  label: 'Min. personen',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'maxPersons',
                  type: 'number',
                  label: 'Max. personen',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'location',
              type: 'text',
              label: 'Locatie',
              admin: {
                description: 'Bijv. "Amsterdam", "Op locatie"',
              },
            },
            {
              name: 'locationDetails',
              type: 'textarea',
              label: 'Locatie details',
              admin: {
                description: 'Extra informatie over de locatie',
                rows: 3,
              },
            },
            {
              name: 'availability',
              type: 'select',
              label: 'Beschikbaarheid',
              options: [
                { label: 'Heel jaar', value: 'year-round' },
                { label: 'Seizoensgebonden', value: 'seasonal' },
                { label: 'Alleen weekenden', value: 'weekends-only' },
                { label: 'Op aanvraag', value: 'custom' },
              ],
              admin: {
                position: 'sidebar',
              },
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
              name: 'popular',
              type: 'checkbox',
              label: 'Populair',
              defaultValue: false,
              admin: {
                description: 'Markeer als populaire ervaring',
                position: 'sidebar',
              },
            },
            {
              name: 'status',
              type: 'select',
              label: 'Status',
              required: true,
              defaultValue: 'draft',
              options: [
                { label: 'Concept', value: 'draft' },
                { label: 'Gepubliceerd', value: 'published' },
                { label: 'Gearchiveerd', value: 'archived' },
              ],
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'pricePerPerson',
                  type: 'number',
                  required: true,
                  label: 'Prijs per persoon',
                  admin: {
                    width: '50%',
                    step: 0.01,
                    description: 'Prijs in euro',
                  },
                },
                {
                  name: 'priceType',
                  type: 'select',
                  label: 'Prijs type',
                  defaultValue: 'per-person',
                  options: [
                    { label: 'Per persoon', value: 'per-person' },
                    { label: 'Vaste prijs', value: 'fixed' },
                    { label: 'Vanaf', value: 'from' },
                  ],
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'priceNote',
              type: 'text',
              label: 'Prijs opmerking',
              admin: {
                description: 'Bijv. "Excl. BTW", "Incl. lunch"',
              },
            },
            {
              name: 'extras',
              type: 'array',
              label: 'Extra opties',
              admin: {
                description: 'Aanvullende opties die bijgeboekt kunnen worden',
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
                  name: 'price',
                  type: 'number',
                  required: true,
                  label: 'Prijs',
                  admin: {
                    step: 0.01,
                  },
                },
                {
                  name: 'priceType',
                  type: 'select',
                  label: 'Prijs type',
                  defaultValue: 'per-person',
                  options: [
                    { label: 'Per persoon', value: 'per-person' },
                    { label: 'Vaste prijs', value: 'fixed' },
                    { label: 'Per uur', value: 'per-hour' },
                  ],
                },
                {
                  name: 'popular',
                  type: 'checkbox',
                  label: 'Populair',
                  defaultValue: false,
                  admin: {
                    description: 'Markeer als populaire extra',
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
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Featured afbeelding',
              admin: {
                description: 'Hoofdafbeelding voor de ervaring',
              },
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Galerij',
              admin: {
                description: 'Extra afbeeldingen en video\'s',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Afbeelding',
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Bijschrift',
                },
                {
                  name: 'isVideo',
                  type: 'checkbox',
                  label: 'Is video',
                  defaultValue: false,
                  admin: {
                    description: 'Markeer als video item',
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
                    description: 'Komma-gescheiden (bijv. "teambuilding, amsterdam, bedrijfsuitje")',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default Experiences
