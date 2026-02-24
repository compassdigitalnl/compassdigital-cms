import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
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
                description: 'Optional heading (e.g., "What Our Clients Say")',
                placeholder: 'Wat klanten zeggen',
              },
            },
            {
              name: 'testimonials',
              type: 'array',
              label: 'Testimonials',
              minRows: 1,
              fields: [
                {
                  name: 'quote',
                  type: 'textarea',
                  label: 'Review Text',
                  required: true,
                  admin: {
                    rows: 3,
                    placeholder:
                      'Uitstekende service en snelle levering. Echt een aanrader voor iedereen!',
                  },
                },
                {
                  name: 'author',
                  type: 'text',
                  label: 'Author Name',
                  required: true,
                  admin: {
                    placeholder: 'John Smith',
                  },
                },
                {
                  name: 'role',
                  type: 'text',
                  label: 'Job Title / Role',
                  admin: {
                    placeholder: 'CEO, Bedrijfsnaam',
                  },
                },
                {
                  name: 'avatar',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Avatar Photo',
                  admin: {
                    description: 'Profile photo (falls back to initials if not provided)',
                  },
                },
                {
                  name: 'rating',
                  type: 'number',
                  label: 'Star Rating',
                  min: 1,
                  max: 5,
                  defaultValue: 5,
                  required: true,
                  admin: {
                    description: 'Star rating from 1 to 5',
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
              label: 'Layout',
              defaultValue: 'grid',
              required: true,
              options: [
                { label: 'Grid (3 columns)', value: 'grid' },
                { label: 'Carousel (slider with arrows)', value: 'carousel' },
                { label: 'Featured (large single testimonial)', value: 'featured' },
              ],
              admin: {
                description: 'Choose how testimonials are displayed',
              },
            },
          ],
        },
      ],
    },
  ],
}
