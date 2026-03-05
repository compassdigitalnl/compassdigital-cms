import type { Tab } from 'payload'

export const Gradients: Tab = {
  label: 'Gradients',
  description: 'Gradient fills for buttons, backgrounds, and hero sections',
  fields: [
    {
      type: 'collapsible',
      label: 'Primary & Secondary',
      fields: [
        {
          name: 'primaryGradient',
          type: 'textarea',
          label: 'Primary Gradient',
          defaultValue: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
          admin: {
            description: 'Main gradient for buttons, CTAs, and interactive elements',
            placeholder: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
            rows: 2,
          },
        },
        {
          name: 'secondaryGradient',
          type: 'textarea',
          label: 'Secondary Gradient',
          defaultValue: 'linear-gradient(135deg, #0A1628 0%, #1B2B45 100%)',
          admin: {
            description: 'Dark gradient for sections, footers, and navigation',
            placeholder: 'linear-gradient(135deg, #0A1628 0%, #1B2B45 100%)',
            rows: 2,
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Hero & Accent',
      fields: [
        {
          name: 'heroGradient',
          type: 'textarea',
          label: 'Hero Gradient',
          defaultValue: 'linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(38,166,154,0.12) 100%)',
          admin: {
            description: 'Subtle overlay gradient for hero sections (low opacity)',
            placeholder:
              'linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(38,166,154,0.12) 100%)',
            rows: 2,
          },
        },
        {
          name: 'accentGradient',
          type: 'textarea',
          label: 'Accent Gradient (Optional)',
          defaultValue: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
          admin: {
            description: 'Optional gradient for special promotions, badges, or campaigns',
            placeholder: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            rows: 2,
          },
        },
      ],
    },
  ],
}
