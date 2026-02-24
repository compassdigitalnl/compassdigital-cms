import { Tab } from 'payload'

export const Colors: Tab = {
  label: 'Colors',
  description: '16 core color tokens for the design system',
  fields: [
    {
      type: 'collapsible',
      label: 'Primary Colors',
      admin: {
        description: 'Navy (dark surfaces) and Teal (brand accent)',
      },
      fields: [
        {
          name: 'navy',
          type: 'text',
          label: '--navy (Main dark background)',
          defaultValue: '#0A1628',
          admin: {
            description: 'Deep navy used for dark surfaces, cards, headers. Provides strong contrast.',
          },
          validate: (val) => {
            if (!val) return true // Optional
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color (e.g. #0A1628)'
            }
            return true
          },
        },
        {
          name: 'navyLight',
          type: 'text',
          label: '--navy-light (Lighter navy shade)',
          defaultValue: '#121F33',
          admin: {
            description: 'Slightly lighter navy for hover states on dark surfaces.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'teal',
          type: 'text',
          label: '--teal (Primary brand color)',
          defaultValue: '#00897B',
          admin: {
            description: 'Primary teal accent. Used for buttons, links, active states.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'tealLight',
          type: 'text',
          label: '--teal-light (Light teal)',
          defaultValue: '#26A69A',
          admin: {
            description: 'Lighter teal for hover states and secondary accents.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'tealDark',
          type: 'text',
          label: '--teal-dark (Dark teal)',
          defaultValue: '#00695C',
          admin: {
            description: 'Darker teal for pressed states and depth.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Status Colors',
      admin: {
        description: 'Semantic colors for success, error, warning, info, and highlight states',
      },
      fields: [
        {
          name: 'green',
          type: 'text',
          label: '--green (Success)',
          defaultValue: '#00C853',
          admin: {
            description: 'Bright green for success messages, checkmarks, positive confirmations.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'coral',
          type: 'text',
          label: '--coral (Error/Danger)',
          defaultValue: '#FF6B6B',
          admin: {
            description: 'Soft coral/red for errors, warnings, destructive actions.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'amber',
          type: 'text',
          label: '--amber (Warning)',
          defaultValue: '#F59E0B',
          admin: {
            description: 'Amber/orange for caution, pending states, important notices.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'blue',
          type: 'text',
          label: '--blue (Info)',
          defaultValue: '#2196F3',
          admin: {
            description: 'Bright blue for informational messages, tips, neutral highlights.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'purple',
          type: 'text',
          label: '--purple (Highlight/Special)',
          defaultValue: '#7C3AED',
          admin: {
            description: 'Purple for special features, premium content, unique elements.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Neutral Colors',
      admin: {
        description: 'Greys, backgrounds, and text colors for UI structure',
      },
      fields: [
        {
          name: 'white',
          type: 'text',
          label: '--white (Pure white surfaces)',
          defaultValue: '#FAFBFC',
          admin: {
            description: 'Off-white for cards, modals, clean backgrounds.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'bg',
          type: 'text',
          label: '--bg (Page background)',
          defaultValue: '#F5F7FA',
          admin: {
            description: 'Light grey page background. Provides subtle contrast to white cards.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'grey',
          type: 'text',
          label: '--grey (Borders, dividers)',
          defaultValue: '#E8ECF1',
          admin: {
            description: 'Light grey for borders, dividers, subtle lines.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'greyMid',
          type: 'text',
          label: '--grey-mid (Muted text, icons)',
          defaultValue: '#94A3B8',
          admin: {
            description: 'Medium grey for muted text, secondary labels, disabled states.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'greyDark',
          type: 'text',
          label: '--grey-dark (Body text)',
          defaultValue: '#64748B',
          admin: {
            description: 'Dark grey for body text. Softer than pure black, easier on eyes.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
        {
          name: 'text',
          type: 'text',
          label: '--text (Headings, primary text)',
          defaultValue: '#1E293B',
          admin: {
            description: 'Near-black for headings and high-emphasis text.',
          },
          validate: (val) => {
            if (!val) return true
            if (!/^#[0-9A-F]{6}$/i.test(val)) {
              return 'Must be valid hex color'
            }
            return true
          },
        },
      ],
    },
  ],
}
