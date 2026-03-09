import type { Block } from 'payload'

export const ComparisonTable: Block = {
  slug: 'comparisontable',
  interfaceName: 'ComparisonTableBlock',
  labels: {
    singular: 'Vergelijkingstabel',
    plural: 'Vergelijkingstabellen',
  },
  fields: [
    {
      name: 'caption',
      type: 'text',
      label: 'Tabel Titel',
      admin: {
        placeholder: 'Bijv: Materiaal vergelijking',
        description: 'Optionele titel boven de tabel',
      },
    },
    {
      name: 'headers',
      type: 'array',
      label: 'Kolomkoppen',
      required: true,
      minRows: 2,
      maxRows: 6,
      fields: [
        {
          name: 'header',
          type: 'text',
          required: true,
          label: 'Kolomkop',
          admin: {
            placeholder: 'Bijv: Nitrile',
          },
        },
      ],
      admin: {
        description: 'Voeg kolomkoppen toe voor de tabel (min 2, max 6)',
      },
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Rijen',
      required: true,
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'rowLabel',
          type: 'text',
          required: true,
          label: 'Rij Label',
          admin: {
            placeholder: 'Bijv: Allergievrij',
          },
        },
        {
          name: 'cells',
          type: 'array',
          label: 'Cellen',
          required: true,
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              label: 'Waarde',
              admin: {
                placeholder: 'Bijv: Ja, Nee, Goed, Uitstekend',
              },
            },
            {
              name: 'type',
              type: 'select',
              label: 'Type',
              defaultValue: 'text',
              options: [
                { label: 'Tekst', value: 'text' },
                { label: '✓ Check (groen vinkje)', value: 'check' },
                { label: '✗ Cross (rood kruisje)', value: 'cross' },
              ],
            },
          ],
          admin: {
            description: 'Voeg cellen toe (aantal moet overeenkomen met aantal kolomkoppen)',
          },
        },
      ],
      admin: {
        description: 'Voeg rijen toe aan de tabel',
      },
    },
  ],
}
