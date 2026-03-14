import type { Block } from 'payload'

export const DestinationGrid: Block = {
  slug: 'destination-grid',
  labels: {
    singular: 'Bestemmingen Grid',
    plural: 'Bestemmingen Grids',
  },
  interfaceName: 'DestinationGridBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Populaire bestemmingen',
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
      defaultValue: '3',
      options: [
        { label: '2 kolommen', value: '2' },
        { label: '3 kolommen', value: '3' },
        { label: '4 kolommen', value: '4' },
      ],
    },
    {
      name: 'showTourCount',
      type: 'checkbox',
      label: 'Toon aantal reizen',
      defaultValue: true,
    },
  ],
}

export default DestinationGrid
