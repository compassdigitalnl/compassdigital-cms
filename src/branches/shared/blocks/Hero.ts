import type { Block } from 'payload'
import { sectionLabelField } from '@/fields/sectionLabel'

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
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'centered',
      options: [
        { label: 'Gecentreerd (standaard)', value: 'centered' },
        { label: 'Twee kolommen (tekst + stats panel)', value: 'two-column' },
      ],
      admin: {
        description: 'Kies de layout structuur',
      },
    },
    sectionLabelField,
    {
      name: 'badge',
      type: 'text',
      label: 'Badge / Label',
      admin: {
        description: 'Kleine pill-shaped label boven de titel (bijv. "Sinds 1994 — 30+ jaar ervaring")',
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
      name: 'titleAccent',
      type: 'text',
      label: 'Accent tekst in titel',
      admin: {
        description:
          'Dit deel van de titel krijgt een gradient kleur (bijv. "medische" in "Uw partner in medische hulpmiddelen")',
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
      name: 'stats',
      type: 'array',
      label: 'Statistieken (rechter paneel)',
      maxRows: 4,
      admin: {
        condition: (data, siblingData) => siblingData?.layout === 'two-column',
        description: 'Toon statistieken in een glasmorfisme kaart rechts (max 4 items)',
      },
      fields: [
        {
          name: 'number',
          type: 'text',
          label: 'Getal',
          required: true,
          admin: {
            description: 'Bijv. "4000" of "30"',
          },
        },
        {
          name: 'suffix',
          type: 'text',
          label: 'Achtervoegsel',
          admin: {
            description: 'Bijv. "+" of "%" (optioneel)',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          admin: {
            description: 'Bijv. "Producten" of "Jaar ervaring"',
          },
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
