import type { Block } from 'payload'

/**
 * B02 - Features Block Configuration
 *
 * Features/USPs grid with Lucide icons and flexible layouts.
 *
 * FEATURES:
 * - 3 layout variants (grid-3, grid-4, list)
 * - 3 icon styles (glow, solid, outlined)
 * - 2 alignment options (center, left)
 * - Lucide React icons (2,000+ options)
 * - Min 2, max 12 features
 * - Tab structure (Content + Layout)
 *
 * @see docs/refactoring/sprint-9/shared/b02-features.html
 */

export const Features: Block = {
  slug: 'features',
  interfaceName: 'FeaturesBlock',
  labels: {
    singular: 'Features / USPs',
    plural: 'Features / USPs',
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
              label: 'Section Title',
              admin: {
                description: 'Heading above the features grid (e.g., "Waarom Compass Digital?")',
                placeholder: 'Waarom kiezen voor ons?',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Section Description',
              admin: {
                description: 'Optional subheading text below title',
                rows: 2,
              },
            },
            {
              name: 'features',
              type: 'array',
              label: 'Features',
              minRows: 2,
              maxRows: 12,
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Lucide Icon Name',
                  required: true,
                  admin: {
                    description:
                      'Lucide icon name (e.g., "Zap", "Palette", "ShieldCheck"). See https://lucide.dev',
                    placeholder: 'Zap',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Feature Title',
                  required: true,
                  admin: {
                    placeholder: 'Snelle levering',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Feature Description',
                  admin: {
                    description: 'Short description (max 2-3 sentences)',
                    rows: 2,
                    placeholder: 'Binnen 24 uur geleverd',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Layout Variant',
              defaultValue: 'grid-3',
              options: [
                {
                  label: '3 Columns Grid',
                  value: 'grid-3',
                },
                {
                  label: '4 Columns Grid',
                  value: 'grid-4',
                },
                {
                  label: 'List Layout (Horizontal)',
                  value: 'list',
                },
              ],
            },
            {
              name: 'iconStyle',
              type: 'select',
              label: 'Icon Style',
              defaultValue: 'glow',
              options: [
                {
                  label: 'Glow Background (Teal)',
                  value: 'glow',
                },
                {
                  label: 'Solid Circle (Teal)',
                  value: 'solid',
                },
                {
                  label: 'Outlined',
                  value: 'outlined',
                },
              ],
            },
            {
              name: 'alignment',
              type: 'select',
              label: 'Content Alignment',
              defaultValue: 'center',
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Left', value: 'left' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
