import type { Block } from 'payload'

/**
 * B06 - Testimonials Block Configuration
 *
 * Customer testimonials with avatars, quotes, ratings, and author details.
 *
 * FEATURES:
 * - 3 layout variants (grid, carousel, featured)
 * - 5-star rating system
 * - Avatar images with fallback initials
 * - Author name and role
 * - Grid: 3 columns on desktop, responsive
 * - Carousel: interactive slider with navigation
 * - Featured: large single testimonial hero
 *
 * @see docs/refactoring/sprint-9/shared/b06-testimonials.html
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
              label: 'Section Title',
              admin: {
                description: 'Optional heading above testimonials',
                placeholder: 'Wat Onze Klanten Zeggen',
              },
            },
            {
              name: 'testimonials',
              type: 'array',
              label: 'Testimonials',
              minRows: 1,
              admin: {
                description: 'Customer testimonials with quotes, ratings, and avatars',
              },
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  required: true,
                  label: 'Quote',
                  admin: {
                    rows: 3,
                    placeholder: 'Compass Digital heeft onze online verkoop verdrievoudigd...',
                  },
                },
                {
                  name: 'author',
                  type: 'text',
                  required: true,
                  label: 'Author Name',
                  admin: {
                    placeholder: 'Jan Smit',
                  },
                },
                {
                  name: 'role',
                  type: 'text',
                  label: 'Author Role',
                  admin: {
                    placeholder: 'CEO, Medisch Totaal',
                  },
                },
                {
                  name: 'avatar',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Avatar Image',
                  admin: {
                    description: 'Optional profile photo (square, min 80x80px)',
                  },
                },
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Rating (1-5 stars)',
                  min: 1,
                  max: 5,
                  defaultValue: 5,
                  admin: {
                    step: 1,
                    description: 'Star rating out of 5',
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
                { label: 'Grid (3 columns on desktop)', value: 'grid' },
                { label: 'Carousel (Sliding testimonials)', value: 'carousel' },
                { label: 'Featured (Large single testimonial)', value: 'featured' },
              ],
              admin: {
                description:
                  'Grid = static 3-col layout. Carousel = interactive slider. Featured = single large quote.',
              },
            },
          ],
        },
      ],
    },
  ],
}
