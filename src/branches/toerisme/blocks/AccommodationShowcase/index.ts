import type { Block } from 'payload'

export const AccommodationShowcase: Block = {
  slug: 'accommodation-showcase',
  labels: {
    singular: 'Accommodatie Showcase',
    plural: 'Accommodatie Showcases',
  },
  interfaceName: 'AccommodationShowcaseBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Aanbevolen accommodaties',
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
      name: 'destinationFilter',
      type: 'relationship',
      relationTo: 'destinations',
      label: 'Filter op bestemming',
      admin: {
        description: 'Optioneel: toon alleen accommodaties van deze bestemming',
      },
    },
    {
      name: 'showStars',
      type: 'checkbox',
      label: 'Toon sterren',
      defaultValue: true,
    },
    {
      name: 'showFacilities',
      type: 'checkbox',
      label: 'Toon faciliteiten',
      defaultValue: true,
    },
  ],
}

export default AccommodationShowcase
