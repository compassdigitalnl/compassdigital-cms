import type { GlobalConfig } from 'payload'
import { checkRole } from '../access/utilities'
import { isClientDeployment } from '@/lib/isClientDeployment'

export const Theme: GlobalConfig = {
  slug: 'theme',
  label: 'Theme & Design System',
  admin: {
    group: 'Ontwerp',
    hidden: ({ user }) => (isClientDeployment() ? false : checkRole(['admin'], user)),
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // COLORS TAB
        {
          label: 'Colors',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  label: 'Primary Color',
                  defaultValue: '#00796B',
                  admin: {
                    description: 'Main brand color (e.g., buttons, links)',
                    placeholder: '#00796B',
                  },
                },
                {
                  name: 'secondaryColor',
                  type: 'text',
                  label: 'Secondary Color',
                  defaultValue: '#0A1628',
                  admin: {
                    description: 'Secondary brand color',
                    placeholder: '#0A1628',
                  },
                },
                {
                  name: 'accentColor',
                  type: 'text',
                  label: 'Accent Color',
                  defaultValue: '#8b5cf6',
                  admin: {
                    description: 'Accent/highlight color',
                    placeholder: '#8b5cf6',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'backgroundColor',
                  type: 'text',
                  label: 'Background Color',
                  defaultValue: '#ffffff',
                  admin: {
                    description: 'Default page background',
                  },
                },
                {
                  name: 'surfaceColor',
                  type: 'text',
                  label: 'Surface Color',
                  defaultValue: '#f9fafb',
                  admin: {
                    description: 'Cards, sections background',
                  },
                },
                {
                  name: 'borderColor',
                  type: 'text',
                  label: 'Border Color',
                  defaultValue: '#e5e7eb',
                  admin: {
                    description: 'Default border color',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'textPrimary',
                  type: 'text',
                  label: 'Text Primary',
                  defaultValue: '#0A1628',
                  admin: {
                    description: 'Main text color',
                  },
                },
                {
                  name: 'textSecondary',
                  type: 'text',
                  label: 'Text Secondary',
                  defaultValue: '#64748b',
                  admin: {
                    description: 'Secondary text color',
                  },
                },
                {
                  name: 'textMuted',
                  type: 'text',
                  label: 'Text Muted',
                  defaultValue: '#94a3b8',
                  admin: {
                    description: 'Muted/disabled text',
                  },
                },
              ],
            },
          ],
        },

        // TYPOGRAPHY TAB
        {
          label: 'Typography',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'headingFont',
                  type: 'text',
                  label: 'Heading Font Family',
                  defaultValue: 'Inter, system-ui, sans-serif',
                  admin: {
                    description: 'Font for headings (h1, h2, etc.)',
                    placeholder: 'Inter, system-ui, sans-serif',
                  },
                },
                {
                  name: 'bodyFont',
                  type: 'text',
                  label: 'Body Font Family',
                  defaultValue: 'Inter, system-ui, sans-serif',
                  admin: {
                    description: 'Font for body text',
                    placeholder: 'Inter, system-ui, sans-serif',
                  },
                },
              ],
            },
            {
              name: 'fontScale',
              type: 'select',
              label: 'Font Size Scale',
              defaultValue: 'md',
              options: [
                { label: 'Small (Compact)', value: 'sm' },
                { label: 'Medium (Default)', value: 'md' },
                { label: 'Large (Comfortable)', value: 'lg' },
              ],
              admin: {
                description: 'Overall font size scale',
              },
            },
          ],
        },

        // SPACING & LAYOUT TAB
        {
          label: 'Spacing & Layout',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'borderRadius',
                  type: 'select',
                  label: 'Border Radius',
                  defaultValue: 'lg',
                  options: [
                    { label: 'None (Sharp)', value: 'none' },
                    { label: 'Small (2px)', value: 'sm' },
                    { label: 'Medium (6px)', value: 'md' },
                    { label: 'Large (12px)', value: 'lg' },
                    { label: 'Extra Large (16px)', value: 'xl' },
                    { label: 'Full (9999px)', value: 'full' },
                  ],
                  admin: {
                    description: 'Default border radius for buttons, cards, etc.',
                  },
                },
                {
                  name: 'spacing',
                  type: 'select',
                  label: 'Spacing Scale',
                  defaultValue: 'md',
                  options: [
                    { label: 'Compact', value: 'sm' },
                    { label: 'Default', value: 'md' },
                    { label: 'Comfortable', value: 'lg' },
                  ],
                  admin: {
                    description: 'Overall spacing scale',
                  },
                },
              ],
            },
            {
              name: 'containerWidth',
              type: 'select',
              label: 'Container Max Width',
              defaultValue: '7xl',
              options: [
                { label: '1024px (Desktop)', value: 'lg' },
                { label: '1280px (Wide)', value: 'xl' },
                { label: '1536px (Extra Wide)', value: '2xl' },
                { label: '1792px (Ultra Wide)', value: '7xl' },
              ],
              admin: {
                description: 'Maximum width for page containers',
              },
            },
          ],
        },

        // EFFECTS TAB
        {
          label: 'Effects',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'shadowSize',
                  type: 'select',
                  label: 'Shadow Size',
                  defaultValue: 'md',
                  options: [
                    { label: 'None', value: 'none' },
                    { label: 'Small', value: 'sm' },
                    { label: 'Medium', value: 'md' },
                    { label: 'Large', value: 'lg' },
                  ],
                },
                {
                  name: 'enableAnimations',
                  type: 'checkbox',
                  label: 'Enable Animations',
                  defaultValue: true,
                  admin: {
                    description: 'Enable hover effects and transitions',
                  },
                },
                {
                  name: 'enableDarkMode',
                  type: 'checkbox',
                  label: 'Enable Dark Mode',
                  defaultValue: false,
                  admin: {
                    description: 'Enable dark mode support (future)',
                  },
                },
              ],
            },
          ],
        },

        // ADVANCED TAB
        {
          label: 'Advanced',
          fields: [
            {
              name: 'customCSS',
              type: 'textarea',
              label: 'Custom CSS Variables',
              admin: {
                description: 'Add custom CSS variables (advanced users only)',
                placeholder: '--custom-color: #000000;\n--custom-spacing: 1rem;',
                rows: 8,
              },
            },
          ],
        },
      ],
    },
  ],
}
