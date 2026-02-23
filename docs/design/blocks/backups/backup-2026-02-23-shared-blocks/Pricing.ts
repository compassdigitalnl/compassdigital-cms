import type { Block } from 'payload'

export const Pricing: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  labels: {
    singular: 'Prijstabel',
    plural: 'Prijstabellen',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
      defaultValue: 'Onze pakketten',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro tekst',
      admin: {
        rows: 2,
      },
    },
    {
      name: 'plans',
      type: 'array',
      label: 'Pakketten',
      labels: {
        singular: 'Pakket',
        plural: 'Pakketten',
      },
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Naam',
        },
        {
          name: 'price',
          type: 'text',
          required: true,
          label: 'Prijs',
          admin: {
            placeholder: '€ 99',
          },
        },
        {
          name: 'period',
          type: 'text',
          label: 'Periode',
          admin: {
            placeholder: '/maand',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Beschrijving',
          admin: {
            rows: 2,
          },
        },
        {
          name: 'features',
          type: 'array',
          label: 'Features',
          fields: [
            {
              name: 'feature',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'CTA knoptekst',
          defaultValue: 'Kies pakket',
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'CTA link',
          defaultValue: '/contact',
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          label: 'Uitgelicht',
          defaultValue: false,
        },
      ],
    },
  ],
}
