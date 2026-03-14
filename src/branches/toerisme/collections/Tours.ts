import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlug } from '@/utilities/slugify'

/**
 * Tours Collection — Toerisme Branch
 *
 * Reizenbeheer voor reisbureaus en touroperators.
 * Ondersteunt reisprogramma's, prijzen, beschikbaarheid en beoordelingen.
 */
export const Tours: CollectionConfig = {
  slug: 'tours',
  labels: {
    singular: 'Reis',
    plural: 'Reizen',
  },
  admin: {
    group: 'Toerisme',
    useAsTitle: 'title',
    defaultColumns: ['title', 'destination', 'price', 'duration', 'availability'],
    hidden: shouldHideCollection(),
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  versions: {
    drafts: true,
  },
  fields: [
    // ─── SIDEBAR ─────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'draft',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },

    // ─── TABS ────────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── TAB 1: Algemeen ──
        {
          label: 'Algemeen',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Titel',
              admin: {
                description: 'Bijv. "Rondreis Bali — 8 dagen ontdekken"',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug',
              hooks: {
                beforeValidate: [autoGenerateSlug],
              },
              admin: {
                description: 'Automatisch gegenereerd uit de titel',
              },
            },
            {
              name: 'destination',
              type: 'relationship',
              relationTo: 'destinations',
              label: 'Bestemming',
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Korte beschrijving',
              maxLength: 500,
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Uitgebreide beschrijving',
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Omslagafbeelding',
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Fotogalerij',
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Afbeelding',
                },
              ],
            },
          ],
        },

        // ── TAB 2: Details ──
        {
          label: 'Details',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'duration',
                  type: 'number',
                  label: 'Duur (dagen)',
                  admin: { width: '50%' },
                },
                {
                  name: 'nights',
                  type: 'number',
                  label: 'Nachten',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'category',
              type: 'select',
              label: 'Categorie',
              options: [
                { label: 'Bestseller', value: 'bestseller' },
                { label: 'Nieuw', value: 'nieuw' },
                { label: 'Avontuur', value: 'avontuur' },
                { label: 'Luxe', value: 'luxe' },
                { label: 'Familie', value: 'familie' },
                { label: 'Stedentrip', value: 'stedentrip' },
                { label: 'Strand', value: 'strand' },
                { label: 'Cultuur', value: 'cultuur' },
              ],
            },
            {
              name: 'highlights',
              type: 'array',
              label: 'Hoogtepunten',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Hoogtepunt',
                },
              ],
            },
            {
              name: 'inclusions',
              type: 'array',
              label: 'Inclusief',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Item',
                },
              ],
            },
            {
              name: 'exclusions',
              type: 'array',
              label: 'Exclusief',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  label: 'Item',
                },
              ],
            },
          ],
        },

        // ── TAB 3: Reisprogramma ──
        {
          label: 'Reisprogramma',
          fields: [
            {
              name: 'itinerary',
              type: 'array',
              label: 'Dagprogramma',
              fields: [
                {
                  name: 'dayNumber',
                  type: 'number',
                  required: true,
                  label: 'Dag',
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Titel',
                },
                {
                  name: 'description',
                  type: 'richText',
                  label: 'Beschrijving',
                },
                {
                  name: 'location',
                  type: 'text',
                  label: 'Locatie',
                },
              ],
            },
          ],
        },

        // ── TAB 4: Prijzen ──
        {
          label: 'Prijzen',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  label: 'Prijs (vanaf p.p.)',
                  admin: {
                    width: '50%',
                    step: 1,
                  },
                },
                {
                  name: 'originalPrice',
                  type: 'number',
                  label: 'Originele prijs',
                  admin: {
                    width: '50%',
                    step: 1,
                    description: 'Wordt doorgestreept weergegeven',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'earlyBirdPrice',
                  type: 'number',
                  label: 'Vroegboekprijs',
                  admin: {
                    width: '50%',
                    step: 1,
                  },
                },
                {
                  name: 'earlyBirdDeadline',
                  type: 'date',
                  label: 'Vroegboek deadline',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'childPrice',
                  type: 'number',
                  label: 'Kinderprijs',
                  admin: {
                    width: '50%',
                    step: 1,
                  },
                },
                {
                  name: 'singleSupplement',
                  type: 'number',
                  label: 'Toeslag eenpersoons',
                  admin: {
                    width: '50%',
                    step: 1,
                  },
                },
              ],
            },
          ],
        },

        // ── TAB 5: Beschikbaarheid ──
        {
          label: 'Beschikbaarheid',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'departureDate',
                  type: 'date',
                  label: 'Vertrekdatum',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                  },
                },
                {
                  name: 'returnDate',
                  type: 'date',
                  label: 'Retourdatum',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                  },
                },
              ],
            },
            {
              name: 'availability',
              type: 'select',
              label: 'Beschikbaarheid',
              defaultValue: 'beschikbaar',
              options: [
                { label: 'Beschikbaar', value: 'beschikbaar' },
                { label: 'Beperkt beschikbaar', value: 'beperkt' },
                { label: 'Uitverkocht', value: 'uitverkocht' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'maxParticipants',
                  type: 'number',
                  label: 'Max. deelnemers',
                  admin: { width: '50%' },
                },
                {
                  name: 'currentBookings',
                  type: 'number',
                  label: 'Huidige boekingen',
                  defaultValue: 0,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },

        // ── TAB 6: Beoordeling ──
        {
          label: 'Beoordeling',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Beoordeling',
                  min: 0,
                  max: 5,
                  admin: {
                    width: '50%',
                    step: 0.1,
                    description: 'Score van 0 tot 5',
                  },
                },
                {
                  name: 'reviewCount',
                  type: 'number',
                  label: 'Aantal reviews',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'featured',
              type: 'checkbox',
              label: 'Uitgelicht',
              defaultValue: false,
            },
          ],
        },

        // SEO tab is auto-generated by seoPlugin (tabbedUI: true)
      ],
    },
  ],
}
