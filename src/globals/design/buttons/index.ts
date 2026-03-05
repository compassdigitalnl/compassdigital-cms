import { Tab } from 'payload'

export const Buttons: Tab = {
  label: 'Buttons',
  description: 'Button design tokens — sizing, shape, and variant colors',
  fields: [
    {
      type: 'collapsible',
      label: 'Button Base',
      admin: {
        description: 'Base properties applied to all buttons',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'btnFontWeight',
              type: 'number',
              label: 'Font Weight',
              defaultValue: 700,
              min: 400,
              max: 900,
              admin: { width: '25%', description: '700 = Bold' },
            },
            {
              name: 'btnBorderRadius',
              type: 'text',
              label: 'Border Radius',
              defaultValue: '8px',
              admin: { width: '25%', description: 'bijv. 8px, 12px, 9999px (pill)' },
            },
            {
              name: 'btnBorderWidth',
              type: 'text',
              label: 'Border Width',
              defaultValue: '1.5px',
              admin: { width: '25%', description: 'Voor outline varianten' },
            },
            {
              name: 'btnIconGap',
              type: 'number',
              label: 'Icon Gap (px)',
              defaultValue: 6,
              min: 0,
              max: 16,
              admin: { width: '25%', description: 'Ruimte tussen icon en tekst' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'btnTransitionDuration',
              type: 'text',
              label: 'Transition Duration',
              defaultValue: '0.2s',
              admin: { width: '33%', description: 'Hover animatie snelheid' },
            },
            {
              name: 'btnHoverTranslateY',
              type: 'text',
              label: 'Hover Translate Y',
              defaultValue: '-1px',
              admin: { width: '33%', description: 'Hover lift effect. 0 = uit.' },
            },
            {
              name: 'btnDisabledOpacity',
              type: 'number',
              label: 'Disabled Opacity',
              defaultValue: 0.5,
              min: 0,
              max: 1,
              admin: { width: '33%', step: 0.1 },
            },
          ],
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Button Sizes',
      admin: {
        description: '3 maten: Small (tabellen, compact), Medium (standaard), Large (hero CTAs)',
      },
      fields: [
        // Small
        {
          type: 'row',
          fields: [
            {
              name: 'btnSmPaddingY',
              type: 'number',
              label: 'SM Padding Y (px)',
              defaultValue: 5,
              admin: { width: '25%' },
            },
            {
              name: 'btnSmPaddingX',
              type: 'number',
              label: 'SM Padding X (px)',
              defaultValue: 12,
              admin: { width: '25%' },
            },
            {
              name: 'btnSmFontSize',
              type: 'number',
              label: 'SM Font Size (px)',
              defaultValue: 10,
              admin: { width: '25%' },
            },
            {
              name: 'btnSmIconSize',
              type: 'number',
              label: 'SM Icon Size (px)',
              defaultValue: 12,
              admin: { width: '25%' },
            },
          ],
        },
        // Medium (default)
        {
          type: 'row',
          fields: [
            {
              name: 'btnMdPaddingY',
              type: 'number',
              label: 'MD Padding Y (px)',
              defaultValue: 8,
              admin: { width: '25%' },
            },
            {
              name: 'btnMdPaddingX',
              type: 'number',
              label: 'MD Padding X (px)',
              defaultValue: 18,
              admin: { width: '25%' },
            },
            {
              name: 'btnMdFontSize',
              type: 'number',
              label: 'MD Font Size (px)',
              defaultValue: 12,
              admin: { width: '25%' },
            },
            {
              name: 'btnMdIconSize',
              type: 'number',
              label: 'MD Icon Size (px)',
              defaultValue: 14,
              admin: { width: '25%' },
            },
          ],
        },
        // Large
        {
          type: 'row',
          fields: [
            {
              name: 'btnLgPaddingY',
              type: 'number',
              label: 'LG Padding Y (px)',
              defaultValue: 11,
              admin: { width: '25%' },
            },
            {
              name: 'btnLgPaddingX',
              type: 'number',
              label: 'LG Padding X (px)',
              defaultValue: 26,
              admin: { width: '25%' },
            },
            {
              name: 'btnLgFontSize',
              type: 'number',
              label: 'LG Font Size (px)',
              defaultValue: 14,
              admin: { width: '25%' },
            },
            {
              name: 'btnLgIconSize',
              type: 'number',
              label: 'LG Icon Size (px)',
              defaultValue: 16,
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },

    {
      type: 'collapsible',
      label: 'Button Variant Colors',
      admin: {
        description: 'Overschrijf kleuren per button variant. Leeg = gebruikt de standaard kleur tokens.',
        initCollapsed: true,
      },
      fields: [
        // Primary CTA
        {
          type: 'row',
          fields: [
            {
              name: 'btnPrimaryBg',
              type: 'text',
              label: 'Primary BG',
              admin: { width: '33%', description: 'Standaard: --color-primary', placeholder: '#00897B' },
            },
            {
              name: 'btnPrimaryText',
              type: 'text',
              label: 'Primary Tekst',
              defaultValue: '#ffffff',
              admin: { width: '33%' },
            },
            {
              name: 'btnPrimaryHoverBg',
              type: 'text',
              label: 'Primary Hover BG',
              admin: { width: '33%', description: 'Standaard: donkerder variant', placeholder: '#00695C' },
            },
          ],
        },
        // Secondary
        {
          type: 'row',
          fields: [
            {
              name: 'btnSecondaryBg',
              type: 'text',
              label: 'Secondary BG',
              admin: { width: '33%', description: 'Standaard: --color-secondary', placeholder: '#0A1628' },
            },
            {
              name: 'btnSecondaryText',
              type: 'text',
              label: 'Secondary Tekst',
              defaultValue: '#ffffff',
              admin: { width: '33%' },
            },
            {
              name: 'btnSecondaryHoverBg',
              type: 'text',
              label: 'Secondary Hover BG',
              admin: { width: '33%', placeholder: '#121F33' },
            },
          ],
        },
        // Danger
        {
          type: 'row',
          fields: [
            {
              name: 'btnDangerBg',
              type: 'text',
              label: 'Danger BG',
              admin: { width: '33%', description: 'Standaard: --color-error', placeholder: '#FF6B6B' },
            },
            {
              name: 'btnDangerText',
              type: 'text',
              label: 'Danger Tekst',
              defaultValue: '#ffffff',
              admin: { width: '33%' },
            },
            {
              name: 'btnDangerHoverBg',
              type: 'text',
              label: 'Danger Hover BG',
              admin: { width: '33%', placeholder: '#E55555' },
            },
          ],
        },
        // Success
        {
          type: 'row',
          fields: [
            {
              name: 'btnSuccessBg',
              type: 'text',
              label: 'Success BG',
              admin: { width: '33%', description: 'Standaard: --color-success', placeholder: '#00C853' },
            },
            {
              name: 'btnSuccessText',
              type: 'text',
              label: 'Success Tekst',
              defaultValue: '#ffffff',
              admin: { width: '33%' },
            },
            {
              name: 'btnSuccessHoverBg',
              type: 'text',
              label: 'Success Hover BG',
              admin: { width: '33%', placeholder: '#00A844' },
            },
          ],
        },
      ],
    },
  ],
}
