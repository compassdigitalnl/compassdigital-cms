import type { Block } from 'payload'

export const MagazineShowcase: Block = {
  slug: 'magazine-showcase',
  labels: {
    singular: 'Magazine Showcase',
    plural: 'Magazine Showcases',
  },
  interfaceName: 'MagazineShowcaseBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Koptekst',
      admin: {
        description: 'Titel boven het magazine-overzicht',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 4,
      min: 1,
      max: 12,
      admin: {
        description: 'Aantal magazines om te tonen',
      },
    },
    {
      name: 'showSubscriptionCTA',
      type: 'checkbox',
      label: 'Toon abonnement CTA',
      defaultValue: true,
      admin: {
        description: 'Toon een call-to-action sectie voor abonnementen onderaan',
      },
    },
  ],
}

export default MagazineShowcase
