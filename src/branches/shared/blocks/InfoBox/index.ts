import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-33 InfoBox Block
 *
 * Colored notification box with variant-based styling.
 * Info=blue, success=green, warning=amber, error=red.
 * Optional dismiss button (requires client component).
 */
export const InfoBox: Block = {
  slug: 'infobox',
  interfaceName: 'InfoBoxBlock',
  labels: {
    singular: 'InfoBox',
    plural: 'InfoBoxes',
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
                placeholder: 'Belangrijk',
                description: 'Optionele koptekst van de notificatie',
              },
            },
            {
              name: 'content',
              type: 'textarea',
              label: 'Inhoud',
              required: true,
              admin: {
                rows: 3,
                placeholder: 'Uw bericht hier...',
                description: 'Tekst van de notificatie',
              },
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link URL',
              admin: {
                placeholder: '/meer-informatie',
                description: 'Optionele link naar meer informatie',
              },
            },
            {
              name: 'linkLabel',
              type: 'text',
              label: 'Link tekst',
              admin: {
                placeholder: 'Meer informatie',
                description: 'Tekst voor de link (alleen zichtbaar als Link URL is ingevuld)',
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
                { label: 'Succes (groen)', value: 'success' },
                { label: 'Waarschuwing (geel)', value: 'warning' },
                { label: 'Fout (rood)', value: 'error' },
              ],
              admin: {
                description: 'Kleurschema en visuele stijl van de notificatie',
              },
            },
            {
              name: 'dismissible',
              type: 'checkbox',
              label: 'Wegklikbaar',
              defaultValue: false,
              admin: {
                description: 'Gebruiker kan de notificatie sluiten met een X-knop',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
