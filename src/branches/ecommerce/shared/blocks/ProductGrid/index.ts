import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-13 Product Grid Block
 *
 * Displays a grid of products from various sources: latest, featured,
 * manually selected, or filtered by category. Supports grid and list layouts.
 */
export const ProductGrid: Block = {
  slug: 'productGrid',
  interfaceName: 'ProductGridBlock',
  labels: {
    singular: 'Product Grid',
    plural: 'Product Grids',
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
                placeholder: 'Populaire producten',
              },
            },
            {
              name: 'source',
              type: 'select',
              label: 'Bron',
              defaultValue: 'latest',
              options: [
                { label: 'Nieuwste producten', value: 'latest' },
                { label: 'Featured producten', value: 'featured' },
                { label: 'Aanbiedingen / Sale', value: 'sale' },
                { label: 'Bestsellers', value: 'bestsellers' },
                { label: 'Populair', value: 'popular' },
                { label: 'Best beoordeeld', value: 'top-rated' },
                { label: 'Handmatig selecteren', value: 'manual' },
                { label: 'Per categorie', value: 'category' },
              ],
              admin: {
                description: 'Hoe worden de producten gekozen?',
              },
            },
            {
              name: 'products',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Producten',
              admin: {
                description: 'Selecteer producten handmatig',
                condition: (data, siblingData) => siblingData?.source === 'manual',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'product-categories',
              label: 'Categorie',
              admin: {
                description: 'Toon producten uit deze categorie',
                condition: (data, siblingData) => siblingData?.source === 'category',
              },
            },
            {
              name: 'limit',
              type: 'number',
              label: 'Maximum aantal',
              defaultValue: 8,
              min: 1,
              max: 24,
              admin: {
                description: 'Maximaal aantal producten om te tonen',
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
              defaultValue: 'grid-4',
              options: [
                { label: '3 kolommen', value: 'grid-3' },
                { label: '4 kolommen', value: 'grid-4' },
                { label: 'Lijst', value: 'list' },
              ],
              admin: {
                description: 'Weergave van de producten',
              },
            },
            {
              name: 'showPrice',
              type: 'checkbox',
              label: 'Toon prijs',
              defaultValue: true,
            },
            {
              name: 'showBadge',
              type: 'checkbox',
              label: 'Toon badge',
              defaultValue: true,
            },
            {
              name: 'showAddToCart',
              type: 'checkbox',
              label: 'Toon "Toevoegen" knop',
              defaultValue: true,
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
