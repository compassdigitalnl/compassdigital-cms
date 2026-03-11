import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-23 Subscription Options Block
 *
 * Frequency selector cards (weekly, monthly, quarterly, yearly)
 * with pricing and savings badges.
 */
export const SubscriptionOptions: Block = {
  slug: 'subscriptionOptions',
  interfaceName: 'SubscriptionOptionsBlock',
  labels: {
    singular: 'Abonnement Opties',
    plural: 'Abonnement Opties',
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
                placeholder: 'Kies uw leverfrequentie',
              },
            },
            {
              name: 'options',
              type: 'array',
              label: 'Opties',
              minRows: 1,
              maxRows: 6,
              fields: [
                {
                  name: 'frequency',
                  type: 'text',
                  label: 'Frequentie',
                  required: true,
                  admin: {
                    placeholder: 'e.g. Wekelijks',
                  },
                },
                {
                  name: 'price',
                  type: 'text',
                  label: 'Prijs',
                  required: true,
                  admin: {
                    placeholder: 'e.g. \u20AC24,99/week',
                  },
                },
                {
                  name: 'savings',
                  type: 'text',
                  label: 'Besparing',
                  admin: {
                    placeholder: 'e.g. Bespaar 15%',
                    description: 'Optioneel: toon een besparingslabel',
                  },
                },
                {
                  name: 'features',
                  type: 'array',
                  label: 'Kenmerken',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Kenmerk',
                      required: true,
                      admin: {
                        placeholder: 'Gratis verzending',
                      },
                    },
                  ],
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
              defaultValue: 'cards',
              options: [
                { label: 'Kaarten', value: 'cards' },
                { label: 'Lijst', value: 'list' },
              ],
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
