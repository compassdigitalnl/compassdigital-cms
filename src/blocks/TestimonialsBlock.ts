import type { Block } from 'payload'
import { sectionLabelField } from '../fields/sectionLabel'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Testimonials',
    plural: 'Testimonials',
  },
  fields: [
    sectionLabelField,
    {
      name: 'heading',
      type: 'text',
      label: 'Sectie titel',
      defaultValue: 'Wat klanten zeggen',
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Introductie tekst',
      admin: {
        description: 'Optionele introductie tekst voor de testimonials sectie',
      },
    },
    {
      name: 'source',
      type: 'select',
      label: 'Bron',
      defaultValue: 'collection',
      required: true,
      options: [
        { label: 'Vanuit Testimonials collection', value: 'collection' },
        { label: 'Handmatig ingevoerd', value: 'manual' },
      ],
    },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: 'Selecteer testimonials',
      admin: {
        condition: (data, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'manualTestimonials',
      type: 'array',
      label: 'Testimonials',
      admin: {
        condition: (data, siblingData) => siblingData?.source === 'manual',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Naam',
        },
        {
          name: 'role',
          type: 'text',
          label: 'Functie',
        },
        {
          name: 'company',
          type: 'text',
          required: false,
          label: 'Bedrijf',
        },
        {
          name: 'quote',
          type: 'textarea',
          required: true,
          label: 'Review tekst',
        },
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 1,
          max: 5,
          defaultValue: 5,
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto',
        },
        {
          name: 'source',
          type: 'text',
          label: 'Bron / Platform',
          admin: {
            description: 'Bijv. "Via Google Reviews", "Via Kiyoh", "Via Trustpilot"',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'carousel',
      options: [
        { label: 'Carousel', value: 'carousel' },
        { label: 'Grid (2 kolommen)', value: 'grid-2' },
        { label: 'Grid (3 kolommen)', value: 'grid-3' },
      ],
    },
  ],
}
