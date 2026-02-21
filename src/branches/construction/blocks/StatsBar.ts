import type { Block } from 'payload'

export const StatsBar: Block = {
  slug: 'stats-bar',
  labels: {
    singular: 'Statistieken Balk',
    plural: 'Statistieken Balken',
  },
  interfaceName: 'StatsBarBlock',
  fields: [
    {
      name: 'style',
      type: 'select',
      label: 'Stijl',
      defaultValue: 'default',
      options: [
        { label: 'Standaard (lichte achtergrond)', value: 'default' },
        { label: 'Accent (gekleurde achtergrond)', value: 'accent' },
        { label: 'Donker', value: 'dark' },
        { label: 'Transparant', value: 'transparent' },
      ],
      admin: {
        description: 'Visuele stijl van de statistieken balk',
      },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistieken',
      minRows: 2,
      maxRows: 5,
      required: true,
      admin: {
        description: 'Voeg 2-5 statistieken toe',
        initCollapsed: false,
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Waarde',
          admin: {
            description: 'Bijv. "25+" of "500+" of "98%"',
            placeholder: '25+',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: {
            description: 'Bijv. "Jaar ervaring" of "Projecten" of "Tevreden klanten"',
            placeholder: 'Jaar ervaring',
          },
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Icoon',
          options: [
            { label: 'Geen icoon', value: 'none' },
            { label: '🏗️ Bouw', value: 'construction' },
            { label: '⭐ Ster', value: 'star' },
            { label: '👥 Mensen', value: 'users' },
            { label: '🏆 Trofee', value: 'trophy' },
            { label: '📊 Grafiek', value: 'chart' },
            { label: '✓ Vinkje', value: 'check' },
            { label: '🎯 Doel', value: 'target' },
            { label: '💼 Koffer', value: 'briefcase' },
          ],
          defaultValue: 'none',
          admin: {
            description: 'Optioneel icoon bij de statistiek',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontaal (onder elkaar op mobiel)', value: 'horizontal' },
        { label: 'Grid (2x2 op mobiel)', value: 'grid' },
      ],
      admin: {
        description: 'Hoe de statistieken worden weergegeven',
      },
    },
    {
      name: 'animate',
      type: 'checkbox',
      label: 'Animeer getallen',
      defaultValue: true,
      admin: {
        description: 'Laat de getallen animeren bij scrollen',
      },
    },
    {
      name: 'dividers',
      type: 'checkbox',
      label: 'Toon scheidingslijnen',
      defaultValue: true,
      admin: {
        description: 'Toon verticale lijnen tussen statistieken',
      },
    },
  ],
}

export default StatsBar
