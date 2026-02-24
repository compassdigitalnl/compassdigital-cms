import type { Block } from 'payload'

export const Services: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: 'Services Block',
    plural: 'Services Blocks',
  },
  fields: [
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
          },
        },
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          admin: {
            width: '50%',
            description: 'Main section heading (optional)',
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
    {
      name: 'services',
      type: 'array',
      label: 'Services',
      minRows: 2,
      maxRows: 12,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'text',
              label: 'Icon',
              admin: {
                width: '50%',
                description:
                  'Lucide icon name (e.g., "package", "code", "truck"). Browse icons at lucide.dev',
                placeholder: 'package',
              },
            },
            {
              name: 'iconColor',
              type: 'select',
              label: 'Icon Color',
              defaultValue: 'teal',
              options: [
                { label: 'Teal (theme.colors.teal)', value: 'teal' },
                { label: 'Blue (theme.colors.blue)', value: 'blue' },
                { label: 'Green (theme.colors.green)', value: 'green' },
                { label: 'Purple (theme.colors.purple)', value: 'purple' },
                { label: 'Amber (theme.colors.amber)', value: 'amber' },
                { label: 'Coral (theme.colors.coral)', value: 'coral' },
              ],
              admin: {
                width: '50%',
                description: 'Icon color from Theme global tokens',
              },
            },
          ],
        },
        {
          name: 'title',
          type: 'text',
          label: 'Service Title',
          required: true,
          admin: {
            description: 'Name of the service or feature (e.g., "Fast Shipping")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            description: 'Brief description of the service (1-2 sentences)',
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
                description: 'Optional link URL (e.g., /services/setup or https://example.com)',
                placeholder: '/services/detail',
              },
            },
            {
              name: 'linkText',
              type: 'text',
              label: 'Link Text',
              defaultValue: 'Meer info',
              admin: {
                width: '40%',
                description: 'Text for the link (e.g., "Learn more", "Get started")',
              },
            },
          ],
        },
      ],
      admin: {
        description:
          'Add 2-12 services or features. Each service has an icon, title, description, and optional link.',
        initCollapsed: true,
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'white',
      options: [
        { label: 'White (theme.colors.white)', value: 'white' },
        { label: 'Light Background (theme.colors.bg)', value: 'bg' },
        { label: 'Light Grey (theme.colors.grey)', value: 'grey' },
        { label: 'Teal Light (theme.colors.tealLight)', value: 'tealLight' },
        { label: 'Navy Light (theme.colors.navyLight)', value: 'navyLight' },
      ],
      admin: {
        description:
          'Background color from Theme global. Maps to CSS variables: --color-white, --color-bg, etc.',
      },
    },
  ],
}
