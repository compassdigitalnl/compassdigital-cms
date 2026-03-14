import type { Block } from 'payload'

export const WorkshopServices: Block = {
  slug: 'workshop-services',
  labels: {
    singular: 'Werkplaats Services',
    plural: 'Werkplaats Services',
  },
  interfaceName: 'WorkshopServicesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Onze werkplaats',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 6,
      min: 1,
      max: 12,
    },
    {
      name: 'showPrices',
      type: 'checkbox',
      label: 'Toon prijzen',
      defaultValue: true,
    },
  ],
}

export default WorkshopServices
