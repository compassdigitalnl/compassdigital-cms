import type { Block } from 'payload'

export const CasesBlock: Block = {
  slug: 'cases',
  interfaceName: 'CasesBlock',
  labels: {
    singular: 'Cases / Portfolio',
    plural: 'Cases / Portfolio',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
      defaultValue: 'Onze projecten',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Introductie tekst',
      admin: {
        description: 'Optionele introductie tekst voor de cases sectie',
        rows: 2,
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Bron',
      defaultValue: 'featured',
      required: true,
      options: [
        { label: 'Featured Cases (Automatisch)', value: 'featured' },
        { label: 'Handmatig (Selecteer cases)', value: 'manual' },
        { label: 'Nieuwste Cases', value: 'latest' },
      ],
      admin: {
        description: 'Hoe worden de cases gekozen?',
      },
    },
    {
      name: 'cases',
      type: 'relationship',
      relationTo: 'cases',
      hasMany: true,
      label: 'Selecteer cases',
      admin: {
        description: 'Kies welke cases je wilt tonen',
        condition: (data, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        description: 'Maximaal aantal cases om te tonen',
        condition: (data, siblingData) => siblingData?.source !== 'manual',
      },
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'grid-3',
      options: [
        { label: '2 kolommen', value: 'grid-2' },
        { label: '3 kolommen', value: 'grid-3' },
        { label: '4 kolommen', value: 'grid-4' },
      ],
    },
    {
      name: 'showExcerpt',
      type: 'checkbox',
      label: 'Toon samenvatting',
      defaultValue: true,
      admin: {
        description: 'Toon de korte beschrijving onder de titel',
      },
    },
    {
      name: 'showClient',
      type: 'checkbox',
      label: 'Toon klant naam',
      defaultValue: true,
      admin: {
        description: 'Toon de klant naam bij elke case',
      },
    },
    {
      name: 'showServices',
      type: 'checkbox',
      label: 'Toon diensten',
      defaultValue: true,
      admin: {
        description: 'Toon de diensten/services bij elke case',
      },
    },
    {
      name: 'showViewAllButton',
      type: 'checkbox',
      label: 'Toon "Bekijk alle" knop',
      defaultValue: true,
      admin: {
        description: 'Link naar portfolio/cases overzicht pagina',
      },
    },
    {
      name: 'viewAllButtonText',
      type: 'text',
      label: '"Bekijk alle" tekst',
      defaultValue: 'Bekijk alle projecten',
      admin: {
        condition: (data, siblingData) => siblingData?.showViewAllButton === true,
      },
    },
    {
      name: 'viewAllButtonLink',
      type: 'text',
      label: '"Bekijk alle" link',
      defaultValue: '/portfolio',
      admin: {
        placeholder: '/portfolio of /cases',
        condition: (data, siblingData) => siblingData?.showViewAllButton === true,
      },
    },
  ],
}
