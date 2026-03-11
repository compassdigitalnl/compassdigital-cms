import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-31 ReservationForm Block
 *
 * Reservation form that delegates rendering to a Form Builder form.
 * Keeps unique layout variants while using the shared FormRenderer.
 *
 * Variants: standard (full-width form), split (form left, decorative info right)
 */
export const ReservationForm: Block = {
  slug: 'reservationForm',
  interfaceName: 'ReservationFormBlock',
  labels: {
    singular: 'Reserveringsformulier',
    plural: 'Reserveringsformulieren',
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
              defaultValue: 'Reserveren',
              admin: {
                placeholder: 'Reserveren',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Beschrijving',
              admin: {
                rows: 3,
                placeholder: 'Reserveer uw tafel en geniet van een heerlijke maaltijd.',
              },
            },
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              required: true,
              label: 'Formulier',
              admin: {
                description: 'Selecteer het reserveringsformulier',
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
                { label: 'Standaard (Volledig formulier)', value: 'standard' },
                { label: 'Split (Formulier links, info rechts)', value: 'split' },
              ],
              admin: {
                description: 'Kies de lay-out van het reserveringsformulier',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
