import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * Branche Pricing Block
 *
 * Single-tier or multi-tier pricing display for a specific branch,
 * with optional competitor price comparison.
 *
 * Background: white (default), light-grey, gradient
 */
export const BranchePricing: Block = {
  slug: 'branchePricing',
  interfaceName: 'BranchePricingBlock',
  labels: {
    singular: 'Branche Pricing',
    plural: 'Branche Pricing',
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
              defaultValue: 'Transparante Prijzen',
              admin: {
                placeholder: 'Transparante Prijzen',
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              label: 'Subtitel',
              admin: {
                placeholder: 'Kies het pakket dat bij jouw bedrijf past',
              },
            },
            {
              name: 'plans',
              type: 'array',
              label: 'Plannen',
              minRows: 1,
              maxRows: 4,
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
                    placeholder: '\u20AC99',
                  },
                },
                {
                  name: 'period',
                  type: 'text',
                  label: 'Periode',
                  defaultValue: '/maand',
                  admin: {
                    placeholder: '/maand',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Omschrijving',
                  admin: {
                    rows: 2,
                    placeholder: 'Ideaal voor kleine bedrijven die willen groeien',
                  },
                },
                {
                  name: 'features',
                  type: 'array',
                  label: 'Features',
                  minRows: 1,
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      required: true,
                      admin: {
                        placeholder: 'Onbeperkt producten',
                      },
                    },
                    {
                      name: 'included',
                      type: 'checkbox',
                      defaultValue: true,
                      label: 'Inbegrepen',
                    },
                  ],
                },
                {
                  name: 'buttonLabel',
                  type: 'text',
                  label: 'Button label',
                  defaultValue: 'Start nu',
                  admin: {
                    placeholder: 'Start nu',
                  },
                },
                {
                  name: 'buttonLink',
                  type: 'text',
                  label: 'Button link',
                  defaultValue: '#',
                  admin: {
                    placeholder: '/contact',
                  },
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Uitgelicht',
                },
                {
                  name: 'badge',
                  type: 'text',
                  label: 'Badge tekst',
                  admin: {
                    placeholder: 'Populair',
                    condition: (_data, siblingData) => siblingData?.featured === true,
                  },
                },
              ],
            },
            {
              name: 'competitorComparison',
              type: 'group',
              label: 'Vergelijking',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Toon vergelijking',
                },
                {
                  name: 'text',
                  type: 'text',
                  label: 'Vergelijkingstekst',
                  admin: {
                    placeholder: 'vs. Shopify + 15 plugins = \u20AC400/mo',
                    condition: (_data, siblingData) => siblingData?.enabled === true,
                  },
                },
              ],
            },
            {
              name: 'ctaText',
              type: 'text',
              label: 'CTA onder prijzen',
              defaultValue: 'Alle plannen inclusief hosting, SSL en support',
              admin: {
                placeholder: 'Alle plannen inclusief hosting, SSL en support',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'bgColor',
              type: 'select',
              label: 'Achtergrondkleur',
              defaultValue: 'white',
              options: [
                { label: 'Wit', value: 'white' },
                { label: 'Lichtgrijs', value: 'light-grey' },
                { label: 'Gradient', value: 'gradient' },
              ],
              admin: {
                description: 'Achtergrondkleur van de sectie',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
