import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-20 ImageGallery Block
 *
 * Responsive image gallery with lightbox, multiple layout variants,
 * and configurable aspect ratios.
 *
 * Variants:
 * - grid: Standard equal-size grid (2/3/4 columns)
 * - featured-grid: First image large, rest smaller (masonry-like)
 * - masonry: Auto-height masonry layout
 */
export const ImageGallery: Block = {
  slug: 'imageGallery',
  interfaceName: 'ImageGalleryBlock',
  labels: {
    singular: 'Afbeeldingen Gallerij',
    plural: 'Afbeeldingen Gallerijen',
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
                description: 'Optionele koptekst boven de gallerij',
                placeholder: 'Onze projecten',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Beschrijving',
              admin: {
                description: 'Optionele tekst onder de titel',
                rows: 2,
                placeholder: 'Bekijk een selectie van ons werk',
              },
            },
            {
              name: 'images',
              type: 'array',
              label: 'Afbeeldingen',
              minRows: 1,
              maxRows: 50,
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Afbeelding',
                },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Onderschrift',
                  admin: {
                    description: 'Tekst bij hover of in lightbox',
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
              label: 'Layout Variant',
              defaultValue: 'grid',
              options: [
                { label: 'Grid (gelijke afbeeldingen)', value: 'grid' },
                { label: 'Featured Grid (1 groot + rest klein)', value: 'featured-grid' },
                { label: 'Masonry (automatische hoogte)', value: 'masonry' },
              ],
              admin: {
                description: 'Kies de gallerij layout',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'columns',
                  type: 'select',
                  label: 'Kolommen',
                  defaultValue: '3',
                  options: [
                    { label: '2 kolommen', value: '2' },
                    { label: '3 kolommen', value: '3' },
                    { label: '4 kolommen', value: '4' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Aantal kolommen op desktop (niet van toepassing bij featured-grid)',
                    condition: (_data, siblingData) => siblingData?.variant !== 'featured-grid',
                  },
                },
                {
                  name: 'aspectRatio',
                  type: 'select',
                  label: 'Beeldverhouding',
                  defaultValue: '4-3',
                  options: [
                    { label: '16:9 (Landschap)', value: '16-9' },
                    { label: '4:3 (Standaard)', value: '4-3' },
                    { label: '1:1 (Vierkant)', value: '1-1' },
                    { label: 'Auto (Origineel)', value: 'auto' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Beeldverhouding voor afbeeldingscontainers',
                  },
                },
              ],
            },
            {
              name: 'enableLightbox',
              type: 'checkbox',
              label: 'Lightbox inschakelen',
              defaultValue: true,
              admin: {
                description: 'Klik op afbeelding om te vergroten in een overlay',
              },
            },
            {
              name: 'gap',
              type: 'select',
              label: 'Tussenruimte',
              defaultValue: 'normal',
              options: [
                { label: 'Klein (8px)', value: 'small' },
                { label: 'Normaal (16px)', value: 'normal' },
                { label: 'Groot (24px)', value: 'large' },
              ],
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
