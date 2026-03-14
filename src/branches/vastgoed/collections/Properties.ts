import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/tenant/shouldHideCollection'
import { autoGenerateSlug } from '@/utilities/slugify'

/**
 * Properties Collection — Vastgoed Branch
 *
 * Woningbeheer voor makelaars en vastgoedkantoren.
 * Ondersteunt woningen met locatie, kenmerken, energie, prijzen en status.
 */
export const Properties: CollectionConfig = {
  slug: 'properties',
  labels: {
    singular: 'Woning',
    plural: 'Woningen',
  },
  admin: {
    group: 'Vastgoed',
    useAsTitle: 'title',
    defaultColumns: ['title', 'city', 'askingPrice', 'propertyType', 'status', 'energyLabel'],
    hidden: shouldHideCollection('realEstate'),
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
              label: 'Titel (adres)',
              admin: {
                description: 'Bijv. "Wilhelminastraat 42, Amsterdam"',
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
            {
              name: 'listingStatus',
              type: 'select',
              label: 'Woningsstatus',
              defaultValue: 'beschikbaar',
              options: [
                { label: 'Beschikbaar', value: 'beschikbaar' },
                { label: 'Onder bod', value: 'onder-bod' },
                { label: 'Verkocht', value: 'verkocht' },
                { label: 'Verhuurd', value: 'verhuurd' },
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

        // ── TAB 2: Locatie ──
        {
          label: 'Locatie',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  label: 'Straat',
                  admin: { width: '60%' },
                },
                {
                  name: 'houseNumber',
                  type: 'text',
                  label: 'Huisnummer',
                  admin: { width: '40%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'postalCode',
                  type: 'text',
                  label: 'Postcode',
                  admin: { width: '30%' },
                },
                {
                  name: 'city',
                  type: 'text',
                  label: 'Plaats',
                  admin: { width: '40%' },
                },
                {
                  name: 'neighborhood',
                  type: 'text',
                  label: 'Wijk',
                  admin: { width: '30%' },
                },
              ],
            },
            {
              name: 'province',
              type: 'select',
              label: 'Provincie',
              options: [
                { label: 'Drenthe', value: 'drenthe' },
                { label: 'Flevoland', value: 'flevoland' },
                { label: 'Friesland', value: 'friesland' },
                { label: 'Gelderland', value: 'gelderland' },
                { label: 'Groningen', value: 'groningen' },
                { label: 'Limburg', value: 'limburg' },
                { label: 'Noord-Brabant', value: 'noord-brabant' },
                { label: 'Noord-Holland', value: 'noord-holland' },
                { label: 'Overijssel', value: 'overijssel' },
                { label: 'Utrecht', value: 'utrecht' },
                { label: 'Zeeland', value: 'zeeland' },
                { label: 'Zuid-Holland', value: 'zuid-holland' },
              ],
            },
            {
              name: 'coordinates',
              type: 'point',
              label: 'Coördinaten (lat/lng)',
              admin: {
                description: 'GPS-coördinaten voor kaartweergave',
              },
            },
          ],
        },

        // ── TAB 3: Kenmerken ──
        {
          label: 'Kenmerken',
          fields: [
            {
              name: 'propertyType',
              type: 'select',
              label: 'Woningtype',
              options: [
                { label: 'Appartement', value: 'appartement' },
                { label: 'Woonhuis', value: 'woonhuis' },
                { label: 'Villa', value: 'villa' },
                { label: 'Penthouse', value: 'penthouse' },
                { label: 'Tussenwoning', value: 'tussenwoning' },
                { label: 'Hoekwoning', value: 'hoekwoning' },
                { label: 'Twee-onder-een-kap', value: 'twee-onder-een-kap' },
                { label: 'Vrijstaand', value: 'vrijstaand' },
              ],
            },
            {
              name: 'buildYear',
              type: 'number',
              label: 'Bouwjaar',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'livingArea',
                  type: 'number',
                  label: 'Woonoppervlakte (m²)',
                  admin: { width: '50%' },
                },
                {
                  name: 'plotArea',
                  type: 'number',
                  label: 'Perceeloppervlakte (m²)',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'rooms',
                  type: 'number',
                  label: 'Kamers',
                  admin: { width: '25%' },
                },
                {
                  name: 'bedrooms',
                  type: 'number',
                  label: 'Slaapkamers',
                  admin: { width: '25%' },
                },
                {
                  name: 'bathrooms',
                  type: 'number',
                  label: 'Badkamers',
                  admin: { width: '25%' },
                },
                {
                  name: 'floors',
                  type: 'number',
                  label: 'Verdiepingen',
                  admin: { width: '25%' },
                },
              ],
            },
            {
              name: 'hasGarden',
              type: 'checkbox',
              label: 'Tuin',
              defaultValue: false,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'gardenArea',
                  type: 'number',
                  label: 'Tuinoppervlakte (m²)',
                  admin: {
                    width: '50%',
                    condition: (_, siblingData) => siblingData?.hasGarden,
                  },
                },
                {
                  name: 'gardenOrientation',
                  type: 'select',
                  label: 'Tuinligging',
                  options: [
                    { label: 'Noord', value: 'noord' },
                    { label: 'Oost', value: 'oost' },
                    { label: 'Zuid', value: 'zuid' },
                    { label: 'West', value: 'west' },
                    { label: 'N.v.t.', value: 'nvt' },
                  ],
                  admin: {
                    width: '50%',
                    condition: (_, siblingData) => siblingData?.hasGarden,
                  },
                },
              ],
            },
            {
              name: 'hasGarage',
              type: 'checkbox',
              label: 'Garage',
              defaultValue: false,
            },
            {
              name: 'hasParking',
              type: 'checkbox',
              label: 'Parkeerplaats',
              defaultValue: false,
            },
            {
              name: 'parkingType',
              type: 'text',
              label: 'Type parkeren',
              admin: {
                description: 'Bijv. "Vergunningsgebied", "Eigen oprit"',
                condition: (_, siblingData) => siblingData?.hasParking,
              },
            },
          ],
        },

        // ── TAB 4: Energie & Installaties ──
        {
          label: 'Energie & Installaties',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'energyLabel',
                  type: 'select',
                  label: 'Energielabel',
                  options: [
                    { label: 'A+++', value: 'A+++' },
                    { label: 'A++', value: 'A++' },
                    { label: 'A+', value: 'A+' },
                    { label: 'A', value: 'A' },
                    { label: 'B', value: 'B' },
                    { label: 'C', value: 'C' },
                    { label: 'D', value: 'D' },
                    { label: 'E', value: 'E' },
                    { label: 'F', value: 'F' },
                    { label: 'G', value: 'G' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'energyLabelExpiry',
                  type: 'date',
                  label: 'Energielabel geldig tot',
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
                  name: 'heatingType',
                  type: 'select',
                  label: 'Verwarming',
                  options: [
                    { label: 'CV-ketel', value: 'cv-ketel' },
                    { label: 'Stadsverwarming', value: 'stadsverwarming' },
                    { label: 'Warmtepomp', value: 'warmtepomp' },
                    { label: 'Vloerverwarming', value: 'vloerverwarming' },
                    { label: 'Anders', value: 'anders' },
                  ],
                  admin: { width: '50%' },
                },
                {
                  name: 'heatingYear',
                  type: 'number',
                  label: 'Bouwjaar verwarming',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'insulation',
              type: 'select',
              hasMany: true,
              label: 'Isolatie',
              options: [
                { label: 'Dakisolatie', value: 'dakisolatie' },
                { label: 'Muurisolatie', value: 'muurisolatie' },
                { label: 'Vloerisolatie', value: 'vloerisolatie' },
                { label: 'Dubbel glas', value: 'dubbel-glas' },
                { label: 'HR++ glas', value: 'hr++-glas' },
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
                  name: 'askingPrice',
                  type: 'number',
                  required: true,
                  label: 'Vraagprijs',
                  admin: {
                    width: '50%',
                    step: 1,
                  },
                },
                {
                  name: 'priceCondition',
                  type: 'select',
                  label: 'Prijsconditie',
                  defaultValue: 'k.k.',
                  options: [
                    { label: 'Kosten koper (k.k.)', value: 'k.k.' },
                    { label: 'Vrij op naam (v.o.n.)', value: 'v.o.n.' },
                  ],
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'originalPrice',
                  type: 'number',
                  label: 'Oorspronkelijke prijs',
                  admin: {
                    width: '50%',
                    step: 1,
                    description: 'Wordt doorgestreept weergegeven bij prijsverlaging',
                  },
                },
                {
                  name: 'pricePerM2',
                  type: 'number',
                  label: 'Prijs per m²',
                  admin: {
                    width: '50%',
                    step: 1,
                    description: 'Automatisch berekend op basis van vraagprijs en woonoppervlakte',
                  },
                },
              ],
            },
            {
              name: 'serviceCharges',
              type: 'number',
              label: 'VvE bijdrage (per maand)',
              admin: {
                step: 1,
              },
            },
          ],
        },

        // ── TAB 6: Status & Admin ──
        {
          label: 'Status & Admin',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'listingDate',
                  type: 'date',
                  label: 'Datum in verkoop',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                  },
                },
                {
                  name: 'soldDate',
                  type: 'date',
                  label: 'Verkoopdatum',
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
                  name: 'viewCount',
                  type: 'number',
                  label: 'Aantal bekeken',
                  defaultValue: 0,
                  admin: { width: '50%' },
                },
                {
                  name: 'favoriteCount',
                  type: 'number',
                  label: 'Aantal favorieten',
                  defaultValue: 0,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'agent',
              type: 'relationship',
              relationTo: 'content-team',
              label: 'Makelaar',
            },
          ],
        },

        // SEO tab is auto-generated by seoPlugin (tabbedUI: true)
      ],
    },
  ],
}
