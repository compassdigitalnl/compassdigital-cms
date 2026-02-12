import type { Block } from 'payload'

export const ProductFilters: Block = {
  slug: 'productFilters',
  labels: {
    singular: 'Product Filters',
    plural: 'Product Filters',
  },
  interfaceName: 'ProductFiltersBlock',
  fields: [
    {
      name: 'position',
      type: 'select',
      defaultValue: 'left',
      label: 'Positie',
      options: [
        { label: 'Links', value: 'left' },
        { label: 'Rechts', value: 'right' },
      ],
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'sidebar',
      label: 'Stijl',
      options: [
        { label: 'Sidebar (vast)', value: 'sidebar' },
        { label: 'Accordion (mobiel)', value: 'accordion' },
        { label: 'Offcanvas (slide-in)', value: 'offcanvas' },
      ],
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      defaultValue: true,
      label: 'Toon Zoeken',
      admin: {
        description: 'Product zoekbalk bovenaan filters',
      },
    },
    {
      name: 'enabledFilters',
      type: 'group',
      label: 'Actieve Filters',
      fields: [
        {
          name: 'categories',
          type: 'checkbox',
          defaultValue: true,
          label: 'Categorieën',
        },
        {
          name: 'brands',
          type: 'checkbox',
          defaultValue: true,
          label: 'Merken',
        },
        {
          name: 'priceRange',
          type: 'checkbox',
          defaultValue: true,
          label: 'Prijsfilter',
        },
        {
          name: 'badges',
          type: 'checkbox',
          defaultValue: true,
          label: 'Badges (Nieuw, Sale, etc.)',
        },
        {
          name: 'stock',
          type: 'checkbox',
          defaultValue: true,
          label: 'Op voorraad',
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Uitgelicht',
        },
      ],
    },
    {
      name: 'priceRangeConfig',
      type: 'group',
      label: 'Prijsfilter Instellingen',
      admin: {
        condition: (data) => data.enabledFilters?.priceRange,
      },
      fields: [
        {
          name: 'min',
          type: 'number',
          defaultValue: 0,
          label: 'Minimum Prijs (€)',
        },
        {
          name: 'max',
          type: 'number',
          defaultValue: 500,
          label: 'Maximum Prijs (€)',
        },
        {
          name: 'step',
          type: 'number',
          defaultValue: 10,
          label: 'Stap',
          admin: {
            description: 'Hoeveel de slider per stap verandert',
          },
        },
      ],
    },
    {
      name: 'showActiveFilters',
      type: 'checkbox',
      defaultValue: true,
      label: 'Toon Actieve Filters',
      admin: {
        description: 'Toon een overzicht van geselecteerde filters met "x" knoppen',
      },
    },
    {
      name: 'clearAllText',
      type: 'text',
      defaultValue: 'Wis alle filters',
      label: 'Wis Filters Tekst',
    },
  ],
}
