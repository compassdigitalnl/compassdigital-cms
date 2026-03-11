import type { Block } from 'payload'

/**
 * B-37 Spacer Block
 *
 * Simple spacing utility block. sm=32px, md=64px, lg=96px, xl=128px.
 * Optional horizontal divider line. Design tab only, no animationFields (utility block).
 */
export const Spacer: Block = {
  slug: 'spacer',
  interfaceName: 'SpacerBlock',
  labels: {
    singular: 'Spacer',
    plural: 'Spacers',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Design',
          fields: [
            {
              name: 'size',
              type: 'select',
              label: 'Grootte',
              defaultValue: 'md',
              options: [
                { label: 'Klein (32px)', value: 'sm' },
                { label: 'Middel (64px)', value: 'md' },
                { label: 'Groot (96px)', value: 'lg' },
                { label: 'Extra groot (128px)', value: 'xl' },
              ],
              admin: {
                description: 'Verticale ruimte tussen secties. Automatisch kleiner op mobiel.',
              },
            },
            {
              name: 'showDivider',
              type: 'checkbox',
              label: 'Toon scheidingslijn',
              defaultValue: false,
              admin: {
                description: 'Horizontale lijn in het midden van de ruimte',
              },
            },
            {
              name: 'dividerColor',
              type: 'select',
              label: 'Lijnkleur',
              defaultValue: 'grey',
              options: [
                { label: 'Grijs', value: 'grey' },
                { label: 'Teal', value: 'teal' },
                { label: 'Navy', value: 'navy' },
              ],
              admin: {
                description: 'Kleur van de scheidingslijn',
                condition: (_data, siblingData) => siblingData?.showDivider === true,
              },
            },
          ],
        },
      ],
    },
  ],
}
