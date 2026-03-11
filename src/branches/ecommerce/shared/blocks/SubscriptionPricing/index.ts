import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-17 Subscription Pricing Block
 *
 * Like Pricing but with monthly/yearly toggle switch.
 * Shows savings badge for yearly plans.
 */
export const SubscriptionPricing: Block = {
  slug: 'subscriptionPricing',
  interfaceName: 'SubscriptionPricingBlock',
  labels: {
    singular: 'Abonnement Prijzen',
    plural: 'Abonnement Prijzen',
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
                placeholder: 'Kies uw abonnement',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitel',
              admin: {
                placeholder: 'Flexibele pakketten voor elke onderneming',
              },
            },
            {
              name: 'frequency',
              type: 'select',
              label: 'Frequentie opties',
              defaultValue: 'both',
              options: [
                { label: 'Alleen maandelijks', value: 'monthly' },
                { label: 'Alleen jaarlijks', value: 'yearly' },
                { label: 'Beide (met toggle)', value: 'both' },
              ],
              admin: {
                description: 'Welke betaalfrequenties worden aangeboden?',
              },
            },
            {
              name: 'plans',
              type: 'array',
              label: 'Pakketten',
              minRows: 1,
              maxRows: 6,
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Naam',
                  required: true,
                  admin: {
                    placeholder: 'Professional',
                  },
                },
                {
                  name: 'monthlyPrice',
                  type: 'text',
                  label: 'Maandelijkse prijs',
                  required: true,
                  admin: {
                    placeholder: 'e.g. \u20AC29',
                  },
                },
                {
                  name: 'yearlyPrice',
                  type: 'text',
                  label: 'Jaarlijkse prijs',
                  required: true,
                  admin: {
                    placeholder: 'e.g. \u20AC290',
                  },
                },
                {
                  name: 'period',
                  type: 'text',
                  label: 'Periode label',
                  admin: {
                    placeholder: 'e.g. /maand',
                  },
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Beschrijving',
                  admin: {
                    placeholder: 'Voor groeiende bedrijven',
                  },
                },
                {
                  name: 'features',
                  type: 'array',
                  label: 'Features',
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Feature tekst',
                      required: true,
                    },
                    {
                      name: 'included',
                      type: 'checkbox',
                      label: 'Inbegrepen',
                      defaultValue: true,
                    },
                  ],
                },
                {
                  name: 'buttonLabel',
                  type: 'text',
                  label: 'Knoptekst',
                  admin: {
                    placeholder: 'Start nu',
                  },
                },
                {
                  name: 'buttonLink',
                  type: 'text',
                  label: 'Knoplink',
                  admin: {
                    placeholder: '/aanmelden',
                  },
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  label: 'Uitgelicht',
                  defaultValue: false,
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
                { label: 'Tabel', value: 'table' },
              ],
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
