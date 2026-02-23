import type { Block } from 'payload'

export const Spacer: Block = {
  slug: 'spacer',
  interfaceName: 'SpacerBlock',
  labels: {
    singular: 'Witruimte',
    plural: 'Witruimtes',
  },
  fields: [
    {
      name: 'height',
      type: 'select',
      label: 'Hoogte',
      defaultValue: 'medium',
      required: true,
      options: [
        { label: 'Klein (40px)', value: 'small' },
        { label: 'Gemiddeld (80px)', value: 'medium' },
        { label: 'Groot (120px)', value: 'large' },
        { label: 'Extra groot (160px)', value: 'xlarge' },
      ],
    },
  ],
}
