import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * Contact Block — Combined contact information + form block
 *
 * Shows company contact details (address, phone, email, opening hours)
 * alongside an optional Payload form-builder form.
 *
 * VARIANTS:
 * - info-only: Just contact info, no form
 * - info-form: Contact info left, form right (default)
 * - info-form-reversed: Form left, contact info right
 * - stacked: Contact info above, form below
 */
export const Contact: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Contact',
    plural: 'Contact Blocks',
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
              required: true,
              defaultValue: 'Neem contact op',
              admin: {
                placeholder: 'Neem contact op',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitel',
              admin: {
                placeholder: 'Wij staan altijd voor je klaar',
              },
            },
            {
              name: 'address',
              type: 'group',
              label: 'Adres',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  label: 'Straat',
                  admin: {
                    placeholder: 'Keizersgracht 123',
                  },
                },
                {
                  name: 'postalCode',
                  type: 'text',
                  label: 'Postcode',
                  admin: {
                    placeholder: '1015 DJ',
                  },
                },
                {
                  name: 'city',
                  type: 'text',
                  label: 'Stad',
                  admin: {
                    placeholder: 'Amsterdam',
                  },
                },
              ],
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Telefoonnummer',
              admin: {
                placeholder: '020 - 123 45 67',
              },
            },
            {
              name: 'email',
              type: 'email',
              label: 'E-mailadres',
              admin: {
                placeholder: 'info@company.com',
              },
            },
            {
              name: 'openingHours',
              type: 'array',
              label: 'Openingstijden',
              admin: {
                description: 'Voeg openingstijden toe per dag of dagbereik',
                initCollapsed: false,
              },
              fields: [
                {
                  name: 'day',
                  type: 'text',
                  label: 'Dag(en)',
                  admin: {
                    placeholder: 'Maandag - Vrijdag',
                  },
                },
                {
                  name: 'hours',
                  type: 'text',
                  label: 'Tijden',
                  admin: {
                    placeholder: '09:00 - 17:00',
                  },
                },
              ],
            },
            {
              name: 'showMap',
              type: 'checkbox',
              label: 'Kaart tonen',
              defaultValue: false,
            },
            {
              name: 'mapUrl',
              type: 'text',
              label: 'Google Maps Embed URL',
              admin: {
                condition: (data, siblingData) => siblingData?.showMap,
                placeholder: 'https://www.google.com/maps/embed?pb=...',
                description: 'Haal de embed URL op via Google Maps "Delen" → "Kaart insluiten"',
              },
            },
            {
              name: 'showForm',
              type: 'checkbox',
              label: 'Formulier tonen',
              defaultValue: true,
            },
            {
              name: 'form',
              type: 'relationship',
              relationTo: 'forms',
              label: 'Formulier',
              admin: {
                condition: (data, siblingData) => siblingData?.showForm,
                description: 'Kies het formulier dat getoond wordt naast de contactgegevens',
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
              defaultValue: 'info-form',
              options: [
                { label: 'Alleen contactgegevens', value: 'info-only' },
                { label: 'Contactgegevens links, formulier rechts', value: 'info-form' },
                { label: 'Formulier links, contactgegevens rechts', value: 'info-form-reversed' },
                { label: 'Contactgegevens boven, formulier onder', value: 'stacked' },
              ],
              admin: {
                description: 'Kies de lay-out van het contactblok',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
