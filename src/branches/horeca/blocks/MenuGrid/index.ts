import type { Block } from 'payload'

export const MenuGrid: Block = {
  slug: 'menu-grid',
  labels: {
    singular: 'Menukaart Grid',
    plural: 'Menukaart Grids',
  },
  interfaceName: 'MenuGridBlock',
  fields: [
    {
      name: 'heading',
      type: 'group',
      label: 'Kopje',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge',
          admin: {
            description: 'Kleine badge boven de titel',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Titel',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Omschrijving',
          admin: { rows: 2 },
        },
      ],
    },
    {
      name: 'source',
      type: 'radio',
      label: 'Bron',
      options: [
        { label: 'Automatisch (alle gepubliceerde gerechten)', value: 'auto' },
        { label: 'Handmatig selecteren', value: 'manual' },
      ],
      defaultValue: 'auto',
    },
    {
      name: 'menuItems',
      type: 'relationship',
      relationTo: 'content-services',
      hasMany: true,
      label: 'Gerechten',
      admin: {
        condition: (data) => data.source === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        condition: (data) => data.source === 'auto',
      },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Kolommen',
      options: [
        { label: '2 kolommen', value: '2' },
        { label: '3 kolommen', value: '3' },
        { label: '4 kolommen', value: '4' },
      ],
      defaultValue: '3',
    },
    {
      name: 'showCategoryFilter',
      type: 'checkbox',
      label: 'Toon categoriefilter',
      defaultValue: false,
    },
  ],
}

export default MenuGrid
