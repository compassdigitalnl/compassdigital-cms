import type { Block } from 'payload'

export const HorecaTeamShowcase: Block = {
  slug: 'horeca-team-showcase',
  labels: {
    singular: 'Horeca Team Showcase',
    plural: 'Horeca Team Showcases',
  },
  interfaceName: 'HorecaTeamShowcaseBlock',
  fields: [
    {
      name: 'heading',
      type: 'group',
      label: 'Kopje',
      fields: [
        { name: 'badge', type: 'text', label: 'Badge' },
        { name: 'title', type: 'text', required: true, label: 'Titel' },
        { name: 'description', type: 'textarea', label: 'Omschrijving', admin: { rows: 2 } },
      ],
    },
    {
      name: 'source',
      type: 'radio',
      label: 'Bron',
      options: [
        { label: 'Automatisch', value: 'auto' },
        { label: 'Handmatig selecteren', value: 'manual' },
      ],
      defaultValue: 'auto',
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'content-team',
      hasMany: true,
      label: 'Teamleden',
      admin: { condition: (data) => data.source === 'manual' },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: { condition: (data) => data.source === 'auto' },
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Kolommen',
      options: [
        { label: '2 kolommen', value: '2' },
        { label: '3 kolommen', value: '3' },
        { label: '4 kolommen', value: '4' },
      ],
      defaultValue: '3',
    },
  ],
}

export default HorecaTeamShowcase
