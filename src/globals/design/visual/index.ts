import type { Tab } from 'payload'

export const Visual: Tab = {
  label: 'Visueel',
  description: 'Layout, border radius, shadows, z-index en effecten',
  fields: [
    // ─── Layout ───────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Layout & Schaal',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'containerWidth',
              type: 'select',
              label: 'Max Container Breedte',
              defaultValue: '7xl',
              required: true,
              options: [
                { label: '1024px (lg)', value: 'lg' },
                { label: '1280px (xl)', value: 'xl' },
                { label: '1536px (2xl)', value: '2xl' },
                { label: '1792px (7xl)', value: '7xl' },
              ],
              admin: { width: '33%' },
            },
            {
              name: 'fontScale',
              type: 'select',
              label: 'Font Schaal',
              defaultValue: 'md',
              options: [
                { label: 'Klein (0.875x)', value: 'sm' },
                { label: 'Normaal (1x)', value: 'md' },
                { label: 'Groot (1.125x)', value: 'lg' },
              ],
              admin: { width: '33%', description: 'Globale schaalfactor voor tekst' },
            },
            {
              name: 'spacing',
              type: 'select',
              label: 'Spacing Schaal',
              defaultValue: 'md',
              options: [
                { label: 'Compact (0.75x)', value: 'sm' },
                { label: 'Normaal (1x)', value: 'md' },
                { label: 'Ruim (1.25x)', value: 'lg' },
              ],
              admin: { width: '33%', description: 'Globale schaalfactor voor ruimte' },
            },
          ],
        },
      ],
    },

    // ─── Border Radius ────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Border Radius',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'radiusSm',
              type: 'number',
              label: '--r-sm (Buttons, inputs)',
              defaultValue: 8,
              required: true,
              admin: { width: '20%', description: '8px' },
            },
            {
              name: 'radiusMd',
              type: 'number',
              label: '--r-md (Cards, panels)',
              defaultValue: 12,
              required: true,
              admin: { width: '20%', description: '12px' },
            },
            {
              name: 'radiusLg',
              type: 'number',
              label: '--r-lg (Grote cards)',
              defaultValue: 16,
              required: true,
              admin: { width: '20%', description: '16px' },
            },
            {
              name: 'radiusXl',
              type: 'number',
              label: '--r-xl (Overlay panels)',
              defaultValue: 20,
              required: true,
              admin: { width: '20%', description: '20px' },
            },
            {
              name: 'radiusFull',
              type: 'number',
              label: '--r-full (Pills)',
              defaultValue: 9999,
              required: true,
              admin: { width: '20%', description: '9999px' },
            },
          ],
        },
      ],
    },

    // ─── Box Shadows ──────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Box Shadows',
      fields: [
        {
          name: 'shadowSm',
          type: 'text',
          label: '--sh-sm (Cards standaard)',
          defaultValue: '0 1px 3px rgba(10, 22, 40, 0.06)',
          required: true,
          admin: { description: 'Subtiele schaduw voor standaard cards' },
        },
        {
          name: 'shadowMd',
          type: 'text',
          label: '--sh-md (Hover states)',
          defaultValue: '0 4px 20px rgba(10, 22, 40, 0.08)',
          required: true,
          admin: { description: 'Medium schaduw voor hover states' },
        },
        {
          name: 'shadowLg',
          type: 'text',
          label: '--sh-lg (Modals)',
          defaultValue: '0 8px 40px rgba(10, 22, 40, 0.12)',
          required: true,
          admin: { description: 'Grote schaduw voor modals en overlays' },
        },
        {
          name: 'shadowXl',
          type: 'text',
          label: '--sh-xl (Floating panels)',
          defaultValue: '0 20px 60px rgba(10, 22, 40, 0.16)',
          required: true,
          admin: { description: 'Extra grote schaduw voor mega menus' },
        },
      ],
    },

    // ─── Z-index ──────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Z-index',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'zDropdown',
              type: 'number',
              label: 'Dropdown',
              defaultValue: 100,
              required: true,
              admin: { width: '20%', description: 'Dropdowns, tooltips' },
            },
            {
              name: 'zSticky',
              type: 'number',
              label: 'Sticky',
              defaultValue: 200,
              required: true,
              admin: { width: '20%', description: 'Sticky headers' },
            },
            {
              name: 'zOverlay',
              type: 'number',
              label: 'Overlay',
              defaultValue: 300,
              required: true,
              admin: { width: '20%', description: 'Search overlays' },
            },
            {
              name: 'zModal',
              type: 'number',
              label: 'Modal',
              defaultValue: 400,
              required: true,
              admin: { width: '20%', description: 'Modals, drawers' },
            },
            {
              name: 'zToast',
              type: 'number',
              label: 'Toast',
              defaultValue: 500,
              required: true,
              admin: { width: '20%', description: 'Notifications' },
            },
          ],
        },
      ],
    },

    // ─── Effects & Custom CSS ─────────────────────────────
    {
      type: 'collapsible',
      label: 'Effecten & Custom CSS',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'enableAnimations',
          type: 'checkbox',
          label: 'Animaties inschakelen',
          defaultValue: true,
          admin: {
            description: 'Hover transities en animaties aan/uit (0ms indien uit)',
          },
        },
        {
          name: 'customCSS',
          type: 'textarea',
          label: 'Custom CSS',
          admin: {
            description: 'Extra CSS variabelen of overrides (geavanceerd)',
            rows: 6,
          },
        },
      ],
    },
  ],
}
