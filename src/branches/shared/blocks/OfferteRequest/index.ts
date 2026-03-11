import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-29 OfferteRequest Block
 *
 * Quote request form that delegates rendering to a Form Builder form.
 * Keeps unique layout variants while using the shared FormRenderer.
 *
 * Variants: standard (full-width form), sidebar (form left, trust signals right)
 */
export const OfferteRequest: Block = {
  slug: 'offerteRequest',
  interfaceName: 'OfferteRequestBlock',
  labels: {
    singular: 'Offerte Aanvraag',
    plural: 'Offerte Aanvragen',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Titel',
              defaultValue: 'Offerte aanvragen',
              admin: {
                placeholder: 'Offerte aanvragen',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Beschrijving',
              admin: {
                rows: 3,
                placeholder: 'Vraag vrijblijvend een offerte aan. Wij maken graag een voorstel op maat.',
              },
            },
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              required: true,
              label: 'Formulier',
              admin: {
                description: 'Selecteer het offerte-formulier',
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
              label: 'Layout Variant',
              defaultValue: 'standard',
              options: [
                { label: 'Standaard (Volledige breedte)', value: 'standard' },
                { label: 'Sidebar (Formulier links, info rechts)', value: 'sidebar' },
              ],
              admin: {
                description: 'Kies de lay-out van het offerte formulier',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
