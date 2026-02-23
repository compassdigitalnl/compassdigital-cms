import type { Block } from 'payload'

export const BlogPreview: Block = {
  slug: 'blog-preview',
  interfaceName: 'BlogPreviewBlock',
  labels: {
    singular: 'Blog Preview',
    plural: 'Blog Previews',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
      defaultValue: 'Laatste blog berichten',
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
      name: 'limit',
      type: 'number',
      label: 'Aantal berichten',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        description: 'Maximaal aantal blog berichten om te tonen',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      label: 'Filter op categorie',
      admin: {
        description: 'Optioneel: toon alleen berichten uit deze categorie',
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
      ],
    },
    {
      name: 'showExcerpt',
      type: 'checkbox',
      label: 'Toon samenvatting',
      defaultValue: true,
      admin: {
        description: 'Toon de excerpt onder de titel',
      },
    },
    {
      name: 'showDate',
      type: 'checkbox',
      label: 'Toon publicatiedatum',
      defaultValue: true,
    },
    {
      name: 'showAuthor',
      type: 'checkbox',
      label: 'Toon auteur',
      defaultValue: false,
    },
  ],
}
