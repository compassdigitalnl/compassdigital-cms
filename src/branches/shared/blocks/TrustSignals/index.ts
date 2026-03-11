import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-40 TrustSignals Block
 *
 * USP/trust indicators in horizontal row or card grid.
 * Icons + short text. Dark background support.
 */
export const TrustSignals: Block = {
  slug: 'trustSignals',
  interfaceName: 'TrustSignalsBlock',
  labels: {
    singular: 'Trust Signals',
    plural: 'Trust Signals',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'items',
              type: 'array',
              label: 'Trust items',
              minRows: 1,
              admin: {
                description: 'USP\'s en vertrouwenssignalen. Voeg icoon, titel en optionele beschrijving toe.',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icoon',
                  admin: {
                    placeholder: 'bijv. shield-check, truck, clock, headphones',
                    description: 'Emoji of icoon naam (bijv. shield-check)',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titel',
                  required: true,
                  admin: {
                    placeholder: 'Veilig betalen',
                  },
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Beschrijving',
                  admin: {
                    placeholder: 'Versleutelde verbinding via SSL',
                    description: 'Korte toelichting (optioneel)',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'variant',
              type: 'select',
              label: 'Layout variant',
              defaultValue: 'horizontal',
              options: [
                { label: 'Horizontaal (rij)', value: 'horizontal' },
                { label: 'Kaarten (grid)', value: 'cards' },
              ],
              admin: {
                description: 'Horizontaal = compacte inline rij. Kaarten = grid met kaarten.',
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
                { label: 'Navy (donker)', value: 'navy' },
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
