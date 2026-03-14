import type { Block } from 'payload'

export const TreatmentGrid: Block = {
  slug: 'treatment-grid',
  labels: {
    singular: 'Behandelingen Grid',
    plural: 'Behandelingen Grids',
  },
  interfaceName: 'TreatmentGridBlock',
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
        { label: 'Automatisch (alle gepubliceerde behandelingen)', value: 'auto' },
        { label: 'Handmatig selecteren', value: 'manual' },
      ],
      defaultValue: 'auto',
    },
    {
      name: 'treatments',
      type: 'relationship',
      relationTo: 'content-services',
      hasMany: true,
      label: 'Behandelingen',
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

export default TreatmentGrid
