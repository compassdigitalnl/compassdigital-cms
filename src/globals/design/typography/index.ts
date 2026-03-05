import { Tab } from 'payload'

export const Typography: Tab = {
  label: 'Typography',
  description: '3 font families + 8-step type scale',
  fields: [
    {
      type: 'collapsible',
      label: 'Font Families',
      admin: {
        description: 'Three font stacks for different use cases',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'fontBody',
          type: 'text',
          label: '--font (Body font)',
          defaultValue: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
          admin: {
            description: 'Primary font for UI and body text. Default: Plus Jakarta Sans with DM Sans fallback.',
          },
        },
        {
          name: 'fontDisplay',
          type: 'text',
          label: '--font-display (Display/Heading font)',
          defaultValue: "'DM Serif Display', Georgia, serif",
          admin: {
            description: 'Serif font for hero headings and editorial content. Adds elegance and contrast.',
          },
        },
        {
          name: 'fontMono',
          type: 'text',
          label: '--font-mono (Monospace font)',
          defaultValue: "'JetBrains Mono', 'Courier New', monospace",
          admin: {
            description: 'Monospace font for code, technical data, timestamps.',
          },
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Type Scale',
      admin: {
        description: '8-step type scale from micro (8px) to hero (36px)',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'heroSize',
          type: 'number',
          label: '--text-hero (Hero headings)',
          defaultValue: 36,
          min: 24,
          max: 72,
          admin: {
            description: '36px — Largest text size. Used for hero section headings, major page titles.',
          },
        },
        {
          name: 'sectionSize',
          type: 'number',
          label: '--text-section (Section headings)',
          defaultValue: 24,
          min: 18,
          max: 48,
          admin: {
            description: '24px — Section headings (H2). Major content blocks.',
          },
        },
        {
          name: 'cardTitleSize',
          type: 'number',
          label: '--text-card-title (Card titles, H3)',
          defaultValue: 18,
          min: 14,
          max: 28,
          admin: {
            description: '18px — Card titles, smaller headings (H3), emphasized labels.',
          },
        },
        {
          name: 'bodyLgSize',
          type: 'number',
          label: '--text-body-lg (Large body text)',
          defaultValue: 15,
          min: 13,
          max: 20,
          admin: {
            description: '15px — Large body text. Intro paragraphs, lead text.',
          },
        },
        {
          name: 'bodySize',
          type: 'number',
          label: '--text-body (Standard body text)',
          defaultValue: 13,
          min: 11,
          max: 17,
          admin: {
            description: '13px — Standard body text. Most common reading size.',
          },
        },
        {
          name: 'smallSize',
          type: 'number',
          label: '--text-small (Small text)',
          defaultValue: 12,
          min: 10,
          max: 15,
          admin: {
            description: '12px — Small text. Captions, metadata, secondary info.',
          },
        },
        {
          name: 'labelSize',
          type: 'number',
          label: '--text-label (Labels, tags)',
          defaultValue: 10,
          min: 8,
          max: 13,
          admin: {
            description: '10px — Tiny labels, tags, badges, uppercase UI text.',
          },
        },
        {
          name: 'microSize',
          type: 'number',
          label: '--text-micro (Micro text)',
          defaultValue: 8,
          min: 7,
          max: 11,
          admin: {
            description: '8px — Smallest text size. Rarely used. Tooltip text, fine print.',
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
              Field: '@/fields/NullField#NullField',
            },
            description: '💡 TIP: Font families should include fallbacks. Type scale values are in pixels and will be converted to CSS variables (--text-hero, etc.).',
          },
        } as any,
      ],
    },
  ],
}
