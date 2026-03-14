import type { Block } from 'payload'

export const ZorgTreatmentGrid: Block = {
  slug: 'zorg-treatment-grid',
  labels: {
    singular: 'Zorg Behandelingen Grid',
    plural: 'Zorg Behandelingen Grids',
  },
  interfaceName: 'ZorgTreatmentGridBlock',
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
      name: 'showInsurance',
      type: 'checkbox',
      label: 'Toon verzekeringsindicatie',
      defaultValue: true,
    },
  ],
}

export default ZorgTreatmentGrid
