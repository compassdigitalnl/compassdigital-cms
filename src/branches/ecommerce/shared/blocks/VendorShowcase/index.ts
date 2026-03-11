import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-26 Vendor Showcase Block
 *
 * Vendor/brand cards in grid or carousel layout.
 * Each card shows logo, name, and product count.
 */
export const VendorShowcase: Block = {
  slug: 'vendorShowcase',
  interfaceName: 'VendorShowcaseBlock',
  labels: {
    singular: 'Merk Showcase',
    plural: 'Merk Showcases',
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
                placeholder: 'Onze merken',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitel',
              admin: {
                placeholder: 'Wij werken met de beste merken',
              },
            },
            {
              name: 'source',
              type: 'select',
              label: 'Bron',
              defaultValue: 'all',
              options: [
                { label: 'Alle merken', value: 'all' },
                { label: 'Featured merken', value: 'featured' },
                { label: 'Handmatig selecteren', value: 'manual' },
              ],
            },
            {
              name: 'vendors',
              type: 'relationship',
              relationTo: 'brands',
              hasMany: true,
              label: 'Merken',
              admin: {
                description: 'Selecteer merken handmatig',
                condition: (data, siblingData) => siblingData?.source === 'manual',
              },
            },
            {
              name: 'limit',
              type: 'number',
              label: 'Maximum aantal',
              defaultValue: 6,
              min: 1,
              max: 24,
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
                { label: 'Grid', value: 'grid' },
                { label: 'Carousel', value: 'carousel' },
              ],
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
