import type { Tab } from 'payload'

const shadowPreviewField =
  '@/branches/shared/components/admin/fields/ShadowPreviewField#ShadowPreviewField'

export const Visual: Tab = {
  label: 'Visueel',
  description: 'Layout, border radius, shadows en effecten',
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
                { label: '1024px (compact)', value: 'lg' },
                { label: '1280px (normaal)', value: 'xl' },
                { label: '1536px (breed)', value: '2xl' },
                { label: '1792px (extra breed)', value: '7xl' },
              ],
              admin: { width: '33%' },
            },
            {
              name: 'fontScale',
              type: 'select',
              label: 'Tekst Grootte',
              defaultValue: 'md',
              options: [
                { label: 'Klein', value: 'sm' },
                { label: 'Normaal', value: 'md' },
                { label: 'Groot', value: 'lg' },
              ],
              admin: { width: '33%', description: 'Vergroot of verklein alle tekst' },
            },
            {
              name: 'spacing',
              type: 'select',
              label: 'Witruimte',
              defaultValue: 'md',
              options: [
                { label: 'Compact', value: 'sm' },
                { label: 'Normaal', value: 'md' },
                { label: 'Ruim', value: 'lg' },
              ],
              admin: { width: '33%', description: 'Meer of minder ruimte tussen elementen' },
            },
          ],
        },
        {
          name: 'enableAnimations',
          type: 'checkbox',
          label: 'Animaties inschakelen',
          defaultValue: true,
          admin: {
            description: 'Hover transities en animaties aan/uit',
          },
        },
      ],
    },

    // ─── Border Radius ────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Afgeronde hoeken',
      admin: {
        description: 'Hoe rond zijn de hoeken van knoppen, kaarten en panels?',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'radiusSm',
              type: 'number',
              label: 'Klein (knoppen, inputs)',
              defaultValue: 8,
              required: true,
              admin: { width: '20%' },
            },
            {
              name: 'radiusMd',
              type: 'number',
              label: 'Normaal (kaarten)',
              defaultValue: 12,
              required: true,
              admin: { width: '20%' },
            },
            {
              name: 'radiusLg',
              type: 'number',
              label: 'Groot (hero cards)',
              defaultValue: 16,
              required: true,
              admin: { width: '20%' },
            },
            {
              name: 'radiusXl',
              type: 'number',
              label: 'Extra groot (panels)',
              defaultValue: 20,
              required: true,
              admin: { width: '20%' },
            },
            {
              name: 'radiusFull',
              type: 'number',
              label: 'Rond (pills, avatars)',
              defaultValue: 9999,
              required: true,
              admin: { width: '20%' },
            },
          ],
        },
      ],
    },

    // ─── Box Shadows ──────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Schaduwen',
      admin: {
        description: 'Diepte-effect onder kaarten, knoppen en panels',
      },
      fields: [
        {
          name: 'shadowSm',
          type: 'text',
          label: 'Licht (standaard kaarten)',
          defaultValue: '0 1px 3px rgba(10, 22, 40, 0.06)',
          required: true,
          admin: {
            description: 'Subtiele schaduw voor standaard kaarten',
            components: { Field: shadowPreviewField },
          },
        },
        {
          name: 'shadowMd',
          type: 'text',
          label: 'Medium (hover states)',
          defaultValue: '0 4px 20px rgba(10, 22, 40, 0.08)',
          required: true,
          admin: {
            description: 'Medium schaduw voor hover states',
            components: { Field: shadowPreviewField },
          },
        },
        {
          name: 'shadowLg',
          type: 'text',
          label: 'Sterk (modals, overlays)',
          defaultValue: '0 8px 40px rgba(10, 22, 40, 0.12)',
          required: true,
          admin: {
            description: 'Sterke schaduw voor modals en overlays',
            components: { Field: shadowPreviewField },
          },
        },
        {
          name: 'shadowXl',
          type: 'text',
          label: 'Zwaar (floating panels)',
          defaultValue: '0 20px 60px rgba(10, 22, 40, 0.16)',
          required: true,
          admin: {
            description: 'Zware schaduw voor mega menus',
            components: { Field: shadowPreviewField },
          },
        },
      ],
    },

    // ─── Admin-only: Z-index & Custom CSS ─────────────────
    {
      type: 'collapsible',
      label: 'Geavanceerd (alleen beheerder)',
      admin: {
        initCollapsed: true,
        description: 'Z-index layering en custom CSS — alleen voor technisch beheer',
        condition: (_data: any, _siblingData: any, { user }: any) => {
          return user?.role === 'admin'
        },
      },
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
              admin: { width: '20%' },
            },
            {
              name: 'zSticky',
              type: 'number',
              label: 'Sticky',
              defaultValue: 200,
              required: true,
              admin: { width: '20%' },
            },
            {
              name: 'zOverlay',
              type: 'number',
              label: 'Overlay',
              defaultValue: 300,
              required: true,
              admin: { width: '20%' },
            },
            {
              name: 'zModal',
              type: 'number',
              label: 'Modal',
              defaultValue: 400,
              required: true,
              admin: { width: '20%' },
            },
            {
              name: 'zToast',
              type: 'number',
              label: 'Toast',
              defaultValue: 500,
              required: true,
              admin: { width: '20%' },
            },
          ],
        },
        {
          name: 'customCSS',
          type: 'textarea',
          label: 'Custom CSS',
          admin: {
            description: 'Extra CSS variabelen of overrides',
            rows: 6,
          },
        },
      ],
    },
  ],
}
