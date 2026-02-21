import type { Block } from 'payload'

export const Map: Block = {
  slug: 'map',
  interfaceName: 'MapBlock',
  labels: {
    singular: 'Kaart',
    plural: 'Kaarten',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
      defaultValue: 'Locatie',
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      label: 'Adres',
      admin: {
        description: 'Volledige adres voor Google Maps',
        placeholder: 'Straat 123, 1234 AB Plaats',
      },
    },
    {
      name: 'zoom',
      type: 'number',
      label: 'Zoom level',
      defaultValue: 15,
      min: 1,
      max: 20,
    },
    {
      name: 'height',
      type: 'select',
      label: 'Hoogte',
      defaultValue: 'medium',
      options: [
        { label: 'Klein (300px)', value: 'small' },
        { label: 'Gemiddeld (450px)', value: 'medium' },
        { label: 'Groot (600px)', value: 'large' },
      ],
    },
  ],
}
