import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-18 Quick Order Block
 *
 * Quick order form with SKU/product input.
 * Simple: single input + quantity + add button.
 * Advanced: multi-line paste area for bulk orders.
 */
export const QuickOrder: Block = {
  slug: 'quickOrder',
  interfaceName: 'QuickOrderBlock',
  labels: {
    singular: 'Quick Order',
    plural: 'Quick Orders',
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
                placeholder: 'Snel bestellen',
              },
            },
            {
              name: 'description',
              type: 'text',
              label: 'Beschrijving',
              admin: {
                placeholder: 'Bestel snel met artikelnummer of productnaam',
              },
            },
            {
              name: 'placeholder',
              type: 'text',
              label: 'Placeholder tekst',
              admin: {
                placeholder: 'e.g. Voer SKU in...',
                description: 'Placeholder tekst voor het invoerveld',
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
              defaultValue: 'simple',
              options: [
                { label: 'Simpel (enkele regel)', value: 'simple' },
                { label: 'Geavanceerd (bulk invoer)', value: 'advanced' },
              ],
              admin: {
                description: 'Simpel: enkel product. Geavanceerd: meerdere producten tegelijk.',
              },
            },
            {
              name: 'showQuantity',
              type: 'checkbox',
              label: 'Toon hoeveelheid veld',
              defaultValue: true,
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
