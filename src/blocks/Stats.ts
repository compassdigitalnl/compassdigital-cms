import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: 'Statistieken',
    plural: 'Statistieken',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Cijfers',
      labels: {
        singular: 'Cijfer',
        plural: 'Cijfers',
      },
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          label: 'Getal',
          admin: {
            placeholder: '250',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          label: 'Achtervoegsel',
          admin: {
            placeholder: '+ of %',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: {
            placeholder: 'Tevreden klanten',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'grid-4',
      options: [
        { label: '2 kolommen', value: 'grid-2' },
        { label: '3 kolommen', value: 'grid-3' },
        { label: '4 kolommen', value: 'grid-4' },
      ],
    },
  ],
}
