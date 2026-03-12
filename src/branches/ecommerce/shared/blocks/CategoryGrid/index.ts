import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-15 Category Grid Block
 *
 * Displays product categories in a grid layout with images,
 * names, and optional product counts.
 */
export const CategoryGrid: Block = {
  slug: 'categoryGrid',
  interfaceName: 'CategoryGridBlock',
  labels: {
    singular: 'Categorie Grid',
    plural: 'Categorie Grids',
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
                placeholder: 'Onze categorieën',
              },
            },
            {
              name: 'source',
              type: 'select',
              label: 'Bron',
              defaultValue: 'all',
              options: [
                { label: 'Alle categorieën', value: 'all' },
                { label: 'Automatisch (top-level)', value: 'auto' },
                { label: 'Featured categorieën', value: 'featured' },
                { label: 'Handmatig selecteren', value: 'manual' },
              ],
              admin: {
                description: 'Welke categorieën worden getoond?',
              },
            },
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'product-categories',
              hasMany: true,
              label: 'Categorieën',
              admin: {
                description: 'Selecteer categorieën handmatig',
                condition: (data, siblingData) => siblingData?.source === 'manual',
              },
            },
            {
              name: 'limit',
              type: 'number',
              label: 'Maximum aantal',
              defaultValue: 6,
              min: 1,
              max: 20,
              admin: {
                description: 'Maximaal aantal categorieën om te tonen',
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
              defaultValue: 'grid-3',
              options: [
                { label: '3 kolommen', value: 'grid-3' },
                { label: '4 kolommen', value: 'grid-4' },
                { label: 'Masonry', value: 'masonry' },
              ],
            },
            {
              name: 'showCount',
              type: 'checkbox',
              label: 'Toon aantal producten',
              defaultValue: true,
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
