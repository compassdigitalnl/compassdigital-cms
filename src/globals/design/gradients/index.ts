import type { Tab } from 'payload'

const gradientField = '@/branches/shared/components/admin/fields/GradientField#GradientField'

export const Gradients: Tab = {
  label: 'Gradienten',
  description: 'Kleurverlopen voor knoppen, achtergronden en hero secties',
  fields: [
    {
      type: 'collapsible',
      label: 'Primair & Secundair',
      fields: [
        {
          name: 'primaryGradient',
          type: 'textarea',
          label: 'Primair Gradient',
          defaultValue: 'linear-gradient(135deg, #00897B 0%, #26A69A 100%)',
          admin: {
            description: 'Hoofd gradient voor knoppen, CTAs en interactieve elementen',
            components: { Field: gradientField },
          },
        },
        {
          name: 'secondaryGradient',
          type: 'textarea',
          label: 'Secundair Gradient',
          defaultValue: 'linear-gradient(135deg, #0A1628 0%, #1B2B45 100%)',
          admin: {
            description: 'Donker gradient voor secties, footers en navigatie',
            components: { Field: gradientField },
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Hero & Accent',
      fields: [
        {
          name: 'heroGradient',
          type: 'textarea',
          label: 'Hero Gradient',
          defaultValue: 'linear-gradient(135deg, rgba(0,137,123,0.08) 0%, rgba(38,166,154,0.12) 100%)',
          admin: {
            description: 'Subtiel overlay gradient voor hero secties (lage transparantie)',
            components: { Field: gradientField },
          },
        },
        {
          name: 'accentGradient',
          type: 'textarea',
          label: 'Accent Gradient (Optioneel)',
          defaultValue: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
          admin: {
            description: 'Optioneel gradient voor acties, badges of campagnes',
            components: { Field: gradientField },
          },
        },
      ],
    },
  ],
}
