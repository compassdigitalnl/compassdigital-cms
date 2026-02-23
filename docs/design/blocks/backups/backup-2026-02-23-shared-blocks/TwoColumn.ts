import type { Block } from 'payload'

export const TwoColumn: Block = {
  slug: 'twoColumn',
  interfaceName: 'TwoColumnBlock',
  labels: {
    singular: 'Twee Kolommen',
    plural: 'Twee Kolommen',
  },
  fields: [
    {
      name: 'leftColumn',
      type: 'richText',
      label: 'Linker kolom',
      required: true,
    },
    {
      name: 'rightColumn',
      type: 'richText',
      label: 'Rechter kolom',
      required: true,
    },
    {
      name: 'ratio',
      type: 'select',
      label: 'Kolom verhouding',
      defaultValue: '50-50',
      options: [
        { label: '50/50', value: '50-50' },
        { label: '40/60', value: '40-60' },
        { label: '60/40', value: '60-40' },
        { label: '33/67', value: '33-67' },
        { label: '67/33', value: '67-33' },
      ],
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Verticale uitlijning',
      defaultValue: 'top',
      options: [
        { label: 'Boven', value: 'top' },
        { label: 'Midden', value: 'center' },
        { label: 'Onder', value: 'bottom' },
      ],
    },
  ],
}
