import type { Tab } from 'payload'

const colorPickerField = '@/branches/shared/components/admin/fields/ColorPickerField#ColorPickerField'

const hexValidate = (val: any) => {
  if (!val) return true
  if (!/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/i.test(val) && !val.startsWith('rgba'))
    return 'Gebruik hex kleur (bijv. #00897B) of rgba()'
  return true
}

const colorField = (
  name: string,
  label: string,
  defaultValue: string,
  description?: string,
) => ({
  name,
  type: 'text' as const,
  label,
  defaultValue,
  validate: hexValidate,
  admin: {
    description,
    components: {
      Field: colorPickerField,
    },
  },
})

export const Colors: Tab = {
  label: 'Kleuren',
  description: 'Alle kleur tokens voor het design systeem',
  fields: [
    // ─── Brand Colors ─────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Merkkleuren',
      admin: {
        description: 'Primaire, secundaire en accent kleuren',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            colorField('primaryColor', 'Primary', '#00897B', 'Hoofdkleur voor knoppen, links, actieve states'),
            colorField('primaryLight', 'Primary Light', '#26A69A', 'Lichtere variant voor hover states'),
            colorField('primaryGlow', 'Primary Glow', 'rgba(0,137,123,0.12)', 'Gloed/achtergrond tint'),
          ],
        },
        {
          type: 'row',
          fields: [
            colorField('secondaryColor', 'Secondary', '#0A1628', 'Donkere achtergronden, headers, footers'),
            colorField('secondaryLight', 'Secondary Light', '#121F33', 'Lichtere variant van secondary'),
          ],
        },
        {
          type: 'row',
          fields: [
            colorField('accentColor', 'Accent', '#8b5cf6', 'Accent kleur voor speciale elementen'),
          ],
        },
      ],
    },

    // ─── Background & Text ────────────────────────────────
    {
      type: 'collapsible',
      label: 'Achtergrond & Tekst',
      admin: {
        description: 'Pagina achtergrond, surfaces, randen, grijs schaal en tekstkleuren',
        initCollapsed: false,
      },
      fields: [
        {
          type: 'row',
          fields: [
            colorField('backgroundColor', 'Achtergrond', '#F5F7FA', 'Pagina achtergrond'),
            colorField('surfaceColor', 'Surface', '#ffffff', 'Cards, modals, panels'),
            colorField('borderColor', 'Border', '#E8ECF1', 'Randen en scheidingslijnen'),
          ],
        },
        {
          type: 'row',
          fields: [
            colorField('greyLight', 'Grey Light', '#F1F4F8', 'Lichtgrijs achtergronden'),
            colorField('greyMid', 'Grey Mid', '#94A3B8', 'Muted tekst, iconen'),
            colorField('greyDark', 'Grey Dark', '#64748B', 'Body tekst, labels'),
          ],
        },
        {
          type: 'row',
          fields: [
            colorField('textPrimary', 'Tekst Primary', '#0A1628', 'Headings, belangrijke tekst'),
            colorField('textSecondary', 'Tekst Secondary', '#64748b', 'Secundaire tekst'),
            colorField('textMuted', 'Tekst Muted', '#94a3b8', 'Gedimde tekst, placeholders'),
          ],
        },
      ],
    },

    // ─── Status Colors ────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Status kleuren',
      admin: {
        description: 'Succes, waarschuwing, fout en info kleuren (elk met light/dark variant)',
        initCollapsed: true,
      },
      fields: [
        // Success
        {
          type: 'row',
          fields: [
            colorField('successColor', 'Success', '#00C853', 'Succes meldingen'),
            colorField('successLight', 'Success Light', '#E8F5E9', 'Succes achtergrond'),
            colorField('successDark', 'Success Dark', '#1B5E20', 'Succes donker'),
          ],
        },
        // Warning
        {
          type: 'row',
          fields: [
            colorField('warningColor', 'Warning', '#F59E0B', 'Waarschuwingen'),
            colorField('warningLight', 'Warning Light', '#FFF8E1', 'Waarschuwing achtergrond'),
            colorField('warningDark', 'Warning Dark', '#92400E', 'Waarschuwing donker'),
          ],
        },
        // Error
        {
          type: 'row',
          fields: [
            colorField('errorColor', 'Error', '#EF4444', 'Foutmeldingen'),
            colorField('errorLight', 'Error Light', '#FFF0F0', 'Fout achtergrond'),
            colorField('errorDark', 'Error Dark', '#991B1B', 'Fout donker'),
          ],
        },
        // Info
        {
          type: 'row',
          fields: [
            colorField('infoColor', 'Info', '#00897B', 'Informatie meldingen'),
            colorField('infoLight', 'Info Light', 'rgba(0,137,123,0.12)', 'Info achtergrond'),
            colorField('infoDark', 'Info Dark', '#004D40', 'Info donker'),
          ],
        },
      ],
    },
  ],
}
