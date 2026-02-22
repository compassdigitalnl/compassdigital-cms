import type { CollectionConfig } from 'payload'
import { checkRole } from '@/access/utilities'
import { shouldHideCollection } from '@/lib/shouldHideCollection'

/**
 * BeautyBookings Collection
 *
 * Customer appointment bookings submitted via booking wizard
 */
export const BeautyBookings: CollectionConfig = {
  slug: 'beautyBookings',
  access: {
    read: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    create: () => true, // Anyone can submit a booking request
    update: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
    delete: ({ req: { user } }) => checkRole(['admin'], user),
  },
  admin: {
    hidden: shouldHideCollection('beauty'),
    group: 'Beauty',
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'service', 'stylist', 'date', 'time', 'status', 'createdAt'],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          label: 'Voornaam',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          label: 'Achternaam',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'customerName',
      type: 'text',
      label: 'Volledige naam',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            return `${siblingData.firstName || ''} ${siblingData.lastName || ''}`.trim()
          },
        ],
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
          label: 'E-mail',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: 'Telefoon',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'beautyServices',
      label: 'Behandeling',
      admin: {
        description: 'Welke behandeling wil de klant boeken?',
      },
    },
    {
      name: 'stylist',
      type: 'relationship',
      relationTo: 'stylists',
      label: 'Stylist',
      admin: {
        description: 'Voorkeur stylist (optioneel)',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'Datum',
          required: true,
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'time',
          type: 'text',
          label: 'Tijd',
          required: true,
          admin: {
            width: '50%',
            description: 'Bijv: 14:30',
          },
        },
      ],
    },
    {
      name: 'preferredTimeSlots',
      type: 'select',
      hasMany: true,
      label: 'Voorkeur tijdsloten',
      options: [
        { label: 'Ochtend (09:00-12:00)', value: 'morning' },
        { label: 'Middag (12:00-17:00)', value: 'afternoon' },
        { label: 'Avond (17:00-21:00)', value: 'evening' },
      ],
    },
    {
      name: 'remarks',
      type: 'textarea',
      label: 'Opmerkingen',
      admin: {
        description: 'Bijzonderheden, allergieën, speciale wensen',
      },
    },
    {
      name: 'isFirstVisit',
      type: 'checkbox',
      label: 'Eerste bezoek',
      defaultValue: false,
      admin: {
        description: 'Is dit de eerste keer dat de klant bij ons komt?',
      },
    },
    {
      name: 'marketingConsent',
      type: 'checkbox',
      label: 'Marketing toestemming',
      defaultValue: false,
      admin: {
        description: 'Klant wil updates en aanbiedingen ontvangen',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Nieuw', value: 'new' },
        { label: 'Bevestigd', value: 'confirmed' },
        { label: 'Voltooid', value: 'completed' },
        { label: 'Geannuleerd', value: 'cancelled' },
        { label: 'No-show', value: 'no-show' },
      ],
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'totalPrice',
      type: 'number',
      label: 'Totaalprijs (€)',
      admin: {
        position: 'sidebar',
        step: 0.5,
        description: 'Totale prijs voor de behandeling(en)',
      },
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Totale duur (min)',
      admin: {
        position: 'sidebar',
        description: 'Geschatte totale duur',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Interne notities',
      admin: {
        description: 'Notities voor intern gebruik (niet zichtbaar voor klant)',
      },
    },
    {
      name: 'confirmationSent',
      type: 'checkbox',
      label: 'Bevestiging verstuurd',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Is er een bevestigingsmail verstuurd?',
      },
    },
    {
      name: 'reminderSent',
      type: 'checkbox',
      label: 'Herinnering verstuurd',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Is er een herinnering verstuurd?',
      },
    },
  ],
}
