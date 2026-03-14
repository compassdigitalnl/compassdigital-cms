import type { Block } from 'payload'

export const EventsGrid: Block = {
  slug: 'events-grid',
  labels: {
    singular: 'Evenementen Grid',
    plural: 'Evenementen Grids',
  },
  interfaceName: 'EventsGridBlock',
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
        { label: 'Automatisch (alle gepubliceerde evenementen)', value: 'auto' },
        { label: 'Handmatig selecteren', value: 'manual' },
      ],
      defaultValue: 'auto',
    },
    {
      name: 'events',
      type: 'relationship',
      relationTo: 'content-activities',
      hasMany: true,
      label: 'Evenementen',
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
  ],
}

export default EventsGrid
