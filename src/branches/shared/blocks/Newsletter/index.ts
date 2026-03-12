import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-28 Newsletter Block
 *
 * Newsletter signup that delegates rendering to a Form Builder form.
 * Keeps unique layout variants while using the shared FormRenderer.
 *
 * Variants: inline (horizontal), card (centered with background), banner (full-width colored)
 */
export const Newsletter: Block = {
  slug: 'newsletter',
  interfaceName: 'NewsletterBlock',
  labels: {
    singular: 'Nieuwsbrief',
    plural: 'Nieuwsbrieven',
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
              defaultValue: 'Blijf op de hoogte',
              admin: {
                placeholder: 'Blijf op de hoogte',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Beschrijving',
              admin: {
                rows: 3,
                placeholder: 'Ontvang het laatste nieuws en aanbiedingen in uw inbox.',
              },
            },
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              label: 'Formulier',
              admin: {
                description: 'Selecteer het nieuwsbrief-formulier',
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
              defaultValue: 'inline',
              options: [
                { label: 'Inline (Horizontaal)', value: 'inline' },
                { label: 'Kaart (Gecentreerd met achtergrond)', value: 'card' },
                { label: 'Banner (Volledige breedte gekleurd)', value: 'banner' },
              ],
              admin: {
                description: 'Kies de lay-out van de nieuwsbrief',
              },
            },
            {
              name: 'backgroundColor',
              type: 'select',
              label: 'Achtergrondkleur',
              defaultValue: 'white',
              options: [
                { label: 'Wit', value: 'white' },
                { label: 'Grijs', value: 'grey' },
                { label: 'Navy', value: 'navy' },
                { label: 'Teal', value: 'teal' },
              ],
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
