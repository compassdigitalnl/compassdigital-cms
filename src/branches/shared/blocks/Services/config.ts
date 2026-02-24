import type { Block } from 'payload'

/**
 * B07 - Services Block Configuration
 *
 * Service grid with icons, colors, descriptions, and optional links.
 *
 * FEATURES:
 * - 6 icon color themes (teal, blue, green, purple, amber, coral)
 * - Lucide React icons (1000+ icons available)
 * - Optional section header (subtitle + title + description)
 * - 2/3/4 column responsive grid
 * - Optional CTA links per service
 * - Min 2, max 12 services
 *
 * USE CASES:
 * - Service catalogs with detail page links
 * - Support options overview
 * - Feature showcases with more info links
 * - "What we do" sections
 *
 * DIFFERENCE FROM B02 (Features):
 * - B07 = Service catalog WITH links to detail pages
 * - B02 = USPs/Features WITHOUT links (purely informational)
 *
 * @see docs/refactoring/sprint-9/shared/b07-services.html
 */

export const Services: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: 'Services Block',
    plural: 'Services Blocks',
  },
  fields: [
    // Section Header Fields
    {
      type: 'row',
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle',
          admin: {
            width: '50%',
            description: 'Small overline text above main title (optional)',
            placeholder: 'Onze Services',
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          admin: {
            width: '50%',
            description: 'Main section heading (optional)',
            placeholder: 'Alles wat je nodig hebt',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      admin: {
        description: 'Brief description below title (optional, max 2-3 sentences)',
        placeholder: 'Wij bieden een complete suite van diensten...',
        rows: 2,
      },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Grid Columns',
      defaultValue: '3',
      required: true,
      options: [
        {
          label: '2 Columns',
          value: '2',
        },
        {
          label: '3 Columns (Recommended)',
          value: '3',
        },
        {
          label: '4 Columns',
          value: '4',
        },
      ],
      admin: {
        description:
          'Number of service cards per row on desktop. Automatically stacks on mobile.',
      },
    },

    // Services Array
    {
      name: 'services',
      type: 'array',
      label: 'Services',
      minRows: 2,
      maxRows: 12,
      required: true,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'text',
              label: 'Lucide Icon Name',
              required: true,
              admin: {
                width: '40%',
                description:
                  'Lucide icon name (e.g., "package", "code", "rocket"). Browse icons at lucide.dev',
                placeholder: 'package',
              },
            },
            {
              name: 'iconColor',
              type: 'select',
              label: 'Icon Color',
              defaultValue: 'teal',
              required: true,
              options: [
                { label: 'Teal (Primary)', value: 'teal' },
                { label: 'Blue', value: 'blue' },
                { label: 'Green', value: 'green' },
                { label: 'Purple', value: 'purple' },
                { label: 'Amber', value: 'amber' },
                { label: 'Coral', value: 'coral' },
              ],
              admin: {
                width: '30%',
                description: 'Icon color theme',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Service Title',
              required: true,
              admin: {
                width: '30%',
                placeholder: 'Multi-Tenant Setup',
              },
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          required: true,
          admin: {
            description: 'Service description (1-2 sentences, max 150 chars recommended)',
            placeholder: 'Complete platform setup met custom branding en domein configuratie.',
            rows: 2,
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'link',
              type: 'text',
              label: 'Link URL',
              admin: {
                width: '60%',
                description:
                  'Optional link URL (e.g., /services/setup or https://example.com)',
                placeholder: '/services/setup',
              },
            },
            {
              name: 'linkText',
              type: 'text',
              label: 'Link Text',
              defaultValue: 'Meer info',
              admin: {
                width: '40%',
                description: 'CTA link text (shown only if link URL is provided)',
                placeholder: 'Meer info',
              },
            },
          ],
        },
      ],
      admin: {
        description:
          'Add 2-12 service cards. Recommended: 3, 6, or 9 items for best visual balance.',
        initCollapsed: true,
      },
    },
  ],
}
