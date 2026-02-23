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
        { label: 'Klein (24px)', value: 'small' },
        { label: 'Gemiddeld (48px)', value: 'medium' },
        { label: 'Groot (80px)', value: 'large' },
        { label: 'Extra groot (120px)', value: 'xlarge' },
      ],
    },
  ],
}
