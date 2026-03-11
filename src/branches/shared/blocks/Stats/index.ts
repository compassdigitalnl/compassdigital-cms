import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-09 - Stats Block Configuration
 *
 * Statistics display block with multiple layout variants.
 * Supports inline, cards, and large number presentations.
 */

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: 'Stats',
    plural: 'Stats',
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
                description: 'Optionele koptekst boven de statistieken',
                placeholder: 'Onze resultaten',
              },
            },
            {
              name: 'items',
              type: 'array',
              label: 'Statistieken',
              minRows: 1,
              maxRows: 8,
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  label: 'Waarde',
                  required: true,
                  admin: {
                    description: 'Het getal of de waarde (bijv. "500+", "98%", "24/7")',
                    placeholder: '500+',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  label: 'Label',
                  required: true,
                  admin: {
                    description: 'Beschrijving van de statistiek (bijv. "Klanten", "Uptime")',
                    placeholder: 'Klanten',
                  },
                },
                {
                  name: 'suffix',
                  type: 'text',
                  label: 'Suffix',
                  admin: {
                    description: 'Optioneel achtervoegsel bij de waarde (bijv. "+", "%", "k")',
                    placeholder: '+',
                  },
                },
              ],
              admin: {
                description: 'Voeg statistieken toe. Houd het kort en krachtig.',
                initCollapsed: true,
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
              label: 'Weergave',
              defaultValue: 'inline',
              options: [
                { label: 'Inline (horizontale rij)', value: 'inline' },
                { label: 'Kaarten (met schaduw)', value: 'cards' },
                { label: 'Groot (gecentreerde cijfers)', value: 'large' },
              ],
              admin: {
                description: 'Kies hoe de statistieken worden weergegeven',
              },
            },
            {
              name: 'backgroundColor',
              type: 'select',
              label: 'Achtergrondkleur',
              defaultValue: 'white',
              options: [
                { label: 'Wit', value: 'white' },
                { label: 'Navy', value: 'navy' },
                { label: 'Teal', value: 'teal' },
                { label: 'Grijs', value: 'grey' },
              ],
              admin: {
                description: 'Achtergrondkleur van de sectie',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
