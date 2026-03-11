import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-20 Bundle Builder Block
 *
 * Product bundle display showing included products
 * with a bundled discount price.
 */
export const BundleBuilder: Block = {
  slug: 'bundleBuilder',
  interfaceName: 'BundleBuilderBlock',
  labels: {
    singular: 'Bundel',
    plural: 'Bundels',
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
                placeholder: 'Voordeel bundel',
              },
            },
            {
              name: 'description',
              type: 'text',
              label: 'Beschrijving',
              admin: {
                placeholder: 'Bespaar door deze producten samen te kopen',
              },
            },
            {
              name: 'products',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              label: 'Producten in bundel',
              admin: {
                description: 'Selecteer de producten die in de bundel zitten',
              },
            },
            {
              name: 'discountPercentage',
              type: 'number',
              label: 'Korting percentage',
              min: 0,
              max: 100,
              admin: {
                placeholder: '15',
                description: 'Korting op de totaalprijs in procenten',
              },
            },
            {
              name: 'discountLabel',
              type: 'text',
              label: 'Korting label',
              admin: {
                placeholder: 'e.g. Bespaar 15% op deze bundel',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [...animationFields()],
        },
      ],
    },
  ],
}
