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
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'full-width',
      options: [
        { label: 'Volledige breedte (standaard)', value: 'full-width' },
        { label: 'Kaart met afgeronde hoeken', value: 'card' },
      ],
      admin: {
        description: 'Kaart variant toont een afgeronde kaart binnen de container',
      },
    },
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
      label: 'Knoptekst (primaire knop)',
      required: true,
      defaultValue: 'Neem contact op',
    },
    {
      name: 'buttonLink',
      type: 'text',
      label: 'Knop link (primaire knop)',
      required: true,
      defaultValue: '/contact',
    },
    {
      name: 'secondaryButtonText',
      type: 'text',
      label: 'Tweede knop tekst (optioneel)',
      admin: {
        description: 'Optionele tweede knop met ghost stijl',
      },
    },
    {
      name: 'secondaryButtonLink',
      type: 'text',
      label: 'Tweede knop link',
      admin: {
        condition: (data, siblingData) => !!siblingData?.secondaryButtonText,
      },
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
