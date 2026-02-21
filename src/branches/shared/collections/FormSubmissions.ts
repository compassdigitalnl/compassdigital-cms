import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    group: 'Formulieren',
    useAsTitle: 'form',
    defaultColumns: ['form', 'submittedAt', 'createdAt'],
    description: 'Form submissions from contact forms and other site forms',
    hidden: ({ user }) => !checkRole(['admin'], user),
  },
  access: {
    // Only admins can read/manage form submissions
    read: ({ req: { user } }) => checkRole(['admin'], user),
    create: () => true, // Allow public API to create submissions
    update: ({ req: { user } }) => checkRole(['admin'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'form',
      type: 'select',
      required: true,
      label: 'Formulier type',
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Offerte aanvraag', value: 'quote' },
        { label: 'Overig', value: 'other' },
      ],
      defaultValue: 'contact',
    },
    {
      name: 'submittedAt',
      type: 'date',
      label: 'Ingediend op',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'data',
      type: 'array',
      label: 'Formulier data',
      required: true,
      fields: [
        {
          name: 'field',
          type: 'text',
          required: true,
          label: 'Veldnaam',
        },
        {
          name: 'value',
          type: 'textarea',
          required: true,
          label: 'Waarde',
        },
      ],
    },
    {
      name: 'processed',
      type: 'checkbox',
      label: 'Verwerkt',
      defaultValue: false,
      admin: {
        description: 'Markeer als verwerkt wanneer je dit bericht hebt behandeld',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notities',
      admin: {
        description: 'Interne notities over deze inzending',
      },
    },
  ],
}
