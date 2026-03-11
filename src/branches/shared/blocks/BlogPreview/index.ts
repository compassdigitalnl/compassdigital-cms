import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-32 BlogPreview Block
 *
 * Displays recent or featured blog posts in grid, list, or featured layout.
 * Supports filtering by category and configurable display options.
 */
export const BlogPreview: Block = {
  slug: 'blogPreview',
  interfaceName: 'BlogPreviewBlock',
  labels: {
    singular: 'Blog Preview',
    plural: 'Blog Previews',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Titel',
              admin: {
                placeholder: 'Laatste Berichten',
                description: 'Optionele koptekst boven de blogposts',
              },
            },
            {
              name: 'source',
              type: 'select',
              label: 'Bron',
              defaultValue: 'latest',
              options: [
                { label: 'Laatste berichten', value: 'latest' },
                { label: 'Uitgelicht', value: 'featured' },
                { label: 'Per categorie', value: 'category' },
              ],
              admin: {
                description: 'Welke blogposts getoond moeten worden',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'blog-categories',
              label: 'Categorie',
              admin: {
                description: 'Selecteer een categorie om te filteren',
                condition: (_data, siblingData) => siblingData?.source === 'category',
              },
            },
            {
              name: 'limit',
              type: 'number',
              label: 'Aantal berichten',
              defaultValue: 3,
              min: 1,
              max: 12,
              admin: {
                description: 'Maximum aantal blogposts om te tonen',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'layout',
              type: 'select',
              label: 'Layout',
              defaultValue: 'grid',
              options: [
                { label: 'Grid (kaarten)', value: 'grid' },
                { label: 'Lijst (horizontaal)', value: 'list' },
                { label: 'Uitgelicht (eerste groot)', value: 'featured' },
              ],
              admin: {
                description: 'Weergave van de blogposts',
              },
            },
            {
              name: 'showExcerpt',
              type: 'checkbox',
              label: 'Toon samenvatting',
              defaultValue: true,
            },
            {
              name: 'showDate',
              type: 'checkbox',
              label: 'Toon datum',
              defaultValue: true,
            },
            {
              name: 'showAuthor',
              type: 'checkbox',
              label: 'Toon auteur',
              defaultValue: false,
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
