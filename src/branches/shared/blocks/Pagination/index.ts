import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-36 Pagination Block
 *
 * Page navigation with numbered or simple (prev/next) variants.
 * Supports first/last buttons and ellipsis for large page counts.
 */
export const Pagination: Block = {
  slug: 'pagination',
  interfaceName: 'PaginationBlock',
  labels: {
    singular: 'Pagination',
    plural: 'Paginations',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'totalPages',
              type: 'number',
              label: 'Totaal aantal pagina\'s',
              required: true,
              min: 1,
              admin: {
                description: 'Het totale aantal pagina\'s',
              },
            },
            {
              name: 'currentPage',
              type: 'number',
              label: 'Huidige pagina',
              defaultValue: 1,
              min: 1,
              admin: {
                description: 'Het nummer van de huidige actieve pagina',
              },
            },
            {
              name: 'baseUrl',
              type: 'text',
              label: 'Basis URL',
              required: true,
              admin: {
                placeholder: '/blog',
                description: 'De basis-URL waaraan het paginanummer wordt toegevoegd (bijv. /blog → /blog?page=2)',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Variant',
              defaultValue: 'numbered',
              options: [
                { label: 'Genummerd (1 2 3 ... 10)', value: 'numbered' },
                { label: 'Simpel (Vorige / Volgende)', value: 'simple' },
              ],
              admin: {
                description: 'Stijl van de paginering',
              },
            },
            {
              name: 'showFirstLast',
              type: 'checkbox',
              label: 'Toon eerste/laatste knoppen',
              defaultValue: true,
              admin: {
                description: 'Toon knoppen om direct naar de eerste of laatste pagina te gaan',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
