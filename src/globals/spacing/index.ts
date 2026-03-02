import { Tab } from 'payload'

export const Spacing: Tab = {
  label: 'Spacing',
  description: '4px grid system — 9 locked spacing tokens (READ-ONLY)',
  fields: [
    {
      type: 'collapsible',
      label: '🔒 Spacing Scale (LOCKED)',
      admin: {
        description: 'These values are locked to maintain consistency across the design system. DO NOT CHANGE unless you understand the impact on all components.',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'sp1',
          type: 'number',
          label: '--sp-1 (Tiny spacing)',
          defaultValue: 4,
          required: true,
          admin: {
            readOnly: true, // 🔒 LOCKED!
            description: '4px — Smallest spacing unit. Used for very tight layouts, icon padding.',
            style: {
              opacity: 0.7,
            },
          },
        },
        {
          name: 'sp2',
          type: 'number',
          label: '--sp-2 (Extra small)',
          defaultValue: 8,
          required: true,
          admin: {
            readOnly: true,
            description: '8px — Extra small gaps. Button padding, tag spacing.',
            style: {
              opacity: 0.7,
            },
          },
        },
        {
          name: 'sp3',
          type: 'number',
          label: '--sp-3 (Small)',
          defaultValue: 12,
          required: true,
          admin: {
            readOnly: true,
            description: '12px — Small spacing. Input padding, compact card spacing.',
            style: {
              opacity: 0.7,
            },
          },
        },
        {
          name: 'sp4',
          type: 'number',
          label: '--sp-4 (Base spacing unit)',
          defaultValue: 16,
          required: true,
          admin: {
            readOnly: true,
            description: '16px — The core spacing unit. Most common gap between elements. DO NOT CHANGE.',
            style: {
              opacity: 0.7,
            },
          },
        },
        {
          name: 'sp6',
          type: 'number',
          label: '--sp-6 (Medium)',
          defaultValue: 24,
          required: true,
          admin: {
            readOnly: true,
            description: '24px — Medium spacing. Card padding, section gaps.',
            style: {
              opacity: 0.7,
            },
          },
        },
        {
          name: 'sp8',
          type: 'number',
          label: '--sp-8 (Large)',
          defaultValue: 32,
          required: true,
          admin: {
            readOnly: true,
            description: '32px — Large spacing. Major section padding, container gaps.',
            style: {
              opacity: 0.7,
            },
          },
        },
        {
          name: 'sp12',
          type: 'number',
          label: '--sp-12 (Extra large)',
          defaultValue: 48,
          required: true,
          admin: {
            readOnly: true,
            description: '48px — Extra large spacing. Hero section padding, major layout gaps.',
            style: {
              opacity: 0.7,
            },
          },
        },
        {
          name: 'sp16',
          type: 'number',
          label: '--sp-16 (XXL)',
          defaultValue: 64,
          required: true,
          admin: {
            readOnly: true,
            description: '64px — XXL spacing. Large hero sections, significant visual breaks.',
            style: {
              opacity: 0.7,
            },
          },
        },
        {
          name: 'sp20',
          type: 'number',
          label: '--sp-20 (Maximum)',
          defaultValue: 80,
          required: true,
          admin: {
            readOnly: true,
            description: '80px — Maximum spacing unit. Rarely used, for extreme layouts.',
            style: {
              opacity: 0.7,
            },
          },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          type: 'ui',
          admin: {
            components: {
              Field: (() => null) as any, // Invisible field, just for info
            },
            description: '⚠️ CRITICAL: These spacing values are locked to maintain consistency across all 156+ components. Changing them would break layouts across the entire platform. Only modify if creating a completely new vertical with different spacing requirements.',
          },
        } as any,
      ],
    },
  ],
}
