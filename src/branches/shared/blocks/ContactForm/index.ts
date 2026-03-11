import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-27 ContactForm Block
 *
 * Contact form that delegates rendering to a Form Builder form.
 * Keeps unique layout variants while using the shared FormRenderer.
 *
 * Variants: standard (full-width), sidebar (narrower), floating (card with shadow)
 */
export const ContactForm: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  labels: {
    singular: 'Contactformulier',
    plural: 'Contactformulieren',
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
              admin: {
                placeholder: 'Neem contact met ons op',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Beschrijving',
              admin: {
                rows: 3,
                placeholder: 'Heeft u een vraag of wilt u meer informatie? Vul het formulier in en wij nemen zo snel mogelijk contact met u op.',
              },
            },
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              required: true,
              label: 'Formulier',
              admin: {
                description: 'Selecteer het formulier dat in dit blok getoond wordt',
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
                { label: 'Sidebar (Smaller formulier)', value: 'sidebar' },
                { label: 'Floating (Kaart met schaduw)', value: 'floating' },
              ],
              admin: {
                description: 'Kies de lay-out van het contactformulier',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
