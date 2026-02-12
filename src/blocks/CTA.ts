import type { Block } from 'payload'

export const CTA: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Actions',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titel',
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Tekst',
      admin: {
        rows: 2,
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Knoptekst',
      required: true,
      defaultValue: 'Neem contact op',
    },
    {
      name: 'buttonLink',
      type: 'text',
      label: 'Knop link',
      required: true,
      defaultValue: '/contact',
    },
    {
      name: 'style',
      type: 'select',
      label: 'Stijl',
      defaultValue: 'primary',
      options: [
        { label: 'Primair (merkkleur)', value: 'primary' },
        { label: 'Secundair (accentkleur)', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Achtergrondafbeelding (optioneel)',
    },
  ],
}
