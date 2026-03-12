import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-34 Banner Block
 *
 * Thin announcement/promo banner. Info=blue, promo=teal, warning=amber.
 * Supports inline or sticky top position. Optional link and dismiss button.
 */
export const Banner: Block = {
  slug: 'banner',
  interfaceName: 'BannerBlock',
  labels: {
    singular: 'Banner',
    plural: 'Banners',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'message',
              type: 'text',
              label: 'Bericht',
              maxLength: 150,
              admin: {
                placeholder: 'Gratis verzending bij bestellingen boven de 50 euro!',
                description: 'Aankondigingstekst voor de banner',
              },
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link URL',
              admin: {
                placeholder: '/aanbiedingen',
                description: 'Optionele link naar meer informatie',
              },
            },
            {
              name: 'linkLabel',
              type: 'text',
              label: 'Link tekst',
              admin: {
                placeholder: 'Bekijk aanbiedingen',
                description: 'Tekst voor de link knop',
              },
            },
            {
              name: 'icon',
              type: 'text',
              label: 'Icoon',
              admin: {
                placeholder: 'bijv. megaphone, gift, truck',
                description: 'Optioneel icoon (emoji of tekst) links van de tekst',
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
              defaultValue: 'info',
              options: [
                { label: 'Info (blauw)', value: 'info' },
                { label: 'Aankondiging (navy)', value: 'announcement' },
                { label: 'Promo (teal)', value: 'promo' },
                { label: 'Waarschuwing (geel)', value: 'warning' },
              ],
              admin: {
                description: 'Kleurschema van de banner',
              },
            },
            {
              name: 'position',
              type: 'select',
              label: 'Positie',
              defaultValue: 'inline',
              options: [
                { label: 'Inline (in pagina)', value: 'inline' },
                { label: 'Bovenkant (sticky)', value: 'top' },
              ],
              admin: {
                description: 'Waar de banner wordt weergegeven',
              },
            },
            {
              name: 'dismissible',
              type: 'checkbox',
              label: 'Wegklikbaar',
              defaultValue: true,
              admin: {
                description: 'Gebruiker kan de banner sluiten met een X-knop',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
