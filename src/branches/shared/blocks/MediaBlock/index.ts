import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-06 Media Block
 *
 * Single image display with optional caption.
 *
 * Size options:
 * - narrow: max-w-2xl (best for inline content)
 * - wide: max-w-5xl (hero-style images)
 * - full: w-full (edge-to-edge)
 */
export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  labels: {
    singular: 'Media Block',
    plural: 'Media Blocks',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Afbeelding',
              admin: {
                description: 'Upload een afbeelding (JPG, PNG, WebP)',
              },
            },
            {
              name: 'caption',
              type: 'text',
              label: 'Bijschrift',
              admin: {
                description: 'Optioneel bijschrift onder de afbeelding',
                placeholder: 'Foto: productoverzicht 2026',
              },
            },
            {
              name: 'alt',
              type: 'text',
              label: 'Alt tekst',
              admin: {
                description:
                  'Beschrijving voor screenreaders en SEO. Als leeg wordt alt van media gebruikt.',
                placeholder: 'Beschrijving van de afbeelding',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'size',
              type: 'select',
              label: 'Breedte',
              defaultValue: 'wide',
              options: [
                { label: 'Smal (max 672px)', value: 'narrow' },
                { label: 'Breed (max 1024px)', value: 'wide' },
                { label: 'Volledig (100%)', value: 'full' },
              ],
              admin: {
                description: 'Maximale breedte van de afbeelding',
              },
            },
            {
              name: 'rounded',
              type: 'checkbox',
              label: 'Afgeronde hoeken',
              defaultValue: true,
              admin: {
                description: 'Toon de afbeelding met afgeronde hoeken',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
