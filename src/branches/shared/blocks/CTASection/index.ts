import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-45 CTA Section Block
 *
 * High-impact call-to-action section with decorative glows and 3 background variants.
 *
 * Variants: navy (dark gradient), teal (teal gradient), white (light with border)
 */
export const CTASection: Block = {
  slug: 'ctaSection',
  interfaceName: 'CTASectionBlock',
  labels: {
    singular: 'CTA Sectie',
    plural: 'CTA Secties',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'overline',
              type: 'text',
              label: 'Overline',
              admin: {
                description: 'Uppercase text above the title',
                placeholder: 'Start Vandaag',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
              admin: {
                description: 'Main CTA headline',
                placeholder: 'Klaar om uw bedrijf te laten groeien?',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: {
                rows: 2,
                description: 'Supporting text below the title',
              },
            },
            {
              name: 'buttons',
              type: 'array',
              label: 'Buttons',
              minRows: 1,
              maxRows: 2,
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  label: 'Button Text',
                  required: true,
                  admin: {
                    placeholder: 'Neem contact op',
                  },
                },
                {
                  name: 'href',
                  type: 'text',
                  label: 'Link URL',
                  required: true,
                  admin: {
                    placeholder: '/contact',
                  },
                },
                {
                  name: 'style',
                  type: 'select',
                  label: 'Button Style',
                  defaultValue: 'primary',
                  options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                  ],
                },
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  options: [
                    { label: 'Arrow Right', value: 'arrow-right' },
                    { label: 'Sparkles', value: 'sparkles' },
                    { label: 'Mail', value: 'mail' },
                    { label: 'Phone', value: 'phone' },
                    { label: 'Calendar', value: 'calendar' },
                  ],
                  admin: {
                    description: 'Optional icon after button text',
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
              label: 'Background Variant',
              defaultValue: 'navy',
              options: [
                { label: 'Navy (Dark Gradient)', value: 'navy' },
                { label: 'Teal (Teal Gradient)', value: 'teal' },
                { label: 'White (Light)', value: 'white' },
              ],
              admin: {
                description: 'Choose the background color scheme',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
