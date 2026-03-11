import type { Block } from 'payload'
import { animationFields } from '../_shared/animationFields'

/**
 * B-38 Testimonials Block
 *
 * Customer testimonials with avatars, quotes, ratings, and author details.
 * Grid, featured, or carousel layout variants.
 */
export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials',
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
                placeholder: 'Wat Onze Klanten Zeggen',
                description: 'Optionele koptekst boven de testimonials',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitel',
              admin: {
                placeholder: 'Beoordeeld door meer dan 500 tevreden klanten',
                description: 'Optionele subtekst onder de titel',
              },
            },
            {
              name: 'testimonials',
              type: 'array',
              label: 'Testimonials',
              minRows: 1,
              admin: {
                description: 'Klantbeoordelingen met citaten, sterren en avatars',
              },
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  label: 'Citaat',
                  required: true,
                  admin: {
                    rows: 3,
                    placeholder: 'Compass Digital heeft onze online verkoop verdrievoudigd...',
                  },
                },
                {
                  name: 'author',
                  type: 'text',
                  label: 'Naam',
                  required: true,
                  admin: {
                    placeholder: 'Jan Smit',
                  },
                },
                {
                  name: 'role',
                  type: 'text',
                  label: 'Functie',
                  admin: {
                    placeholder: 'CEO',
                  },
                },
                {
                  name: 'company',
                  type: 'text',
                  label: 'Bedrijf',
                  admin: {
                    placeholder: 'Medisch Totaal',
                  },
                },
                {
                  name: 'avatar',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Profielfoto',
                  admin: {
                    description: 'Optionele profielfoto (vierkant, min 80x80px)',
                  },
                },
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Beoordeling (1-5 sterren)',
                  min: 1,
                  max: 5,
                  defaultValue: 5,
                  admin: {
                    step: 1,
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
              defaultValue: 'grid',
              options: [
                { label: 'Grid (kaarten)', value: 'grid' },
                { label: 'Uitgelicht (groot citaat)', value: 'featured' },
                { label: 'Carousel (schuivend)', value: 'carousel' },
              ],
              admin: {
                description: 'Grid = 3-koloms layout. Uitgelicht = groot enkelvoudig citaat. Carousel = interactieve slider.',
              },
            },
            {
              name: 'columns',
              type: 'select',
              label: 'Kolommen',
              defaultValue: '3',
              options: [
                { label: '2 kolommen', value: '2' },
                { label: '3 kolommen', value: '3' },
              ],
              admin: {
                description: 'Aantal kolommen in grid layout',
                condition: (_data, siblingData) => siblingData?.variant === 'grid',
              },
            },
            ...animationFields(),
          ],
        },
      ],
    },
  ],
}
