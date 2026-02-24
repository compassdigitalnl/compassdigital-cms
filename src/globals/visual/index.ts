import type { Tab } from 'payload'

export const Visual: Tab = {
  label: 'Visual',
  description: 'Border radius, shadows, and z-index layering',
  fields: [
    // Border Radius Group
    {
      type: 'collapsible',
      label: 'Border Radius',
      fields: [
        {
          name: 'radiusSm',
          type: 'number',
          label: '--r-sm (Buttons, inputs, small cards)',
          defaultValue: 8,
          required: true,
          admin: {
            description: '8px — buttons, inputs, small cards',
          },
        },
        {
          name: 'radiusMd',
          type: 'number',
          label: '--r-md (Cards, modals, panels - default)',
          defaultValue: 12,
          required: true,
          admin: {
            description: '12px — cards, modals, panels (most common)',
          },
        },
        {
          name: 'radiusLg',
          type: 'number',
          label: '--r-lg (Large cards, hero sections)',
          defaultValue: 16,
          required: true,
          admin: {
            description: '16px — large cards, hero sections',
          },
        },
        {
          name: 'radiusXl',
          type: 'number',
          label: '--r-xl (Overlay panels)',
          defaultValue: 20,
          required: true,
          admin: {
            description: '20px — overlay panels (search, modals)',
          },
        },
        {
          name: 'radiusFull',
          type: 'number',
          label: '--r-full (Pills, avatars, badges)',
          defaultValue: 9999,
          required: true,
          admin: {
            description: '9999px — perfect circles (pills, avatars, badges)',
          },
        },
      ],
    },

    // Box Shadows Group
    {
      type: 'collapsible',
      label: 'Box Shadows',
      fields: [
        {
          name: 'shadowSm',
          type: 'text',
          label: '--sh-sm (Subtle lift, default cards)',
          defaultValue: '0 1px 3px rgba(10, 22, 40, 0.06)',
          required: true,
          admin: {
            description: 'Subtle elevation for default cards',
          },
        },
        {
          name: 'shadowMd',
          type: 'text',
          label: '--sh-md (Hover states, dropdowns)',
          defaultValue: '0 4px 20px rgba(10, 22, 40, 0.08)',
          required: true,
          admin: {
            description: 'Medium elevation for hover states',
          },
        },
        {
          name: 'shadowLg',
          type: 'text',
          label: '--sh-lg (Modals, overlays)',
          defaultValue: '0 8px 40px rgba(10, 22, 40, 0.12)',
          required: true,
          admin: {
            description: 'Large elevation for modals and overlays',
          },
        },
        {
          name: 'shadowXl',
          type: 'text',
          label: '--sh-xl (Floating panels, mega menus)',
          defaultValue: '0 20px 60px rgba(10, 22, 40, 0.16)',
          required: true,
          admin: {
            description: 'Extra large elevation for floating elements',
          },
        },
      ],
    },

    // Z-index Group
    {
      type: 'collapsible',
      label: 'Z-index Scale',
      admin: {
        description: '⚠️ NEVER use arbitrary z-index values. Only use these 5 layering tokens.',
      },
      fields: [
        {
          name: 'zDropdown',
          type: 'number',
          label: '--z-dropdown (Dropdowns, tooltips)',
          defaultValue: 100,
          required: true,
          admin: {
            description: '100 — sort menus, filter dropdowns, tooltips',
          },
        },
        {
          name: 'zSticky',
          type: 'number',
          label: '--z-sticky (Sticky headers, sidebars)',
          defaultValue: 200,
          required: true,
          admin: {
            description: '200 — main navigation, sticky elements',
          },
        },
        {
          name: 'zOverlay',
          type: 'number',
          label: '--z-overlay (Search overlays, backdrops)',
          defaultValue: 300,
          required: true,
          admin: {
            description: '300 — InstantSearch overlay, backdrops',
          },
        },
        {
          name: 'zModal',
          type: 'number',
          label: '--z-modal (Modals, drawers)',
          defaultValue: 400,
          required: true,
          admin: {
            description: '400 — QuickView modal, MiniCart flyout',
          },
        },
        {
          name: 'zToast',
          type: 'number',
          label: '--z-toast (Toast notifications)',
          defaultValue: 500,
          required: true,
          admin: {
            description: '500 — AddToCart toast, system notifications (topmost layer)',
          },
        },
      ],
    },
  ],
}
