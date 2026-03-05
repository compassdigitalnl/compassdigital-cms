import type { Tab } from 'payload'
import { featureFields, subFeatureFields } from '@/lib/featureFields'

export const pricesTab: Tab = {
  label: 'Prijzen',
  description: 'Prijzen, BTW, staffels en klantengroepen',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          min: 0,
          label: 'Basis Prijs (excl. BTW)',
          validate: (value: any, { data }: any) => {
            const productType = data?.productType
            if (productType === 'grouped' || productType === 'bundle') return true
            if (value === null || value === undefined || value === '') {
              return 'Prijs is verplicht'
            }
            return true
          },
          admin: {
            step: 0.01,
            width: '33%',
            description: 'Niet verplicht voor Grouped/Bundle Products (prijs komt van sub-producten)',
          },
        },
        {
          name: 'salePrice',
          type: 'number',
          min: 0,
          label: 'Actieprijs',
          admin: { step: 0.01, width: '33%', description: 'Tijdelijke korting' },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          min: 0,
          label: 'Vergelijk Prijs (doorstreept)',
          admin: { step: 0.01, width: '34%', description: 'Voor "Was X, nu Y"' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'costPrice',
          type: 'number',
          min: 0,
          label: 'Kostprijs (intern)',
          admin: { step: 0.01, width: '50%', description: 'Voor winstmarge berekening' },
        },
        {
          name: 'msrp',
          type: 'number',
          min: 0,
          label: 'Adviesprijs (MSRP)',
          admin: { step: 0.01, width: '50%', description: 'Manufacturer Suggested Retail Price' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'taxClass',
          type: 'select',
          label: 'BTW Klasse',
          defaultValue: 'standard',
          options: [
            { label: 'Standaard (21%)', value: 'standard' },
            { label: 'Verlaagd (9%)', value: 'reduced' },
            { label: 'Nul (0%)', value: 'zero' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'includesTax',
          type: 'checkbox',
          label: 'Prijs inclusief BTW',
          defaultValue: false,
          admin: { width: '50%', description: 'Anders = excl. BTW' },
        },
      ],
    },
    ...subFeatureFields('b2b', 'groupPricing', [
      {
        type: 'collapsible',
        label: 'Klantengroep Prijzen (B2B)',
        admin: { initCollapsed: true, description: 'Speciale prijzen per klantengroep' },
        fields: [
          {
            name: 'groupPrices',
            type: 'array',
            label: 'Groepsprijzen',
            maxRows: 20,
            admin: {
              description: 'Stel verschillende prijzen in voor verschillende klantengroepen (bijv. dealers, groothandel)',
            },
            fields: [
              {
                name: 'group',
                type: 'relationship',
                relationTo: 'customer-groups',
                required: true,
                label: 'Klantengroep',
              },
              {
                name: 'price',
                type: 'number',
                required: true,
                min: 0,
                label: 'Prijs',
                admin: { step: 0.01 },
              },
              {
                name: 'minQuantity',
                type: 'number',
                min: 1,
                defaultValue: 1,
                label: 'Vanaf aantal',
                admin: { description: 'Minimale afname voor deze prijs' },
              },
            ],
          },
        ],
      },
    ]),
    ...featureFields('volumePricing', [
      {
        type: 'collapsible',
        label: 'Staffelprijzen (Volume)',
        admin: {
          initCollapsed: true,
          description: 'Korting bij grotere aantallen — overschrijft eventuele globale staffelregels',
        },
        fields: [
          {
            name: 'volumePricing',
            type: 'array',
            label: 'Staffels',
            admin: { description: 'Bijv: 1-9 stuks 10, 10-49 stuks 9, 50+ stuks 8' },
            fields: [
              {
                type: 'row',
                fields: [
                  { name: 'minQuantity', type: 'number', required: true, min: 1, label: 'Vanaf', admin: { width: '25%' } },
                  { name: 'maxQuantity', type: 'number', min: 1, label: 'Tot', admin: { width: '25%', description: 'Leeg = onbeperkt' } },
                  { name: 'price', type: 'number', required: true, min: 0, label: 'Stuksprijs', admin: { step: 0.01, width: '25%' } },
                  { name: 'discountPercentage', type: 'number', min: 0, max: 100, label: 'Korting %', admin: { width: '25%', description: 'Of vul prijs in' } },
                ],
              },
            ],
          },
        ],
      },
    ]),
  ],
}
