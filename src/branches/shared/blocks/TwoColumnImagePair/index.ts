import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-02d Two Column Image Pair Block
 *
 * Displays two images side-by-side with flexible layout options
 * and optional text overlays or comparison badges.
 *
 * Layouts: equal, left-large, right-large, comparison
 * Types: standard (hover captions), overlay (card overlays)
 * Aspect ratios: landscape (4:3), portrait (3:4), square (1:1)
 */
export const TwoColumnImagePair: Block = {
  slug: 'twoColumnImagePair',
  interfaceName: 'TwoColumnImagePairBlock',
  labels: {
    singular: 'Two Column Image Pair',
    plural: 'Two Column Image Pairs',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'image1',
              type: 'upload',
              relationTo: 'media',
              label: 'Eerste afbeelding',
              required: true,
              admin: {
                description: 'De linker afbeelding',
              },
            },
            {
              name: 'caption1',
              type: 'text',
              label: 'Bijschrift eerste afbeelding',
              admin: {
                description: 'Optioneel bijschrift onder of over de eerste afbeelding',
              },
            },
            {
              name: 'overlay1',
              type: 'group',
              label: 'Overlay eerste afbeelding',
              admin: {
                condition: (data, siblingData) => siblingData?.imageType === 'overlay',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Overlay titel',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Overlay beschrijving',
                  maxLength: 200,
                },
              ],
            },
            {
              name: 'comparisonBadge1',
              type: 'text',
              label: 'Vergelijkingsbadge eerste afbeelding',
              admin: {
                description: 'Bijv. "Voor"',
                condition: (data, siblingData) => siblingData?.layout === 'comparison',
              },
            },
            {
              name: 'image2',
              type: 'upload',
              relationTo: 'media',
              label: 'Tweede afbeelding',
              required: true,
              admin: {
                description: 'De rechter afbeelding',
              },
            },
            {
              name: 'caption2',
              type: 'text',
              label: 'Bijschrift tweede afbeelding',
              admin: {
                description: 'Optioneel bijschrift onder of over de tweede afbeelding',
              },
            },
            {
              name: 'overlay2',
              type: 'group',
              label: 'Overlay tweede afbeelding',
              admin: {
                condition: (data, siblingData) => siblingData?.imageType === 'overlay',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Overlay titel',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Overlay beschrijving',
                  maxLength: 200,
                },
              ],
            },
            {
              name: 'comparisonBadge2',
              type: 'text',
              label: 'Vergelijkingsbadge tweede afbeelding',
              admin: {
                description: 'Bijv. "Na"',
                condition: (data, siblingData) => siblingData?.layout === 'comparison',
              },
            },
          ],
        },
        {
          label: 'Design',
          fields: [
            {
              name: 'layout',
              type: 'select',
              label: 'Layout',
              defaultValue: 'equal',
              options: [
                { label: 'Gelijk (50/50)', value: 'equal' },
                { label: 'Links groter (60/40)', value: 'left-large' },
                { label: 'Rechts groter (40/60)', value: 'right-large' },
                { label: 'Vergelijking', value: 'comparison' },
              ],
              admin: {
                description: 'Kies de verdeling van de twee kolommen',
              },
            },
            {
              name: 'imageType',
              type: 'select',
              label: 'Afbeelding type',
              defaultValue: 'standard',
              options: [
                { label: 'Standaard (hover bijschrift)', value: 'standard' },
                { label: 'Overlay (kaart overlay)', value: 'overlay' },
              ],
              admin: {
                description: 'Standaard toont bijschriften bij hover, overlay toont een kaart over de afbeelding',
              },
            },
            {
              name: 'aspectRatio',
              type: 'select',
              label: 'Beeldverhouding',
              defaultValue: 'landscape',
              options: [
                { label: 'Liggend (4:3)', value: 'landscape' },
                { label: 'Staand (3:4)', value: 'portrait' },
                { label: 'Vierkant (1:1)', value: 'square' },
              ],
            },
            {
              name: 'spacing',
              type: 'select',
              label: 'Tussenruimte',
              defaultValue: 'default',
              options: [
                { label: 'Compact (16px)', value: 'compact' },
                { label: 'Standaard (32px)', value: 'default' },
                { label: 'Ruim (48px)', value: 'spacious' },
              ],
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
