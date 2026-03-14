import type { Block } from 'payload'

export const CategoryGrid: Block = {
  slug: 'category-grid',
  labels: {
    singular: 'Cursuscategorieën Grid',
    plural: 'Cursuscategorieën Grids',
  },
  interfaceName: 'CategoryGridBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Ontdek per categorie',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 6,
      min: 1,
      max: 12,
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Kolommen',
      defaultValue: '6',
      options: [
        { label: '3 kolommen', value: '3' },
        { label: '4 kolommen', value: '4' },
        { label: '6 kolommen', value: '6' },
      ],
    },
    {
      name: 'showCount',
      type: 'checkbox',
      label: 'Toon aantal cursussen',
      defaultValue: true,
    },
  ],
}

export default CategoryGrid
