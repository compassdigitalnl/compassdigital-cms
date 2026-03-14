import type { Block } from 'payload'

export const ValuationCTA: Block = {
  slug: 'valuation-cta',
  labels: {
    singular: 'Waardebepaling CTA',
    plural: 'Waardebepaling CTA',
  },
  interfaceName: 'ValuationCTABlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      defaultValue: 'Wat is uw woning waard?',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
      admin: {
        placeholder:
          'Ontvang binnen 24 uur een gratis en vrijblijvende waardebepaling van uw woning door onze gecertificeerde makelaars.',
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Knoptekst',
      defaultValue: 'Gratis waardebepaling aanvragen',
    },
    {
      name: 'showTrustBadges',
      type: 'checkbox',
      label: 'Toon trust badges',
      defaultValue: true,
    },
  ],
}

export default ValuationCTA
