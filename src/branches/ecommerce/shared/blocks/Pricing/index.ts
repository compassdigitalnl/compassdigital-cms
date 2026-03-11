import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-16 Pricing Block
 *
 * Pricing comparison table with feature checkmarks/crosses.
 * Featured plan gets highlighted border + "Populair" badge.
 */
export const Pricing: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  labels: {
    singular: 'Prijzen',
    plural: 'Prijzen',
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
                placeholder: 'Onze pakketten',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitel',
              admin: {
                placeholder: 'Kies het pakket dat bij u past',
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
                    placeholder: 'Starter',
                  },
                },
                {
                  name: 'price',
                  type: 'text',
                  label: 'Prijs',
                  required: true,
                  admin: {
                    placeholder: 'e.g. \u20AC29',
                    description: 'Bijv. \u20AC29 of \u20AC99 of Gratis',
                  },
                },
                {
                  name: 'period',
                  type: 'text',
                  label: 'Periode',
                  admin: {
                    placeholder: 'e.g. /maand',
                    description: 'Bijv. /maand of /jaar',
                  },
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Beschrijving',
                  admin: {
                    placeholder: 'Perfect voor startende ondernemers',
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
                      admin: {
                        placeholder: 'Onbeperkte producten',
                      },
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
                    placeholder: 'Kies dit pakket',
                  },
                },
                {
                  name: 'buttonLink',
                  type: 'text',
                  label: 'Knoplink',
                  admin: {
                    placeholder: '/contact',
                  },
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  label: 'Uitgelicht (Populair)',
                  defaultValue: false,
                  admin: {
                    description: 'Toon als aanbevolen pakket met highlight',
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
              name: 'columns',
              type: 'select',
              label: 'Kolommen',
              defaultValue: '3',
              options: [
                { label: '2 kolommen', value: '2' },
                { label: '3 kolommen', value: '3' },
                { label: '4 kolommen', value: '4' },
              ],
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
