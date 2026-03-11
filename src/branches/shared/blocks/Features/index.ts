import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-03 Features Block
 *
 * Features/USPs grid with Lucide icons and flexible layouts.
 *
 * Layouts: grid-3 (3 columns), grid-4 (4 columns), list (single column)
 * Icon styles: glow (bg with opacity), solid (filled circle), outlined (border circle)
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
              name: 'subtitle',
              type: 'text',
              label: 'Section Subtitle',
              admin: {
                description: 'Optional subheading text below title',
                placeholder: 'Ontdek onze voordelen',
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
                    placeholder: 'Binnen 24 uur geleverd aan huis of op kantoor.',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link (optioneel)',
                  admin: {
                    description: 'URL of pad voor meer info (e.g., /diensten/webshop)',
                    placeholder: '/diensten/webshop',
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
              name: 'layout',
              type: 'select',
              label: 'Grid Layout',
              defaultValue: 'grid-3',
              options: [
                { label: '3 Columns Grid', value: 'grid-3' },
                { label: '4 Columns Grid', value: 'grid-4' },
                { label: 'List Layout', value: 'list' },
                { label: 'Split (afbeelding + items naast elkaar)', value: 'split' },
              ],
              admin: {
                description: 'Number of columns on desktop. Mobile always stacks to 1 column.',
              },
            },
            {
              name: 'iconStyle',
              type: 'select',
              label: 'Icon Style',
              defaultValue: 'glow',
              options: [
                { label: 'Glow Background (Teal)', value: 'glow' },
                { label: 'Solid Circle (Teal)', value: 'solid' },
                { label: 'Outlined Circle', value: 'outlined' },
              ],
            },
            {
              name: 'splitImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Afbeelding',
              admin: {
                condition: (data, siblingData) => siblingData?.layout === 'split',
                description: 'Afbeelding aan de linkerkant bij split layout',
              },
            },
            {
              name: 'splitImagePosition',
              type: 'select',
              label: 'Afbeelding positie',
              defaultValue: 'left',
              options: [
                { label: 'Links', value: 'left' },
                { label: 'Rechts', value: 'right' },
              ],
              admin: {
                condition: (data, siblingData) => siblingData?.layout === 'split',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
