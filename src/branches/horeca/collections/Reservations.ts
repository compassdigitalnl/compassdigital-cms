import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * Reservations Collection
 *
 * Table reservations for restaurants
 */
export const Reservations: CollectionConfig = {
  slug: 'reservations',
  access: {
    read: ({ req: { user } }) => {
      if (checkRole(['admin', 'editor'], user)) return true
      return false // Only admins can see reservations
    },
    create: () => true, // Anyone can create a reservation (from contact form)
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('horeca'),
    group: 'Horeca',
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'date', 'time', 'guests', 'status', 'createdAt'],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'customerName',
          type: 'text',
          required: true,
          label: 'Naam klant',
        },
        {
          name: 'customerEmail',
          type: 'email',
          required: true,
          label: 'Email',
        },
        {
          name: 'customerPhone',
          type: 'text',
          required: true,
          label: 'Telefoonnummer',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Reserveringsdatum',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'time',
          type: 'text',
          required: true,
          label: 'Tijd',
          admin: {
            description: 'Bijv. 18:00, 19:30',
          },
        },
        {
          name: 'guests',
          type: 'number',
          required: true,
          label: 'Aantal gasten',
          min: 1,
          max: 20,
          defaultValue: 2,
        },
      ],
    },
    {
      name: 'preferences',
      type: 'select',
      label: 'Tafelvoorkeur',
      hasMany: true,
      options: [
        { label: 'Raam', value: 'window' },
        { label: 'Buiten (terras)', value: 'terrace' },
        { label: 'Binnen', value: 'inside' },
        { label: 'Stil/apart', value: 'quiet' },
        { label: 'Bar', value: 'bar' },
      ],
    },
    {
      name: 'occasion',
      type: 'select',
      label: 'Gelegenheid',
      options: [
        { label: 'Regulier diner', value: 'regular' },
        { label: 'Verjaardag', value: 'birthday' },
        { label: 'Jubileum', value: 'anniversary' },
        { label: 'Business', value: 'business' },
        { label: 'Romantisch', value: 'romantic' },
        { label: 'Groepsuitje', value: 'group' },
        { label: 'Anders', value: 'other' },
      ],
      defaultValue: 'regular',
    },
    {
      name: 'specialRequests',
      type: 'textarea',
      label: 'Bijzondere wensen',
      admin: {
        description: 'Allergieën, dieetwensen, etc.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      options: [
        { label: '⏳ Aangevraagd', value: 'pending' },
        { label: '✓ Bevestigd', value: 'confirmed' },
        { label: '✗ Geannuleerd', value: 'cancelled' },
        { label: '✓ Voltooid', value: 'completed' },
        { label: '✗ No-show', value: 'no-show' },
      ],
      defaultValue: 'pending',
      admin: {
        description: 'Huidige status van de reservering',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'confirmed',
          type: 'checkbox',
          label: 'Bevestigd naar klant',
          defaultValue: false,
          admin: {
            description: 'Is bevestigingsmail verstuurd?',
          },
        },
        {
          name: 'reminded',
          type: 'checkbox',
          label: 'Herinnering verstuurd',
          defaultValue: false,
          admin: {
            description: 'Is reminder verstuurd (bijv. dag van tevoren)?',
          },
        },
      ],
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Interne notities',
      admin: {
        description: 'Alleen zichtbaar voor personeel',
      },
    },
    {
      name: 'assignedTable',
      type: 'text',
      label: 'Toegewezen tafel',
      admin: {
        description: 'Optioneel: tafelnummer (bijv. T5, T12)',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // TODO: Send confirmation email when status changes to 'confirmed'
        // TODO: Send reminder email 24h before reservation
        if (operation === 'create') {
          console.log(`New reservation created: ${doc.customerName} on ${doc.date}`)
        }
        return doc
      },
    ],
  },
}
