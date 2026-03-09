import type { Block } from 'payload'

export const QuickOrder: Block = {
  slug: 'quickOrder',
  labels: {
    singular: 'Quick Order',
    plural: 'Quick Orders',
  },
  interfaceName: 'QuickOrderBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      defaultValue: 'Snel Bestellen',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Introductie',
      admin: {
        rows: 3,
      },
    },
    {
      name: 'showOrderLists',
      type: 'checkbox',
      defaultValue: true,
      label: 'Toon Bestellijsten',
      admin: {
        description: 'Toon opgeslagen bestellijsten voor snelle selectie',
      },
    },
    {
      name: 'inputMode',
      type: 'select',
      defaultValue: 'textarea',
      label: 'Invoer Modus',
      options: [
        { label: 'Tekstgebied (bulk)', value: 'textarea' },
        { label: 'Enkele regel', value: 'single' },
        { label: 'Beide', value: 'both' },
      ],
      admin: {
        description: 'Hoe gebruikers producten kunnen invoeren',
      },
    },
    {
      name: 'placeholderText',
      type: 'textarea',
      label: 'Placeholder Tekst',
      defaultValue:
        'Voer artikelnummers en aantallen in:\n\nBV-001 5\nLT-334 2\nHT-892 10',
      admin: {
        rows: 4,
        description: 'Voorbeeld tekst in het invoerveld',
      },
    },
    {
      name: 'helpText',
      type: 'richText',
      label: 'Hulptekst',
      admin: {
        description: 'Extra uitleg over hoe de quick order functie werkt',
      },
    },
    {
      name: 'submitButtonText',
      type: 'text',
      label: 'Knop Tekst',
      defaultValue: 'Toevoegen aan winkelwagen',
    },
    {
      name: 'showUpload',
      type: 'checkbox',
      defaultValue: false,
      label: 'CSV Upload Toestaan',
      admin: {
        description: 'Gebruikers kunnen een CSV bestand uploaden met bestellingen',
      },
    },
    {
      name: 'uploadHelpText',
      type: 'text',
      label: 'CSV Upload Hulptekst',
      defaultValue: 'Upload een CSV bestand met artikelnummer,aantal per regel',
      admin: {
        condition: (data) => data.showUpload,
      },
    },
  ],
}
