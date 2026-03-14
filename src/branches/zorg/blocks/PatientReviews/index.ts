import type { Block } from 'payload'

export const PatientReviews: Block = {
  slug: 'patient-reviews',
  labels: {
    singular: 'Patiëntreviews',
    plural: 'Patiëntreviews',
  },
  interfaceName: 'PatientReviewsBlock',
  fields: [
    {
      name: 'heading',
      type: 'group',
      label: 'Kopje',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: 'Badge',
          admin: {
            description: 'Kleine badge boven de titel',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Titel',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Omschrijving',
          admin: { rows: 2 },
        },
      ],
    },
    {
      name: 'source',
      type: 'radio',
      label: 'Bron',
      options: [
        { label: 'Automatisch (alle gepubliceerde reviews)', value: 'auto' },
        { label: 'Handmatig selecteren', value: 'manual' },
      ],
      defaultValue: 'auto',
    },
    {
      name: 'reviews',
      type: 'relationship',
      relationTo: 'content-reviews',
      hasMany: true,
      label: 'Reviews',
      admin: {
        condition: (data) => data.source === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Maximum aantal',
      defaultValue: 6,
      min: 1,
      max: 12,
      admin: {
        condition: (data) => data.source === 'auto',
      },
    },
    {
      name: 'showTreatmentType',
      type: 'checkbox',
      label: 'Toon behandeltype',
      defaultValue: true,
    },
  ],
}

export default PatientReviews
