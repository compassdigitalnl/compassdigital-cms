import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-26 Vendor Showcase Block
 *
 * Vendor/supplier cards in grid or carousel layout.
 * Each card shows logo, name, product count, rating, and link to vendor page.
 */
export const VendorShowcase: Block = {
  slug: 'vendorShowcase',
  interfaceName: 'VendorShowcaseBlock',
  labels: {
    singular: 'Leverancier Showcase',
    plural: 'Leverancier Showcases',
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
                placeholder: 'Onze leveranciers',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitel',
              admin: {
                placeholder: 'Wij werken met de beste leveranciers',
              },
            },
            {
              name: 'source',
              type: 'select',
              label: 'Bron',
              defaultValue: 'all',
              options: [
                { label: 'Alle leveranciers', value: 'all' },
                { label: 'Featured leveranciers', value: 'featured' },
                { label: 'Handmatig selecteren', value: 'manual' },
              ],
            },
            {
              name: 'vendors',
              type: 'relationship',
              relationTo: 'vendors',
              hasMany: true,
              label: 'Leveranciers',
              admin: {
                description: 'Selecteer leveranciers handmatig',
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
