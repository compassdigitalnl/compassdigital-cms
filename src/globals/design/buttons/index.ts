import type { Tab } from 'payload'

const colorPickerField =
  '@/branches/shared/components/admin/fields/ColorPickerField#ColorPickerField'

export const Buttons: Tab = {
  label: 'Knoppen',
  description: 'Button design tokens — maten, vorm en kleuren',
  fields: [
    {
      type: 'collapsible',
      label: 'Knop Basis',
      admin: {
        description: 'Basis eigenschappen voor alle knoppen',
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
      label: 'Knop Maten',
      admin: {
        description: '3 maten: Small (tabellen, compact), Medium (standaard), Large (hero CTAs)',
        initCollapsed: true,
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
      label: 'Knop Kleuren',
      admin: {
        description: 'Kleuren per knop variant. Leeg = gebruikt de standaard kleur tokens.',
        initCollapsed: false,
      },
      fields: [
        // Primary CTA
        {
          type: 'row',
          fields: [
            {
              name: 'btnPrimaryBg',
              type: 'text',
              label: 'Primary Achtergrond',
              admin: {
                width: '33%',
                description: 'Standaard: primary kleur',
                components: { Field: colorPickerField },
              },
            },
            {
              name: 'btnPrimaryText',
              type: 'text',
              label: 'Primary Tekst',
              defaultValue: '#ffffff',
              admin: {
                width: '33%',
                components: { Field: colorPickerField },
              },
            },
            {
              name: 'btnPrimaryHoverBg',
              type: 'text',
              label: 'Primary Hover',
              admin: {
                width: '33%',
                description: 'Standaard: donkerder variant',
                components: { Field: colorPickerField },
              },
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
              label: 'Secondary Achtergrond',
              admin: {
                width: '33%',
                description: 'Standaard: secondary kleur',
                components: { Field: colorPickerField },
              },
            },
            {
              name: 'btnSecondaryText',
              type: 'text',
              label: 'Secondary Tekst',
              defaultValue: '#ffffff',
              admin: {
                width: '33%',
                components: { Field: colorPickerField },
              },
            },
            {
              name: 'btnSecondaryHoverBg',
              type: 'text',
              label: 'Secondary Hover',
              admin: {
                width: '33%',
                components: { Field: colorPickerField },
              },
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
              label: 'Danger Achtergrond',
              admin: {
                width: '33%',
                description: 'Standaard: error kleur',
                components: { Field: colorPickerField },
              },
            },
            {
              name: 'btnDangerText',
              type: 'text',
              label: 'Danger Tekst',
              defaultValue: '#ffffff',
              admin: {
                width: '33%',
                components: { Field: colorPickerField },
              },
            },
            {
              name: 'btnDangerHoverBg',
              type: 'text',
              label: 'Danger Hover',
              admin: {
                width: '33%',
                components: { Field: colorPickerField },
              },
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
              label: 'Success Achtergrond',
              admin: {
                width: '33%',
                description: 'Standaard: success kleur',
                components: { Field: colorPickerField },
              },
            },
            {
              name: 'btnSuccessText',
              type: 'text',
              label: 'Success Tekst',
              defaultValue: '#ffffff',
              admin: {
                width: '33%',
                components: { Field: colorPickerField },
              },
            },
            {
              name: 'btnSuccessHoverBg',
              type: 'text',
              label: 'Success Hover',
              admin: {
                width: '33%',
                components: { Field: colorPickerField },
              },
            },
          ],
        },
      ],
    },
  ],
}
