import type { Block } from 'payload'

export const FeaturedProperties: Block = {
  slug: 'featured-properties',
  labels: {
    singular: 'Uitgelichte Woningen',
    plural: 'Uitgelichte Woningen',
  },
  interfaceName: 'FeaturedPropertiesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Uitgelichte woningen',
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
      name: 'showMap',
      type: 'checkbox',
      label: 'Toon kaartweergave',
      defaultValue: false,
    },
    {
      name: 'statusFilter',
      type: 'select',
      label: 'Filter op status',
      defaultValue: 'alle',
      options: [
        { label: 'Alle', value: 'alle' },
        { label: 'Beschikbaar', value: 'beschikbaar' },
        { label: 'Onder bod', value: 'onder-bod' },
      ],
    },
  ],
}

export default FeaturedProperties
