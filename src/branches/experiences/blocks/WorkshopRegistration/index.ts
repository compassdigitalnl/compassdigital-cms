import type { Block } from 'payload'
import { animationFields } from '@/branches/shared/blocks/_shared/animationFields'

/**
 * B-30 WorkshopRegistration Block
 *
 * Workshop registration form that delegates rendering to a Form Builder form.
 * Keeps unique layout variants while using the shared FormRenderer.
 *
 * Variants: standard (full-width), card (centered card with background)
 */
export const WorkshopRegistration: Block = {
  slug: 'workshopRegistration',
  interfaceName: 'WorkshopRegistrationBlock',
  labels: {
    singular: 'Workshop Registratie',
    plural: 'Workshop Registraties',
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
                placeholder: 'Schrijf u in voor deze workshop',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Beschrijving',
              admin: {
                rows: 3,
                placeholder: 'Meld u aan voor deze unieke workshop. Plaatsen zijn beperkt!',
              },
            },
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              required: true,
              label: 'Formulier',
              admin: {
                description: 'Selecteer het registratieformulier',
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
                { label: 'Kaart (Gecentreerd met achtergrond)', value: 'card' },
              ],
              admin: {
                description: 'Kies de lay-out van het registratieformulier',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
