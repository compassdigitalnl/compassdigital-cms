import type { Block } from 'payload'

export const InfoBox: Block = {
  slug: 'infobox',
  interfaceName: 'InfoBoxBlock',
  labels: {
    singular: 'Info Box',
    plural: 'Info Boxes',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      label: 'Type',
      defaultValue: 'info',
      required: true,
      options: [
        { label: '💡 Info (Teal)', value: 'info' },
        { label: '⚠️ Waarschuwing (Amber)', value: 'warning' },
        { label: '✅ Succes (Green)', value: 'success' },
        { label: '⛔ Let op (Red)', value: 'danger' },
      ],
      admin: {
        description: 'Kies het type en de kleur van de info box',
      },
    },
    {
      name: 'icon',
      type: 'select',
      label: 'Icon',
      defaultValue: 'Lightbulb',
      options: [
        { label: '💡 Lightbulb (Tip)', value: 'Lightbulb' },
        { label: '⚠️ Alert Triangle (Waarschuwing)', value: 'AlertTriangle' },
        { label: 'ℹ️ Info (Informatie)', value: 'Info' },
        { label: '✅ Check Circle (Succes)', value: 'CheckCircle' },
        { label: '⚡ Zap (Belangrijk)', value: 'Zap' },
        { label: '🎯 Target (Tip)', value: 'Target' },
        { label: '🔔 Bell (Melding)', value: 'Bell' },
        { label: '🛡️ Shield (Veiligheid)', value: 'Shield' },
        { label: '📌 Pin (Notitie)', value: 'Pin' },
        { label: '🔍 Search (Details)', value: 'Search' },
      ],
      admin: {
        description: 'Kies een Lucide icon voor de info box',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Bijv: Wist u dat?',
        description: 'Optionele titel voor de info box',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Content',
      required: true,
      admin: {
        rows: 3,
        placeholder: 'Voer de inhoud van de info box in...',
        description: 'De hoofdtekst van de info box',
      },
    },
  ],
}
