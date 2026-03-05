import type { Tab } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { featureField } from '@/lib/featureFields'
import { features } from '@/lib/features'
import { productTypeOptions } from '../productTypeOptions'

export const basicInfoTab: Tab = {
  label: 'Basis Info',
  description: 'Algemene productinformatie',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Product Naam',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'URL Slug',
      admin: {
        position: 'sidebar',
        description: 'Laat leeg voor automatische generatie o.b.v. productnaam. Vul in om handmatig te overrulen.',
      },
    },
    ...featureField('editionNotifications', {
      name: 'magazineTitle',
      type: 'text',
      label: 'Periodieke Publicatie Naam',
      admin: {
        position: 'sidebar',
        description: 'Bijv. "WINELIFE" — Voor editie-notificaties. Alle producten met dezelfde naam worden als edities van dezelfde publicatie behandeld.',
      },
    }),
    {
      name: 'productType',
      type: 'select',
      label: 'Product Type',
      defaultValue: 'simple',
      required: true,
      options: productTypeOptions,
      admin: {
        position: 'sidebar',
        description: 'Simple = normaal, Grouped = multi-select, Variable = configureerbaar',
      },
    },
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
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Korte Beschrijving',
      maxLength: 200,
      admin: {
        description: 'Max 200 karakters, gebruikt in productlijsten',
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
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      label: 'Categorieen',
      admin: { position: 'sidebar' },
    },
    ...featureField('shop', {
      name: 'branches',
      type: 'relationship',
      relationTo: 'branches',
      hasMany: true,
      label: 'Branches',
      admin: {
        position: 'sidebar',
        description: 'Selecteer branches waar dit product bij hoort',
      },
    }),
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: { description: 'Voor zoeken en filtering' },
      fields: [
        { name: 'tag', type: 'text', required: true, label: 'Tag' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          defaultValue: 'draft',
          required: true,
          label: 'Status',
          options: [
            { label: 'Concept', value: 'draft' },
            { label: 'Gepubliceerd', value: 'published' },
            { label: 'Uitverkocht', value: 'sold-out' },
            { label: 'Gearchiveerd', value: 'archived' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Featured',
          admin: { width: '25%', description: 'Toon in featured secties' },
        },
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
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'releaseDate',
          type: 'date',
          label: 'Release Datum',
          admin: {
            width: '50%',
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
            width: '50%',
            description: 'Handmatige badge. Bij "Geen" wordt automatisch bepaald o.b.v. actieprijs, voorraad en populariteit.',
          },
        },
      ],
    },
  ],
}
