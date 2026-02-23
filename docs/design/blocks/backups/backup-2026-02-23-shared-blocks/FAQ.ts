import type { Block } from 'payload'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQ\'s',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
      defaultValue: 'Veelgestelde vragen',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro tekst',
      admin: {
        rows: 2,
        description: 'Optionele introductie tekst voor de FAQ sectie',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Bron',
      defaultValue: 'manual',
      required: true,
      options: [
        { label: 'Vanuit FAQ collection', value: 'collection' },
        { label: 'Handmatig ingevoerd', value: 'manual' },
      ],
      admin: {
        description: 'Kies tussen herbruikbare FAQ\'s of unieke vragen voor deze pagina',
      },
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      label: 'Selecteer FAQ\'s',
      admin: {
        description: 'Kies welke FAQ\'s je wilt tonen uit de collection',
        condition: (data, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Filter op categorie',
      options: [
        { label: 'Alle categorieën', value: 'all' },
        { label: 'Algemeen', value: 'algemeen' },
        { label: 'Producten', value: 'producten' },
        { label: 'Verzending & Levering', value: 'verzending' },
        { label: 'Retourneren', value: 'retourneren' },
        { label: 'Betaling', value: 'betaling' },
        { label: 'Account & Privacy', value: 'account' },
        { label: 'Technische Support', value: 'support' },
        { label: 'Overig', value: 'overig' },
      ],
      defaultValue: 'all',
      admin: {
        description: 'Toon alleen FAQ\'s uit een specifieke categorie (alleen bij collection mode)',
        condition: (data, siblingData) =>
          siblingData?.source === 'collection' && !siblingData?.faqs,
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 10,
      min: 1,
      max: 30,
      admin: {
        description: 'Maximaal aantal FAQ\'s om te tonen',
        condition: (data, siblingData) =>
          siblingData?.source === 'collection' && !siblingData?.faqs,
      },
    },
    {
      name: 'showFeaturedOnly',
      type: 'checkbox',
      label: 'Alleen uitgelichte FAQ\'s',
      defaultValue: false,
      admin: {
        description: 'Toon alleen FAQ\'s die zijn gemarkeerd als "Uitgelicht"',
        condition: (data, siblingData) =>
          siblingData?.source === 'collection' && !siblingData?.faqs,
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Handmatige Vragen & Antwoorden',
      labels: {
        singular: 'Vraag',
        plural: 'Vragen',
      },
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Vraag',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          label: 'Antwoord',
          required: true,
        },
      ],
      admin: {
        description: 'Voeg handmatig vragen en antwoorden toe (alleen voor deze pagina)',
        condition: (data, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'generateSchema',
      type: 'checkbox',
      label: 'FAQ Schema genereren (voor Google)',
      defaultValue: true,
      admin: {
        description: 'Voegt gestructureerde data toe zodat FAQ\'s in Google zoekresultaten verschijnen',
      },
    },
  ],
}
