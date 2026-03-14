import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlug } from '@/utilities/slugify'

/**
 * Vehicles Collection — Automotive Branch
 *
 * Voertuigbeheer voor autobedrijven, garages en dealers.
 * Ondersteunt auto's, motoren, scooters, campers en caravans.
 */
export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  labels: {
    singular: 'Voertuig',
    plural: 'Voertuigen',
  },
  admin: {
    group: 'Automotive',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'vehicleType', 'price', 'year', 'featured'],
    hidden: shouldHideCollection('automotive'),
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
  hooks: {
    afterChange: [
      async ({ doc }) => {
        // Fire-and-forget: index vehicle in Meilisearch
        import('@/features/search/lib/meilisearch/client')
          .then(({ meilisearchClient }) => {
            meilisearchClient
              .index('vehicles')
              .addDocuments([
                {
                  id: doc.id,
                  title: doc.title,
                  slug: doc.slug,
                  status: doc.status,
                  vehicleType: doc.vehicleType,
                  brand: doc.brand,
                  model: doc.model,
                  year: doc.year,
                  price: doc.price,
                  salePrice: doc.salePrice,
                  fuelType: doc.fuelType,
                  transmission: doc.transmission,
                  mileage: doc.mileage,
                  bodyType: doc.bodyType,
                  color: doc.color,
                  licensePlate: doc.licensePlate,
                  shortDescription: doc.shortDescription,
                },
              ])
              .catch(() => {})
          })
          .catch(() => {})
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        // Fire-and-forget: remove vehicle from Meilisearch
        import('@/features/search/lib/meilisearch/client')
          .then(({ meilisearchClient }) => {
            meilisearchClient
              .index('vehicles')
              .deleteDocument(doc.id)
              .catch(() => {})
          })
          .catch(() => {})
      },
    ],
  },
  fields: [
    // ─── SIDEBAR ─────────────────────────────────────────────
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
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
                description: 'Bijv. "Volkswagen Golf 1.4 TSI Highline"',
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
              name: 'status',
              type: 'select',
              label: 'Status',
              defaultValue: 'beschikbaar',
              options: [
                { label: 'Beschikbaar', value: 'beschikbaar' },
                { label: 'Gereserveerd', value: 'gereserveerd' },
                { label: 'Verkocht', value: 'verkocht' },
              ],
            },
            {
              name: 'vehicleType',
              type: 'select',
              label: 'Voertuigtype',
              defaultValue: 'auto',
              options: [
                { label: 'Auto', value: 'auto' },
                { label: 'Motor', value: 'motor' },
                { label: 'Scooter', value: 'scooter' },
                { label: 'Camper', value: 'camper' },
                { label: 'Caravan', value: 'caravan' },
              ],
            },
          ],
        },

        // ── TAB 2: Specificaties ──
        {
          label: 'Specificaties',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'brand',
                  type: 'relationship',
                  relationTo: 'vehicle-brands',
                  label: 'Merk',
                  admin: { width: '33%' },
                },
                {
                  name: 'model',
                  type: 'text',
                  label: 'Model',
                  admin: { width: '33%' },
                },
                {
                  name: 'variant',
                  type: 'text',
                  label: 'Uitvoering',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'year',
                  type: 'number',
                  label: 'Bouwjaar',
                  admin: { width: '50%' },
                },
                {
                  name: 'mileage',
                  type: 'number',
                  label: 'Kilometerstand',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'fuelType',
                  type: 'select',
                  label: 'Brandstof',
                  options: [
                    { label: 'Benzine', value: 'benzine' },
                    { label: 'Diesel', value: 'diesel' },
                    { label: 'Elektrisch', value: 'elektrisch' },
                    { label: 'Hybride (benzine)', value: 'hybride-benzine' },
                    { label: 'Hybride (diesel)', value: 'hybride-diesel' },
                    { label: 'LPG', value: 'lpg' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'transmission',
                  type: 'select',
                  label: 'Transmissie',
                  options: [
                    { label: 'Handgeschakeld', value: 'handgeschakeld' },
                    { label: 'Automaat', value: 'automaat' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'power',
                  type: 'number',
                  label: 'Vermogen (pk)',
                  admin: { width: '50%' },
                },
                {
                  name: 'powerKw',
                  type: 'number',
                  label: 'Vermogen (kW)',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'engineCapacity',
                  type: 'number',
                  label: 'Cilinderinhoud (cc)',
                  admin: { width: '50%' },
                },
                {
                  name: 'color',
                  type: 'text',
                  label: 'Kleur',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'bodyType',
                  type: 'select',
                  label: 'Carrosserie',
                  options: [
                    { label: 'Sedan', value: 'sedan' },
                    { label: 'Hatchback', value: 'hatchback' },
                    { label: 'SUV', value: 'suv' },
                    { label: 'Stationwagon', value: 'stationwagon' },
                    { label: 'Cabrio', value: 'cabrio' },
                    { label: 'Coup\u00e9', value: 'coupe' },
                    { label: 'Bus', value: 'bus' },
                    { label: 'Bestel', value: 'bestel' },
                  ],
                  admin: { width: '33%' },
                },
                {
                  name: 'doors',
                  type: 'number',
                  label: 'Deuren',
                  admin: { width: '33%' },
                },
                {
                  name: 'seats',
                  type: 'number',
                  label: 'Zitplaatsen',
                  admin: { width: '33%' },
                },
              ],
            },
            {
              name: 'weight',
              type: 'number',
              label: 'Gewicht (kg)',
            },
          ],
        },

        // ── TAB 3: Prijzen ──
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
                  label: 'Prijs',
                  admin: {
                    width: '50%',
                    step: 1,
                  },
                },
                {
                  name: 'salePrice',
                  type: 'number',
                  label: 'Actieprijs',
                  admin: {
                    width: '50%',
                    step: 1,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'priceType',
                  type: 'select',
                  label: 'Prijstype',
                  defaultValue: 'btw-marge',
                  options: [
                    { label: 'BTW/Marge', value: 'btw-marge' },
                    { label: 'BTW-auto', value: 'btw-auto' },
                    { label: 'Excl. BTW', value: 'ex-btw' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'monthlyPrice',
                  type: 'number',
                  label: 'Vanaf p/m',
                  admin: {
                    width: '50%',
                    step: 1,
                    description: 'Maandelijkse financieringsprijs',
                  },
                },
              ],
            },
          ],
        },

        // ── TAB 4: Registratie ──
        {
          label: 'Registratie',
          fields: [
            {
              name: 'licensePlate',
              type: 'text',
              label: 'Kenteken',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'firstRegistration',
                  type: 'date',
                  label: 'Eerste toelating',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                  },
                },
                {
                  name: 'apkExpiry',
                  type: 'date',
                  label: 'APK geldig tot',
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
                  name: 'numberOfOwners',
                  type: 'number',
                  label: 'Aantal eigenaren',
                  admin: { width: '50%' },
                },
                {
                  name: 'napCheck',
                  type: 'checkbox',
                  label: 'NAP-controle',
                  defaultValue: true,
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },

        // ── TAB 5: Media ──
        {
          label: 'Media',
          fields: [
            {
              name: 'images',
              type: 'array',
              label: "Foto's",
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
            {
              type: 'row',
              fields: [
                {
                  name: 'videoUrl',
                  type: 'text',
                  label: 'Video URL',
                  admin: {
                    width: '50%',
                    description: 'YouTube of Vimeo link',
                  },
                },
                {
                  name: 'panoramaUrl',
                  type: 'text',
                  label: '360\u00b0 URL',
                  admin: {
                    width: '50%',
                    description: 'Link naar 360-graden weergave',
                  },
                },
              ],
            },
          ],
        },

        // ── TAB 6: Extra's ──
        {
          label: "Extra's",
          fields: [
            {
              name: 'features',
              type: 'array',
              label: 'Uitrusting',
              fields: [
                {
                  name: 'category',
                  type: 'select',
                  label: 'Categorie',
                  options: [
                    { label: 'Comfort', value: 'comfort' },
                    { label: 'Veiligheid', value: 'veiligheid' },
                    { label: 'Exterieur', value: 'exterieur' },
                    { label: 'Audio & Multimedia', value: 'audio-multimedia' },
                    { label: 'Overig', value: 'overig' },
                  ],
                },
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Naam',
                },
              ],
            },
          ],
        },

        // ── TAB 7: Beschrijving ──
        {
          label: 'Beschrijving',
          fields: [
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
          ],
        },

        // SEO tab is auto-generated by seoPlugin (tabbedUI: true)
      ],
    },
  ],
}
