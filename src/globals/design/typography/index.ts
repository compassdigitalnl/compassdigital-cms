import type { Tab } from 'payload'

const fontSelectField =
  '@/branches/shared/components/admin/fields/FontSelectField#FontSelectField'

export const Typography: Tab = {
  label: 'Typografie',
  description: 'Lettertypen en type schaal',
  fields: [
    {
      type: 'collapsible',
      label: 'Lettertypen',
      admin: {
        description: 'Kies een lettertype uit de presets of voer een eigen font-family in',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'headingFont',
          type: 'text',
          label: 'Heading Font',
          defaultValue: 'Inter, system-ui, sans-serif',
          admin: {
            description: 'Lettertype voor alle headings (h1-h6)',
            components: {
              Field: fontSelectField,
            },
          },
        },
        {
          name: 'bodyFont',
          type: 'text',
          label: 'Body Font',
          defaultValue: 'Inter, system-ui, sans-serif',
          admin: {
            description: 'Lettertype voor body tekst, labels, UI elementen',
            components: {
              Field: fontSelectField,
            },
          },
        },
        {
          name: 'fontMono',
          type: 'text',
          label: 'Monospace Font',
          defaultValue: "'JetBrains Mono', 'Courier New', monospace",
          admin: {
            description: 'Lettertype voor code, technische data, timestamps. Meestal niet nodig om te wijzigen.',
          },
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Type Schaal',
      admin: {
        description: '8-staps type schaal van micro (8px) tot hero (36px)',
        initCollapsed: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'heroSize',
              type: 'number',
              label: 'Hero (px)',
              defaultValue: 36,
              min: 24,
              max: 72,
              admin: { width: '25%', description: 'Hero headings, grote titels' },
            },
            {
              name: 'sectionSize',
              type: 'number',
              label: 'Section (px)',
              defaultValue: 24,
              min: 18,
              max: 48,
              admin: { width: '25%', description: 'Sectie headings (H2)' },
            },
            {
              name: 'cardTitleSize',
              type: 'number',
              label: 'Card Title (px)',
              defaultValue: 18,
              min: 14,
              max: 28,
              admin: { width: '25%', description: 'Card titels, H3' },
            },
            {
              name: 'bodyLgSize',
              type: 'number',
              label: 'Body Large (px)',
              defaultValue: 15,
              min: 13,
              max: 20,
              admin: { width: '25%', description: 'Intro tekst, lead text' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'bodySize',
              type: 'number',
              label: 'Body (px)',
              defaultValue: 13,
              min: 11,
              max: 17,
              admin: { width: '25%', description: 'Standaard body tekst' },
            },
            {
              name: 'smallSize',
              type: 'number',
              label: 'Small (px)',
              defaultValue: 12,
              min: 10,
              max: 15,
              admin: { width: '25%', description: 'Captions, metadata' },
            },
            {
              name: 'labelSize',
              type: 'number',
              label: 'Label (px)',
              defaultValue: 10,
              min: 8,
              max: 13,
              admin: { width: '25%', description: 'Labels, tags, badges' },
            },
            {
              name: 'microSize',
              type: 'number',
              label: 'Micro (px)',
              defaultValue: 8,
              min: 7,
              max: 11,
              admin: { width: '25%', description: 'Tooltips, fine print' },
            },
          ],
        },
      ],
    },
  ],
}
