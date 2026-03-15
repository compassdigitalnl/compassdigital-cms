import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideContentCollection } from '@/lib/tenant/shouldHideCollection'
import { getCachedSiteBranch } from '@/lib/tenant/contentModules'

/** Shared branch options used across all unified content collections */
export const branchOptions = [
  { label: 'Algemeen', value: 'general' },
  { label: 'Tech / ICT', value: 'tech' },
  { label: 'Zakelijke Dienstverlening', value: 'dienstverlening' },
  { label: 'Bouw & Renovatie', value: 'bouw' },
  { label: 'Beauty & Wellness', value: 'beauty' },
  { label: 'Zorg & Fysiotherapie', value: 'zorg' },
  { label: 'Horeca & Restaurant', value: 'horeca' },
  { label: 'Ervaringen & Belevenissen', value: 'ervaringen' },
  { label: 'Marktplaats', value: 'marketplace' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Toerisme', value: 'toerisme' },
  { label: 'Vastgoed', value: 'vastgoed' },
  { label: 'Onderwijs', value: 'onderwijs' },
]

const colorOptions = [
  { label: 'Teal', value: 'teal' },
  { label: 'Blauw', value: 'blue' },
  { label: 'Groen', value: 'green' },
  { label: 'Paars', value: 'purple' },
  { label: 'Amber', value: 'amber' },
  { label: 'Koraal', value: 'coral' },
]

/**
 * Content Services — Unified collection
 *
 * Vervangt: services, professional-services, construction-services, beautyServices, treatments
 * Alle diensten/services in één collection met `branch` veld voor branche-specifieke velden.
 * Branch default wordt bepaald door Settings > siteBranch.
 */
export const ContentServices: CollectionConfig = {
  slug: 'content-services',
  labels: {
    singular: 'Dienst',
    plural: 'Diensten',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'branch', 'status', 'featured'],
    hidden: shouldHideContentCollection('content-services'),
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
    beforeChange: [
      ({ data, operation }) => {
        // Auto-set branch from Settings on create if not explicitly set
        if (operation === 'create' && !data.branch) {
          data.branch = getCachedSiteBranch()
        }
        return data
      },
    ],
  },
  fields: [
    // ─── TOP FIELDS ────────────────────────────────────────
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'branch',
      type: 'select',
      required: true,
      label: 'Branche',
      options: branchOptions,
      defaultValue: () => getCachedSiteBranch(),
      admin: {
        position: 'sidebar',
        description: 'Bepaalt welke velden zichtbaar zijn',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Uitgelicht',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'draft',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    // ─── TABS ──────────────────────────────────────────────
    {
      type: 'tabs',
      tabs: [
        // ── TAB 1: Inhoud ──
        {
          label: 'Inhoud',
          fields: [
            {
              name: 'icon',
              type: 'text',
              label: 'Icoon',
              admin: {
                description: 'Lucide icon naam (bijv. "wrench", "scissors", "heart")',
              },
            },
            {
              name: 'color',
              type: 'select',
              label: 'Kleur',
              options: colorOptions,
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              required: true,
              label: 'Korte beschrijving',
              maxLength: 300,
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Uitgebreide beschrijving',
            },
            {
              name: 'features',
              type: 'array',
              label: 'Kenmerken',
              admin: {
                description: 'Voordelen of kenmerken van deze dienst',
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
                  label: 'Beschrijving',
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icoon',
                },
              ],
            },
            {
              name: 'processSteps',
              type: 'array',
              label: 'Processtappen',
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
                  label: 'Beschrijving',
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icoon',
                },
              ],
            },
            {
              name: 'usps',
              type: 'array',
              label: 'USPs',
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
                  label: 'Beschrijving',
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icoon',
                },
              ],
            },
            // Automotive-specifiek
            {
              name: 'vehicleType',
              type: 'select',
              label: 'Voertuigtype',
              options: [
                { label: 'Auto', value: 'auto' },
                { label: 'Motor', value: 'motor' },
                { label: 'Scooter', value: 'scooter' },
                { label: 'Camper', value: 'camper' },
                { label: 'Alle', value: 'alle' },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.branch === 'automotive',
                description: 'Voor welk voertuigtype is deze dienst bedoeld',
              },
            },
            {
              name: 'serviceTypes',
              type: 'array',
              label: 'Service Types',
              admin: {
                condition: (_, siblingData) =>
                  ['dienstverlening', 'bouw', 'general'].includes(siblingData?.branch),
                description: 'Sub-categorieën binnen deze dienst',
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
                  label: 'Beschrijving',
                },
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icoon',
                },
              ],
            },
          ],
        },

        // ── TAB 2: Prijzen & Boekbaarheid (beauty, zorg, horeca) ──
        {
          label: 'Prijzen & Boekbaarheid',
          fields: [
            {
              name: 'duration',
              type: 'number',
              label: 'Duur (minuten)',
              admin: {
                condition: (_, siblingData) =>
                  ['beauty', 'zorg', 'horeca'].includes(siblingData?.branch),
              },
            },
            {
              name: 'price',
              type: 'number',
              label: 'Prijs (€)',
              admin: {
                step: 0.01,
                condition: (_, siblingData) =>
                  ['beauty', 'zorg', 'horeca'].includes(siblingData?.branch),
              },
            },
            {
              name: 'priceFrom',
              type: 'number',
              label: 'Prijs vanaf (€)',
              admin: {
                step: 0.01,
                condition: (_, siblingData) =>
                  ['beauty', 'zorg'].includes(siblingData?.branch),
              },
            },
            {
              name: 'priceTo',
              type: 'number',
              label: 'Prijs tot (€)',
              admin: {
                step: 0.01,
                condition: (_, siblingData) =>
                  ['beauty', 'zorg'].includes(siblingData?.branch),
              },
            },
            {
              name: 'bookable',
              type: 'checkbox',
              label: 'Online boekbaar',
              defaultValue: false,
              admin: {
                condition: (_, siblingData) =>
                  ['beauty', 'zorg'].includes(siblingData?.branch),
              },
            },
            {
              name: 'insurance',
              type: 'select',
              label: 'Verzekering',
              options: [
                { label: 'Vergoed', value: 'covered' },
                { label: 'Gedeeltelijk vergoed', value: 'partial' },
                { label: 'Niet vergoed', value: 'not-covered' },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.branch === 'zorg',
              },
            },
            {
              name: 'successRate',
              type: 'number',
              label: 'Slagingspercentage (%)',
              min: 0,
              max: 100,
              admin: {
                condition: (_, siblingData) => siblingData?.branch === 'zorg',
              },
            },
          ],
        },

        // ── TAB 3: FAQ ──
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
                },
              ],
            },
          ],
        },

        // ── TAB 4: Media ──
        {
          label: 'Media',
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Uitgelichte afbeelding',
            },
            {
              name: 'gallery',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              label: 'Galerij',
            },
          ],
        },

        // ── TAB 5: Relaties ──
        {
          label: 'Relaties',
          fields: [
            {
              name: 'relatedServices',
              type: 'relationship',
              relationTo: 'content-services',
              hasMany: true,
              label: 'Gerelateerde diensten',
            },
          ],
        },

        // SEO tab is auto-generated by seoPlugin (tabbedUI: true)
      ],
    },
  ],
}
