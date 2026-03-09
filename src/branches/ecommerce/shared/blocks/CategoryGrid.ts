import type { Block } from 'payload'
import { sectionLabelField } from '@/fields/sectionLabel'

export const CategoryGrid: Block = {
  slug: 'categoryGrid',
  interfaceName: 'CategoryGridBlock',
  labels: {
    singular: 'Categorie Grid',
    plural: 'Categorie Grids',
  },
  fields: [
    sectionLabelField,
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
      defaultValue: 'Onze categorieën',
      admin: {
        placeholder: 'Ons assortiment',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro tekst',
      admin: {
        rows: 2,
        placeholder: 'Ontdek al onze productcategorieën',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Bron',
      defaultValue: 'auto',
      options: [
        { label: 'Automatisch (Featured categorieën)', value: 'auto' },
        { label: 'Handmatig (Selecteer categorieën)', value: 'manual' },
      ],
      admin: {
        description: 'Automatisch toont alle featured categorieën',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      label: 'Selecteer categorieën',
      admin: {
        description: 'Alleen gebruikt bij "Handmatig"',
        condition: (data, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'showIcon',
      type: 'checkbox',
      label: 'Toon Icon',
      defaultValue: true,
      admin: {
        description: 'Toon emoji icon of afbeelding',
      },
    },
    {
      name: 'showProductCount',
      type: 'checkbox',
      label: 'Toon Aantal Producten',
      defaultValue: true,
      admin: {
        description: 'Toon "280+ producten" onder categorie naam',
      },
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'grid-3',
      options: [
        { label: '2 kolommen', value: 'grid-2' },
        { label: '3 kolommen', value: 'grid-3' },
        { label: '4 kolommen', value: 'grid-4' },
        { label: '5 kolommen', value: 'grid-5' },
        { label: '6 kolommen', value: 'grid-6' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 10,
      min: 1,
      max: 20,
      admin: {
        description: 'Maximaal aantal categorieën om te tonen',
      },
    },
    {
      name: 'showQuickOrderCard',
      type: 'checkbox',
      label: 'Toon "Quick Order" kaart als laatste item',
      defaultValue: false,
      admin: {
        description: 'Voegt een speciale Quick Order kaart toe met teal achtergrond',
      },
    },
    {
      name: 'quickOrderLink',
      type: 'text',
      label: 'Quick Order link',
      defaultValue: '/quick-order',
      admin: {
        condition: (data, siblingData) => siblingData?.showQuickOrderCard,
      },
    },
  ],
}
