import type { Block } from 'payload'

export const ProductEmbed: Block = {
  slug: 'productembed',
  interfaceName: 'ProductEmbedBlock',
  labels: {
    singular: 'Product Embed',
    plural: 'Product Embeds',
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
      admin: {
        description: 'Selecteer een product om in te bedden',
      },
    },
    {
      name: 'showPrice',
      type: 'checkbox',
      label: 'Prijs tonen',
      defaultValue: true,
      admin: {
        description: 'Toon de productprijs in de embed',
      },
    },
    {
      name: 'showButton',
      type: 'checkbox',
      label: 'Bestel knop tonen',
      defaultValue: true,
      admin: {
        description: 'Toon de "Bestellen" knop',
      },
    },
    {
      name: 'customDescription',
      type: 'textarea',
      label: 'Custom Beschrijving',
      admin: {
        rows: 2,
        description: 'Optioneel: overschrijf de product beschrijving voor deze embed',
        placeholder: 'Laat leeg om de standaard product beschrijving te gebruiken',
      },
    },
  ],
}
