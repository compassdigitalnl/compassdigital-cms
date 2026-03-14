import type { Block } from 'payload'

export const TradeInCTA: Block = {
  slug: 'trade-in-cta',
  labels: {
    singular: 'Inruil CTA',
    plural: 'Inruil CTAs',
  },
  interfaceName: 'TradeInCTABlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      defaultValue: 'Auto inruilen?',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschrijving',
      admin: {
        rows: 3,
        placeholder: 'Rij uw nieuwe auto naar huis en laat uw huidige auto achter. Wij regelen de rest.',
      },
    },
    {
      name: 'showForm',
      type: 'checkbox',
      label: 'Toon inruilformulier',
      defaultValue: false,
      admin: {
        description: 'Toon het inruilformulier direct op de pagina in plaats van een link naar /inruilen',
      },
    },
  ],
}

export default TradeInCTA
