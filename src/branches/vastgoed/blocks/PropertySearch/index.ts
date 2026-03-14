import type { Block } from 'payload'

export const PropertySearch: Block = {
  slug: 'property-search',
  labels: {
    singular: 'Woningen Zoeken',
    plural: 'Woningen Zoeken',
  },
  interfaceName: 'PropertySearchBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Titel',
      admin: {
        placeholder: 'Vind uw droomwoning',
      },
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Ondertitel',
      admin: {
        placeholder: 'Zoek in ons actuele aanbod van woningen',
      },
    },
    {
      name: 'showFilters',
      type: 'checkbox',
      label: 'Toon snelfilters',
      defaultValue: true,
    },
    {
      name: 'defaultCity',
      type: 'text',
      label: 'Standaard stad',
      admin: {
        placeholder: 'Bijv. Amsterdam',
        description: 'Filtert automatisch op deze stad',
      },
    },
  ],
}

export default PropertySearch
