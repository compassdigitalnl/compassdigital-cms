import type { Block } from 'payload'

export const LogoBar: Block = {
  slug: 'logobar',
  interfaceName: 'LogoBarBlock',
  labels: {
    singular: 'Logo Bar Block',
    plural: 'Logo Bar Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      admin: {
        description:
          'Optional heading above logos (e.g., "Trusted by leading companies", "Our partners")',
        placeholder: 'Trusted by leading companies',
      },
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logos',
      minRows: 3,
      maxRows: 20,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo Image',
          admin: {
            description:
              'Upload company logo (PNG, SVG recommended). Logos will be displayed in grayscale and colorize on hover.',
          },
        },
        {
          name: 'name',
          type: 'text',
          label: 'Company Name',
          required: true,
          admin: {
            description: 'Used for alt text accessibility (e.g., "Microsoft", "Google")',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
          admin: {
            description:
              'Optional link to company website (leave empty if no link needed). Must be full URL (e.g., https://example.com)',
            placeholder: 'https://example.com',
          },
          validate: (val) => {
            if (!val) return true
            try {
              new URL(val)
              return true
            } catch {
              return 'Must be a valid URL (e.g., https://example.com)'
            }
          },
        },
      ],
      admin: {
        description:
          'Add 3-20 client/partner logos. Logos will auto-scroll on mobile if more than 5. Best results: upload logos with transparent backgrounds.',
        initCollapsed: true,
      },
    },
    {
      name: 'autoScroll',
      type: 'checkbox',
      label: 'Enable Auto-Scroll',
      defaultValue: false,
      admin: {
        description:
          'Enable automatic horizontal scrolling animation (pauses on hover). Best for 8+ logos. Creates an infinite carousel effect.',
      },
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Background Variant',
      defaultValue: 'light',
      options: [
        {
          label: 'Light (Grey background - theme.colors.grey)',
          value: 'light',
        },
        {
          label: 'White (Clean background - theme.colors.white)',
          value: 'white',
        },
        {
          label: 'Dark (Navy gradient - theme.gradients.navy)',
          value: 'dark',
        },
      ],
      admin: {
        description:
          'Choose background style to match surrounding sections. Dark variant inverts logos to white for visibility.',
      },
    },
  ],
}
