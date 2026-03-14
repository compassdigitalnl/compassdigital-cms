import type { Block } from 'payload'

export const LatestArticles: Block = {
  slug: 'latest-articles',
  labels: {
    singular: 'Laatste Artikelen',
    plural: 'Laatste Artikelen',
  },
  interfaceName: 'LatestArticlesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Koptekst',
      admin: {
        description: 'Titel boven het artikeloverzicht',
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
        description: 'Aantal artikelen om te tonen',
      },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Kolommen',
      options: [
        { label: '2 kolommen', value: '2' },
        { label: '3 kolommen', value: '3' },
        { label: '4 kolommen', value: '4' },
      ],
      defaultValue: '3',
    },
    {
      name: 'categoryFilter',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
      label: 'Categoriefilter',
      admin: {
        description: 'Optioneel: toon alleen artikelen uit deze categorieën',
      },
    },
    {
      name: 'showPremiumBadge',
      type: 'checkbox',
      label: 'Toon premium badge',
      defaultValue: true,
      admin: {
        description: 'Toon een badge bij premium/pro artikelen',
      },
    },
  ],
}

export default LatestArticles
