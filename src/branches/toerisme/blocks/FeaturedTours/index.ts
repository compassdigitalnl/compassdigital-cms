import type { Block } from 'payload'

export const FeaturedTours: Block = {
  slug: 'featured-tours',
  labels: {
    singular: 'Uitgelichte Reizen',
    plural: 'Uitgelichte Reizen',
  },
  interfaceName: 'FeaturedToursBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Uitgelichte reizen',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 4,
      min: 1,
      max: 12,
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Kolommen',
      defaultValue: '4',
      options: [
        { label: '2 kolommen', value: '2' },
        { label: '3 kolommen', value: '3' },
        { label: '4 kolommen', value: '4' },
      ],
    },
    {
      name: 'continentFilter',
      type: 'select',
      label: 'Filter op continent',
      options: [
        { label: 'Alle', value: '' },
        { label: 'Europa', value: 'europa' },
        { label: 'Azië', value: 'azie' },
        { label: 'Afrika', value: 'afrika' },
        { label: 'Amerika', value: 'amerika' },
        { label: 'Oceanië', value: 'oceanie' },
      ],
    },
    {
      name: 'showPrice',
      type: 'checkbox',
      label: 'Toon prijs',
      defaultValue: true,
    },
    {
      name: 'showRating',
      type: 'checkbox',
      label: 'Toon beoordeling',
      defaultValue: true,
    },
  ],
}

export default FeaturedTours
