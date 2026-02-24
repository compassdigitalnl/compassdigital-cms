import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: 'Stats Block',
    plural: 'Stats Blocks',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Section Title',
          admin: {
            width: '60%',
            description: 'Optional heading above statistics (e.g., "Our Impact", "By the Numbers")',
            placeholder: 'Platform Performance',
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
              label: '3 Columns',
              value: '3',
            },
            {
              label: '4 Columns',
              value: '4',
            },
          ],
          admin: {
            width: '40%',
            description: 'Number of statistics per row on desktop',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      admin: {
        description: 'Optional introductory text below title (1-2 sentences)',
        placeholder: 'Numbers that speak for our commitment to quality and customer satisfaction.',
      },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistics',
      minRows: 2,
      maxRows: 4,
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'Icon',
          admin: {
            description:
              'Optional emoji or icon (e.g., "📊", "🚀", "⭐"). Leave empty for minimal design without icon.',
            placeholder: '📊',
          },
        },
        {
          name: 'value',
          type: 'text',
          label: 'Stat Value',
          required: true,
          admin: {
            description:
              'The statistic number/value (e.g., "500+", "€2.5M", "< 24h", "98%"). Keep it short and impactful.',
            placeholder: '500+',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Stat Label',
          required: true,
          admin: {
            description: 'Description of what the stat represents (e.g., "Happy Clients", "Revenue", "Uptime")',
            placeholder: 'Happy Clients',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Additional Detail',
          admin: {
            description:
              'Optional extra context (e.g., "Since 2020", "And growing"). Shows below the label in smaller text.',
            placeholder: 'And growing',
          },
        },
      ],
      admin: {
        description:
          'Add 2-4 key statistics. Best practices: Use round numbers, add context with icons, keep labels short.',
        initCollapsed: true,
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Style',
      defaultValue: 'white',
      options: [
        { label: 'White (theme.colors.white)', value: 'white' },
        { label: 'Light Grey (theme.colors.grey)', value: 'grey' },
        { label: 'Teal Gradient (theme.gradients.teal)', value: 'tealGradient' },
        { label: 'Navy Gradient (theme.gradients.navy)', value: 'navyGradient' },
      ],
      admin: {
        description:
          'Background color/gradient from Theme global. Gradient variants use white text for better contrast.',
      },
    },
  ],
}
