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
                  defaultValue: '#00897B',
                  admin: {
                    description: 'Main brand color (e.g., buttons, links)',
                    placeholder: '#00897B',
                  },
                },
                {
                  name: 'primaryLight',
                  type: 'text',
                  label: 'Primary Light',
                  defaultValue: '#26A69A',
                  admin: {
                    description: 'Lighter variant of primary color',
                    placeholder: '#26A69A',
                  },
                },
                {
                  name: 'primaryGlow',
                  type: 'text',
                  label: 'Primary Glow',
                  defaultValue: 'rgba(0,137,123,0.12)',
                  admin: {
                    description: 'Subtle glow/background for primary',
                    placeholder: 'rgba(0,137,123,0.12)',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'secondaryColor',
                  type: 'text',
                  label: 'Secondary Color',
                  defaultValue: '#0A1628',
                  admin: {
                    description: 'Secondary brand color (dark)',
                    placeholder: '#0A1628',
                  },
                },
                {
                  name: 'secondaryLight',
                  type: 'text',
                  label: 'Secondary Light',
                  defaultValue: '#121F33',
                  admin: {
                    description: 'Lighter variant of secondary',
                    placeholder: '#121F33',
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
                  defaultValue: '#F5F7FA',
                  admin: {
                    description: 'Default page background',
                  },
                },
                {
                  name: 'surfaceColor',
                  type: 'text',
                  label: 'Surface Color',
                  defaultValue: '#ffffff',
                  admin: {
                    description: 'Cards, sections background',
                  },
                },
                {
                  name: 'borderColor',
                  type: 'text',
                  label: 'Border Color',
                  defaultValue: '#E8ECF1',
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
                  name: 'greyLight',
                  type: 'text',
                  label: 'Grey Light',
                  defaultValue: '#F1F4F8',
                  admin: {
                    description: 'Light grey for backgrounds',
                  },
                },
                {
                  name: 'greyMid',
                  type: 'text',
                  label: 'Grey Mid',
                  defaultValue: '#94A3B8',
                  admin: {
                    description: 'Medium grey for secondary text',
                  },
                },
                {
                  name: 'greyDark',
                  type: 'text',
                  label: 'Grey Dark',
                  defaultValue: '#64748B',
                  admin: {
                    description: 'Dark grey for text',
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

        // STATUS COLORS TAB
        {
          label: 'Status Colors',
          description:
            'Status colors are used for alerts, notifications, badges, and form states. These colors are critical for user feedback and accessibility.',
          fields: [
            // SUCCESS
            {
              type: 'collapsible',
              label: 'Success Colors',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'successColor',
                      type: 'text',
                      label: 'Success (Default)',
                      defaultValue: '#00C853',
                      admin: {
                        description: 'Main success color (green)',
                        placeholder: '#00C853',
                      },
                    },
                    {
                      name: 'successLight',
                      type: 'text',
                      label: 'Success Light',
                      defaultValue: '#E8F5E9',
                      admin: {
                        description: 'Light background for success messages',
                        placeholder: '#E8F5E9',
                      },
                    },
                    {
                      name: 'successDark',
                      type: 'text',
                      label: 'Success Dark',
                      defaultValue: '#1B5E20',
                      admin: {
                        description: 'Dark text for success messages',
                        placeholder: '#1B5E20',
                      },
                    },
                  ],
                },
              ],
            },
            // WARNING
            {
              type: 'collapsible',
              label: 'Warning Colors',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'warningColor',
                      type: 'text',
                      label: 'Warning (Default)',
                      defaultValue: '#F59E0B',
                      admin: {
                        description: 'Main warning color (amber/orange)',
                        placeholder: '#F59E0B',
                      },
                    },
                    {
                      name: 'warningLight',
                      type: 'text',
                      label: 'Warning Light',
                      defaultValue: '#FFF8E1',
                      admin: {
                        description: 'Light background for warning messages',
                        placeholder: '#FFF8E1',
                      },
                    },
                    {
                      name: 'warningDark',
                      type: 'text',
                      label: 'Warning Dark',
                      defaultValue: '#92400E',
                      admin: {
                        description: 'Dark text for warning messages',
                        placeholder: '#92400E',
                      },
                    },
                  ],
                },
              ],
            },
            // ERROR
            {
              type: 'collapsible',
              label: 'Error Colors',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'errorColor',
                      type: 'text',
                      label: 'Error (Default)',
                      defaultValue: '#EF4444',
                      admin: {
                        description: 'Main error color (red)',
                        placeholder: '#EF4444',
                      },
                    },
                    {
                      name: 'errorLight',
                      type: 'text',
                      label: 'Error Light',
                      defaultValue: '#FFF0F0',
                      admin: {
                        description: 'Light background for error messages',
                        placeholder: '#FFF0F0',
                      },
                    },
                    {
                      name: 'errorDark',
                      type: 'text',
                      label: 'Error Dark',
                      defaultValue: '#991B1B',
                      admin: {
                        description: 'Dark text for error messages',
                        placeholder: '#991B1B',
                      },
                    },
                  ],
                },
              ],
            },
            // INFO
            {
              type: 'collapsible',
              label: 'Info Colors',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'infoColor',
                      type: 'text',
                      label: 'Info (Default)',
                      defaultValue: '#00897B',
                      admin: {
                        description: 'Main info color (teal)',
                        placeholder: '#00897B',
                      },
                    },
                    {
                      name: 'infoLight',
                      type: 'text',
                      label: 'Info Light',
                      defaultValue: 'rgba(0,137,123,0.12)',
                      admin: {
                        description: 'Light background for info messages',
                        placeholder: 'rgba(0,137,123,0.12)',
                      },
                    },
                    {
                      name: 'infoDark',
                      type: 'text',
                      label: 'Info Dark',
                      defaultValue: '#004D40',
                      admin: {
                        description: 'Dark text for info messages',
                        placeholder: '#004D40',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // GRADIENTS TAB
        {
          label: 'Gradients',
          description:
            'Gradients are used for hero sections, buttons, and accent elements. Use CSS gradient syntax: linear-gradient(135deg, #color1 0%, #color2 100%)',
          fields: [
            {
              name: 'primaryGradient',
              type: 'text',
              label: 'Primary Gradient',
              defaultValue: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
              admin: {
                description: 'Main gradient (buttons, CTAs)',
                placeholder: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
              },
            },
            {
              name: 'secondaryGradient',
              type: 'text',
              label: 'Secondary Gradient',
              defaultValue: 'linear-gradient(135deg, #0A1628 0%, #1a2847 100%)',
              admin: {
                description: 'Secondary gradient (dark sections)',
                placeholder: 'linear-gradient(135deg, #0A1628 0%, #1a2847 100%)',
              },
            },
            {
              name: 'heroGradient',
              type: 'text',
              label: 'Hero Gradient',
              defaultValue: 'linear-gradient(135deg, rgba(0,137,123,0.1) 0%, rgba(38,166,154,0.1) 100%)',
              admin: {
                description: 'Hero section overlay gradient',
                placeholder: 'linear-gradient(135deg, rgba(0,137,123,0.1) 0%, rgba(38,166,154,0.1) 100%)',
              },
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
