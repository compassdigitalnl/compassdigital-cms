import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlugFromName } from '@/utilities/slugify'

/**
 * Accommodations Collection — Toerisme Branch
 *
 * Accommodatiebeheer voor reisbureaus en touroperators.
 * Ondersteunt hotels, resorts, villa's, hostels en meer.
 */
export const Accommodations: CollectionConfig = {
  slug: 'accommodations',
  labels: {
    singular: 'Accommodatie',
    plural: 'Accommodaties',
  },
  admin: {
    group: 'Toerisme',
    useAsTitle: 'name',
    defaultColumns: ['name', 'destination', 'type', 'stars', 'priceFrom'],
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
              name: 'name',
              type: 'text',
              required: true,
              label: 'Naam',
              admin: {
                description: 'Bijv. "The Ritz-Carlton Bali"',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug',
              hooks: {
                beforeValidate: [autoGenerateSlugFromName],
              },
              admin: {
                description: 'Automatisch gegenereerd uit de naam',
              },
            },
            {
              name: 'destination',
              type: 'relationship',
              relationTo: 'destinations',
              label: 'Bestemming',
            },
            {
              name: 'type',
              type: 'select',
              label: 'Type',
              options: [
                { label: 'Hotel', value: 'hotel' },
                { label: 'Resort', value: 'resort' },
                { label: 'Villa', value: 'villa' },
                { label: 'Appartement', value: 'appartement' },
                { label: 'Hostel', value: 'hostel' },
                { label: 'B&B', value: 'b-and-b' },
                { label: 'Glamping', value: 'glamping' },
              ],
            },
            {
              name: 'stars',
              type: 'number',
              label: 'Sterren',
              min: 1,
              max: 5,
              admin: {
                description: 'Sterrenclassificatie (1-5)',
              },
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

        // ── TAB 2: Locatie ──
        {
          label: 'Locatie',
          fields: [
            {
              name: 'address',
              type: 'text',
              label: 'Adres',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'city',
                  type: 'text',
                  label: 'Stad',
                  admin: { width: '50%' },
                },
                {
                  name: 'region',
                  type: 'text',
                  label: 'Regio',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'distanceBeach',
                  type: 'text',
                  label: 'Afstand strand',
                  admin: {
                    width: '33%',
                    description: 'Bijv. "200m", "Aan het strand"',
                  },
                },
                {
                  name: 'distanceCenter',
                  type: 'text',
                  label: 'Afstand centrum',
                  admin: {
                    width: '33%',
                    description: 'Bijv. "500m", "In het centrum"',
                  },
                },
                {
                  name: 'distanceAirport',
                  type: 'text',
                  label: 'Afstand vliegveld',
                  admin: {
                    width: '33%',
                    description: 'Bijv. "25 km", "45 min"',
                  },
                },
              ],
            },
          ],
        },

        // ── TAB 3: Kamers ──
        {
          label: 'Kamers',
          fields: [
            {
              name: 'rooms',
              type: 'array',
              label: 'Kamertypes',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Naam',
                  admin: {
                    description: 'Bijv. "Deluxe Zeezicht Kamer"',
                  },
                },
                {
                  name: 'type',
                  type: 'text',
                  label: 'Type',
                  admin: {
                    description: 'Bijv. "Superior", "Deluxe", "Suite"',
                  },
                },
                {
                  name: 'maxGuests',
                  type: 'number',
                  label: 'Max. gasten',
                  min: 1,
                },
                {
                  name: 'pricePerNight',
                  type: 'number',
                  label: 'Prijs per nacht',
                  admin: {
                    step: 1,
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Beschrijving',
                },
                {
                  name: 'amenities',
                  type: 'array',
                  label: 'Voorzieningen',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      label: 'Voorziening',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── TAB 4: Faciliteiten ──
        {
          label: 'Faciliteiten',
          fields: [
            {
              name: 'facilities',
              type: 'select',
              hasMany: true,
              label: 'Faciliteiten',
              options: [
                { label: 'Zwembad', value: 'zwembad' },
                { label: 'Spa', value: 'spa' },
                { label: 'Restaurant', value: 'restaurant' },
                { label: 'Bar', value: 'bar' },
                { label: 'Fitness', value: 'fitness' },
                { label: 'WiFi', value: 'wifi' },
                { label: 'Parkeren', value: 'parkeren' },
                { label: 'Roomservice', value: 'roomservice' },
                { label: 'Airco', value: 'airco' },
                { label: 'Wasserij', value: 'wasserij' },
                { label: 'Kindvriendelijk', value: 'kindvriendelijk' },
                { label: 'Huisdieren', value: 'huisdieren' },
              ],
            },
          ],
        },

        // ── TAB 5: Prijzen ──
        {
          label: 'Prijzen',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'priceFrom',
                  type: 'number',
                  label: 'Prijs vanaf (p.p.p.n.)',
                  admin: {
                    width: '50%',
                    step: 1,
                  },
                },
                {
                  name: 'priceTo',
                  type: 'number',
                  label: 'Prijs tot',
                  admin: {
                    width: '50%',
                    step: 1,
                  },
                },
              ],
            },
            {
              name: 'mealPlan',
              type: 'select',
              label: 'Maaltijdplan',
              options: [
                { label: 'Logies', value: 'logies' },
                { label: 'Logies & Ontbijt', value: 'ontbijt' },
                { label: 'Halfpension', value: 'halfpension' },
                { label: 'Volpension', value: 'volpension' },
                { label: 'All-inclusive', value: 'allinclusive' },
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
                  max: 10,
                  admin: {
                    width: '50%',
                    step: 0.1,
                    description: 'Score van 0 tot 10',
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
