import type { Block } from 'payload'

export const FeaturedVehicles: Block = {
  slug: 'featured-vehicles',
  labels: {
    singular: 'Uitgelichte Voertuigen',
    plural: 'Uitgelichte Voertuigen',
  },
  interfaceName: 'FeaturedVehiclesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Uitgelichte occasions',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 4,
      min: 1,
      max: 12,
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Weergave',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
      defaultValue: 'grid',
    },
  ],
}

export default FeaturedVehicles
