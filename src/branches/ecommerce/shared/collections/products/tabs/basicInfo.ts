import type { Tab } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { featureField } from '@/lib/tenant/featureFields'
import { features } from '@/lib/tenant/features'
import { autoGenerateSlug } from '@/utilities/slugify'

export const basicInfoTab: Tab = {
  label: 'Basis Info',
  description: 'Algemene productinformatie',
  fields: [
    // ── Title + Slug side by side ─────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Product Naam',
          admin: {
            width: '50%',
            components: {
              Field: '@/branches/shared/components/admin/fields/AITextField#AITextField',
            },
          },
        },
        {
          name: 'slug',
          type: 'text',
          unique: true,
          label: 'URL Slug',
          hooks: {
            beforeValidate: [autoGenerateSlug],
          },
          admin: {
            width: '50%',
            description: 'Automatisch gegenereerd uit de titel',
          },
        },
      ],
    },
    // ── SKU / EAN / MPN ───────────────────────────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'sku',
          type: 'text',
          label: 'SKU / Artikelnummer',
          unique: true,
          admin: { width: '33%' },
        },
        {
          name: 'ean',
          type: 'text',
          label: 'EAN / Barcode',
          admin: {
            width: '33%',
            description: 'European Article Number (13 cijfers)',
          },
        },
        {
          name: 'mpn',
          type: 'text',
          label: 'MPN',
          admin: {
            width: '34%',
            description: 'Manufacturer Part Number',
          },
        },
      ],
    },
    // ── Descriptions ──────────────────────────────────────────────
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Korte Beschrijving',
      maxLength: 200,
      admin: {
        description: 'Max 200 karakters, gebruikt in productlijsten',
        components: {
          Field: '@/branches/shared/components/admin/fields/AITextareaField#AITextareaField',
        },
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Beschrijving',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    // ── Brand / Manufacturer ──────────────────────────────────────
    {
      type: 'row',
      fields: [
        ...featureField('brands', {
          name: 'brand',
          type: 'relationship',
          relationTo: 'brands',
          label: 'Merk',
          admin: {
            width: '50%',
            description: 'Bijv: Hartmann, BSN Medical, 3M',
          },
        }),
        {
          name: 'manufacturer',
          type: 'text',
          label: 'Fabrikant',
          admin: {
            width: features.brands ? '50%' : '100%',
            description: 'Als afwijkend van merk',
          },
        },
      ],
    },
    ...featureField('vendors', {
      name: 'vendor',
      type: 'relationship',
      relationTo: 'vendors',
      label: 'Leverancier',
      admin: {
        description: 'Welke leverancier levert dit product?',
      },
    }),
    // ── Tags ──────────────────────────────────────────────────────
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: { description: 'Voor zoeken en filtering' },
      fields: [
        { name: 'tag', type: 'text', required: true, label: 'Tag' },
      ],
    },
    // ── Condition / Warranty / Release / Badge ────────────────────
    {
      type: 'row',
      fields: [
        {
          name: 'condition',
          type: 'select',
          label: 'Conditie',
          defaultValue: 'new',
          options: [
            { label: 'Nieuw', value: 'new' },
            { label: 'Refurbished', value: 'refurbished' },
            { label: 'Gebruikt', value: 'used' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'warranty',
          type: 'text',
          label: 'Garantie',
          admin: { width: '25%', placeholder: 'Bijv: 2 jaar, Lifetime' },
        },
        {
          name: 'releaseDate',
          type: 'date',
          label: 'Release Datum',
          admin: {
            width: '25%',
            date: { pickerAppearance: 'dayOnly' },
          },
        },
        {
          name: 'badge',
          type: 'select',
          label: 'Product Badge',
          defaultValue: 'none',
          options: [
            { label: 'Geen (of automatisch)', value: 'none' },
            { label: 'Nieuw', value: 'new' },
            { label: 'Sale / Aanbieding', value: 'sale' },
            { label: 'Populair', value: 'popular' },
            { label: 'Bestseller', value: 'bestseller' },
            { label: 'Uitverkocht', value: 'sold-out' },
          ],
          admin: {
            width: '25%',
            description: 'Handmatige badge. Bij "Geen" wordt automatisch bepaald.',
          },
        },
      ],
    },
  ],
}
