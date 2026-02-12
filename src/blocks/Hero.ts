import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: {
    singular: 'Hero',
    plural: 'Hero\'s',
  },
  fields: [
    {
      name: 'style',
      type: 'select',
      label: 'Stijl',
      defaultValue: 'default',
      required: true,
      options: [
        { label: 'Standaard (met achtergrondkleur)', value: 'default' },
        { label: 'Met afbeelding', value: 'image' },
        { label: 'Met gradient', value: 'gradient' },
        { label: 'Minimaal (alleen tekst)', value: 'minimal' },
      ],
      admin: {
        description: 'Kies hoe de hero eruit ziet',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titel',
      required: true,
      admin: {
        description: 'De grote koptekst (H1)',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtekst',
      admin: {
        description: 'Korte tekst onder de titel',
        rows: 3,
      },
    },
    {
      name: 'primaryCTA',
      type: 'group',
      label: 'Primaire knop',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Knoptekst',
          defaultValue: 'Neem contact op',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/contact',
        },
      ],
    },
    {
      name: 'secondaryCTA',
      type: 'group',
      label: 'Secundaire knop (optioneel)',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Knoptekst',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      label: 'Achtergrondafbeelding',
      relationTo: 'media',
      admin: {
        condition: (data, siblingData) => siblingData?.style === 'image',
        description: 'Alleen zichtbaar bij stijl "Met afbeelding"',
      },
    },
    {
      name: 'backgroundImageUrl',
      type: 'text',
      label: 'Achtergrondafbeelding URL (placeholder)',
      admin: {
        condition: (data, siblingData) => siblingData?.style === 'image',
        description: 'Directe URL naar afbeelding (gebruikt voor AI-gegenereerde sites)',
        readOnly: true,
      },
    },
  ],
}
