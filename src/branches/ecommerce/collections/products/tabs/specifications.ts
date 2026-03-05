import type { Tab } from 'payload'

export const specificationsTab: Tab = {
  label: 'Specificaties',
  description: 'Technische specificaties en eigenschappen',
  fields: [
    {
      name: 'specifications',
      type: 'array',
      label: 'Specificatie Groepen',
      admin: { description: 'Groepeer specificaties logisch (bijv: Technische Specificaties, Afmetingen, Materialen)' },
      fields: [
        {
          name: 'group',
          type: 'text',
          required: true,
          label: 'Groep Naam',
          admin: { description: 'Bijv: "Technische Specificaties", "Afmetingen"' },
        },
        {
          name: 'attributes',
          type: 'array',
          label: 'Attributen',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', required: true, label: 'Naam', admin: { width: '40%', placeholder: 'Bijv: Materiaal' } },
                { name: 'value', type: 'text', required: true, label: 'Waarde', admin: { width: '40%', placeholder: 'Bijv: Nitrile' } },
                { name: 'unit', type: 'text', label: 'Eenheid', admin: { width: '20%', placeholder: 'cm, kg, etc.' } },
              ],
            },
          ],
        },
      ],
    },
  ],
}
