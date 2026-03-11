import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-12 - Video Block Configuration
 *
 * Video embed block supporting YouTube and Vimeo.
 * Responsive 16:9 container with size controls.
 */

export const Video: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'videoUrl',
              type: 'text',
              label: 'Video URL',
              required: true,
              admin: {
                description: 'YouTube of Vimeo URL (bijv. https://www.youtube.com/watch?v=... of https://vimeo.com/...)',
                placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Titel',
              admin: {
                description: 'Optionele koptekst boven de video',
                placeholder: 'Bekijk onze introductievideo',
              },
            },
            {
              name: 'caption',
              type: 'text',
              label: 'Onderschrift',
              admin: {
                description: 'Optionele tekst onder de video',
                placeholder: 'Een korte uitleg over wat er in de video te zien is',
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
                { label: 'Smal (max 640px)', value: 'narrow' },
                { label: 'Breed (max 960px)', value: 'wide' },
                { label: 'Volledig (max 1280px)', value: 'full' },
              ],
              admin: {
                description: 'Maximale breedte van de videospeler',
              },
            },
            {
              name: 'autoplay',
              type: 'checkbox',
              label: 'Autoplay',
              defaultValue: false,
              admin: {
                description: 'Automatisch afspelen wanneer de pagina laadt (de meeste browsers blokkeren autoplay met geluid)',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
