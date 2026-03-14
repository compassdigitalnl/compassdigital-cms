import type { Block } from 'payload'

export const FeaturedArticle: Block = {
  slug: 'featured-article',
  labels: {
    singular: 'Uitgelicht Artikel',
    plural: 'Uitgelichte Artikelen',
  },
  interfaceName: 'FeaturedArticleBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Koptekst',
      admin: {
        description: 'Optionele titel boven het uitgelichte artikel',
      },
    },
    {
      name: 'article',
      type: 'relationship',
      relationTo: 'blog-posts',
      label: 'Artikel',
      admin: {
        description: 'Selecteer een specifiek artikel. Als leeg: het laatste uitgelichte artikel wordt getoond.',
      },
    },
    {
      name: 'showExcerpt',
      type: 'checkbox',
      label: 'Toon excerpt',
      defaultValue: true,
      admin: {
        description: 'Toon de samenvatting van het artikel',
      },
    },
    {
      name: 'showAuthor',
      type: 'checkbox',
      label: 'Toon auteur',
      defaultValue: true,
      admin: {
        description: 'Toon de auteursinformatie',
      },
    },
  ],
}

export default FeaturedArticle
