import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-19 Staffel Pricing Block
 *
 * Volume/bulk pricing tiers display.
 * Table variant: standard pricing table.
 * Cards variant: stepped cards showing quantity ranges.
 */
export const StaffelPricing: Block = {
  slug: 'staffelPricing',
  interfaceName: 'StaffelPricingBlock',
  labels: {
    singular: 'Staffelkorting',
    plural: 'Staffelkortingen',
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
                placeholder: 'Staffelkorting',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitel',
              admin: {
                placeholder: 'Meer bestellen = meer besparen',
              },
            },
            {
              name: 'tiers',
              type: 'array',
              label: 'Staffels',
              minRows: 1,
              maxRows: 10,
              fields: [
                {
                  name: 'minQuantity',
                  type: 'number',
                  label: 'Minimaal aantal',
                  required: true,
                  min: 1,
                  admin: {
                    placeholder: '1',
                  },
                },
                {
                  name: 'maxQuantity',
                  type: 'number',
                  label: 'Maximaal aantal',
                  admin: {
                    placeholder: '99 (leeg = onbeperkt)',
                    description: 'Laat leeg voor "en meer"',
                  },
                },
                {
                  name: 'price',
                  type: 'number',
                  label: 'Prijs per stuk',
                  required: true,
                  admin: {
                    placeholder: '12.50',
                  },
                },
                {
                  name: 'discount',
                  type: 'text',
                  label: 'Korting label',
                  admin: {
                    placeholder: 'e.g. -10% of Bespaar 20%',
                    description: 'Optioneel: toon een kortingslabel',
                  },
                },
              ],
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
              defaultValue: 'table',
              options: [
                { label: 'Tabel', value: 'table' },
                { label: 'Kaarten', value: 'cards' },
              ],
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
