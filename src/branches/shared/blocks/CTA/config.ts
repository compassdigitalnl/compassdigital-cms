import type { Block } from 'payload'

/**
 * B03 - CTA Block Configuration
 *
 * Call-to-action section with flexible layouts and styles.
 *
 * @see docs/refactoring/sprint-9/shared/b03-cta.html
 */

export const CTA: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Actions',
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
              label: 'Title',
              required: true,
              admin: {
                description: 'Main CTA headline',
                placeholder: 'Klaar om aan de slag te gaan?',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              admin: {
                rows: 2,
                description: 'Supporting text below the title',
                placeholder: 'Neem vandaag nog contact op',
              },
            },
            {
              name: 'buttons',
              type: 'array',
              label: 'Call to Action Buttons',
              minRows: 1,
              maxRows: 2,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Button Text',
                  required: true,
                  admin: {
                    placeholder: 'Neem contact op',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Button Link',
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
                    { label: 'Primary (Teal)', value: 'primary' },
                    { label: 'Secondary (White outline)', value: 'secondary' },
                    { label: 'Ghost (Text only)', value: 'ghost' },
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
              label: 'Layout Variant',
              defaultValue: 'centered',
              required: true,
              options: [
                { label: 'Centered (Text centered)', value: 'centered' },
                { label: 'Split (Text left, CTA right)', value: 'split' },
                { label: 'Full Width (Edge to edge)', value: 'full-width' },
              ],
            },
            {
              name: 'style',
              type: 'select',
              label: 'Background Style',
              defaultValue: 'dark',
              required: true,
              options: [
                { label: 'Dark (Navy gradient)', value: 'dark' },
                { label: 'Light (White/grey)', value: 'light' },
                { label: 'Gradient (Teal glow)', value: 'gradient' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
