import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-14 Product Embed Block
 *
 * Single product highlight with multiple display variants:
 * card (image left, text right), hero (full-width), minimal (small inline).
 */
export const ProductEmbed: Block = {
  slug: 'productEmbed',
  interfaceName: 'ProductEmbedBlock',
  labels: {
    singular: 'Product Embed',
    plural: 'Product Embeds',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
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
              name: 'description',
              type: 'richText',
              label: 'Aangepaste beschrijving',
              admin: {
                description: 'Optioneel: overschrijf de standaard productbeschrijving',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Variant',
              defaultValue: 'card',
              options: [
                { label: 'Kaart (afbeelding links, tekst rechts)', value: 'card' },
                { label: 'Hero (volledige breedte)', value: 'hero' },
                { label: 'Minimaal (compact inline)', value: 'minimal' },
              ],
            },
            {
              name: 'showPrice',
              type: 'checkbox',
              label: 'Toon prijs',
              defaultValue: true,
            },
            {
              name: 'showDescription',
              type: 'checkbox',
              label: 'Toon beschrijving',
              defaultValue: true,
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
